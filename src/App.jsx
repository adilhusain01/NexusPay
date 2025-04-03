import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './contexts/WalletContext';
import { PaymentProvider } from './contexts/PaymentContext';
import Navbar from './components/Navbar';
import SellerDashboard from './components/SellerDashboard';
import ClientDashboard from './components/ClientDashboard';
import AdminDashboard from './components/AdminDashboard';
import { Toaster } from 'react-hot-toast';
import HomePage from './components/HomePage';
// import { ThemeProvider } from '@/components/theme-provider';

const App = () => {
  return (
    // <ThemeProvider defaultTheme='dark' storageKey='ui-theme'>
    <WalletProvider>
      <PaymentProvider>
        <Router>
          <Toaster
            position='top-right'
            toastOptions={{
              className: 'bg-slate-900 text-slate-50 border border-slate-800',
              style: {
                background: 'rgb(15 23 42)',
                color: 'rgb(248 250 252)',
                border: '1px solid rgb(30 41 59)',
              },
            }}
          />
          <div className='min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-50'>
            <Navbar />
            <div className='pt-16'>
              <Routes>
                <Route path='/seller' element={<SellerDashboard />} />
                <Route path='/client' element={<ClientDashboard />} />
                <Route path='/admin' element={<AdminDashboard />} />
                <Route path='/' element={<HomePage />} />
              </Routes>
            </div>
          </div>
        </Router>
      </PaymentProvider>
    </WalletProvider>
    // </ThemeProvider>
  );
};

export default App;
