import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePayment } from '../contexts/PaymentContext';
import MakePayment from './MakePayment';
import PaymentHistory from './PaymentHistory';

const ClientDashboard = () => {
  const { fetchClientPaymentHistory } = usePayment();

  useEffect(() => {
    fetchClientPaymentHistory();
  }, [fetchClientPaymentHistory]);

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-12'
      >
        <h1 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400'>
          Client Payment Portal
        </h1>
        <p className='text-lg text-slate-400'>
          Manage your payments securely and efficiently
        </p>
      </motion.div>

      <div className='grid lg:grid-cols-2 gap-8'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MakePayment />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PaymentHistory />
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;
