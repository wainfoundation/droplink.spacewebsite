import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Pi, Crown, Star, User, CheckCircle, XCircle } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import PiAuthButton from "@/components/PiAuthButton";
import { createMockPayment, approveMockPayment, completeMockPayment, generateMockTxid, getMockPayments, clearMockPayments } from "@/services/mockPaymentService";

const TestPage = () => {
  const { user, profile, refreshUserData } = useUser();
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);

  const testPlans = [
    { id: 'starter', name: 'Starter Plan', price: 5, color: 'blue' },
    { id: 'pro', name: 'Pro Plan', price: 15, color: 'purple' }
  ];

  const handleTestPayment = async (plan: any) => {
    setIsProcessingPayment(true);
    
    try {
      console.log(`Testing payment for ${plan.name}...`);
      
      // Create mock payment
      const mockPayment = await createMockPayment({
        amount: plan.price,
        memo: `Test Payment - ${plan.name}`,
        metadata: {
          planId: plan.id,
          planName: plan.name,
          test: true
        }
      });
      
      toast({
        title: "Payment Created",
        description: `Created mock payment: ${mockPayment.id}`,
      });
      
      // Simulate approval delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      const approvedPayment = await approveMockPayment(mockPayment.id);
      
      toast({
        title: "Payment Approved",
        description: `Payment approved: ${approvedPayment.id}`,
      });
      
      // Simulate completion delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const txid = generateMockTxid();
      const completedPayment = await completeMockPayment(approvedPayment.id, txid);
      
      toast({
        title: "Payment Completed!",
        description: `Payment completed with TXID: ${txid}`,
      });
      
      // Refresh payments list
      await loadPayments();
      
    } catch (error) {
      console.error('Test payment error:', error);
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const loadPayments = async () => {
    try {
      const mockPayments = await getMockPayments();
      setPayments(mockPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
    }
  };

  const handleClearPayments = () => {
    clearMockPayments();
    setPayments([]);
    toast({
      title: "Payments Cleared",
      description: "All mock payments have been cleared",
    });
  };

  React.useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Droplink Test Environment
          </h1>
          <p className="text-gray-600">
            Test authentication and payment flows without real Pi Network integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authentication Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5 text-purple-600" />
                Authentication Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Test the authentication flow with real Pi Network
                  </p>
                  <PiAuthButton 
                    onAuthSuccess={() => {
                      toast({
                        title: "Authentication Successful!",
                        description: "You can now test the payment flow",
                      });
                    }}
                    onAuthError={() => {
                      toast({
                        title: "Authentication Failed",
                        description: "Please try again",
                        variant: "destructive",
                      });
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium text-green-900">
                        Authenticated as {profile?.username || user?.user_metadata?.username || 'User'}
                      </p>
                      <p className="text-sm text-green-700">
                        Plan: {profile?.plan || 'Free'}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="w-full"
                  >
                    Reset Session
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                Payment Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!user ? (
                <div className="text-center py-4">
                  <XCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Please authenticate first to test payments
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    Test payment processing with mock Pi Network payments
                  </p>
                  
                  {testPlans.map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${plan.color}-500`} />
                        <div>
                          <p className="font-medium">{plan.name}</p>
                          <p className="text-sm text-gray-600">{plan.price} π</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleTestPayment(plan)}
                        disabled={isProcessingPayment}
                        size="sm"
                        className={`bg-${plan.color}-600 hover:bg-${plan.color}-700`}
                      >
                        {isProcessingPayment ? "Processing..." : "Test Payment"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Pi className="h-5 w-5 text-sky-600" />
                  Mock Payment History
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearPayments}
                  disabled={payments.length === 0}
                >
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {payments.length === 0 ? (
                <div className="text-center py-8">
                  <Pi className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No mock payments yet</p>
                  <p className="text-sm text-gray-500">Test a payment to see it here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant={
                            payment.status === 'completed' ? 'default' :
                            payment.status === 'approved' ? 'secondary' :
                            payment.status === 'pending' ? 'outline' : 'destructive'
                          }
                        >
                          {payment.status}
                        </Badge>
                        <div>
                          <p className="font-medium">{payment.memo}</p>
                          <p className="text-sm text-gray-600">
                            {payment.amount} π • {new Date(payment.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {payment.txid && (
                        <div className="text-right">
                          <p className="text-xs text-gray-500">TXID</p>
                          <p className="text-xs font-mono">{payment.txid.slice(0, 8)}...</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Environment Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Test Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">Authentication</p>
                <p className="text-gray-600">Mock Pi Network auth with random usernames</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Payments</p>
                <p className="text-gray-600">Simulated payment flow with delays</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Data Storage</p>
                <p className="text-gray-600">LocalStorage for persistence during testing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestPage;
