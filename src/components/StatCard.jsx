import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PropTypes from 'prop-types';

const StatCard = ({ icon: Icon, title, value, iconColor }) => {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className='bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'>
        <CardHeader>
          <CardTitle className='flex items-center gap-3 text-slate-50'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`w-10 h-10 rounded-lg bg-${iconColor}-500/10 flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 text-${iconColor}-400`} />
            </motion.div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-2xl font-bold text-slate-50'>{value}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

StatCard.propTypes = {
  icon: PropTypes.elementType.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  iconColor: PropTypes.string.isRequired,
};

export default StatCard;
