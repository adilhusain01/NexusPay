import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, setCurrentPage, hasMorePages }) => {
  return (
    <div className='mt-6 flex items-center justify-between'>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
        disabled={currentPage === 0}
        className='flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <ChevronLeft className='w-4 h-4 mr-1' />
        Previous
      </motion.button>
      <span className='text-sm text-slate-400'>Page {currentPage + 1}</span>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setCurrentPage((prev) => prev + 1)}
        disabled={!hasMorePages}
        className='flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
      >
        Next
        <ChevronRight className='w-4 h-4 ml-1' />
      </motion.button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  setCurrentPage: PropTypes.func.isRequired,
  hasMorePages: PropTypes.bool.isRequired,
};

export default Pagination;
