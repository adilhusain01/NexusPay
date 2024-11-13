import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet, ArrowRight, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePayment } from '../contexts/PaymentContext';

const CreatePaymentRequest = () => {
  const { createPaymentRequest, loading } = usePayment();
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleCreatePayment = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const uniqueId = `pay_${Date.now()}`;
      await createPaymentRequest(uniqueId, amount);
      setAmount('');
      toast.success('Payment request created successfully!');
    } catch (error) {
      setError('Failed to create payment request.');
      toast.error('Payment request creation failed');
      console.error('Payment creation error:', error);
    }
  };

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
            Create Payment Request
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreatePayment} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-slate-400 mb-2'>
                Amount (ETH)
              </label>
              <input
                type='number'
                step='0.000001'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className='w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-50'
                placeholder='Enter amount in ETH'
                required
                min='0'
              />
            </div>
            <Button
              type='submit'
              disabled={loading}
              className='flex flex-row w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            >
              {loading ? 'Creating...' : 'Create Request'}
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CreatePaymentRequest;
