
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { usePiPayment } from '@/hooks/usePiPayment';
import { Pi, Shield, CheckCircle, Zap, AlertTriangle } from 'lucide-react';

/**
 * Pi Network Integration Component
 * Simple component that demonstrates how to use the Pi Network integration
 */
const PiNetworkIntegration = () => {
  const {
    isAuthenticated,
    user,
    authenticate,
    isProcessing,
    currentPaymentId,
    createPayment,
    config,
    isValid,
    errors
  } = usePiPayment();

  const handleTestPayment = async () => {
    const result = await createPayment({
      amount: 1,
      memo: "Test payment for Droplink integration",
      metadata: {
        test: true,
        component: "PiNetworkIntegration",
        timestamp: Date.now()
      }
    });

    console.log("Payment result:", result);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pi className="w-5 h-5" />
          Pi Network Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuration Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Environment:</span>
            <Badge variant={config.isSandbox ? "secondary" : "default"}>
              {config.isSandbox ? 'Sandbox' : 'Production'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Pi Browser:</span>
            <Badge variant={config.isPiBrowser ? "default" : "destructive"}>
              {config.isPiBrowser ? 'Detected' : 'Not Detected'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Configuration:</span>
            <Badge variant={isValid ? "default" : "destructive"}>
              {isValid ? 'Valid' : 'Invalid'}
            </Badge>
          </div>
        </div>

        {/* Configuration Errors */}
        {!isValid && errors.length > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Configuration Issues:</strong>
              <ul className="mt-1 list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm">{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Authentication Status */}
        {isAuthenticated ? (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Connected to Pi Network!</strong><br />
              User: {user?.username || 'Pi User'}<br />
              UID: {user?.uid}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Click "Connect to Pi Network" to authenticate and enable payments.
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          {!isAuthenticated ? (
            <Button 
              onClick={() => {
                window.location.href = 'https://droplink.space/auth';
              }}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Pi className="w-4 h-4" />
                  Connect to Pi Network
                </div>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleTestPayment}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Test Payment (1 π)
                </div>
              )}
            </Button>
          )}
        </div>

        {/* Payment Status */}
        {currentPaymentId && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <CheckCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>Payment in Progress</strong><br />
              Payment ID: {currentPaymentId}<br />
              Waiting for user approval...
            </AlertDescription>
          </Alert>
        )}

        {/* Usage Instructions */}
        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>How to use:</strong></p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Ensure you're in Pi Browser</li>
            <li>Click "Connect to Pi Network"</li>
            <li>Approve the authentication request</li>
            <li>Test payments with "Test Payment"</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default PiNetworkIntegration;
