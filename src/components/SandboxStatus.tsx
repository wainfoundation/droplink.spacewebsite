import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const SandboxStatus = () => {
  const isSandbox = false; // Force mainnet only
  const isDevelopment = import.meta.env.DEV;
  const piApiUrl = 'https://api.minepi.com'; // Always mainnet
  const appId = 'droplink'; // Always mainnet app ID
  const piBrowserUrl = 'https://minepi.com'; // Always mainnet

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Mainnet Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Environment:</span>
          <Badge variant="secondary">
            MAINNET
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Development Mode:</span>
          <div className="flex items-center gap-1">
            {isDevelopment ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs">{isDevelopment ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Pi API URL:</span>
          <span className="text-xs text-gray-600">{piApiUrl}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">App ID:</span>
          <span className="text-xs text-gray-600">{appId}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Pi Browser URL:</span>
          <span className="text-xs text-gray-600">{piBrowserUrl}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Pi SDK Available:</span>
          <div className="flex items-center gap-1">
            {typeof window.Pi !== 'undefined' ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
            <span className="text-xs">{typeof window.Pi !== 'undefined' ? 'Yes' : 'No'}</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Environment Variables:</h4>
          <div className="space-y-1 text-xs">
            <div>VITE_PI_SANDBOX: {import.meta.env.VITE_PI_SANDBOX || 'undefined'}</div>
            <div>NODE_ENV: {import.meta.env.NODE_ENV || 'undefined'}</div>
            <div>MODE: {import.meta.env.MODE || 'undefined'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SandboxStatus;
