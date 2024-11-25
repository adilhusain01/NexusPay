import { Wallet } from 'lucide-react';
import StatCard from './StatCard';
import PropTypes from 'prop-types';

const TotalVolumeCard = ({ totalAmount }) => (
  <StatCard
    icon={Wallet}
    title='Total Volume'
    value={`${totalAmount} ETH`}
    iconColor='purple'
  />
);

TotalVolumeCard.propTypes = {
  totalAmount: PropTypes.string,
};

export default TotalVolumeCard;
