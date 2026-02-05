import React from 'react';

const SandboxDebugInfo: React.FC = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const hostname = window.location.hostname.toLowerCase();
  const href = window.location.href;
  
  const isPiUserAgent = userAgent.includes('pibrowser') || 
                       userAgent.includes('pi network') || 
                       userAgent.includes('pi-browser');
  
  const isPiDomain = hostname.includes('pinet.com') || 
                     hostname.includes('minepi.com') ||
                     hostname.includes('sandbox.minepi.com');
  
  const hasPiSDK = typeof window.Pi !== 'undefined';
  
  const isSandboxMode = hostname.includes('sandbox.minepi.com') || 
                       hostname.includes('localhost') ||
                       hostname.includes('127.0.0.1');

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-xs space-y-2">
      <h4 className="font-semibold">Sandbox Debug Info:</h4>
      <div>Hostname: {hostname}</div>
      <div>URL: {href}</div>
      <div>Pi User Agent: {isPiUserAgent ? '✓' : '✗'}</div>
      <div>Pi Domain: {isPiDomain ? '✓' : '✗'}</div>
      <div>Pi SDK Available: {hasPiSDK ? '✓' : '✗'}</div>
      <div>Sandbox Mode: {isSandboxMode ? '✓' : '✗'}</div>
      <div>Should Show Button: {(isPiUserAgent || isPiDomain || hasPiSDK || isSandboxMode) ? '✓' : '✗'}</div>
    </div>
  );
};

export default SandboxDebugInfo;
