import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/contractHelpers';
import toast from 'react-hot-toast';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const { signer, account } = useWallet();
  const [contract, setContract] = useState(null);
  const [isRegisteredSeller, setIsRegisteredSeller] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [clientPayments, setClientPayments] = useState([]);
  const [processingPayments, setProcessingPayments] = useState(new Set());

  // Initialize contract and check seller status
  useEffect(() => {
    if (signer) {
      const paymentContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setContract(paymentContract);
      checkSellerStatus();
      if (account) {
        fetchClientPaymentHistory();
      }
    }
  }, [signer, account]);

  // Set up event listeners
  useEffect(() => {
    if (contract) {
      const handlePaymentRequestCreated = (
        paymentId,
        seller,
        amount,
        expiryTime
      ) => {
        const newRequest = {
          paymentId,
          seller,
          amount: ethers.utils.formatEther(amount),
          expiryTime: expiryTime.toNumber(),
          status: 'pending',
          createdAt: Math.floor(Date.now() / 1000),
          buyer: ethers.constants.AddressZero,
        };

        setPaymentRequests((prev) => [...prev, newRequest]);
      };

      const handlePaymentCompleted = (paymentId, buyer, seller, amount) => {
        setPaymentRequests((prev) =>
          prev.map((req) =>
            req.paymentId === paymentId
              ? {
                  ...req,
                  status: 'completed',
                  buyer,
                  paidAmount: ethers.utils.formatEther(amount),
                }
              : req
          )
        );

        // If the current user is the buyer, refresh their payment history
        if (buyer.toLowerCase() === account?.toLowerCase()) {
          fetchClientPaymentHistory();
        }
      };

      const handlePaymentExpired = (paymentId) => {
        setPaymentRequests((prev) =>
          prev.map((req) =>
            req.paymentId === paymentId ? { ...req, status: 'expired' } : req
          )
        );
      };

      // Subscribe to events
      contract.on('PaymentRequestCreated', handlePaymentRequestCreated);
      contract.on('PaymentCompleted', handlePaymentCompleted);
      contract.on('PaymentExpired', handlePaymentExpired);

      // Cleanup function
      return () => {
        contract.off('PaymentRequestCreated', handlePaymentRequestCreated);
        contract.off('PaymentCompleted', handlePaymentCompleted);
        contract.off('PaymentExpired', handlePaymentExpired);
      };
    }
  }, [contract, account]);

  const checkSellerStatus = async () => {
    if (!contract || !account) return;
    try {
      const sellerInfo = await contract.sellers(account);
      setIsRegisteredSeller(sellerInfo.isRegistered);
      if (sellerInfo.isRegistered) {
        const stats = await contract.getSellerStats(account);
        setSellerDetails({
          businessName: stats.businessName,
          totalTransactions: stats.totalTransactions.toString(),
          totalAmount: ethers.utils.formatEther(stats.totalAmount),
        });
      }
    } catch (error) {
      console.error('Error checking seller status:', error);
      toast.error('Failed to fetch seller status');
    }
  };

  const fetchClientPaymentHistory = async () => {
    if (!contract || !account) return;
    try {
      const [paymentIds, sellers, businessNames, amounts, timestamps] =
        await contract.getClientPaymentHistory(account);

      const history = paymentIds.map((paymentId, index) => ({
        paymentId,
        seller: sellers[index],
        businessName: businessNames[index],
        amount: ethers.utils.formatEther(amounts[index]),
        timestamp: timestamps[index].toNumber(),
      }));

      setClientPayments(history);
    } catch (error) {
      console.error('Error fetching client payment history:', error);
      toast.error('Failed to fetch payment history');
    }
  };

  const getClientPaymentCount = async (clientAddress) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const count = await contract.getClientPaymentCount(clientAddress);
      return count.toNumber();
    } catch (error) {
      console.error('Error getting client payment count:', error);
      throw error;
    }
  };

  const registerSeller = async (businessName) => {
    if (!contract) throw new Error('Contract not initialized');
    setLoading(true);
    try {
      const tx = await contract.registerSeller(businessName);
      await tx.wait();
      await checkSellerStatus();
      toast.success('Successfully registered as seller!');
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error registering seller:', error);
      toast.error('Failed to register as seller');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createPaymentRequest = async (paymentId, amountInEth) => {
    if (!contract) throw new Error('Contract not initialized');
    if (!isRegisteredSeller) throw new Error('Not registered as seller');
    setLoading(true);
    try {
      const amountInWei = ethers.utils.parseEther(amountInEth.toString());
      const tx = await contract.createPaymentRequest(paymentId, amountInWei);
      await tx.wait();
      toast.success('Payment request created successfully!');
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error creating payment request:', error);
      toast.error('Failed to create payment request');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const makePayment = async (paymentId, amountInEth) => {
    if (!contract) throw new Error('Contract not initialized');
    if (processingPayments.has(paymentId)) {
      toast.error('Payment is already being processed');
      return;
    }

    setLoading(true);
    setProcessingPayments((prev) => new Set(prev).add(paymentId));

    try {
      const amountInWei = ethers.utils.parseEther(amountInEth.toString());
      const tx = await contract.makePayment(paymentId, { value: amountInWei });
      await tx.wait();
      await fetchClientPaymentHistory(); // Refresh payment history after successful payment
      toast.success('Payment completed successfully!');
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error making payment:', error);
      toast.error('Payment failed');
      throw error;
    } finally {
      setLoading(false);
      setProcessingPayments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(paymentId);
        return newSet;
      });
    }
  };

  const checkPaymentStatus = async (paymentId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const [isPaid, isExpired, remainingTime, buyer] =
        await contract.checkPaymentStatus(paymentId);
      const request = paymentRequests.find(
        (req) => req.paymentId === paymentId
      );

      // If the payment is expired but not marked in our state, mark it
      if (isExpired && request?.status === 'pending') {
        await contract.markPaymentExpired(paymentId);
      }

      return {
        isPaid,
        isExpired,
        remainingTime: remainingTime.toNumber(),
        buyer,
        paymentDetails: request,
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  };

  const getPaymentRequests = (filter = 'all') => {
    switch (filter) {
      case 'pending':
        return paymentRequests.filter((req) => req.status === 'pending');
      case 'completed':
        return paymentRequests.filter((req) => req.status === 'completed');
      case 'expired':
        return paymentRequests.filter((req) => req.status === 'expired');
      default:
        return paymentRequests;
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        contract,
        isRegisteredSeller,
        sellerDetails,
        loading,
        paymentRequests,
        clientPayments,
        registerSeller,
        createPaymentRequest,
        makePayment,
        checkPaymentStatus,
        getPaymentRequests,
        fetchClientPaymentHistory,
        getClientPaymentCount,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => useContext(PaymentContext);
