import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2, Settings, User, Shield } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { usePiAuth } from '@/hooks/usePiAuth';
import { useToast } from '@/hooks/use-toast';
import { getPiConfig } from '@/utils/pi-config';

const SandboxAuthTest = () => {
  const { user, isLoggedIn, currentPlan } = useUser();
  const { handlePiLogin, piUser, piAuthenticating, error } = usePiAuth();
  const { toast } = useToast();
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});
  const [isTesting, setIsTesting] = useState(false);

  const config = getPiConfig();

  useEffect(() => {
    runInitialTests();
  }, []);

  const runInitialTests = async () => {
    const results: Record<string, boolean | null> = {};
    
    // Test 1: Pi SDK availability
    results.piSdk = typeof window.Pi !== 'undefined';
    
    // Test 2: Sandbox mode
    results.sandboxMode = config.isSandbox;
    
    // Test 3: Pi SDK initialization
    results.piInit = window.Pi && typeof window.Pi.init === 'function';
    
    // Test 4: Pi authentication method
    results.piAuth = window.Pi && typeof window.Pi.authenticate === 'function';
    
    // Test 5: User authentication
    results.userAuth = isLoggedIn;
    
    // Test 6: Pi user data
    results.piUser = !!piUser;
    
    setTestResults(results);
  };

  const handleTestAuth = async () => {
    try {
      setIsTesting(true);
      await handlePiLogin();
      
      if (piUser) {
        toast({
          title: "Sandbox Auth Success",
          description: `Authenticated as ${piUser.username} in sandbox mode`,
        });
        await runInitialTests(); // Refresh tests
      }
    } catch (error: any) {
      toast({
        title: "Sandbox Auth Failed",
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
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
    { key: 'sandboxMode', name: 'Sandbox Mode', description: 'Running in sandbox/testnet mode' },
    { key: 'piInit', name: 'Pi SDK Init', description: 'Pi SDK initialization method available' },
    { key: 'piAuth', name: 'Pi Authentication', description: 'Pi authentication method available' },
    { key: 'userAuth', name: 'User Authentication', description: 'User is authenticated' },
    { key: 'piUser', name: 'Pi User Data', description: 'Pi user data is available' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-600" />
            Sandbox Authentication Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Environment Status */}
            <div className="flex items-center justify-between p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-orange-600" />
                <div>
                  <h3 className="font-semibold text-orange-800">Sandbox Mode Active</h3>
                  <p className="text-sm text-orange-600">Testing Pi Network authentication in sandbox environment</p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-800">
                SANDBOX
              </Badge>
            </div>

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

            {/* Authentication Test */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Authentication Test</h3>
              
              <Card className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <User className="w-8 h-8 text-blue-600" />
                    <h4 className="text-lg font-semibold">Test Pi Network Authentication</h4>
                  </div>
                  
                  <p className="text-gray-600">
                    Test the Pi Network authentication flow in sandbox mode.
                  </p>
                  
                  <Button 
                    onClick={handleTestAuth} 
                    disabled={piAuthenticating || isTesting}
                    className="w-full max-w-md"
                  >
                    {piAuthenticating || isTesting ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Testing Authentication...
                      </div>
                    ) : (
                      'Test Pi Authentication'
                    )}
                  </Button>
                  
                  {piUser && (
                    <Alert className="mt-4">
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Authenticated:</strong> {piUser.username} (ID: {piUser.id})
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {error && (
                    <Alert className="mt-4" variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Error:</strong> {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </Card>
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
                    <div className="font-semibold capitalize">{currentPlan || 'free'}</div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Environment</div>
                    <div className="font-semibold">Sandbox</div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Configuration Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Configuration</h3>
              <Card className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Environment:</span>
                    <span className="font-mono">{config.isSandbox ? 'Sandbox' : 'Mainnet'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pi Browser:</span>
                    <span className="font-mono">{config.isPiBrowser ? 'Detected' : 'Not Detected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">SDK Version:</span>
                    <span className="font-mono">{config.sdkVersion}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">App ID:</span>
                    <span className="font-mono">{config.appId}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SandboxAuthTest;
