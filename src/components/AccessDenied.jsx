import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const AccessDenied = () => {
  return (
    <div
      className='flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-12'
      style={{ height: 'calc(100vh - 4.5rem)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-12'
      >
        <h1 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400'>
          Access Restricted
        </h1>
        <p className='text-lg text-slate-400'>
          Only authorized administrators can access this dashboard
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='max-w-md mx-auto'
      >
        <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
          <CardHeader>
            <CardTitle className='flex flex-col items-center gap-3 text-slate-50'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center'
              >
                <Shield className='w-5 h-5 text-red-400' />
              </motion.div>
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-400 text-center'>
              Please connect with an administrator account to access this
              dashboard.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccessDenied;
