import { motion } from 'framer-motion';
import { usePayment } from '../contexts/PaymentContext';
import { History } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleString();
};

const PaymentHistory = () => {
  const { clientPayments } = usePayment();

  return (
    <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
      <CardHeader>
        <CardTitle className='flex items-center gap-3 text-slate-50'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
          >
            <History className='w-5 h-5 text-indigo-400' />
          </motion.div>
          Payment History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className='overflow-hidden rounded-lg border border-slate-700'>
          <div className='overflow-x-auto'>
            {clientPayments.length > 0 ? (
              <table className='w-full'>
                <thead>
                  <tr className='bg-slate-800/50'>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider'>
                      Timestamp
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider'>
                      Business
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider'>
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-slate-700'>
                  {clientPayments.map((payment, index) => (
                    <motion.tr
                      key={payment.paymentId || payment.timestamp}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className='bg-slate-800/30 hover:bg-slate-800/50 transition-colors'
                    >
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-300'>
                        {formatDate(payment.timestamp)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-slate-300'>
                        {payment.businessName || `${payment.recipient.slice(0, 6)}...${payment.recipient.slice(-4)}`}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-400'>
                        {payment.amount} ETH
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className='text-center py-8 text-slate-400'>
                No payment history available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentHistory;