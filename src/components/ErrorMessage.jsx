import { XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  return (
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
  );
};

ErrorMessage.propTypes = {
  error: PropTypes.string,
};

export default ErrorMessage;
