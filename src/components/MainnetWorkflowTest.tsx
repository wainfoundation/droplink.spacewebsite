import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { mainnetPaymentService } from '@/services/mainnetPaymentService';
import { CheckCircle, XCircle, AlertCircle, Wallet, CreditCard, User } from 'lucide-react';

const MainnetWorkflowTest = () => {
  const [currentStep, setCurrentStep] = useState<'auth' | 'plan' | 'payment' | 'approval' | 'dashboard'>('auth');
  const [isProcessing, setIsProcessing] = useState(false);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { user, refreshUserData } = useUser();

  const plans = [
    { id: 'basic', name: 'Basic', price: 1, features: ['Basic features'] },
    { id: 'pro', name: 'Pro', price: 5, features: ['Pro features'] },
    { id: 'premium', name: 'Premium', price: 10, features: ['Premium features'] }
  ];

  const handlePiAuth = async () => {
    try {
      setIsProcessing(true);
      
      if (!window.Pi) {
        throw new Error('Pi SDK not available');
      }

      console.log('Starting Pi authentication for mainnet...');
      
      const authResult = await window.Pi.authenticate(
        ["username", "payments", "wallet_address"],
        (payment: any) => {
          console.log("Incomplete payment found:", payment);
          return payment;
        }
      );

      if (authResult && authResult.accessToken) {
        console.log('Pi authentication successful:', authResult);
        
        // Store wallet address if available
        if (authResult.user.walletAddress) {
          setUserWalletAddress(authResult.user.walletAddress);
          mainnetPaymentService.setUserWalletAddress(authResult.user.walletAddress);
        }
        
        setCurrentStep('plan');
        toast({
          title: "Authentication Successful!",
          description: `Welcome ${authResult.user.username}!`,
        });
      } else {
        throw new Error('No access token received');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate with Pi Network",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePlanSelection = (planId: string) => {
    setSelectedPlan(planId);
    setCurrentStep('payment');
    toast({
      title: "Plan Selected",
      description: `Selected ${plans.find(p => p.id === planId)?.name} plan`,
    });
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;
    
    try {
      setIsProcessing(true);
      
      const plan = plans.find(p => p.id === selectedPlan);
      if (!plan) return;

      console.log('Creating payment for plan:', plan);
      
      const result = await mainnetPaymentService.createPlanPayment(
        plan.name,
        plan.price,
        'monthly',
        user?.id
      );

      if (result.success) {
        setPaymentId(result.paymentId || null);
        setCurrentStep('approval');
        
        toast({
          title: "Payment Created",
          description: "Your payment is ready for approval.",
        });
        
        // Simulate approval process
        setTimeout(() => {
          handleApproval();
        }, 3000);
      } else {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Failed to create payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApproval = async () => {
    try {
      setIsProcessing(true);
      
      if (paymentId) {
        const approved = await mainnetPaymentService.approvePayment(paymentId);
        if (approved) {
          setCurrentStep('dashboard');
          toast({
            title: "Payment Approved!",
            description: "Your payment has been approved and processed.",
          });
          
          // Refresh user data
          await refreshUserData();
        }
      }
    } catch (error: any) {
      console.error('Approval error:', error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve payment",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetWorkflow = () => {
    setCurrentStep('auth');
    setUserWalletAddress(null);
    setSelectedPlan(null);
    setPaymentId(null);
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'auth': return <User className="w-5 h-5" />;
      case 'plan': return <CreditCard className="w-5 h-5" />;
      case 'payment': return <Wallet className="w-5 h-5" />;
      case 'approval': return <CheckCircle className="w-5 h-5" />;
      case 'dashboard': return <CheckCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStepStatus = (step: string) => {
    const stepOrder = ['auth', 'plan', 'payment', 'approval', 'dashboard'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            Pi Network Mainnet Workflow Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Workflow Steps */}
            <div className="flex items-center justify-between">
              {['auth', 'plan', 'payment', 'approval', 'dashboard'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    getStepStatus(step) === 'completed' ? 'bg-green-100 text-green-800' :
                    getStepStatus(step) === 'current' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {getStepIcon(step)}
                    <span className="capitalize">{step}</span>
                  </div>
                  {index < 4 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      getStepStatus(step) === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Current Step Content */}
            <div className="mt-8">
              {currentStep === 'auth' && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Step 1: Pi Network Authentication</h3>
                  <p className="text-gray-600">Authenticate with Pi Network to get your wallet address</p>
                  <Button 
                    onClick={handlePiAuth} 
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? 'Authenticating...' : 'Sign in with Pi Network'}
                  </Button>
                </div>
              )}

              {currentStep === 'plan' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Step 2: Select Plan</h3>
                  <p className="text-gray-600">Choose your subscription plan</p>
                  
                  {userWalletAddress && (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>Wallet Address:</strong> {userWalletAddress}
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {plans.map(plan => (
                      <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-2xl font-bold text-blue-600">{plan.price}π</p>
                          <ul className="text-sm text-gray-600 mt-2">
                            {plan.features.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                          <Button 
                            onClick={() => handlePlanSelection(plan.id)}
                            className="w-full mt-4"
                            size="sm"
                          >
                            Select Plan
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 'payment' && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Step 3: Payment Processing</h3>
                  <p className="text-gray-600">Creating payment with your wallet address</p>
                  
                  {selectedPlan && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800">
                        <strong>Selected Plan:</strong> {plans.find(p => p.id === selectedPlan)?.name} - {plans.find(p => p.id === selectedPlan)?.price}π
                      </p>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handlePayment} 
                    disabled={isProcessing}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? 'Processing Payment...' : 'Create Payment'}
                  </Button>
                </div>
              )}

              {currentStep === 'approval' && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Step 4: Payment Approval</h3>
                  <p className="text-gray-600">Waiting for payment approval...</p>
                  
                  {paymentId && (
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <p className="text-yellow-800">
                        <strong>Payment ID:</strong> {paymentId}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <span>Processing approval...</span>
                  </div>
                </div>
              )}

              {currentStep === 'dashboard' && (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Step 5: Dashboard Access</h3>
                  <p className="text-gray-600">Payment successful! Welcome to your dashboard.</p>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center justify-center gap-2 text-green-800">
                      <CheckCircle className="w-6 h-6" />
                      <span className="font-semibold">Payment Completed Successfully!</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </div>

            {/* Reset Button */}
            <div className="text-center pt-4">
              <Button 
                onClick={resetWorkflow}
                variant="outline"
                size="sm"
              >
                Reset Workflow
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MainnetWorkflowTest;
