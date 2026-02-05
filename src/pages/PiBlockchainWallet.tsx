import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/context/UserContext';
import { 
  ArrowRight, 
  BarChart3, 
  CreditCard, 
  DollarSign, 
  Users, 
  Wallet, 
  Settings, 
  Crown,
  TrendingUp,
  TrendingDown,
  Copy,
  ExternalLink,
  RefreshCw,
  Lock,
  CheckCircle,
  Clock,
  AlertCircle,
  Droplet,
  Gift,
  Zap
} from 'lucide-react';
import GoToTop from '@/components/GoToTop';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const DROPLINK_WALLET = 'GBVTV77XFMDYSSVIG6ZGSRAGZ3S7KA4275YYLOLIROOD3Y3F3TH5U3EI';
const PI_MAINNET_API = 'https://api.mainnet.minepi.com';
const PI_API_URL = PI_MAINNET_API;

interface WalletBalance {
  balance: string;
  buying_liabilities: string;
  selling_liabilities: string;
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  limit?: string;
  is_authorized?: boolean;
  last_modified_ledger?: number;
}

interface AccountData {
  id: string;
  account_id: string;
  sequence: string;
  sequence_ledger?: number;
  sequence_time?: string;
  subentry_count?: number;
  home_domain?: string;
  last_modified_ledger?: number;
  last_modified_time: string;
  thresholds: {
    low_threshold: number;
    med_threshold: number;
    high_threshold: number;
  };
  flags: {
    auth_required: boolean;
    auth_revocable: boolean;
    auth_immutable: boolean;
    auth_clawback_enabled: boolean;
  };
  balances: WalletBalance[];
  signers: Array<{
    weight: number;
    key: string;
    type: string;
  }>;
  num_sponsoring: number;
  num_sponsored: number;
  paging_token: string;
}

interface PaymentOperation {
  id: string;
  type: string;
  from: string;
  to: string;
  asset_type: string;
  asset_code?: string;
  amount: string;
  created_at: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: string;
  asset_type: string;
  asset_code?: string;
  from: string;
  to: string;
  created_at: string;
  successful: boolean;
}

interface DropInfo {
  id: string;
  title: string;
  description: string;
  amount: string;
  status: 'active' | 'upcoming' | 'ended';
  startDate: string;
  endDate: string;
  participants: number;
  totalPool: string;
  icon: string;
}

const DROP_CAMPAIGNS: DropInfo[] = [
  {
    id: '1',
    title: 'Droplink Launch Airdrop',
    description: 'Join our community and receive Pi tokens! Connect your wallet to participate in the Droplink ecosystem.',
    amount: '10 π',
    status: 'active',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    participants: 1247,
    totalPool: '50,000 π',
    icon: '🚀'
  },
  {
    id: '2',
    title: 'Creator Rewards Drop',
    description: 'Content creators with verified profiles are eligible for special rewards. Create amazing content and earn!',
    amount: '25 π',
    status: 'active',
    startDate: '2025-12-05',
    endDate: '2026-01-05',
    participants: 856,
    totalPool: '100,000 π',
    icon: '✨'
  },
  {
    id: '3',
    title: 'New Year Bonus Drop',
    description: 'Ring in the new year with bonus Pi! Special rewards for all active Droplink users.',
    amount: '50 π',
    status: 'upcoming',
    startDate: '2026-01-01',
    endDate: '2026-01-07',
    participants: 0,
    totalPool: '250,000 π',
    icon: '🎉'
  },
  {
    id: '4',
    title: 'Referral Bonus Drop',
    description: 'Invite friends and earn together! Both you and your friend receive Pi when they join.',
    amount: '5 π',
    status: 'active',
    startDate: '2025-11-15',
    endDate: '2026-03-15',
    participants: 2341,
    totalPool: 'Unlimited',
    icon: '👥'
  }
];

const MAINNET_ISSUER_WALLET = 'GCTPMH43NGN7E4IXLQ27H2XWGGWWDY3I6UAPBFXYQSEUPEKNQE2BZXC2';

