import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Users } from 'lucide-react';
import PropTypes from 'prop-types';

const SellerTable = ({ sellers, loading }) => {
  return (
    <div className='rounded-lg overflow-hidden border border-slate-800'>
      {loading ? (
        <div className='flex items-center justify-center py-12'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className='w-12 h-12 border-4 border-slate-600 border-t-indigo-400 rounded-full'
          />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className='hover:bg-slate-800/50'>
              <TableHead className='text-slate-400 font-medium'>
                Business Name
              </TableHead>
              <TableHead className='text-slate-400 font-medium'>
                Address
              </TableHead>
              <TableHead className='text-slate-400 font-medium'>
                Transactions
              </TableHead>
              <TableHead className='text-slate-400 font-medium'>
                Volume (ETH)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sellers.map((seller, index) => (
              <motion.tr
                key={seller.address}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className='group hover:bg-slate-800/50'
              >
                <TableCell className='text-slate-300 font-medium'>
                  {seller.businessName}
                </TableCell>
                <TableCell className='text-slate-400'>
                  {`${seller.address.substring(
                    0,
                    6
                  )}...${seller.address.substring(38)}`}
                </TableCell>
                <TableCell className='text-slate-300'>
                  {seller.totalTransactions}
                </TableCell>
                <TableCell className='text-slate-300'>
                  {seller.totalAmount}
                </TableCell>
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      )}

      {sellers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-center py-12 text-slate-400'
        >
          <Users className='w-12 h-12 mx-auto mb-4 opacity-50' />
          <p>No registered sellers found.</p>
        </motion.div>
      )}
    </div>
  );
};

SellerTable.propTypes = {
  sellers: PropTypes.arrayOf(
    PropTypes.shape({
      businessName: PropTypes.string.isRequired,
      address: PropTypes.string.isRequired,
      totalTransactions: PropTypes.number.isRequired,
      totalAmount: PropTypes.number.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
};

export default SellerTable;
