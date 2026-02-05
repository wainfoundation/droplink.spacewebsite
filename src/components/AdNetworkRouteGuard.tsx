/**
 * Ad Network Route Guard
 * Wraps protected routes and shows ad network modal when needed
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAdNetworkAccess } from '@/hooks/useAdNetworkAccess';
import AdNetworkModal from './AdNetworkModal';

interface AdNetworkRouteGuardProps {
  children: React.ReactNode;
  config?: {
    enabled?: boolean;
    frequency?: 'always' | 'daily' | 'weekly' | 'session';
    adType?: 'interstitial' | 'rewarded';
    skipEnabled?: boolean;
    skipAfterSeconds?: number;
    protectedRoutes?: string[];
  };
}

export default function AdNetworkRouteGuard({ 
  children, 
  config = {} 
}: AdNetworkRouteGuardProps) {
  const location = useLocation();
  const [isAccessGranted, setIsAccessGranted] = useState(false);
  
  const {
    showAdModal,
    handleAdComplete,
    checkRouteAccess,
    config: adConfig,
    adStats
  } = useAdNetworkAccess(config);

  // Check route access when location changes
  useEffect(() => {
    const checkAccess = async () => {
      const hasAccess = await checkRouteAccess(location.pathname);
      setIsAccessGranted(hasAccess);
    };

    checkAccess();
  }, [location.pathname, checkRouteAccess]);

  // Handle ad completion
  const handleAdCompleteWrapper = async (success: boolean) => {
    await handleAdComplete(success);
    if (success) {
      setIsAccessGranted(true);
    }
  };

  // If ad modal is not showing and access is not granted, show loading
  if (!showAdModal && !isAccessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Checking Access</h2>
          <p className="text-sm text-gray-600">Verifying ad network requirements...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Ad Network Modal */}
      <AdNetworkModal
        isOpen={showAdModal}
        onClose={() => handleAdCompleteWrapper(false)}
        onAdComplete={handleAdCompleteWrapper}
        title="Watch Ad to Access Home"
        description="Watch a short ad to unlock full access to Droplink home content"
        adType={adConfig.adType}
        skipEnabled={adConfig.skipEnabled}
        skipAfterSeconds={adConfig.skipAfterSeconds}
      />

      {/* Protected Content */}
      {isAccessGranted && children}

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs">
          <div className="font-semibold mb-1">Ad Network Debug</div>
          <div>Route: {location.pathname}</div>
          <div>Access: {isAccessGranted ? 'Granted' : 'Denied'}</div>
          <div>Modal: {showAdModal ? 'Open' : 'Closed'}</div>
          <div>Total Ads: {adStats.totalAdsWatched}</div>
          <div>Session: {adStats.sessionAdWatched ? 'Watched' : 'Not Watched'}</div>
        </div>
      )}
    </>
  );
}
