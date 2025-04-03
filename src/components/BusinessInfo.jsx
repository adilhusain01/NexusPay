import { Building2 } from 'lucide-react';
import StatCard from './StatCard';
import PropTypes from 'prop-types';

const BusinessInfo = ({ businessName }) => (
  <StatCard
    icon={Building2}
    title='Business Info'
    value={businessName}
    iconColor='indigo'
  />
);

BusinessInfo.propTypes = {
  businessName: PropTypes.string,
};

export default BusinessInfo;
