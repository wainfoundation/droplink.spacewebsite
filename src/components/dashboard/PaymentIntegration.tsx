import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard,
  DollarSign,
  Wallet,
  TrendingUp,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  Shield,
  Award,
  Trophy,
  Medal,
  Flag,
  Compass,
  Navigation,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  QrCode,
  Tag,
  Pin,
  Archive,
  Settings2,
  User,
  UserPlus,
  UserCheck,
  UserX,
  Users2,
  UserCircle,
  UserSquare,
  UserCheck2,
  UserX2,
  UserPlus2,
  UserMinus,
  UserEdit,
  UserCog,
  UserShield,
  UserLock,
  UserUnlock,
  UserKey,
  UserBell,
  UserMail,
  UserPhone,
  UserMessage,
  UserVideo,
  UserImage,
  UserMusic,
  UserFile,
  UserBook,
  UserShopping,
  UserCredit,
  UserDollar,
  UserGift,
  UserAward,
  UserTrophy,
  UserMedal,
  UserFlag,
  UserGlobe,
  UserCompass,
  UserNavigation,
  UserSearch,
  UserFilter,
  UserSort,
  UserMore,
  UserCopy,
  UserQr,
  UserTag,
  UserPin,
  UserArchive,
  UserSettings,
  UserCog2,
  UserShield2,
  UserLock2,
  UserUnlock2,
  UserKey2,
  UserBell2,
  UserMail2,
  UserPhone2,
  UserMessage2,
  UserVideo2,
  UserImage2,
  UserMusic2,
  UserFile2,
  UserBook2,
  UserShopping2,
  UserCredit2,
  UserDollar2,
  UserGift2,
  UserAward2,
  UserTrophy2,
  UserMedal2,
  UserFlag2,
  UserGlobe2,
  UserCompass2,
  UserNavigation2,
  UserSearch2,
  UserFilter2,
  UserSort2,
  UserMore2,
  UserCopy2,
  UserQr2,
  UserTag2,
  UserPin2,
  UserArchive2,
  UserSettings2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  type: 'pi' | 'stripe' | 'paypal' | 'crypto';
  name: string;
  icon: React.ComponentType<any>;
  isEnabled: boolean;
  balance?: number;
  currency?: string;
}

interface Transaction {
  id: string;
  type: 'payment' | 'tip' | 'donation' | 'subscription';
  amount: number;
  currency: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  from?: string;
  to?: string;
}

interface PaymentIntegrationProps {
  onPayment?: (amount: number, method: string) => void;
  onWithdraw?: (amount: number, method: string) => void;
}

