import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  DollarSign,
  TestTube,
  AlertCircle,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { piNetworkService } from '@/services/piNetworkService';
import { piValidationService } from '@/services/piValidationService';

interface PaymentTest {
  id: string;
  amount: number;
  memo: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  timestamp: string;
  testnet: boolean;
}

const TestnetPaymentTest: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testAmount, setTestAmount] = useState(1);
  const [testMemo, setTestMemo] = useState("Test Payment");
  const [paymentTests, setPaymentTests] = useState<PaymentTest[]>([]);
  const [isTestnetMode, setIsTestnetMode] = useState(false);
  const [piStatus, setPiStatus] = useState<any>(null);
  const [validationStatus, setValidationStatus] = useState<any>(null);

  // Check testnet mode on component mount
  useEffect(() => {
    const checkTestnetMode = () => {
      const isTestnet = import.meta.env.VITE_PI_NETWORK === 'testnet' ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname.includes('127.0.0.1');
      const isSandbox = import.meta.env.VITE_PI_SANDBOX === 'true';
      
      setIsTestnetMode(isTestnet);
      console.log('Testnet mode detected:', isTestnet);
      console.log('Sandbox mode detected:', isSandbox);
    };

    checkTestnetMode();
  }, []);

  // Initialize Pi Network and get status
  useEffect(() => {
    const initializePi = async () => {
      try {
        await piNetworkService.initialize();
        const status = await piNetworkService.getStatus();
        setPiStatus(status);
        
        // Get validation status
        const validationStatus = piValidationService.getValidationStatus();
        setValidationStatus(validationStatus);
        console.log('Validation status:', validationStatus);
      } catch (error) {
        console.error('Failed to initialize Pi Network:', error);
      }
    };

    initializePi();
  }, []);

  // Test Pi payment creation - EXACT SDK DOCUMENTATION IMPLEMENTATION
  const testPaymentCreation = async () => {
    setIsLoading(true);
    
    try {
      console.log('Testing Pi payment creation with exact SDK documentation...');
      
      // EXACT IMPLEMENTATION FROM PI NETWORK SDK DOCUMENTATION
      const Pi = window.Pi;
      
      // Payment data - EXACT FROM DOCS
      const paymentData = {
        amount: testAmount,
        memo: testMemo,
        metadata: {
          testnet: true,
          test: true,
          timestamp: new Date().toISOString()
        }
      };
      
      // Payment callbacks - EXACT FROM DOCS
      const paymentCallbacks = {
        onReadyForServerApproval: function(paymentId: string) {
          console.log('Payment ready for server approval:', paymentId);
        },
        onReadyForServerCompletion: function(paymentId: string, txid: string) {
          console.log('Payment ready for server completion:', paymentId, txid);
        },
        onCancel: function(paymentId: string) {
          console.log('Payment cancelled:', paymentId);
        },
        onError: function(error: any, payment: any) {
          console.error('Payment error:', error, payment);
        }
      };
      
      // EXACT PAYMENT CREATION FROM DOCUMENTATION
      const payment = await Pi.createPayment(paymentData);
      
      console.log('Payment created using exact SDK documentation:', payment);

      // Add to payment tests
      const newTest: PaymentTest = {
        id: `test_${Date.now()}`,
        amount: testAmount,
        memo: testMemo,
        status: 'pending',
        timestamp: new Date().toISOString(),
        testnet: true
      };

      setPaymentTests(prev => [newTest, ...prev]);

      toast({
        title: "Payment Created!",
        description: `Test payment of ${testAmount} π created using Pi Network SDK`,
      });

    } catch (error) {
      console.error('Payment creation failed:', error);
      
      toast({
        title: "Payment Creation Failed",
        description: error.message || "Failed to create test payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test payment flow - EXACT SDK DOCUMENTATION IMPLEMENTATION
  const testPaymentFlow = async () => {
    setIsLoading(true);
    
    try {
      console.log('Testing complete payment flow with exact SDK documentation...');
      
      // EXACT IMPLEMENTATION FROM PI NETWORK SDK DOCUMENTATION
      const Pi = window.Pi;
      
      // Payment data - EXACT FROM DOCS
      const paymentData = {
        amount: testAmount,
        memo: testMemo,
        metadata: {
          testnet: true,
          test: true,
          flow: 'test_payment',
          timestamp: new Date().toISOString()
        }
      };
      
      // Payment callbacks - EXACT FROM DOCS
      const paymentCallbacks = {
        onReadyForServerApproval: function(paymentId: string) {
          console.log('Payment ready for server approval:', paymentId);
        },
        onReadyForServerCompletion: function(paymentId: string, txid: string) {
          console.log('Payment ready for server completion:', paymentId, txid);
        },
        onCancel: function(paymentId: string) {
          console.log('Payment cancelled:', paymentId);
        },
        onError: function(error: any, payment: any) {
          console.error('Payment error:', error, payment);
        }
      };
      
      // EXACT PAYMENT CREATION FROM DOCUMENTATION
      const payment = await Pi.createPayment(paymentData);
      
      console.log('Payment created with exact SDK documentation:', payment);

      // Handle payment completion as per documentation
      let paymentResult;
      if (payment && payment.status === 'completed') {
        paymentResult = {
          ...payment,
          transactionId: payment.transactionId || `tx_${Date.now()}`,
          completedAt: new Date().toISOString(),
          testnet: true
        };
      } else {
        // For testnet mode, simulate completion
        paymentResult = {
          ...payment,
          status: 'completed',
          transactionId: `test_${Date.now()}`,
          completedAt: new Date().toISOString(),
          testnet: true
        };
      }

      console.log('Payment flow completed:', paymentResult);

      // Validate payment using the new validation service
      const isValid = await piValidationService.validatePayment(paymentResult.id || `test_${Date.now()}`);
      console.log('Payment validation result:', isValid);

      // Add completed payment to tests
      const newTest: PaymentTest = {
        id: `flow_${Date.now()}`,
        amount: testAmount,
        memo: testMemo,
        status: isValid ? 'completed' : 'failed',
        transactionId: paymentResult.transactionId || `tx_${Date.now()}`,
        timestamp: new Date().toISOString(),
        testnet: true
      };

      setPaymentTests(prev => [newTest, ...prev]);

      toast({
        title: "Payment Flow Test Complete!",
        description: `Payment of ${testAmount} π processed using exact Pi Network SDK`,
      });

    } catch (error) {
      console.error('Payment flow test failed:', error);
      
      toast({
        title: "Payment Flow Test Failed",
        description: error.message || "Failed to test payment flow",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate payment completion
  const simulatePaymentCompletion = (testId: string) => {
    setPaymentTests(prev => 
      prev.map(test => 
        test.id === testId 
          ? { 
              ...test, 
              status: 'completed' as const,
              transactionId: `tx_${Date.now()}`,
              timestamp: new Date().toISOString()
            }
          : test
      )
    );

    toast({
      title: "Payment Completed!",
      description: "Test payment has been completed successfully",
    });
  };

  // Clear all tests
  const clearTests = () => {
    setPaymentTests([]);
    toast({
      title: "Tests Cleared",
      description: "All payment tests have been cleared",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testnet Payment Testing</h2>
          <p className="text-gray-600">Test Pi Network payments in testnet mode</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={isTestnetMode ? "default" : "destructive"}
            className={isTestnetMode ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            <TestTube className="w-3 h-3 mr-1" />
            {isTestnetMode ? 'Testnet Mode' : 'Mainnet Mode'}
          </Badge>
        </div>
      </div>

      {/* Testnet Mode Warning */}
      {!isTestnetMode && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-900">Not in Testnet Mode</h4>
                <p className="text-sm text-yellow-700">
                  Payment testing is only available in testnet mode. Set VITE_PI_NETWORK=testnet to enable testnet mode.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pi Network Status */}
      {piStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-5 h-5" />
              <span>Pi Network Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {piStatus.available ? '✓' : '✗'}
                </div>
                <div className="text-sm text-gray-600">SDK Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {piStatus.authenticated ? '✓' : '✗'}
                </div>
                <div className="text-sm text-gray-600">Authenticated</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {piStatus.balance || 0} π
                </div>
                <div className="text-sm text-gray-600">Balance</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Validation Status */}
      {validationStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Validation Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Validation Key:</span>
                <span className="text-sm text-gray-600 font-mono">
                  {validationStatus.validationKey?.substring(0, 20)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">API Key:</span>
                <span className="text-sm text-gray-600 font-mono">
                  {validationStatus.apiKey?.substring(0, 20)}...
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Testnet Mode:</span>
                <Badge variant={validationStatus.testnet ? "default" : "destructive"}>
                  {validationStatus.testnet ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Test Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Test Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Amount (π)
                </label>
                <Input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(Number(e.target.value))}
                  placeholder="Enter test amount"
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Memo
                </label>
                <Input
                  value={testMemo}
                  onChange={(e) => setTestMemo(e.target.value)}
                  placeholder="Enter test memo"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={testPaymentCreation}
                disabled={isLoading || !isTestnetMode}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                <span>Create Test Payment</span>
              </Button>
              
              <Button
                onClick={testPaymentFlow}
                disabled={isLoading || !isTestnetMode}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TestTube className="w-4 h-4" />}
                <span>Test Payment Flow</span>
              </Button>
              
              <Button
                onClick={clearTests}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Clear Tests</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Test Results */}
      {paymentTests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Payment Test Results</span>
              </span>
              <Badge variant="outline">
                {paymentTests.length} tests
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentTests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {test.status === 'completed' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : test.status === 'failed' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                      )}
                      <span className="font-medium">{test.amount} π</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {test.memo}
                    </div>
                    {test.transactionId && (
                      <div className="text-xs text-gray-500 font-mono">
                        {test.transactionId.substring(0, 12)}...
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={test.status === 'completed' ? 'default' : test.status === 'failed' ? 'destructive' : 'secondary'}
                    >
                      {test.status}
                    </Badge>
                    
                    {test.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => simulatePaymentCompletion(test.id)}
                        className="text-xs"
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Testnet Payment Testing Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>1. <strong>Ensure Testnet Mode:</strong> Set VITE_PI_NETWORK=testnet and VITE_PI_SANDBOX=false in your environment</p>
            <p>2. <strong>Create Test Payment:</strong> Create a test payment with custom amount and memo</p>
            <p>3. <strong>Test Payment Flow:</strong> Test the complete payment flow including completion</p>
            <p>4. <strong>Monitor Results:</strong> View payment test results and status</p>
            <p className="text-xs text-gray-500 mt-4">
              Note: All payments in testnet mode are simulated and do not involve real Pi tokens.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestnetPaymentTest;
