import PropTypes from 'prop-types';

const DetailItem = ({ label, value, icon, isStatus }) => (
    <div className='flex justify-between items-center'>
      <span className='text-slate-400'>{label}:</span>
      <span
        className={`text-slate-50 font-medium flex items-center ${
          isStatus ? 'capitalize' : ''
        }`}
      >
        {icon && <span className='mr-2'>{icon}</span>}
        {value}
      </span>
    </div>
  );

  
DetailItem.propTypes = {
label: PropTypes.string.isRequired,
value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
icon: PropTypes.element,
isStatus: PropTypes.bool,
};

export default DetailItem;    