const PaymentIntegration: React.FC<PaymentIntegrationProps> = ({
  onPayment,
  onWithdraw
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'pi',
      type: 'pi',
      name: 'Pi Network',
      icon: Wallet,
      isEnabled: true,
      balance: 1250.50,
      currency: 'π'
    },
    {
      id: 'stripe',
      type: 'stripe',
      name: 'Stripe',
      icon: CreditCard,
      isEnabled: false,
      balance: 0,
      currency: 'USD'
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      icon: ExternalLink,
      isEnabled: false,
      balance: 0,
      currency: 'USD'
    },
    {
      id: 'crypto',
      type: 'crypto',
      name: 'Cryptocurrency',
      icon: Shield,
      isEnabled: false,
      balance: 0,
      currency: 'BTC'
    }
  ];

  const transactions: Transaction[] = [
    {
      id: '1',
      type: 'tip',
      amount: 5.00,
      currency: 'π',
      description: 'Tip from @user123',
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
      from: '@user123'
    },
    {
      id: '2',
      type: 'payment',
      amount: 25.00,
      currency: 'π',
      description: 'Pro Plan Subscription',
      status: 'completed',
      date: '2024-01-14T15:45:00Z'
    },
    {
      id: '3',
      type: 'donation',
      amount: 10.00,
      currency: 'π',
      description: 'Donation from @supporter',
      status: 'completed',
      date: '2024-01-13T09:15:00Z',
      from: '@supporter'
    }
  ];

  const totalStats = {
    totalEarnings: transactions.reduce((sum, t) => sum + (t.type === 'tip' || t.type === 'donation' ? t.amount : 0), 0),
    totalSpent: transactions.reduce((sum, t) => sum + (t.type === 'payment' || t.type === 'subscription' ? t.amount : 0), 0),
    totalTransactions: transactions.length,
    activeMethods: paymentMethods.filter(m => m.isEnabled).length
  };

  const handlePayment = async (amount: number, method: string) => {
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Payment Successful",
        description: `Payment of ${amount} ${method} completed successfully`,
      });
      
      onPayment?.(amount, method);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Payment could not be processed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async (amount: number, method: string) => {
    try {
      // Simulate withdrawal processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Withdrawal Successful",
        description: `Withdrawal of ${amount} ${method} completed successfully`,
      });
      
      onWithdraw?.(amount, method);
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "Withdrawal could not be processed. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment & Monetization</h2>
          <p className="text-gray-600">Manage your payments and earnings</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowWithdrawModal(true)}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Withdraw
          </Button>
          <Button
            onClick={() => setShowPaymentModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalEarnings.toFixed(2)} π</p>
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalSpent.toFixed(2)} π</p>
              </div>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalTransactions}</p>
              </div>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Methods</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.activeMethods}</p>
              </div>
              <Wallet className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <div key={method.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="w-5 h-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">{method.name}</p>
                            <p className="text-sm text-gray-600">
                              {method.balance?.toFixed(2)} {method.currency}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={method.isEnabled ? 'default' : 'secondary'}>
                            {method.isEnabled ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedMethod(method.id)}
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {transaction.amount.toFixed(2)} {transaction.currency}
                        </p>
                        <Badge variant={
                          transaction.status === 'completed' ? 'default' :
                          transaction.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="methods" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              return (
                <Card key={method.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-8 h-8 text-gray-600" />
                        <div>
                          <h3 className="font-semibold text-gray-900">{method.name}</h3>
                          <p className="text-sm text-gray-600">
                            {method.balance?.toFixed(2)} {method.currency}
                          </p>
                        </div>
                      </div>
                      <Badge variant={method.isEnabled ? 'default' : 'secondary'}>
                        {method.isEnabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMethod(method.id)}
                        className="flex items-center space-x-1"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Configure</span>
                      </Button>
                      <Button
                        variant={method.isEnabled ? 'outline' : 'default'}
                        size="sm"
                        onClick={() => {
                          // Toggle method status
                          toast({
                            title: method.isEnabled ? "Method Disabled" : "Method Enabled",
                            description: `${method.name} has been ${method.isEnabled ? 'disabled' : 'enabled'}`,
                          });
                        }}
                      >
                        {method.isEnabled ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {transaction.type === 'tip' ? <Award className="w-5 h-5 text-yellow-600" /> :
                         transaction.type === 'donation' ? <Trophy className="w-5 h-5 text-green-600" /> :
                         transaction.type === 'payment' ? <CreditCard className="w-5 h-5 text-blue-600" /> :
                         <Medal className="w-5 h-5 text-purple-600" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString()} at {new Date(transaction.date).toLocaleTimeString()}
                        </p>
                        {transaction.from && (
                          <p className="text-xs text-gray-500">From: {transaction.from}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {transaction.amount.toFixed(2)} {transaction.currency}
                      </p>
                      <Badge variant={
                        transaction.status === 'completed' ? 'default' :
                        transaction.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Auto-accept payments</p>
                  <p className="text-sm text-gray-600">Automatically accept incoming payments</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Payment notifications</p>
                  <p className="text-sm text-gray-600">Get notified about new payments</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Tax settings</p>
                  <p className="text-sm text-gray-600">Configure tax reporting</p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PaymentIntegration;
