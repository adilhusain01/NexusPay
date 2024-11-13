import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  Boxes,
  Lock,
  Wallet,
  ChevronRight,
  Globe,
  Zap,
  Shield as ShieldCheck,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MainFeatureCard = ({ title, description, icon: Icon, to }) => (
  <Link to={to} className='block'>
    <Card className='h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 hover:border-indigo-500 transition-all duration-300 group relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
      <CardHeader className='space-y-4 relative z-10'>
        <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300'>
          <Icon className='w-7 h-7 text-indigo-400 group-hover:text-indigo-300 transition-colors' />
        </div>
        <div className='space-y-2'>
          <CardTitle className='text-xl font-semibold text-slate-50 flex items-center gap-2 group-hover:text-white'>
            {title}
            <ChevronRight className='w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300' />
          </CardTitle>
          <CardDescription className='text-slate-400 text-base leading-relaxed group-hover:text-slate-300'>
            {description}
          </CardDescription>
        </div>
      </CardHeader>
    </Card>
  </Link>
);

const FeatureCard = ({ title, description, icon: Icon }) => (
  <Card className='bg-slate-900/40 border-slate-800/50 hover:border-slate-700/50 transition-all duration-300 h-full'>
    <CardHeader>
      <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center mb-4'>
        <Icon className='w-6 h-6 text-indigo-400' />
      </div>
      <CardTitle className='text-lg text-slate-200 font-medium'>
        {title}
      </CardTitle>
      <CardDescription className='text-slate-400'>
        {description}
      </CardDescription>
    </CardHeader>
  </Card>
);

const Stats = () => (
  <div className='grid grid-cols-2 md:grid-cols-4 gap-6 py-8'>
    {[
      { label: 'Active Users', value: '5K+' },
      { label: 'Daily Transactions', value: '1K+' },
      { label: 'Processing Volume', value: '$0.25M+' },
      { label: 'Countries Served', value: '7+' },
    ].map((stat, index) => (
      <div key={index} className='text-center'>
        <div className='text-2xl font-bold text-white mb-1'>{stat.value}</div>
        <div className='text-sm text-slate-400'>{stat.label}</div>
      </div>
    ))}
  </div>
);

const features = [
  {
    title: 'Global Infrastructure',
    description: 'Powered by enterprise-grade blockchain networks',
    icon: Globe,
  },
  {
    title: 'Lightning Fast',
    description: 'Sub-second transaction confirmation times',
    icon: Zap,
  },
  {
    title: 'Bank-Grade Security',
    description: 'Multi-layer encryption and compliance',
    icon: ShieldCheck,
  },
  {
    title: 'Smart Storage',
    description: 'Distributed ledger technology for data integrity',
    icon: Boxes,
  },
  {
    title: 'Instant Settlements',
    description: 'Real-time processing and automated reconciliation',
    icon: Sparkles,
  },
  {
    title: 'Wallet Integration',
    description: 'Compatible with major crypto and fiat wallets',
    icon: Wallet,
  },
];

const HomePage = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24'>
        {/* Hero Section */}
        <div className='text-center mb-20'>
          <h1 className='text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient'>
            NexusPay
          </h1>
          <p className='text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed'>
            The future of decentralized payments. Enterprise-grade blockchain
            infrastructure for the modern digital economy.
          </p>
        </div>

        {/* Stats Section */}
        <Stats />

        {/* Main Features Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24'>
          <MainFeatureCard
            title='Client Portal'
            description='Seamless payments and transaction history at your fingertips'
            icon={Store}
            to='/client'
          />
          <MainFeatureCard
            title='Seller Dashboard'
            description='Create payment requests and manage your business with powerful analytics'
            icon={Users}
            to='/seller'
          />
          <MainFeatureCard
            title='Admin Console'
            description='Complete platform oversight with advanced management tools'
            icon={Shield}
            to='/admin'
          />
        </div>

        {/* Additional Features Grid */}
        <div>
          <h2 className='text-3xl font-semibold text-slate-50 text-center mb-12'>
            Enterprise-Grade Features
          </h2>
          <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
