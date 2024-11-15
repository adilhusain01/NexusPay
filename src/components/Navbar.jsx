import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, ExternalLink, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useWallet } from '../contexts/WalletContext';
import logo from '../assets/logo.png';

const Navbar = () => {
  const { account, connectWallet } = useWallet();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      if (scrolled !== isScrolled) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 will-change-transform ${
        isScrolled
          ? 'bg-slate-900/95 supports-[backdrop-filter]:backdrop-blur-xl border-b border-slate-800/50'
          : 'bg-transparent border-b border-transparent'
      }`}
      style={{
        WebkitBackfaceVisibility: 'hidden',
        WebkitTransform: 'translate3d(0, 0, 0)',
      }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/' className='flex items-center space-x-3'>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className='bg-indigo-500/10 p-1 rounded-lg'
            >
              <img src={logo} alt='logo' className='w-10 h-10 object-cover' />
            </motion.div>
            <span className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400'>
              NexusPay
            </span>
          </Link>

          <div className='hidden md:flex items-center space-x-4'>
            {account ? (
              <div className='flex flex-row items-center space-x-4'>
                <div className='flex items-center px-3 py-1 bg-slate-800/90 rounded-full border border-slate-700/90'>
                  <div className='w-2 h-2 bg-green-500 rounded-full mr-2' />
                  <span className='text-sm text-slate-300'>
                    {`${account.slice(0, 6)}...${account.slice(-4)}`}
                  </span>
                </div>
                <Button
                  onClick={connectWallet}
                  variant='outline'
                  className='flex flex-row border-slate-700/90 hover:border-indigo-500 bg-slate-800/50'
                >
                  <ExternalLink className='w-4 h-4 mr-2' />
                  Change Wallet
                </Button>
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                className='flex flex-row bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
              >
                <Wallet className='w-4 h-4 mr-2' />
                Connect Wallet
              </Button>
            )}
          </div>

          <div className='md:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='ghost' size='icon' className='text-slate-400'>
                  <Menu className='w-5 h-5' />
                </Button>
              </SheetTrigger>
              <SheetContent className='bg-slate-900 border-slate-800'>
                <div className='flex flex-col space-y-4 mt-8'>
                  {account ? (
                    <>
                      <div className='flex items-center px-3 py-1 bg-slate-800/90 rounded-full border border-slate-700/90 w-fit'>
                        <div className='w-2 h-2 bg-green-500 rounded-full mr-2' />
                        <span className='text-sm text-slate-300'>
                          {`${account.slice(0, 6)}...${account.slice(-4)}`}
                        </span>
                      </div>
                      <Button
                        onClick={connectWallet}
                        variant='outline'
                        className='border-slate-700/90 hover:border-indigo-500 bg-slate-800/50'
                      >
                        <ExternalLink className='w-4 h-4 mr-2' />
                        Change Wallet
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={connectWallet}
                      className='flex flex-row bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                    >
                      <Wallet className='w-4 h-4 mr-2' />
                      Connect Wallet
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
