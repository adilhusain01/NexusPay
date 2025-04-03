import { motion } from 'framer-motion';

const DashboardHeader = () => (
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
);

export default DashboardHeader;
