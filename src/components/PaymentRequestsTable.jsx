import { motion } from 'framer-motion';
import { History, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PropTypes from 'prop-types';
import { usePayment } from '../contexts/PaymentContext';

const PaymentRequestsTable = () => {
  const { sellerPayments } = usePayment()

  console.log(sellerPayments);
  

  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
        <CardHeader>
          <div className='flex items-center gap-3 text-slate-50'>
            <CardTitle className='flex items-center gap-3 text-slate-50'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
              >
                <History className='w-5 h-5 text-indigo-400' />
              </motion.div>
              Payment History
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className='rounded-lg overflow-hidden border border-slate-800'
          >
            <Table>
              <TableHeader>
                <TableRow className='hover:bg-slate-800/50'>
                  <TableHead className='text-slate-400 font-medium'>
                    ID
                  </TableHead>
                  <TableHead className='text-slate-400 font-medium'>
                    Amount
                  </TableHead>
                  <TableHead className='text-slate-400 font-medium'>
                    By
                  </TableHead>
                  <TableHead className='text-slate-400 font-medium'>
                    Timestamp
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sellerPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.paymentId || payment.timestamp}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className='group'
                  >
                    <TableCell className='text-slate-300 font-medium'>
                      {payment.paymentId || 'Direct Payment'}
                    </TableCell>
                    <TableCell className='text-slate-300'>
                      {payment.amount} ETH
                    </TableCell>
                    <TableCell>
                      {payment.buyer
                        ? `${payment.buyer.slice(0, 6)}...${payment.buyer.slice(-4)}`
                        : `${payment.payer.slice(0, 6)}...${payment.payer.slice(-4)}`}
                    </TableCell>
                    <TableCell className='text-slate-400'>
                      {formatDate(payment.timestamp)}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            {sellerPayments.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-center py-12 text-slate-400'
              >
                <Clock className='w-12 h-12 mx-auto mb-4 opacity-50' />
                <p>No payment requests found for the selected filter.</p>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

PaymentRequestsTable.propTypes = {
  sellerPayments: PropTypes.arrayOf(
    PropTypes.shape({
      paymentId: PropTypes.string,
      amount: PropTypes.number,
      buyer: PropTypes.string,
      payer: PropTypes.string,
      timestamp: PropTypes.number,
      type: PropTypes.string,
    })
  ),
};

export default PaymentRequestsTable;