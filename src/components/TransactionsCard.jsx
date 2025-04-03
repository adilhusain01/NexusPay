import { BarChart3 } from 'lucide-react';
import StatCard from './StatCard';
import PropTypes from 'prop-types';

const TransactionsCard = ({ totalTransactions }) => (
  <StatCard
    icon={BarChart3}
    title='Transactions'
    value={totalTransactions}
    iconColor='green'
  />
);

TransactionsCard.propTypes = {
  totalTransactions: PropTypes.string,
}

export default TransactionsCard;
