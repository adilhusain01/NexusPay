import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';

const PaymentForm = ({
  paymentId,
  setPaymentId,
  handleCheckPayment,
  loading,
}) => {
  return (
    <form onSubmit={handleCheckPayment} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-slate-400 mb-2'>
          Payment ID
        </label>
        <input
          type='text'
          value={paymentId}
          onChange={(e) => setPaymentId(e.target.value)}
          className='w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-50'
          placeholder='Enter payment ID'
          required
        />
      </div>
      <Button
        type='submit'
        disabled={loading}
        className='flex flex-row w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white'
      >
        {loading ? 'Checking...' : 'Check Payment'}
        <ArrowRight className='w-4 h-4 ml-2' />
      </Button>
    </form>
  );
};

PaymentForm.propTypes = {
  paymentId: PropTypes.string.isRequired,
  setPaymentId: PropTypes.func.isRequired,
  handleCheckPayment: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PaymentForm;
