import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2, User, CreditCard, Home, Settings } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { usePiAuth } from '@/hooks/usePiAuth';
import { mainnetPaymentService } from '@/services/mainnetPaymentService';
import { piAdNetworkService } from '@/services/piAdNetworkService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const PiFlowTest = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoggedIn, profile, currentPlan, refreshUserData } = useUser();
  const { handlePiLogin, piUser, piAuthenticating } = usePiAuth();
  
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});
  const [currentStep, setCurrentStep] = useState<'auth' | 'plan' | 'payment' | 'dashboard'>('auth');
  const [isProcessing, setIsProcessing] = useState(false);

  const PLANS = [
    { id: 'free', name: 'Free Plan', price: 0 },
    { id: 'starter', name: 'Starter Plan', price: 5 },
    { id: 'pro', name: 'Pro Plan', price: 15 }
  ];

  useEffect(() => {
    runInitialTests();
  }, []);

  const runInitialTests = async () => {
    const results: Record<string, boolean | null> = {};
    
    // Test 1: Pi SDK availability
    results.piSdk = typeof window.Pi !== 'undefined';
    
    // Test 2: Pi Ad Network
    try {
      await piAdNetworkService.initialize();
      results.piAds = piAdNetworkService.isAdsEnabled();
    } catch (error) {
      results.piAds = false;
    }
    
    // Test 3: Mainnet Payment Service
    try {
      await mainnetPaymentService.initialize();
      results.paymentService = true;
    } catch (error) {
      results.paymentService = false;
    }
    
    // Test 4: User Authentication
    results.userAuth = isLoggedIn;
    
    // Test 5: User Plan
    results.userPlan = currentPlan !== 'free';
    
    setTestResults(results);
  };

  const handleAuth = async () => {
    try {
      setIsProcessing(true);
      await handlePiLogin();
      if (piUser) {
        toast({ title: "Pi Auth Success", description: `Logged in as ${piUser.username}` });
        setCurrentStep('plan');
        await refreshUserData();
        runInitialTests();
      }
    } catch (error: any) {
      toast({ title: "Pi Auth Failed", description: error.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlanSelect = async (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;

    if (plan.price === 0) {
      // Free plan
      try {
        setIsProcessing(true);
        // Simulate free plan setup
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast({ title: "Free Plan Activated", description: "Your free plan is now active!" });
        setCurrentStep('dashboard');
        await refreshUserData();
        runInitialTests();
      } catch (error) {
        toast({ title: "Error", description: "Failed to activate free plan", variant: 'destructive' });
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Paid plan
      setCurrentStep('payment');
    }
  };

  const handlePayment = async (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan || plan.price === 0) return;

    try {
      setIsProcessing(true);
      
      const result = await mainnetPaymentService.createPayment(
        {
          amount: plan.price,
          memo: `Droplink ${plan.name} plan subscription`,
          metadata: {
            planId: plan.id,
            planName: plan.name,
            userId: user?.id,
            app: 'droplink'
          }
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            toast({ title: "Payment Ready", description: "Payment ready for approval in Pi Wallet" });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            toast({ title: "Payment Successful", description: `Upgraded to ${plan.name}!` });
            setCurrentStep('dashboard');
            await refreshUserData();
            runInitialTests();
          },
          onCancel: (paymentId: string) => {
            toast({ title: "Payment Cancelled", description: "Payment was cancelled", variant: 'destructive' });
            setIsProcessing(false);
          },
          onError: (error: any, payment: any) => {
            toast({ title: "Payment Error", description: "Payment failed", variant: 'destructive' });
            setIsProcessing(false);
          }
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      toast({ title: "Payment Failed", description: error.message, variant: 'destructive' });
      setIsProcessing(false);
    }
  };

  const getTestIcon = (result: boolean | null) => {
    if (result === null) return <div className="w-4 h-4 border-2 border-gray-300 rounded-full animate-spin" />;
    return result ? <CheckCircle className="w-4 h-4 text-green-500" /> : <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getTestStatus = (result: boolean | null) => {
    if (result === null) return 'Testing...';
    return result ? 'Passed' : 'Failed';
  };

  const getTestColor = (result: boolean | null) => {
    if (result === null) return 'bg-gray-100 text-gray-600';
    return result ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const tests = [
    { key: 'piSdk', name: 'Pi SDK Available', description: 'Pi Network SDK is loaded' },
    { key: 'piAds', name: 'Pi Ad Network', description: 'Pi Ad Network is initialized' },
    { key: 'paymentService', name: 'Payment Service', description: 'Mainnet payment service is ready' },
    { key: 'userAuth', name: 'User Authentication', description: 'User is authenticated' },
    { key: 'userPlan', name: 'User Plan', description: 'User has a paid plan' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Pi Network Complete Flow Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Test Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">System Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tests.map(test => (
                  <Card key={test.key} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTestIcon(testResults[test.key])}
                        <div>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-sm text-gray-600">{test.description}</div>
                        </div>
                      </div>
                      <Badge className={getTestColor(testResults[test.key])}>
                        {getTestStatus(testResults[test.key])}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Flow Steps */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Complete Flow Test</h3>
              
              {/* Step 1: Authentication */}
              {currentStep === 'auth' && (
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <User className="w-6 h-6 text-blue-600" />
                    <h4 className="text-lg font-semibold">Step 1: Pi Authentication</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Sign in with your Pi Network account to continue.
                  </p>
                  <Button 
                    onClick={handleAuth} 
                    disabled={piAuthenticating || isProcessing}
                    className="w-full"
                  >
                    {piAuthenticating || isProcessing ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Authenticating...
                      </div>
                    ) : (
                      'Sign in with Pi Network'
                    )}
                  </Button>
                  {piUser && (
                    <Alert className="mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Authenticated as: <strong>{piUser.username}</strong>
                      </AlertDescription>
                    </Alert>
                  )}
                </Card>
              )}

              {/* Step 2: Plan Selection */}
              {currentStep === 'plan' && (
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-green-600" />
                    <h4 className="text-lg font-semibold">Step 2: Choose Your Plan</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Select a plan that fits your needs.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PLANS.map(plan => (
                      <Card key={plan.id} className="p-4 cursor-pointer hover:border-blue-300" onClick={() => handlePlanSelect(plan.id)}>
                        <div className="text-center">
                          <h5 className="font-semibold">{plan.name}</h5>
                          <p className="text-2xl font-bold text-blue-600">{plan.price} π</p>
                          <Button 
                            className="w-full mt-2" 
                            variant={plan.price === 0 ? "outline" : "default"}
                            disabled={isProcessing}
                          >
                            {plan.price === 0 ? 'Select Free' : `Choose ${plan.name}`}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </Card>
              )}

              {/* Step 3: Payment */}
              {currentStep === 'payment' && (
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-yellow-600" />
                    <h4 className="text-lg font-semibold">Step 3: Complete Payment</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Complete your payment using Pi Network.
                  </p>
                  <div className="space-y-4">
                    {PLANS.filter(p => p.price > 0).map(plan => (
                      <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h5 className="font-semibold">{plan.name}</h5>
                          <p className="text-gray-600">{plan.price} π</p>
                        </div>
                        <Button 
                          onClick={() => handlePayment(plan.id)}
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing...
                            </div>
                          ) : (
                            'Pay Now'
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Step 4: Dashboard */}
              {currentStep === 'dashboard' && (
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Home className="w-6 h-6 text-green-600" />
                    <h4 className="text-lg font-semibold">Step 4: Dashboard Access</h4>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your account is set up and ready to use!
                  </p>
                  <div className="space-y-4">
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Success!</strong> You have completed the full Pi Network flow.
                      </AlertDescription>
                    </Alert>
                    <div className="flex gap-4">
                      <Button onClick={() => navigate('/dashboard')} className="flex-1">
                        Go to Dashboard
                      </Button>
                      <Button onClick={() => setCurrentStep('auth')} variant="outline">
                        Test Again
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Current Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Current Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">User</div>
                    <div className="font-semibold">{user?.user_metadata?.username || 'Not logged in'}</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Plan</div>
                    <div className="font-semibold">{currentPlan || 'free'}</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Step</div>
                    <div className="font-semibold capitalize">{currentStep}</div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PiFlowTest;
