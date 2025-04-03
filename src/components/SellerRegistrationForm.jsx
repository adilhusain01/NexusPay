import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, ArrowRight, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';

const SellerRegistrationForm = ({ loading, onSubmit }) => {
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(businessName);
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.log(error);
    }
  };

  return (
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
          <form onSubmit={handleSubmit} className='space-y-4'>
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
  );
};

SellerRegistrationForm.propTypes = {
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default SellerRegistrationForm;
