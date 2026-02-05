import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { piAuthService } from '@/services/piAuthService';
import { piPaymentService } from '@/services/piPaymentService';
import { approvePiPayment, completePiPayment } from '@/services/piPaymentService';
import { Pi, Shield, CheckCircle, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

/**
 * Pi Network Test Component - Following Official Documentation
 * This component demonstrates the complete Pi Network integration
 */
const PiNetworkTest = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [authResult, setAuthResult] = useState<any>(null);
  const [currentPaymentId, setCurrentPaymentId] = useState<string | null>(null);

  // Step 5: Integrating Pi Into Your Application (Authentication)
  const handleAuthentication = async () => {
    try {
      setIsAuthenticating(true);
      
      console.log("=== Pi Authentication Test ===");
      console.log("Current URL:", window.location.href);
      console.log("User Agent:", navigator.userAgent);
      
      // Authenticate the user, and get permission to request payments from them
      const scopes = ['payments', 'username'];
      
      console.log("Calling Pi.authenticate with scopes:", scopes);
      const auth = await piAuthService.authenticate(scopes);
      
      console.log("Authentication successful:", auth);
      setAuthResult(auth);
      
      toast({
        title: "Pi Network Authentication Successful!",
        description: `Welcome ${auth.user?.username || 'Pi User'}! You're ready to make payments!`,
      });
      
    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Could not authenticate with Pi Network",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Step 6: Handling Payments with Server-Side Integration
  const handlePayment = async () => {
    if (!authResult) {
      toast({
        title: "Authentication Required",
        description: "Please authenticate with Pi Network first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessingPayment(true);
      
      // Create Payment: Use the createPayment function in the Pi SDK
      const paymentData = {
        amount: 1,  /* Pi Amount being Transacted */
        memo: "Test payment for Droplink", /* "Any information that you want to add to payment" */
        metadata: { 
          test: true,
          app: "Droplink",
          timestamp: Date.now()
        }, /* { Special Information: 1234, ... } */
      };

      // Callbacks the developer needs to implement - Following official docs exactly
      const paymentCallbacks = {
        onReadyForServerApproval: async function(paymentId: string) {
          console.log("onReadyForServerApproval", paymentId);
          setCurrentPaymentId(paymentId);
          
          try {
            // Your app needs to pass the payment id and other relevant data to your app backend
            // The payment id should then be shared with the Pi API endpoint /payments/approve
            console.log("Calling server-side payment approval...");
            const approvalResult = await approvePiPayment(paymentId);
            
            toast({
              title: "Payment Ready for Approval",
              description: `Payment ID: ${paymentId} - Approved on server`,
            });
            
            console.log("Payment approved on server:", approvalResult);
          } catch (error) {
            console.error("Server approval error:", error);
            toast({
              title: "Payment Approval Failed",
              description: "Could not approve payment on server",
              variant: "destructive",
            });
          }
        },
        onReadyForServerCompletion: async function(paymentId: string, txid: string) {
          console.log("onReadyForServerCompletion", paymentId, txid);
          
          try {
            // Your job is again to pass any relevant data to your app server
            // On your server, you can verify the payment and deliver the item
            console.log("Calling server-side payment completion...");
            const completionResult = await completePiPayment(paymentId, txid);
            
            toast({
              title: "Payment Completed!",
              description: `Transaction ID: ${txid} - Completed on server`,
            });
            
            console.log("Payment completed on server:", completionResult);
            setCurrentPaymentId(null);
          } catch (error) {
            console.error("Server completion error:", error);
            toast({
              title: "Payment Completion Failed",
              description: "Could not complete payment on server",
              variant: "destructive",
            });
          }
        },
        onCancel: function(paymentId: string) {
          console.log("Payment cancelled:", paymentId);
          setCurrentPaymentId(null);
          toast({
            title: "Payment Cancelled",
            description: "The payment was cancelled by the user",
            variant: "destructive",
          });
        },
        onError: function(error: Error, payment?: any) {
          console.error("Payment error:", error);
          setCurrentPaymentId(null);
          toast({
            title: "Payment Error",
            description: error.message || "An error occurred during payment",
            variant: "destructive",
          });
        },
      };

      console.log("Creating payment with data:", paymentData);
      await piPaymentService.createPayment(paymentData, paymentCallbacks);
      
    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Failed",
        description: error.message || "Could not process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pi className="w-6 h-6" />
            Pi Network Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              This component demonstrates the complete Pi Network integration following the official documentation, including server-side payment approval and completion.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <Button 
              onClick={() => {
                window.location.href = 'https://droplink.space/auth';
              }}
              disabled={isAuthenticating}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
            >
              {isAuthenticating ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Authenticating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Pi className="w-4 h-4" />
                  Step 5: Authenticate with Pi Network
                </div>
              )}
            </Button>

            {authResult && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Authentication Successful!</strong><br />
                  User: {authResult.user?.username || 'Pi User'}<br />
                  UID: {authResult.user?.uid}<br />
                  Access Token: {authResult.accessToken ? 'Present' : 'Not available (sandbox)'}
                </AlertDescription>
              </Alert>
            )}

            {authResult && (
              <Button 
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing Payment...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Step 6: Test Payment (1 π) with Server Integration
                  </div>
                )}
              </Button>
            )}

            {currentPaymentId && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <CheckCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <strong>Payment in Progress</strong><br />
                  Payment ID: {currentPaymentId}<br />
                  Waiting for user approval and blockchain transaction...
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p><strong>Current Environment:</strong> {window.location.href.includes('sandbox') ? 'Sandbox' : 'Production'}</p>
            <p><strong>Pi Browser:</strong> {navigator.userAgent.includes('Pi') ? 'Yes' : 'No'}</p>
            <p><strong>Pi SDK Available:</strong> {typeof window.Pi !== 'undefined' ? 'Yes' : 'No'}</p>
            <p><strong>Server Integration:</strong> {authResult ? 'Ready' : 'Not Available'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PiNetworkTest; 