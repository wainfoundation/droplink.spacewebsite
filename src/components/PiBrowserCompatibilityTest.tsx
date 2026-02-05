import React, { useState, useEffect } from 'react';

interface PiBrowserCompatibilityTestProps {
  onTestComplete?: (results: any) => void;
}

const PiBrowserCompatibilityTest: React.FC<PiBrowserCompatibilityTestProps> = ({ onTestComplete }) => {
  const [testResults, setTestResults] = useState<any>({});
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const runCompatibilityTests = async () => {
    setIsRunning(true);
    const results: any = {};

    try {
      // Test 1: Pi Browser Detection
      const userAgent = navigator.userAgent.toLowerCase();
      const isPiBrowser = userAgent.includes('pibrowser') || 
                         userAgent.includes('pi network') || 
                         userAgent.includes('pi-browser');
      
      results.piBrowserDetection = {
        detected: isPiBrowser,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      };

      // Test 2: Pi SDK Availability
      results.piSDKAvailability = {
        available: typeof window.Pi !== 'undefined',
        hasInit: typeof window.Pi?.init === 'function',
        timestamp: new Date().toISOString()
      };

      // Test 3: DOM Manipulation
      try {
        const testElement = document.createElement('div');
        testElement.style.display = 'none';
        document.body.appendChild(testElement);
        document.body.removeChild(testElement);
        results.domManipulation = { success: true, error: null };
      } catch (error) {
        results.domManipulation = { success: false, error: error.message };
      }

      // Test 4: CSS Support
      const supportsCSS = window.CSS && window.CSS.supports;
      results.cssSupport = {
        supports: supportsCSS,
        customProperties: supportsCSS ? window.CSS.supports('--test', 'value') : false,
        flexbox: supportsCSS ? window.CSS.supports('display', 'flex') : false
      };

      // Test 5: Touch Events
      const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      results.touchSupport = {
        supported: supportsTouch,
        maxTouchPoints: navigator.maxTouchPoints
      };

      // Test 6: Viewport API
      results.viewportSupport = {
        visualViewport: typeof window.visualViewport !== 'undefined',
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight
      };

      // Test 7: Console Errors
      const originalError = console.error;
      const errors: string[] = [];
      console.error = (...args) => {
        errors.push(args.join(' '));
        originalError.apply(console, args);
      };

      // Wait a bit to catch any errors
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.error = originalError;
      results.consoleErrors = {
        count: errors.length,
        errors: errors.slice(0, 5) // Limit to first 5 errors
      };

      setTestResults(results);
      setIsComplete(true);
      
      if (onTestComplete) {
        onTestComplete(results);
      }

    } catch (error) {
      results.error = error.message;
      setTestResults(results);
      setIsComplete(true);
    } finally {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runCompatibilityTests();
  }, []);

  if (isRunning) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Testing Pi Browser Compatibility</h3>
          <p className="text-gray-600">Running compatibility tests...</p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pi Browser Compatibility Test Results</h3>
        
        <div className="space-y-4">
          {/* Pi Browser Detection */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Pi Browser Detection</h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-sm ${
                testResults.piBrowserDetection?.detected 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {testResults.piBrowserDetection?.detected ? 'Detected' : 'Not Detected'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              User Agent: {testResults.piBrowserDetection?.userAgent}
            </p>
          </div>

          {/* Pi SDK Availability */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Pi SDK Availability</h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-sm ${
                testResults.piSDKAvailability?.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {testResults.piSDKAvailability?.available ? 'Available' : 'Not Available'}
              </span>
              {testResults.piSDKAvailability?.hasInit && (
                <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800">
                  Init Function
                </span>
              )}
            </div>
          </div>

          {/* DOM Manipulation */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">DOM Manipulation</h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-sm ${
                testResults.domManipulation?.success 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {testResults.domManipulation?.success ? 'Working' : 'Failed'}
              </span>
            </div>
            {testResults.domManipulation?.error && (
              <p className="text-sm text-red-600 mt-1">
                Error: {testResults.domManipulation.error}
              </p>
            )}
          </div>

          {/* CSS Support */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">CSS Support</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  testResults.cssSupport?.supports 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  CSS.supports: {testResults.cssSupport?.supports ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  testResults.cssSupport?.customProperties 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Custom Properties: {testResults.cssSupport?.customProperties ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  testResults.cssSupport?.flexbox 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  Flexbox: {testResults.cssSupport?.flexbox ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Touch Support */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Touch Support</h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-sm ${
                testResults.touchSupport?.supported 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                Touch Events: {testResults.touchSupport?.supported ? 'Yes' : 'No'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Max Touch Points: {testResults.touchSupport?.maxTouchPoints}
            </p>
          </div>

          {/* Viewport Support */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Viewport Support</h4>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-sm ${
                  testResults.viewportSupport?.visualViewport 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  Visual Viewport API: {testResults.viewportSupport?.visualViewport ? 'Yes' : 'No'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Window Size: {testResults.viewportSupport?.innerWidth} x {testResults.viewportSupport?.innerHeight}
              </p>
            </div>
          </div>

          {/* Console Errors */}
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Console Errors</h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-sm ${
                testResults.consoleErrors?.count === 0 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                Errors: {testResults.consoleErrors?.count}
              </span>
            </div>
            {testResults.consoleErrors?.errors && testResults.consoleErrors.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Recent errors:</p>
                <ul className="text-xs text-red-600 space-y-1">
                  {testResults.consoleErrors.errors.map((error: string, index: number) => (
                    <li key={index} className="truncate">{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <button
            onClick={runCompatibilityTests}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Run Test Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default PiBrowserCompatibilityTest;
