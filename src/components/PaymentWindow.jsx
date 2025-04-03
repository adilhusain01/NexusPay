import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Copy, Clock, Download } from 'lucide-react';
import { usePayment } from '../contexts/PaymentContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { QRCodeSVG } from 'qrcode.react';

const PaymentWindow = () => {
  const { paymentWindow, closePaymentWindow, updatePaymentWindowStatus } =
    usePayment();
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);

  useEffect(() => {
    if (paymentWindow) {
      const interval = setInterval(() => {
        updatePaymentWindowStatus(paymentWindow.paymentId);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [paymentWindow, updatePaymentWindowStatus]);

  if (!paymentWindow) return null;

  const handleCopyPaymentId = () => {
    navigator.clipboard.writeText(paymentWindow.paymentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svg = qrRef.current.querySelector('svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `payment-qr-code.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const handleClose = () => {
    closePaymentWindow();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className='fixed inset-0 flex items-center justify-center z-50 bg-black/50'
    >
      <Card className='bg-slate-900 border-slate-700 w-full max-w-xl'>
        <CardHeader className='bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg'>
          <CardTitle className='flex items-center justify-between text-white'>
            <span>Payment Request</span>
            <button
              onClick={handleClose}
              className='text-white hover:text-slate-300'
            >
              <XCircle className='w-6 h-6' />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className='p-8'>
          <div className='flex flex-col items-center'>
            <div className='bg-white p-4 rounded-lg shadow-lg' ref={qrRef}>
              <QRCodeSVG value={paymentWindow.paymentId} size={192} />
            </div>
            <p className='text-slate-400 mt-4'>
              Scan this QR code to make payment
            </p>
            <div className='flex items-center mt-4 w-full'>
              <input
                type='text'
                value={paymentWindow.paymentId}
                className='bg-slate-800/50 border border-slate-700 rounded-l-lg px-4 py-2 flex-1 text-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                readOnly
              />
              <button
                onClick={handleCopyPaymentId}
                className='bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-r-lg'
              >
                {copied ? (
                  <CheckCircle className='w-5 h-5' />
                ) : (
                  <Copy className='w-5 h-5' />
                )}
              </button>
            </div>
            <div className='flex items-center mt-4 text-slate-400'>
              <Clock className='w-5 h-5 mr-2' />
              <span>
                This payment request will expire in{' '}
                <span className='text-slate-50 font-medium'>
                  {paymentWindow.expiryTime
                    ? new Date(paymentWindow.expiryTime * 1000)
                        .toISOString()
                        .slice(11, 19)
                    : ''}
                </span>
              </span>
            </div>
            {paymentWindow.isPaid && (
              <div className='flex items-center text-green-500 mt-4'>
                <CheckCircle className='w-5 h-5 mr-2' />
                <span>Payment Completed</span>
              </div>
            )}
            <button
              onClick={handleDownload}
              className='bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg mt-4'
            >
              <Download className='w-5 h-5 inline-block' />
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentWindow;
