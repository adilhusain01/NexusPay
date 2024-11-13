import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '../contexts/PaymentContext';
import { toast } from 'react-hot-toast';
import BusinessInfo from './BusinessInfo';
import Transactions from './Transactions';
import TotalVolume from './TotalVolume';
import CreatePaymentRequest from './CreatePaymentRequest';
import PaymentRequests from './PaymentRequests';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Store, ArrowRight, XCircle } from 'lucide-react';

const SellerDashboard = () => {
  const { isRegisteredSeller, sellerDetails, loading, registerSeller } =
    usePayment();
  const [businessName, setBusinessName] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
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
          Manage your business and payment requests
        </p>
      </motion.div>

      <div className='grid lg:grid-cols-2 gap-8'>
        <BusinessInfo />
        <TotalVolume />
      </div>

      <div className='grid lg:grid-cols-2 gap-8 mt-8'>
        <CreatePaymentRequest />
        <PaymentRequests />
      </div>

      <div className='mt-8'>
        <Transactions />
      </div>
    </div>
  );
};

export default SellerDashboard;
