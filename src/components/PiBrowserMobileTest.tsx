import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Smartphone, Globe, Zap } from 'lucide-react';

const PiBrowserMobileTest = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean | null>>({});
  const [isPiMobile, setIsPiMobile] = useState(false);
  const [loadingTime, setLoadingTime] = useState<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    
    // Detect Pi Browser mobile
    const userAgent = navigator.userAgent.toLowerCase();
    const isPiBrowser = /pibrowser|pi network|pi-browser/i.test(userAgent);
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isPiMobileDetected = isPiBrowser && isMobile;
    
    setIsPiMobile(isPiMobileDetected);
    
    // Run tests
    const runTests = () => {
      const results: Record<string, boolean | null> = {};
      
      // Test 1: Pi SDK availability
      results.piSdk = typeof window.Pi !== 'undefined';
      
      // Test 2: Pi SDK initialization
      results.piInit = window.Pi && typeof window.Pi.init === 'function';
      
      // Test 3: Validation key accessibility
      fetch('/validation-key.txt')
        .then(response => response.ok)
        .then(accessible => {
          results.validationKey = accessible;
          setTestResults(prev => ({ ...prev, validationKey: accessible }));
        })
        .catch(() => {
          results.validationKey = false;
          setTestResults(prev => ({ ...prev, validationKey: false }));
        });
      
      // Test 4: Viewport optimization
      results.viewport = window.visualViewport !== undefined;
      
      // Test 5: Touch events
      results.touchEvents = 'ontouchstart' in window;
      
      // Test 6: CSS custom properties
      results.cssVariables = CSS.supports('--vh', '1vh');
      
      // Test 7: Pi Network API connectivity
      fetch('https://api.minepi.com/v2/me', { method: 'HEAD' })
        .then(response => {
          results.piApi = response.status !== 0; // Network accessible
          setTestResults(prev => ({ ...prev, piApi: response.status !== 0 }));
        })
        .catch(() => {
          results.piApi = false;
          setTestResults(prev => ({ ...prev, piApi: false }));
        });
      
      // Test 8: App manifest
      fetch('/pi-app-manifest.json')
        .then(response => response.ok)
        .then(accessible => {
          results.manifest = accessible;
          setTestResults(prev => ({ ...prev, manifest: accessible }));
        })
        .catch(() => {
          results.manifest = false;
          setTestResults(prev => ({ ...prev, manifest: false }));
        });
      
      setTestResults(results);
      
      // Calculate loading time
      const endTime = performance.now();
      setLoadingTime(Math.round(endTime - startTime));
    };
    
    // Run tests after a short delay
    setTimeout(runTests, 1000);
  }, []);

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
    { key: 'piSdk', name: 'Pi SDK Available', description: 'Pi Network SDK is loaded and available' },
    { key: 'piInit', name: 'Pi SDK Initialized', description: 'Pi SDK initialization function is available' },
    { key: 'validationKey', name: 'Validation Key', description: 'Validation key file is accessible' },
    { key: 'viewport', name: 'Viewport API', description: 'Visual Viewport API is supported' },
    { key: 'touchEvents', name: 'Touch Events', description: 'Touch events are supported' },
    { key: 'cssVariables', name: 'CSS Variables', description: 'CSS custom properties are supported' },
    { key: 'piApi', name: 'Pi API Access', description: 'Pi Network API is accessible' },
    { key: 'manifest', name: 'App Manifest', description: 'Pi app manifest is accessible' }
  ];

  const overallStatus = Object.values(testResults).every(result => result === true);
  const testsCompleted = Object.values(testResults).every(result => result !== null);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-blue-600" />
            Pi Browser Mobile Compatibility Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Environment Detection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">Browser Type</span>
                </div>
                <Badge className={`mt-2 ${isPiMobile ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {isPiMobile ? 'Pi Browser Mobile' : 'Regular Browser'}
                </Badge>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  <span className="font-medium">Loading Time</span>
                </div>
                <div className="mt-2 text-lg font-semibold">
                  {loadingTime ? `${loadingTime}ms` : 'Testing...'}
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  <span className="font-medium">Overall Status</span>
                </div>
                <Badge className={`mt-2 ${testsCompleted ? (overallStatus ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800') : 'bg-yellow-100 text-yellow-800'}`}>
                  {testsCompleted ? (overallStatus ? 'All Tests Passed' : 'Some Tests Failed') : 'Testing...'}
                </Badge>
              </Card>
            </div>

            {/* Test Results */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Results</h3>
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

            {/* Environment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Environment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>User Agent:</strong>
                  <div className="mt-1 p-2 bg-gray-100 rounded text-xs break-all">
                    {navigator.userAgent}
                  </div>
                </div>
                <div>
                  <strong>Screen Resolution:</strong>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {window.screen.width} x {window.screen.height}
                  </div>
                </div>
                <div>
                  <strong>Viewport Size:</strong>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {window.innerWidth} x {window.innerHeight}
                  </div>
                </div>
                <div>
                  <strong>Device Pixel Ratio:</strong>
                  <div className="mt-1 p-2 bg-gray-100 rounded">
                    {window.devicePixelRatio}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {testsCompleted && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Recommendations</h3>
                <div className="space-y-2">
                  {!testResults.piSdk && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <div className="font-medium text-red-800">Pi SDK Not Available</div>
                      <div className="text-sm text-red-600">Ensure the Pi Network SDK is properly loaded</div>
                    </div>
                  )}
                  {!testResults.validationKey && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <div className="font-medium text-red-800">Validation Key Not Accessible</div>
                      <div className="text-sm text-red-600">Check that /validation-key.txt is accessible</div>
                    </div>
                  )}
                  {!testResults.piApi && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded">
                      <div className="font-medium text-red-800">Pi API Not Accessible</div>
                      <div className="text-sm text-red-600">Check network connectivity to Pi Network API</div>
                    </div>
                  )}
                  {overallStatus && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <div className="font-medium text-green-800">All Tests Passed!</div>
                      <div className="text-sm text-green-600">Your app is ready for Pi Browser mobile</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Run Tests Again
              </Button>
              <Button 
                onClick={() => {
                  const report = {
                    isPiMobile,
                    loadingTime,
                    testResults,
                    userAgent: navigator.userAgent,
                    timestamp: new Date().toISOString()
                  };
                  console.log('Pi Browser Mobile Test Report:', report);
                  alert('Test report logged to console');
                }}
              >
                Export Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PiBrowserMobileTest;
