import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePayment } from '../contexts/PaymentContext';
import toast from 'react-hot-toast';
import { XCircle, Wallet, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import QRCodeScanner from './QRCodeScanner';
import DetailItem from './DetailItem';

const MakePayment = () => {
  const { makePayment, makeWalletPayment, checkPaymentStatus, loading, fetchClientPaymentHistory } = usePayment();
  const [paymentId, setPaymentId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const [isWalletPayment, setIsWalletPayment] = useState(false);
  const [amount, setAmount] = useState('');

  const resetState = () => {
    setPaymentId('');
    setPaymentStatus(null);
    setPaymentDetails(null);
    setIsConfirming(false);
    setError('');
    setIsWalletPayment(false);
    setAmount('');
  };

  const handleCheckPayment = async (scannedCode) => {
    setError('');

    // Robust payment type detection
    const isValidWalletAddress = /^0x[a-fA-F0-9]{40}$/.test(scannedCode);
    const isValidPaymentId = /^pay_[a-zA-Z0-9]{13}$/.test(scannedCode);

    if (!isValidWalletAddress && !isValidPaymentId) {
      setError('Invalid QR code format');
      toast.error('Invalid QR code format');
      return;
    }

    setPaymentId(scannedCode);
    setIsWalletPayment(isValidWalletAddress);

    if (isValidWalletAddress) {
      setPaymentDetails({
        type: 'wallet',
        address: scannedCode,
        status: 'ready'
      });
      return;
    }
    
    try {
      const status = await checkPaymentStatus(scannedCode);
      setPaymentStatus(status);

      if (status.paymentDetails) {
        setPaymentDetails(status.paymentDetails);
      } else {
        setError('Payment request not found');
        toast.error('Payment request not found');
      }

      if (status.isExpired) {
        toast.error('This payment request has expired');
      }
    } catch (error) {
      setError('Error checking payment status');
      toast.error('Error checking payment status');
      console.error('Error checking payment:', error);
    }
  };

  const handleMakePayment = async () => {
    setError('');
    try {
      if (isWalletPayment) {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
          setError('Please enter a valid amount');
          toast.error('Please enter a valid amount');
          return;
        }

        // Direct wallet payment - only one transaction needed
        await makeWalletPayment(paymentId, parseFloat(amount));
        toast.success('Payment successful');
        resetState();
        await fetchClientPaymentHistory();
      } else {
        // Regular payment through contract - remove the second transaction
        await makePayment(paymentId, paymentDetails.amount);
        // No need to check status immediately after payment
        // The contract events will handle updating the UI
        toast.success('Payment successful');
        resetState();
        await fetchClientPaymentHistory();
      }
    } catch (error) {
      setError('Payment failed. Please try again.');
      toast.error('Payment failed');
      console.error('Payment error:', error);
    }
  };

  useEffect(() => {
    let interval;
    if (paymentDetails && !isWalletPayment && !paymentStatus?.isPaid && !paymentStatus?.isExpired) {
      interval = setInterval(async () => {
        try {
          const status = await checkPaymentStatus(paymentId);
          setPaymentStatus(status);

          if (status.paymentDetails) {
            setPaymentDetails(status.paymentDetails);
          }

          if (status.isExpired) {
            clearInterval(interval);
            toast.error('Payment request has expired');
          }
        } catch (error) {
          console.error('Error refreshing payment status:', error);
        }
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [paymentDetails, paymentStatus, paymentId, isWalletPayment]);

  return (
    <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 shadow-xl'>
      <CardHeader className='pb-4'>
        <CardTitle className='flex items-center gap-3 text-slate-50 text-2xl font-bold'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='w-12 h-12 rounded-lg bg-indigo-500/20 flex items-center justify-center'
          >
            <Wallet className='w-6 h-6 text-indigo-400' />
          </motion.div>
          Make Payment
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex justify-center'>
          <QRCodeScanner onScan={handleCheckPayment} />
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='p-4 bg-red-500/10 border border-red-500/20 rounded-lg'
            >
              <div className='flex items-center text-red-400'>
                <XCircle className='w-5 h-5 mr-2' />
                <p>{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {paymentDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className='p-6 bg-slate-800/50 rounded-lg border border-slate-700 shadow-lg'
            >
              <h3 className='text-xl font-semibold text-slate-50 mb-4'>
                Payment Details
              </h3>
              <div className='space-y-4'>
                {isWalletPayment ? (
                  <>
                    <DetailItem
                      label='Recipient Address'
                      value={`${paymentDetails.address.slice(0, 6)}...${paymentDetails.address.slice(-4)}`}
                    />
                    <div>
                      <label className='block text-sm font-medium text-slate-300 mb-2'>
                        Amount (ETH)
                      </label>
                      <input
                        type='number'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className='w-full px-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-50 transition duration-200'
                        placeholder='Enter amount to send'
                        step='0.001'
                        min='0'
                        required
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <DetailItem
                      label='Payment ID'
                      value={paymentId}
                    />
                    <DetailItem
                      label='Amount'
                      value={`${paymentDetails.amount} ETH`}
                    />
                    <DetailItem
                      label='Status'
                      value={paymentDetails.status}
                      isStatus
                    />
                    <DetailItem
                      label='Created'
                      value={new Date(
                        paymentDetails.createdAt * 1000
                      ).toLocaleString()}
                    />
                    {paymentStatus?.remainingTime > 0 && (
                      <DetailItem
                        label='Time Remaining'
                        value={`${Math.floor(paymentStatus.remainingTime)} seconds`}
                        icon={<Clock className='w-5 h-5 text-indigo-400' />}
                      />
                    )}
                  </>
                )}
              </div>

              {(!paymentStatus?.isPaid && !paymentStatus?.isExpired) && (
                <motion.div layout className='mt-6'>
                  {!isConfirming ? (
                    <Button
                      onClick={() => setIsConfirming(true)}
                      className='flex flex-row w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105'
                    >
                      Confirm Payment
                      <ArrowRight className='w-5 h-5 ml-2' />
                    </Button>
                  ) : (
                    <div className='flex space-x-3'>
                      <Button
                        onClick={handleMakePayment}
                        disabled={loading || (isWalletPayment && !amount)}
                        className='flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105'
                      >
                        {loading ? 'Processing...' : 'Pay Now'}
                      </Button>
                      <Button
                        onClick={() => setIsConfirming(false)}
                        className='bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out'
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </motion.div>
              )}

              <AnimatePresence>
                {!isWalletPayment && (
                  <>
                    {paymentStatus?.isExpired && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className='flex items-center justify-center mt-6 text-red-400 bg-red-500/10 p-3 rounded-lg'
                      >
                        <XCircle className='w-5 h-5 mr-2' />
                        <span className='font-medium'>Payment request expired</span>
                      </motion.div>
                    )}

                    {paymentStatus?.isPaid && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className='flex items-center justify-center mt-6 text-green-400 bg-green-500/10 p-3 rounded-lg'
                      >
                        <CheckCircle className='w-5 h-5 mr-2' />
                        <span className='font-medium'>Payment completed</span>
                      </motion.div>
                    )}
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default MakePayment;