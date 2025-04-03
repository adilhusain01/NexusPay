import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from './WalletContext';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/contractHelpers';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const { signer, account } = useWallet();
  const [contract, setContract] = useState(null);
  const [isRegisteredSeller, setIsRegisteredSeller] = useState(false);
  const [sellerDetails, setSellerDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [clientPayments, setClientPayments] = useState([]);
  const [sellerPayments, setSellerPayments] = useState([]);
  const [processingPayments, setProcessingPayments] = useState(new Set());
  const [paymentWindow, setPaymentWindow] = useState(null);

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
        fetchSellerPaymentHistory();
        fetchClientPaymentHistory();
      }
    }
  }, [signer, account]);

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

        showPaymentWindow(paymentId, ethers.utils.formatEther(amount));
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

        if (buyer.toLowerCase() === account?.toLowerCase()) {
          fetchClientPaymentHistory();
        }

        if (seller.toLowerCase() === account?.toLowerCase()) {
          fetchSellerPaymentHistory();
        }
      };

      const handlePaymentExpired = (paymentId) => {
        setPaymentRequests((prev) =>
          prev.map((req) =>
            req.paymentId === paymentId ? { ...req, status: 'expired' } : req
          )
        );
      };

      contract.on('PaymentRequestCreated', handlePaymentRequestCreated);
      contract.on('PaymentCompleted', handlePaymentCompleted);
      contract.on('PaymentExpired', handlePaymentExpired);

      return () => {
        contract.off('PaymentRequestCreated', handlePaymentRequestCreated);
        contract.off('PaymentCompleted', handlePaymentCompleted);
        contract.off('PaymentExpired', handlePaymentExpired);
      };
    }
  }, [contract, account]);

  useEffect(() => {
    if (contract) {
      const handleDirectPayment = async (from, to, amount) => {
        // Update histories when a direct wallet payment is detected
        if (from.toLowerCase() === account?.toLowerCase() || 
            to.toLowerCase() === account?.toLowerCase()) {
          await Promise.all([
            fetchClientPaymentHistory(),
            fetchSellerPaymentHistory()
          ]);
        }
      };

      // Listen for Transfer events (for direct wallet payments)
      if (signer?.provider) {
        signer.provider.on('Transfer', handleDirectPayment);
        
        return () => {
          signer.provider.off('Transfer', handleDirectPayment);
        };
      }
    }
  }, [contract, account, signer]);

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
      // Fetch regular payment history
      const [paymentIds, sellers, businessNames, amounts, timestamps] =
        await contract.getClientPaymentHistory(account);

      // Fetch direct payment history
      const [directRecipients, directAmounts, directTimestamps] =
        await contract.getClientDirectPayments(account);

      // Combine both types of payments
      const regularHistory = paymentIds.map((paymentId, index) => ({
        paymentId,
        seller: sellers[index],
        businessName: businessNames[index],
        amount: ethers.utils.formatEther(amounts[index]),
        timestamp: timestamps[index].toNumber(),
        type: 'regular'
      }));

      const directHistory = directRecipients.map((recipient, index) => ({
        recipient,
        amount: ethers.utils.formatEther(directAmounts[index]),
        timestamp: directTimestamps[index].toNumber(),
        type: 'direct'
      }));

      // Combine and sort by timestamp
      const allPayments = [...regularHistory, ...directHistory]
        .sort((a, b) => b.timestamp - a.timestamp);

      setClientPayments(allPayments);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast.error('Failed to fetch payment history');
    }
  };

  // Update fetchSellerPaymentHistory to include direct wallet payments
  const fetchSellerPaymentHistory = async () => {
    if (!contract || !account) return;
    try {
      // Fetch regular payment history
      const [paymentIds, buyers, amounts, timestamps, isPaid] =
        await contract.getSellerPaymentHistory(account);

      // Fetch direct payment history
      const [directPayers, directAmounts, directTimestamps] =
        await contract.getSellerDirectPayments(account);

      // Combine both types of payments
      const regularHistory = paymentIds.map((paymentId, index) => ({
        paymentId,
        buyer: buyers[index],
        amount: ethers.utils.formatEther(amounts[index]),
        timestamp: timestamps[index].toNumber(),
        isPaid: isPaid[index],
        type: 'regular'
      }));

      const directHistory = directPayers.map((payer, index) => ({
        payer,
        amount: ethers.utils.formatEther(directAmounts[index]),
        timestamp: directTimestamps[index].toNumber(),
        isPaid: true, // Direct payments are always paid
        type: 'direct'
      }));

      // Combine and sort by timestamp
      const allPayments = [...regularHistory, ...directHistory]
        .sort((a, b) => b.timestamp - a.timestamp);

      setSellerPayments(allPayments);
    } catch (error) {
      console.error('Error fetching seller payment history:', error);
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
      await fetchClientPaymentHistory();
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

  const makeWalletPayment = async (recipientAddress, amount) => {
    if (!signer) throw new Error('Wallet not connected');
    if (processingPayments.has(recipientAddress)) {
      toast.error('Payment is already being processed');
      return;
    }

    setLoading(true);
    setProcessingPayments((prev) => new Set(prev).add(recipientAddress));

    try {
      // Convert amount to Wei
      const amountInWei = ethers.utils.parseEther(amount.toString());
      
      // Create and send the transaction
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: amountInWei
      });

      // Wait for transaction confirmation
      await tx.wait();

      // Update payment histories
      await Promise.all([
        fetchClientPaymentHistory(),
        fetchSellerPaymentHistory()
      ]);

      // Record the direct payment in contract if the recipient is a registered seller
      if (contract) {
        try {
          const recipientInfo = await contract.sellers(recipientAddress);
          if (recipientInfo.isRegistered) {
            const recordTx = await contract.recordDirectPayment(recipientAddress, amountInWei);
            await recordTx.wait();
          }
        } catch (error) {
          console.warn('Error recording direct payment:', error);
          // Don't throw here as the payment itself was successful
        }
      }

      toast.success('Payment sent successfully!');
      return { success: true, transaction: tx };
    } catch (error) {
      console.error('Error making wallet payment:', error);
      toast.error('Payment failed');
      throw error;
    } finally {
      setLoading(false);
      setProcessingPayments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(recipientAddress);
        return newSet;
      });
    }
  };



  const checkPaymentStatus = async (paymentId) => {
    if (!contract) throw new Error('Contract not initialized');
    try {
      const [isPaid, isExpired, remainingTime, buyer] =
        await contract.checkPaymentStatus(paymentId);

      const paymentRequest = await contract.paymentRequests(paymentId);

      const paymentDetails = {
        paymentId,
        seller: paymentRequest.seller,
        amount: ethers.utils.formatEther(paymentRequest.amount),
        expiryTime: paymentRequest.expiryTime.toNumber(),
        isPaid: paymentRequest.isPaid,
        isExpired: paymentRequest.isExpired,
        buyer: paymentRequest.buyer,
        status: isPaid ? 'completed' : isExpired ? 'expired' : 'pending',
        createdAt: paymentRequest.expiryTime.toNumber() - 180,
      };

      if (isExpired && !paymentRequest.isExpired) {
        await contract.markPaymentExpired(paymentId);
      }

      return {
        isPaid,
        isExpired,
        remainingTime: remainingTime.toNumber(),
        buyer,
        paymentDetails,
      };
    } catch (error) {
      console.error('Error checking payment status:', error);
      throw error;
    }
  };

  const getPaymentRequests = () => {
    return paymentRequests;
  };

  const showPaymentWindow = (paymentId, amount) => {
    const qrCodeSrc = paymentId;
    setPaymentWindow({
      paymentId,
      amount,
      qrCodeSrc,
      expiryTime: null,
      isPaid: false,
    });
  };

  const closePaymentWindow = () => {
    setPaymentWindow(null);
  };

  const updatePaymentWindowStatus = async (paymentId) => {
    if (!paymentWindow || paymentWindow.paymentId !== paymentId) return;

    try {
      const { isPaid, isExpired, remainingTime, buyer } =
        await checkPaymentStatus(paymentId);
      setPaymentWindow((prev) => ({
        ...prev,
        expiryTime: remainingTime,
        isPaid,
        isExpired,
        buyer,
      }));
    } catch (error) {
      console.error('Error updating payment window status:', error);
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
        sellerPayments,
        registerSeller,
        createPaymentRequest,
        makePayment,
        makeWalletPayment,
        checkPaymentStatus,
        getPaymentRequests,
        fetchClientPaymentHistory,
        getClientPaymentCount,
        showPaymentWindow,
        closePaymentWindow,
        paymentWindow,
        updatePaymentWindowStatus,
        fetchSellerPaymentHistory,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

PaymentProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const usePayment = () => useContext(PaymentContext);