const PiBlockchainWallet = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { isLoggedIn, currentPlan } = useUser();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [walletData, setWalletData] = useState<AccountData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mainnetIssuerData, setMainnetIssuerData] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallet data from Pi Mainnet API
  const fetchWalletData = async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      // Fetch account data
      const accountResponse = await fetch(`${PI_API_URL}/accounts/${DROPLINK_WALLET}`);
      if (!accountResponse.ok) throw new Error('Failed to fetch wallet data');
      const accountData = await accountResponse.json();
      
      setWalletData(accountData);
      
      // Fetch mainnet issuer data
      try {
        const issuerResponse = await fetch(`${PI_API_URL}/accounts/${MAINNET_ISSUER_WALLET}`);
        if (issuerResponse.ok) {
          const issuerData = await issuerResponse.json();
          setMainnetIssuerData(issuerData);
        }
      } catch (issuerErr) {
        console.warn('Failed to fetch mainnet issuer data:', issuerErr);
      }
      
      // Fetch transactions (payments)
      const paymentsResponse = await fetch(
        `${PI_API_URL}/accounts/${DROPLINK_WALLET}/payments?limit=20&order=desc`
      );
      if (!paymentsResponse.ok) throw new Error('Failed to fetch transactions');
      const paymentsData = await paymentsResponse.json();
      
      // Transform payments to transactions
      const txs: Transaction[] = paymentsData._embedded?.records?.map((payment: any) => ({
        id: payment.id,
        type: payment.from === DROPLINK_WALLET ? 'payment' : 'received',
        amount: payment.amount,
        asset_type: payment.asset_type === 'native' ? 'PI' : payment.asset_code || payment.asset_type,
        asset_code: payment.asset_code,
        from: payment.from,
        to: payment.to,
        created_at: payment.created_at,
        successful: true
      })) || [];
      
      setTransactions(txs);
    } catch (err) {
      console.error('Error fetching wallet data:', err);
      setError('Failed to load wallet data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load wallet data on mount and set up auto-refresh
  useEffect(() => {
    fetchWalletData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchWalletData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefreshWallet = () => {
    fetchWalletData();
  };

  const handleCopyAddress = () => {
    if (walletData) {
      navigator.clipboard.writeText(walletData.id);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return 'N/A';
    return `${address.substring(0, 6)}...${address.substring(address.length - 6)}`;
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getNativeBalance = () => {
    if (!walletData) return '0.0000';
    const nativeBalance = walletData.balances.find(b => b.asset_type === 'native');
    return nativeBalance ? parseFloat(nativeBalance.balance).toFixed(4) : '0.0000';
  };

  const getStatusIcon = (successful: boolean) => {
    return successful ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />;
  };

  if (loading && !walletData) {
    return (
      <>
        <Helmet>
          <title>Loading Droplink Wallet...</title>
        </Helmet>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="text-center space-y-6 p-8">
            <div className="relative">
              <div className="animate-spin mx-auto">
                <Wallet className="w-16 h-16 text-primary" />
              </div>
              <div className="absolute inset-0 animate-ping opacity-20">
                <Wallet className="w-16 h-16 text-primary mx-auto" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Loading Droplink Wallet</h2>
              <p className="text-muted-foreground">Connecting to Pi Mainnet Blockchain...</p>
            </div>
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Droplink Wallet - Real-time Pi Blockchain Transactions</title>
        <meta name="description" content="View Droplink's official wallet with live Pi blockchain transactions and participate in airdrops" />
      </Helmet>

      <Navbar />

      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-6 p-4 sm:p-8 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight flex items-center gap-2">
                <Droplet className="w-8 h-8 text-primary" />
                Droplink Wallet
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time Pi blockchain transactions for droplink.space • Updated every 30 seconds
              </p>
              {walletData?.home_domain && (
                <p className="text-xs text-primary mt-1 font-mono">
                  Domain: {walletData.home_domain}
                </p>
              )}
            </div>
            <Button
              onClick={handleRefreshWallet}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="issuer" className="hidden lg:block">Issuer</TabsTrigger>
              <TabsTrigger value="drops" className="hidden lg:block">Drops</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Wallet Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Main Balance Card */}
                <Card className="lg:col-span-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-primary" />
                      Wallet Balance
                    </CardTitle>
                    <CardDescription>Your current Pi holdings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="text-4xl font-bold text-primary">
                        {getNativeBalance()} π
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Last updated: {walletData?.last_modified_time ? formatDate(walletData.last_modified_time) : 'N/A'}
                      </p>
                    </div>
                    
                    {/* Wallet Address */}
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Wallet Address</Label>
                      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg">
                        <code className="text-xs font-mono flex-1 truncate">
                          {walletData?.id ? formatAddress(walletData.id) : 'Loading...'}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyAddress}
                          className="gap-2"
                          disabled={!walletData}
                        >
                          <Copy className="w-4 h-4" />
                          {copiedAddress ? 'Copied!' : 'Copy'}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {DROPLINK_WALLET}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Account Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Sequence</span>
                        <code className="text-xs font-mono bg-slate-50 px-2 py-1 rounded">
                          {walletData?.sequence ? walletData.sequence.substring(0, 12) + '...' : 'N/A'}
                        </code>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Active Signers</span>
                        <span className="font-semibold">{walletData?.signers.length || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Sponsoring</span>
                        <span className="font-semibold">{walletData?.num_sponsoring || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Sponsored</span>
                        <span className="font-semibold">{walletData?.num_sponsored || 0}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Subentry Count</span>
                        <span className="font-semibold">{walletData?.subentry_count || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Security & Flags */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="w-5 h-5 text-primary" />
                    Security & Flags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {walletData?.flags && Object.entries(walletData.flags).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <span className="text-sm font-medium text-slate-700">
                          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <div className={value ? 'text-red-600' : 'text-green-600'}>
                          {value ? <AlertCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Transaction History
                  </CardTitle>
                  <CardDescription>
                    View all wallet transactions in real-time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No transactions found</p>
                    </div>
                  ) : (
                    <ScrollArea className="w-full max-h-[600px]">
                      <div className="space-y-2">
                        {transactions.map((tx) => (
                          <div
                            key={tx.id}
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className={`flex-shrink-0 p-2 rounded-lg ${
                                tx.type === 'payment' ? 'bg-red-100' : 'bg-green-100'
                              }`}>
                                {tx.type === 'payment' ? (
                                  <TrendingDown className="w-5 h-5 text-red-600" />
                                ) : (
                                  <TrendingUp className="w-5 h-5 text-green-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium capitalize">
                                  {tx.type === 'payment' ? 'Sent' : 'Received'} {tx.asset_code || tx.asset_type}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(tx.created_at)}
                                </div>
                                {(tx.to || tx.from) && (
                                  <div className="text-xs text-muted-foreground font-mono mt-1">
                                    {tx.type === 'payment' ? 'To: ' : 'From: '}
                                    {formatAddress(tx.type === 'payment' ? tx.to : tx.from)}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-right">
                                <div className={`font-semibold ${
                                  tx.type === 'payment' ? 'text-red-600' : 'text-green-600'
                                }`}>
                                  {tx.type === 'payment' ? '-' : '+'}
                                  {tx.amount ? parseFloat(tx.amount).toFixed(4) : '0.0000'} π
                                </div>
                                <div className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${
                                  tx.successful ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                                }`}>
                                  {getStatusIcon(tx.successful)}
                                  <span className="capitalize">{tx.successful ? 'Success' : 'Failed'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>

              {/* Transaction Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Transaction Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary">
                        {transactions.length}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Transactions</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {transactions.filter(t => t.type === 'received').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Received</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {transactions.filter(t => t.type === 'payment').length}
                      </div>
                      <p className="text-sm text-muted-foreground">Sent</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <div className="text-2xl font-bold text-sky-600">
                        {transactions.filter(t => t.successful).length}
                      </div>
                      <p className="text-sm text-muted-foreground">Successful</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Volume Analytics */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Transaction Volume
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Inflow</span>
                        <span className="text-lg font-bold text-green-600">+300.00 π</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Total Outflow</span>
                        <span className="text-lg font-bold text-red-600">-91.50 π</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-red-600 h-2 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t space-y-2">
                      <div className="flex justify-between items-center font-bold">
                        <span>Net Flow</span>
                        <span className="text-lg text-primary">+208.50 π</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Account Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Last 7 Days</span>
                        <span className="text-lg font-bold">4 txs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-sm font-medium">This Month</span>
                        <span className="text-lg font-bold">5 txs</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                        <span className="text-sm font-medium">Average per Day</span>
                        <span className="text-lg font-bold">0.71 txs</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Balance Growth</Label>
                      <div className="text-2xl font-bold text-green-600">+346.59 π</div>
                      <p className="text-xs text-muted-foreground">All time balance</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Avg Transaction</Label>
                      <div className="text-2xl font-bold text-primary">56.40 π</div>
                      <p className="text-xs text-muted-foreground">Average size</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs font-semibold">Success Rate</Label>
                      <div className="text-2xl font-bold text-sky-600">100%</div>
                      <p className="text-xs text-muted-foreground">Completed transactions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mainnet Issuer Tab */}
            <TabsContent value="issuer" className="space-y-6">
              {mainnetIssuerData ? (
                <>
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-green-900">✓ Mainnet Production</p>
                        <p className="text-sm text-green-800 mt-1">This is the official DROP token issuer and distributor on Pi Mainnet. Live production environment.</p>
                      </div>
                    </div>
                  </div>

                  <Card className="border-primary/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Droplet className="w-5 h-5 text-primary" />
                        Mainnet Issuer Account
                      </CardTitle>
                      <CardDescription>DROP Token Distribution Account - Pi Mainnet</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label className="text-xs font-semibold">Account Address</Label>
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg mt-2">
                          <code className="text-xs font-mono flex-1 truncate">
                            {mainnetIssuerData.id ? formatAddress(mainnetIssuerData.id) : 'N/A'}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              navigator.clipboard.writeText(mainnetIssuerData.id);
                              setCopiedAddress(true);
                              setTimeout(() => setCopiedAddress(false), 2000);
                            }}
                            className="gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            {copiedAddress ? 'Copied!' : 'Copy'}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 font-mono break-all">
                          {mainnetIssuerData.id}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Active Signers</p>
                          <p className="text-lg font-bold text-primary mt-1">{mainnetIssuerData.signers.length}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Subentry Count</p>
                          <p className="text-lg font-bold text-primary mt-1">{mainnetIssuerData.subentry_count || 0}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sponsoring</p>
                          <p className="text-lg font-bold text-primary mt-1">{mainnetIssuerData.num_sponsoring}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Sponsored</p>
                          <p className="text-lg font-bold text-primary mt-1">{mainnetIssuerData.num_sponsored}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-4">Asset Holdings</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {mainnetIssuerData.balances
                            .filter((b) => b.asset_type === 'credit_alphanum4' || b.asset_type === 'credit_alphanum12')
                            .slice(0, 6)
                            .map((balance, idx) => (
                              <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                                <p className="font-medium text-sm">
                                  {balance.asset_code} {balance.asset_type === 'credit_alphanum4' ? '(4)' : '(12)'}
                                </p>
                                <p className="text-lg font-bold text-primary mt-1">
                                  {parseFloat(balance.balance).toFixed(2)}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Status: {balance.is_authorized ? '✓ Authorized' : '✗ Not Authorized'}
                                </p>
                              </div>
                            ))}
                        </div>
                        {mainnetIssuerData.balances.filter(b => b.asset_code).length > 6 && (
                          <p className="text-xs text-muted-foreground mt-3">
                            +{mainnetIssuerData.balances.filter(b => b.asset_code).length - 6} more assets
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          Last Modified: {mainnetIssuerData.last_modified_time ? formatDate(mainnetIssuerData.last_modified_time) : 'N/A'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">Mainnet issuer data not available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Drops Tab */}
            <TabsContent value="drops" className="space-y-6">
              <DropsSection drops={DROP_CAMPAIGNS} />
            </TabsContent>
          </Tabs>

          {/* Mobile Drops Section */}
          <div className="lg:hidden mt-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Gift className="w-6 h-6 text-primary" />
                Active Airdrops
              </h2>
              <DropsSection drops={DROP_CAMPAIGNS} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <GoToTop />
    </>
  );
};

// Drops/Airdrops Section Component
const DropsSection = ({ drops }: { drops: DropInfo[] }) => {
  const getStatusBadge = (status: DropInfo['status']) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">🟢 Active</span>;
      case 'upcoming':
        return <span className="px-2 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full">🔵 Upcoming</span>;
      case 'ended':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">⚫ Ended</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {drops.map((drop) => (
        <Card 
          key={drop.id} 
          className={`relative overflow-hidden transition-all hover:shadow-lg ${
            drop.status === 'active' ? 'border-green-500 border-2' : ''
          }`}
        >
          {drop.status === 'active' && (
            <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 rounded-bl-lg text-xs font-bold animate-pulse">
              LIVE NOW
            </div>
          )}

          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="text-2xl">{drop.icon}</span>
                  {drop.title}
                </CardTitle>
                <div className="mt-2">
                  {getStatusBadge(drop.status)}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {drop.description}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-xs text-muted-foreground">Reward Amount</p>
                <p className="text-lg font-bold text-primary">{drop.amount}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Pool</p>
                <p className="text-lg font-bold text-purple-600">{drop.totalPool}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="font-medium">{new Date(drop.startDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="font-medium">{new Date(drop.endDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-semibold text-primary">{drop.participants.toLocaleString()}</span>
                <span className="text-muted-foreground"> participants</span>
              </span>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2">
            <Button
              className="flex-1"
              variant={drop.status === 'active' ? 'default' : 'outline'}
              disabled={drop.status !== 'active'}
            >
              {drop.status === 'active' && <Zap className="w-4 h-4 mr-2" />}
              {drop.status === 'active' ? 'Join Now' : drop.status === 'upcoming' ? 'Coming Soon' : 'Ended'}
            </Button>
            <Button variant="outline" size="icon">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PiBlockchainWallet;
