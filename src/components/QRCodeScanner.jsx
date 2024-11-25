import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { XCircle, Camera, Check, RefreshCw } from 'lucide-react';
import jsQR from 'jsqr';
import QrScanner from 'qr-scanner';
import PropTypes from 'prop-types';

const QRCodeScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  const startScanning = () => {
    setError('');
    setIsLoading(true);
    setIsScanning(true);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsLoading(false);
        scannerRef.current = new QrScanner(
          videoRef.current,
          (result) => handleScanResult(result.data),
          { highlightScanRegion: true, highlightCodeOutline: true }
        );
        scannerRef.current.start();
      })
      .catch((err) => {
        setError('Error accessing camera: ' + err.message);
        setIsScanning(false);
        setIsLoading(false);
      });
  };

  const stopScanning = () => {
    setIsScanning(false);
    if (scannerRef.current) {
      scannerRef.current.destroy();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const handleScanResult = (result) => {
    if (result) {
      setIsProcessing(true);
      setError(false)
      if (isValidQRFormat(result)) {
        onScan(result);
        stopScanning();
      } else {
        setError('Invalid QR code format. Please scan a valid payment request or wallet address.');
      }
      setIsProcessing(false);
    }
  };

  const captureQRCode = () => {
    setIsProcessing(true);
    const canvas = canvasRef.current;
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      handleScanResult(code.data);
    } else {
      setError('No QR code detected. Please try again.');
      setIsProcessing(false);
    }
  };

  const isValidQRFormat = (data) => {
    // Check for payment request format
    const isPaymentRequest = data.startsWith('pay_') && data.length === 'pay_1731519811637'.length;
    
    // Check for Ethereum address format (0x followed by 40 hex characters)
    const isEthereumAddress = /^0x[a-fA-F0-9]{40}$/.test(data);
    
    return isPaymentRequest || isEthereumAddress;
  };

  const retryScanning = () => {
    setError('');
    captureQRCode();
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      {isScanning ? (
        <div className='relative w-full max-w-md'>
          <video ref={videoRef} className='w-full rounded-lg' />
          <canvas ref={canvasRef} className='hidden' />
          <div className='absolute inset-0 border-2 border-indigo-500 opacity-50 pointer-events-none'></div>
          <button
            onClick={stopScanning}
            className='absolute top-4 right-4 bg-slate-800/50 hover:bg-slate-700 text-white p-2 rounded-full'
          >
            <XCircle className='w-6 h-6' />
          </button>
          <button
            onClick={captureQRCode}
            className='absolute bottom-4 left-4 bg-indigo-500 hover:bg-indigo-600 text-white p-3 rounded-full'
          >
            {isProcessing ? (
              <Check className='w-6 h-6 animate-spin' />
            ) : (
              <Camera className='w-6 h-6' />
            )}
          </button>
          {error && (
            <button
              onClick={retryScanning}
              className='absolute bottom-4 right-4 bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full'
            >
              <RefreshCw className='w-6 h-6' />
            </button>
          )}
        </div>
      ) : (
        !isScanning && (
          <Button
            onClick={startScanning}
            disabled={isLoading}
            className='flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-md'
          >
            {isLoading ? (
              <span className='animate-spin mr-2'>⏳</span>
            ) : (
              <Camera className='w-5 h-5 mr-2' />
            )}
            {isLoading ? 'Starting...' : 'Scan QR Code'}
          </Button>
        )
      )}
      {error && (
        <div className='mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400'>
          {error}
        </div>
      )}
    </div>
  );
};

QRCodeScanner.propTypes = {
  onScan: PropTypes.func.isRequired,
};

export default QRCodeScanner;