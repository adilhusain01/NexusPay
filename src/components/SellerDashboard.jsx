import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Store,
  CreditCard,
  Clock,
  ArrowUpRight,
  BarChart3,
  Filter,
  PlusCircle,
  Building2,
  Wallet,
  ArrowRight,
  XCircle,
  History,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePayment } from '../contexts/PaymentContext';
import { toast } from 'react-hot-toast';

const SellerDashboard = () => {
  const {
    isRegisteredSeller,
    sellerDetails,
    loading,
    registerSeller,
    createPaymentRequest,
    getPaymentRequests,
    checkPaymentStatus,
  } = usePayment();
  const [businessName, setBusinessName] = useState('');
  const [amount, setAmount] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerSeller(businessName);
      setShowRegistration(false);
      toast.success('Registration successful!');
    } catch (error) {
      setError('Registration failed. Please try again.');
      toast.error('Registration failed');
      console.error('Registration error:', error);
    }
  };

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

  const filteredRequests = getPaymentRequests(filter);

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  if (!isRegisteredSeller && !showRegistration) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-12'
        >
          <h1 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400'>
            Welcome to Seller Portal
          </h1>
          <p className='text-lg text-slate-400'>
            Register your business to start accepting crypto payments
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md mx-auto'
        >
          <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-slate-50'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
                >
                  <Store className='w-5 h-5 text-indigo-400' />
                </motion.div>
                Become a Seller
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowRegistration(true)}
                className='flex flex-row w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
              >
                Register as Seller
                <ArrowRight className='w-4 h-4 ml-2' />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (showRegistration) {
    return (
      <div className='max-w-6xl mx-auto px-4 py-12'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-12'
        >
          <h1 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400'>
            Register Your Business
          </h1>
          <p className='text-lg text-slate-400'>
            Complete your business registration to get started
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='max-w-md mx-auto'
        >
          <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-slate-50'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
                >
                  <Building2 className='w-5 h-5 text-indigo-400' />
                </motion.div>
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-slate-400 mb-2'>
                    Business Name
                  </label>
                  <input
                    type='text'
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className='w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-50'
                    placeholder='Enter business name'
                    required
                  />
                </div>
                <Button
                  type='submit'
                  disabled={loading}
                  className='flex flex-row w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                >
                  {loading ? 'Registering...' : 'Complete Registration'}
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
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-12'
      >
        <h1 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400'>
          Seller Dashboard
        </h1>
        <p className='text-lg text-slate-400'>
          Manage your payment requests and track business performance
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      >
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-slate-50'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
                >
                  <Building2 className='w-5 h-5 text-indigo-400' />
                </motion.div>
                Business Info
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-slate-50'>
                {sellerDetails?.businessName}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-slate-50'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center'
                >
                  <BarChart3 className='w-5 h-5 text-green-400' />
                </motion.div>
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-slate-50'>
                {sellerDetails?.totalTransactions}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-slate-50'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center'
                >
                  <Wallet className='w-5 h-5 text-purple-400' />
                </motion.div>
                Total Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-slate-50'>
                {sellerDetails?.totalAmount} ETH
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className='grid md:grid-cols-2 gap-8'>
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

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
            <CardHeader>
              <div className='flex items-center gap-3 text-slate-50'>
                <CardTitle className='flex items-center gap-3 text-slate-50'>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
                  >
                    <History className='w-5 h-5 text-indigo-400' />
                  </motion.div>
                  Payment Requests
                </CardTitle>
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className='w-40 bg-slate-800 border-slate-700'>
                    <SelectValue placeholder='Filter status' />
                  </SelectTrigger>
                  <SelectContent className='bg-slate-800 border-slate-700'>
                    <SelectItem value='all'>All Requests</SelectItem>
                    <SelectItem value='pending'>Pending</SelectItem>
                    <SelectItem value='completed'>Completed</SelectItem>
                    <SelectItem value='expired'>Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className='rounded-lg overflow-hidden border border-slate-800'
              >
                <Table>
                  <TableHeader>
                    <TableRow className='hover:bg-slate-800/50'>
                      <TableHead className='text-slate-400 font-medium'>
                        ID
                      </TableHead>
                      <TableHead className='text-slate-400 font-medium'>
                        Amount
                      </TableHead>
                      <TableHead className='text-slate-400 font-medium'>
                        Status
                      </TableHead>
                      <TableHead className='text-slate-400 font-medium'>
                        Created
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request, index) => (
                      <motion.tr
                        key={request.paymentId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className='group'
                      >
                        <TableCell className='text-slate-300 font-medium'>
                          {request.paymentId}
                        </TableCell>
                        <TableCell className='text-slate-300'>
                          {request.amount} ETH
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              request.status === 'completed'
                                ? 'bg-green-500/10 text-green-400'
                                : request.status === 'pending'
                                ? 'bg-yellow-500/10 text-yellow-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                          >
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell className='text-slate-400'>
                          {formatDate(request.createdAt)}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
                {filteredRequests.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className='text-center py-12 text-slate-400'
                  >
                    <Clock className='w-12 h-12 mx-auto mb-4 opacity-50' />
                    <p>No payment requests found for the selected filter.</p>
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerDashboard;
