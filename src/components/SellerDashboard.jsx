import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { usePayment } from '../contexts/PaymentContext';
import WelcomeScreen from './WelcomeScreen';
import { motion } from 'framer-motion';
import SellerRegistrationForm from './SellerRegistrationForm';
import DashboardHeader from './DashboardHeader';
import BusinessInfo from './BusinessInfo';
import TransactionsCard from './TransactionsCard';
import TotalVolumeCard from './TotalVolumeCard';
import CreatePaymentForm from './CreatePaymentForm';
import PaymentRequestsTable from './PaymentRequestsTable';
import PaymentWindow from './PaymentWindow';

const SellerDashboard = () => {
  const {
    isRegisteredSeller,
    sellerDetails,
    loading,
    registerSeller,
    createPaymentRequest,
    paymentWindow,
    sellerPaymentHistory,
    fetchSellerPaymentHistory,
  } = usePayment();

  const [showRegistration, setShowRegistration] = useState(false);

  useEffect(() => {
    if (isRegisteredSeller) {
      fetchSellerPaymentHistory();
    }
  }, [isRegisteredSeller]);

  const handleRegister = async (businessName) => {
    try {
      await registerSeller(businessName);
      setShowRegistration(false);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    }
  };

  const handleCreatePayment = async (amount) => {
    try {
      const uniqueId = `pay_${Date.now()}`;
      await createPaymentRequest(uniqueId, amount);
      toast.success('Payment request created successfully!');
    } catch (error) {
      toast.error('Payment request creation failed');
      throw error;
    }
  };

  if (!isRegisteredSeller && !showRegistration) {
    return <WelcomeScreen onRegisterClick={() => setShowRegistration(true)} />;
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
        <SellerRegistrationForm loading={loading} onSubmit={handleRegister} />
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <DashboardHeader />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      >
        <BusinessInfo businessName={sellerDetails?.businessName} />
        <TransactionsCard
          totalTransactions={sellerDetails?.totalTransactions}
        />
        <TotalVolumeCard totalAmount={sellerDetails?.totalAmount} />
      </motion.div>

      <div className='grid md:grid-cols-2 gap-8'>
        <CreatePaymentForm loading={loading} onSubmit={handleCreatePayment} />
        <PaymentRequestsTable sellerPaymentHistory={sellerPaymentHistory} />
      </div>

      {paymentWindow && <PaymentWindow />}
    </div>
  );
};

export default SellerDashboard;
