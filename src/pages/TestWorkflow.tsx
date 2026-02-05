import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, TestTube, Crown } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import PiAuthButton from "@/components/PiAuthButton";
import { createMockPayment, approveMockPayment, completeMockPayment, generateMockTxid } from "@/services/mockPaymentService";
import Logo from "@/components/ui/Logo";

const TestWorkflow = () => {
  const navigate = useNavigate();
  const { user, profile, refreshUserData } = useUser();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'auth' | 'plan' | 'payment' | 'complete'>('auth');
  const [isProcessing, setIsProcessing] = useState(false);

  const testPlans = [
    { id: 'starter', name: 'Starter Plan', price: 5, color: 'blue' },
    { id: 'pro', name: 'Pro Plan', price: 15, color: 'purple' }
  ];

  const handleAuthSuccess = () => {
    setCurrentStep('plan');
    toast({
      title: "Authentication Successful!",
      description: "Now select a plan to test payment",
    });
  };

  const handlePlanSelection = async (plan: any) => {
    setCurrentStep('payment');
    setIsProcessing(true);
    
    try {
      console.log('Testing payment for plan:', plan);
      
      // Create mock payment
      const mockPayment = await createMockPayment({
        planId: plan.id,
        planName: plan.name,
        amount: plan.price
      });
      
      toast({
        title: "Payment Created",
        description: `Created mock payment: ${mockPayment.paymentId}`,
      });
      
      // Simulate approval delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const approved = await approveMockPayment(mockPayment.paymentId);
      
      if (approved) {
        toast({
          title: "Payment Approved",
          description: `Payment approved: ${mockPayment.paymentId}`,
        });
        
        // Simulate completion delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        const txid = generateMockTxid();
        const completed = await completeMockPayment(mockPayment.paymentId, txid);
        
        if (completed) {
          toast({
            title: "Payment Completed!",
            description: `Payment completed with TXID: ${txid}`,
          });
        }
      }
      
      setCurrentStep('complete');
      
      // Navigate to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Test payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStepContent = () => {
    switch (currentStep) {
      case 'auth':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Logo size="lg" />
              <h2 className="text-2xl font-bold mt-4">Test Authentication</h2>
              <p className="text-gray-600">Use real Pi Network authentication to test the workflow</p>
            </div>
            <PiAuthButton 
              onAuthSuccess={handleAuthSuccess}
              onAuthError={() => {
                toast({
                  title: "Authentication Failed",
                  description: "Please try again",
                  variant: "destructive",
                });
              }}
            />
          </div>
        );

      case 'plan':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Select Test Plan</h2>
              <p className="text-gray-600">Choose a plan to test the payment flow</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {testPlans.map((plan) => (
                <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{plan.name}</h3>
                        <p className="text-sm text-gray-600">{plan.price} π</p>
                      </div>
                      <Button
                        onClick={() => handlePlanSelection(plan)}
                        disabled={isProcessing}
                        className={`bg-${plan.color}-600 hover:bg-${plan.color}-700`}
                      >
                        {isProcessing ? "Processing..." : "Test Payment"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="text-2xl font-bold">Processing Payment</h2>
            <p className="text-gray-600">Simulating payment approval and completion...</p>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-600">Redirecting to dashboard...</p>
            <Button onClick={() => navigate('/dashboard')} className="mt-4">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Workflow Test
          </h1>
          <p className="text-gray-600">
            Test the complete authentication and payment workflow
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="h-5 w-5 text-purple-600" />
              Step {currentStep === 'auth' ? 1 : currentStep === 'plan' ? 2 : currentStep === 'payment' ? 3 : 4} of 4
            </CardTitle>
          </CardHeader>
          <CardContent>
            {getStepContent()}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Badge variant="outline" className="text-xs">
            Test Mode - All payments are simulated
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default TestWorkflow;
