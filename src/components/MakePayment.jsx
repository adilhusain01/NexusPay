import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '../contexts/PaymentContext';
import toast from 'react-hot-toast';
import { Wallet, ArrowRight, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MakePayment = () => {
  const { makePayment, checkPaymentStatus, loading } = usePayment();
  const [paymentId, setPaymentId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState('');

  const handleCheckPayment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const status = await checkPaymentStatus(paymentId);
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
      await makePayment(paymentId, paymentDetails.amount);
      const status = await checkPaymentStatus(paymentId);
      setPaymentStatus(status);

      if (status.paymentDetails) {
        setPaymentDetails(status.paymentDetails);
      }
    } catch (error) {
      setError('Payment failed. Please try again.');
      toast.error('Payment failed');
      console.error('Payment error:', error);
    }
  };

  useEffect(() => {
    let interval;
    if (paymentDetails && !paymentStatus?.isPaid && !paymentStatus?.isExpired) {
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
  }, [paymentDetails, paymentStatus, paymentId]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3 text-slate-50'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
            >
              <Wallet className='w-5 h-5 text-indigo-400' />
            </motion.div>
            Make Payment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCheckPayment} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-slate-400 mb-2'>
                Payment ID
              </label>
              <input
                type='text'
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                className='w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-50'
                placeholder='Enter payment ID'
                required
              />
            </div>
            <Button
              type='submit'
              disabled={loading}
              className='flex flex-row w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
            >
              {loading ? 'Checking...' : 'Check Payment'}
              <ArrowRight className='w-4 h-4 ml-2' />
            </Button>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg'
            >
              <div className='flex items-center text-red-400'>
                <XCircle className='w-5 h-5 mr-2' />
                <p>{error}</p>
              </div>
            </motion.div>
          )}

          {paymentDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-6 p-6 bg-slate-800/50 rounded-lg border border-slate-700'
            >
              <h3 className='text-lg font-semibold text-slate-50 mb-4'>
                Payment Details
              </h3>
              <div className='space-y-3'>
                <div className='flex justify-between text-slate-400'>
                  <span>Amount:</span>
                  <span className='text-slate-50 font-medium'>
                    {paymentDetails.amount} ETH
                  </span>
                </div>
                <div className='flex justify-between text-slate-400'>
                  <span>Status:</span>
                  <span className='text-slate-50 font-medium capitalize'>
                    {paymentDetails.status}
                  </span>
                </div>
                <div className='flex justify-between text-slate-400'>
                  <span>Created:</span>
                  <span className='text-slate-50 font-medium'>
                    {new Date(paymentDetails.createdAt * 1000).toLocaleString()}
                  </span>
                </div>
                {paymentStatus?.remainingTime > 0 && (
                  <div className='flex justify-between text-indigo-400'>
                    <span>Time Remaining:</span>
                    <span className='font-medium'>
                      {Math.floor(paymentStatus.remainingTime)} seconds
                    </span>
                  </div>
                )}
              </div>

              {!paymentStatus?.isPaid && !paymentStatus?.isExpired && (
                <Button
                  onClick={handleMakePayment}
                  disabled={loading}
                  className='flex flex-row w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                  <ArrowRight className='w-4 h-4 ml-2' />
                </Button>
              )}

              {paymentStatus?.isExpired && (
                <div className='flex items-center justify-center mt-4 text-red-400'>
                  <XCircle className='w-5 h-5 mr-2' />
                  <span className='font-medium'>Payment request expired</span>
                </div>
              )}

              {paymentStatus?.isPaid && (
                <div className='flex items-center justify-center mt-4 text-green-400'>
                  <CheckCircle className='w-5 h-5 mr-2' />
                  <span className='font-medium'>Payment completed</span>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MakePayment;
