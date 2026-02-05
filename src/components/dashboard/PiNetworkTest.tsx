import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  CheckCircle, 
  XCircle, 
  Loader2,
  RefreshCw,
  Wallet,
  User,
  Heart,
  DollarSign
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { piNetworkService } from '@/services/piNetworkService';

const PiNetworkTest: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [isPiAvailable, setIsPiAvailable] = useState(false);

  // Check if Pi Network is available
  const checkPiAvailability = () => {
    const available = piNetworkService.isPiAvailable();
    setIsPiAvailable(available);
    return available;
  };

  // Test Pi Network API calls
  const testPiAPI = async () => {
    setIsLoading(true);
    setTestResults(null);

    try {
      console.log('Testing Pi Network API...');
      
      // Initialize Pi Network
      const initialized = await piNetworkService.initialize();
      console.log('Pi Network initialized:', initialized);

      // Get Pi Network status
      const status = await piNetworkService.getStatus();
      console.log('Pi Network status:', status);

      // Test individual API calls
      const results = {
        initialization: initialized,
        status: status,
        availability: piNetworkService.isPiAvailable(),
        timestamp: new Date().toISOString()
      };

      setTestResults(results);

      toast({
        title: "Pi Network API Test Complete!",
        description: `Status: ${status.available ? 'Available' : 'Not Available'}`,
      });

    } catch (error) {
      console.error('Pi Network API test failed:', error);
      
      const errorResults = {
        error: error.message,
        availability: piNetworkService.isPiAvailable(),
        timestamp: new Date().toISOString()
      };

      setTestResults(errorResults);

      toast({
        title: "Pi Network API Test Failed",
        description: error.message || "Failed to test Pi Network API",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test authentication
  const testAuthentication = async () => {
    setIsLoading(true);

    try {
      console.log('Testing Pi Network authentication...');
      
      const isAuthenticated = await piNetworkService.isAuthenticated();
      console.log('Pi Network authentication status:', isAuthenticated);

      if (isAuthenticated) {
        const user = await piNetworkService.getUser();
        console.log('Pi Network user:', user);

        toast({
          title: "Pi Network Authentication Success!",
          description: `User: ${user?.username || 'Unknown'}`,
        });
      } else {
        toast({
          title: "Pi Network Authentication Required",
          description: "Please authenticate with Pi Network first",
        });
      }

    } catch (error) {
      console.error('Pi Network authentication test failed:', error);
      
      toast({
        title: "Pi Network Authentication Failed",
        description: error.message || "Failed to test authentication",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Test wallet functions
  const testWallet = async () => {
    setIsLoading(true);

    try {
      console.log('Testing Pi Network wallet...');
      
      const walletAddress = await piNetworkService.getWalletAddress();
      const balance = await piNetworkService.getBalance();
      
      console.log('Pi Network wallet address:', walletAddress);
      console.log('Pi Network balance:', balance);

      toast({
        title: "Pi Network Wallet Test Success!",
        description: `Address: ${walletAddress?.substring(0, 10)}... Balance: ${balance} π`,
      });

    } catch (error) {
      console.error('Pi Network wallet test failed:', error);
      
      toast({
        title: "Pi Network Wallet Test Failed",
        description: error.message || "Failed to test wallet",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pi Network API Test</h2>
          <p className="text-gray-600">Test Pi Network API calls and functionality</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge 
            variant={isPiAvailable ? "default" : "destructive"}
            className={isPiAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
          >
            {isPiAvailable ? (
              <CheckCircle className="w-3 h-3 mr-1" />
            ) : (
              <XCircle className="w-3 h-3 mr-1" />
            )}
            {isPiAvailable ? 'Pi Available' : 'Pi Not Available'}
          </Badge>
        </div>
      </div>

      {/* Test Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Button
          onClick={checkPiAvailability}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Check Availability</span>
        </Button>
        
        <Button
          onClick={testPiAPI}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Settings className="w-4 h-4" />}
          <span>Test API</span>
        </Button>
        
        <Button
          onClick={testAuthentication}
          disabled={isLoading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
          <span>Test Auth</span>
        </Button>
        
        <Button
          onClick={testWallet}
          disabled={isLoading}
          variant="outline"
          className="flex items-center space-x-2"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
          <span>Test Wallet</span>
        </Button>
      </div>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Test Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <h4 className="font-medium text-red-900">Error</h4>
                  </div>
                  <p className="text-red-700 mt-2">{testResults.error}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Pi Network Available:</span>
                    <Badge variant={testResults.availability ? "default" : "destructive"}>
                      {testResults.availability ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Initialization:</span>
                    <Badge variant={testResults.initialization ? "default" : "destructive"}>
                      {testResults.initialization ? 'Success' : 'Failed'}
                    </Badge>
                  </div>
                  
                  {testResults.status && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Status Available:</span>
                        <Badge variant={testResults.status.available ? "default" : "destructive"}>
                          {testResults.status.available ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Authenticated:</span>
                        <Badge variant={testResults.status.authenticated ? "default" : "destructive"}>
                          {testResults.status.authenticated ? 'Yes' : 'No'}
                        </Badge>
                      </div>
                      
                      {testResults.status.user && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">User:</span>
                          <span className="text-sm text-gray-600">
                            {testResults.status.user.username || 'Unknown'}
                          </span>
                        </div>
                      )}
                      
                      {testResults.status.balance !== undefined && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Balance:</span>
                          <span className="text-sm text-gray-600">
                            {testResults.status.balance} π
                          </span>
                        </div>
                      )}
                      
                      {testResults.status.walletAddress && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Wallet Address:</span>
                          <span className="text-sm text-gray-600 font-mono">
                            {testResults.status.walletAddress.substring(0, 20)}...
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Timestamp:</span>
                    <span className="text-sm text-gray-600">
                      {new Date(testResults.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Test Pi Network API</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>1. <strong>Check Availability:</strong> Verify if Pi Network SDK is loaded</p>
            <p>2. <strong>Test API:</strong> Initialize Pi Network and get status</p>
            <p>3. <strong>Test Auth:</strong> Check if user is authenticated with Pi Network</p>
            <p>4. <strong>Test Wallet:</strong> Get wallet address and balance</p>
            <p className="text-xs text-gray-500 mt-4">
              Note: Some functions may require Pi Network authentication or may fallback to mock data in development mode.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PiNetworkTest;
