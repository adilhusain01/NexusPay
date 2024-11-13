import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  ArrowUpRight,
  Building2,
  CreditCard,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Shield,
  History,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { usePayment } from '../contexts/PaymentContext';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';

const AdminDashboard = () => {
  const { contract } = usePayment();
  const { account } = useWallet();
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalStats, setTotalStats] = useState({
    totalSellers: 0,
    totalTransactions: 0,
    totalVolume: '0',
  });
  const SELLERS_PER_PAGE = 10;

  useEffect(() => {
    checkOwnerStatus();
    if (isOwner) {
      loadSellers();
      calculateTotalStats();
    }
  }, [contract, account, currentPage, isOwner]);

  const checkOwnerStatus = async () => {
    if (contract && account) {
      try {
        const owner = await contract.owner();
        setIsOwner(owner.toLowerCase() === account.toLowerCase());
      } catch (error) {
        console.error('Error checking owner status:', error);
      }
    }
  };

  const calculateTotalStats = async () => {
    if (!contract || !isOwner) return;
    try {
      const [addresses, , transactions, amounts] = await contract.getAllSellers(
        0,
        1000
      );
      setTotalStats({
        totalSellers: addresses.length,
        totalTransactions: transactions.reduce(
          (acc, curr) => acc + Number(curr),
          0
        ),
        totalVolume: ethers.utils.formatEther(
          amounts.reduce((acc, curr) => acc.add(curr), ethers.BigNumber.from(0))
        ),
      });
    } catch (error) {
      console.error('Error calculating total stats:', error);
    }
  };

  const loadSellers = async () => {
    if (!contract || !isOwner) return;
    setLoading(true);
    try {
      const offset = currentPage * SELLERS_PER_PAGE;
      const [addresses, businessNames, transactions, amounts] =
        await contract.getAllSellers(offset, SELLERS_PER_PAGE);

      const formattedSellers = addresses.map((address, index) => ({
        address,
        businessName: businessNames[index],
        totalTransactions: transactions[index].toString(),
        totalAmount: ethers.utils.formatEther(amounts[index]),
      }));

      setSellers(formattedSellers);
    } catch (error) {
      console.error('Error loading sellers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOwner) {
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
  }

  return (
    <div className='max-w-6xl mx-auto px-4 py-12'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='text-center mb-12'
      >
        <h1 className='text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400'>
          Admin Dashboard
        </h1>
        <p className='text-lg text-slate-400'>
          Monitor platform performance and manage registered sellers
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'
      >
        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-slate-50'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
                >
                  <Users className='w-5 h-5 text-indigo-400' />
                </motion.div>
                Total Sellers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-slate-50'>
                {totalStats.totalSellers}
              </p>
            </CardContent>
          </Card>
        </motion.div>

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
                Total Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-slate-50'>
                {totalStats.totalTransactions}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
          <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
            <CardHeader>
              <CardTitle className='flex items-center gap-3 text-slate-50'>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center'
                >
                  <CreditCard className='w-5 h-5 text-purple-400' />
                </motion.div>
                Total Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-2xl font-bold text-slate-50'>
                {totalStats.totalVolume} ETH
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
          <CardHeader>
            <CardTitle className='flex items-center gap-3 text-slate-50'>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className='w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center'
              >
                <History className='w-5 h-5 text-indigo-400' />
              </motion.div>
              Registered Sellers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className='flex items-center justify-center py-12'>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className='w-12 h-12 border-4 border-slate-600 border-t-indigo-400 rounded-full'
                />
              </div>
            ) : (
              <div className='rounded-lg overflow-hidden border border-slate-800'>
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
            )}

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
              <span className='text-sm text-slate-400'>
                Page {currentPage + 1}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={sellers.length < SELLERS_PER_PAGE}
                className='flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Next
                <ChevronRight className='w-4 h-4 ml-1' />
              </motion.button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
