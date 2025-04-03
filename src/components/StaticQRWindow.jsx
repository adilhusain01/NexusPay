import { motion } from 'framer-motion';
import { XCircle, Copy, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

const StaticQRWindow = ({ walletAddress, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
    >
      <Card className="bg-slate-900 border-slate-700 w-full max-w-xl">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-lg">
          <CardTitle className="flex items-center justify-between text-white">
            <span>Wallet QR Code</span>
            <button
              onClick={onClose}
              className="text-white hover:text-slate-300"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <QRCodeSVG value={walletAddress} size={192} />
            </div>
            <p className="text-slate-400 mt-4">
              Scan this QR code to send payments
            </p>
            <div className="flex items-center mt-4 w-full">
              <input
                type="text"
                value={walletAddress}
                className="bg-slate-800/50 border border-slate-700 rounded-l-lg px-4 py-2 flex-1 text-slate-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                readOnly
              />
              <button
                onClick={handleCopyAddress}
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2"
              >
                <Copy className="w-5 h-5" />
              </button>
              <a
                href={`https://etherscan.io/address/${walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-r-lg"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
            {copied && (
              <div className="text-green-500 mt-2">
                Address copied to clipboard!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

StaticQRWindow.propTypes = {
  walletAddress: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default StaticQRWindow;