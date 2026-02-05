
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
import { ArrowRight, BarChart3, CreditCard, DollarSign, Users, Wallet, Settings, Crown } from 'lucide-react';
import GoToTop from '@/components/GoToTop';
import PlanManagement from '@/components/dashboard/PlanManagement';
import PlanWorkflowTest from '@/components/PlanWorkflowTest';
import SandboxAuthTest from '@/components/SandboxAuthTest';
import MockWorkflowTest from '@/components/MockWorkflowTest';
import DashboardSetupCheck from '@/components/dashboard/DashboardSetupCheck';

const PiDashboard = () => {
  const { user, isLoading } = useAuth();
  const { isLoggedIn, currentPlan } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardSetupCheck>
      <Helmet>
        <title>Pi Dashboard - Droplink</title>
        <meta name="description" content="Manage your Pi earnings and transactions on Droplink" />
      </Helmet>

      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Pi Dashboard</h2>
              <p className="text-muted-foreground">
                Welcome back, {user?.user_metadata?.username || 'User'}! 
                Current plan: <span className="font-semibold capitalize">{currentPlan || 'free'}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                <Crown className="mr-2 h-4 w-4" />
                {currentPlan === 'free' ? 'Upgrade Plan' : 'Manage Plan'}
              </Button>
              <Button>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Pi Wallet
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="test">Test</TabsTrigger>
              <TabsTrigger value="sandbox">Sandbox</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Balance
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">π 128.42</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Tips Received
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">π 24.50</div>
                    <p className="text-xs text-muted-foreground">
                      +12 tips this month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Product Sales
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">π 89.90</div>
                    <p className="text-xs text-muted-foreground">
                      +7 sales this month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Subscription Revenue
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">π 14.02</div>
                    <p className="text-xs text-muted-foreground">
                      +2.1% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>
                      Your recent Pi transactions on Droplink
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px]">
                      <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center justify-between border-b pb-2">
                            <div>
                              <p className="font-medium">Tip from @user{i}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date().toLocaleDateString()}
                              </p>
                            </div>
                            <div className="font-medium text-green-600">+π {(Math.random() * 10).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      View All Transactions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
                
                <div className="col-span-3">
                  <Card>
                    <CardHeader>
                      <CardTitle>Wallet Settings</CardTitle>
                      <CardDescription>
                        Configure your wallet preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8">
                        <p className="text-gray-500">Wallet management will be available soon.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="plans" className="space-y-4">
              <PlanManagement />
            </TabsContent>
            
            <TabsContent value="workflow" className="space-y-4">
              <MockWorkflowTest />
            </TabsContent>
            
            <TabsContent value="test" className="space-y-4">
              <PlanWorkflowTest />
            </TabsContent>
            
            <TabsContent value="sandbox" className="space-y-4">
              <SandboxAuthTest />
            </TabsContent>
            
            <TabsContent value="earnings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                  <CardDescription>
                    Your Pi earnings from all sources on Droplink
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center border rounded">
                    <p className="text-muted-foreground">Earnings chart will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    A complete record of your Pi transactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] flex items-center justify-center border rounded">
                    <p className="text-muted-foreground">Transaction history will appear here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Pi Wallet Settings</CardTitle>
                  <CardDescription>
                    Configure your Pi wallet preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="auto-withdraw">Auto Withdraw</Label>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="auto-withdraw" className="h-4 w-4" />
                      <span className="text-sm">Automatically withdraw earnings to my Pi wallet</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-withdraw">Minimum Withdrawal</Label>
                    <Input id="min-withdraw" type="number" placeholder="10" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-threshold">Notification Threshold</Label>
                    <Input id="notification-threshold" type="number" placeholder="50" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <GoToTop />
    </DashboardSetupCheck>
  );
};

export default PiDashboard;
