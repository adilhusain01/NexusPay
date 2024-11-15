import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart3, CreditCard, History } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePayment } from '../contexts/PaymentContext';
import { useWallet } from '../contexts/WalletContext';
import { ethers } from 'ethers';
import AccessDenied from './AccessDenied';
import AdminStatCard from './AdminStatCard';
import SellerTable from './SellerTable';
import Pagination from './Pagination';

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
    return <AccessDenied />;
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
        <AdminStatCard
          Icon={Users}
          title='Total Sellers'
          value={totalStats.totalSellers}
        />
        <AdminStatCard
          Icon={BarChart3}
          title='Total Transactions'
          value={totalStats.totalTransactions}
        />
        <AdminStatCard
          Icon={CreditCard}
          title='Total Volume'
          value={`${totalStats.totalVolume} ETH`}
        />
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
            <SellerTable sellers={sellers} loading={loading} />
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              hasMorePages={sellers.length === SELLERS_PER_PAGE}
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
