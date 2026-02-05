import React from 'react';
import PiNetworkTest from '@/components/PiNetworkTest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Pi, BookOpen, Code, Zap } from 'lucide-react';

const PiTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Pi className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Pi Network Integration Test</h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              This page demonstrates the complete Pi Network integration following the official documentation.
              Test authentication and payments in sandbox mode.
            </p>
          </div>

          {/* Documentation Reference */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <BookOpen className="w-5 h-5" />
                Official Pi Network Documentation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">Step 1-4: Setup</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• Developer Portal Access</li>
                    <li>• App Registration</li>
                    <li>• API Key Generation</li>
                    <li>• Dev Portal Checklist</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">Step 5-6: Integration</h4>
                  <ul className="text-blue-700 space-y-1">
                    <li>• SDK Initialization</li>
                    <li>• User Authentication</li>
                    <li>• Payment Handling</li>
                    <li>• Server-Side Processing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Environment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Environment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-2">
                  <p className="font-semibold">Environment</p>
                  <p className="text-gray-600">
                    {window.location.href.includes('sandbox') ? 'Sandbox (Test)' : 'Production'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Pi Browser</p>
                  <p className="text-gray-600">
                    {navigator.userAgent.includes('Pi') ? 'Detected' : 'Not Detected'}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold">Pi SDK</p>
                  <p className="text-gray-600">
                    {typeof window.Pi !== 'undefined' ? 'Available' : 'Not Available'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Component */}
          <PiNetworkTest />

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Testing Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-orange-200 bg-orange-50">
                <AlertDescription className="text-orange-800">
                  <strong>Important:</strong> For full functionality, access this page through the Pi Browser app.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">1. Authentication Test</p>
                    <p className="text-gray-600">Click "Authenticate with Pi Network" to test the authentication flow.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">2. Payment Test</p>
                    <p className="text-gray-600">After authentication, test the payment flow with a 1 π test payment.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-semibold">3. Sandbox Mode</p>
                    <p className="text-gray-600">All transactions are in sandbox mode - no real Pi will be transferred.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PiTest; 