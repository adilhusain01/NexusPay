import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const Transactions = ({ sellerDetails }) => (
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
);

export default Transactions;
