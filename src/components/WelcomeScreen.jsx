import { motion } from 'framer-motion';
import { Store, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';

const WelcomeScreen = ({ onRegisterClick }) => (
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
            onClick={onRegisterClick}
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

WelcomeScreen.propTypes = {
  onRegisterClick: PropTypes.func.isRequired,
};

export default WelcomeScreen;
