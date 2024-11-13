import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clock, History } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';

const PaymentRequests = () => {
  const { getPaymentRequests } = usePayment();
  const [filter, setFilter] = useState('all');

  const filteredRequests = getPaymentRequests(filter);

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
              Payment Requests
            </CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className='w-40 bg-slate-800 border-slate-700'>
                <SelectValue placeholder='Filter status' />
              </SelectTrigger>
              <SelectContent className='bg-slate-800 border-slate-700'>
                <SelectItem value='all'>All Requests</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='expired'>Expired</SelectItem>
              </SelectContent>
            </Select>
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
                    Status
                  </TableHead>
                  <TableHead className='text-slate-400 font-medium'>
                    Created
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request, index) => (
                  <motion.tr
                    key={request.paymentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className='group'
                  >
                    <TableCell className='text-slate-300 font-medium'>
                      {request.paymentId}
                    </TableCell>
                    <TableCell className='text-slate-300'>
                      {request.amount} ETH
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          request.status === 'completed'
                            ? 'bg-green-500/10 text-green-400'
                            : request.status === 'pending'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {request.status}
                      </span>
                    </TableCell>
                    <TableCell className='text-slate-400'>
                      {formatDate(request.createdAt)}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
            {filteredRequests.length === 0 && (
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

export default PaymentRequests;
