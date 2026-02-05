import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';

interface AdAccessState {
  hasWatchedAd: boolean;
  adExpiryTime: number | null;
  isEliteUser: boolean;
  canAccessContent: boolean;
}

const AD_WATCH_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds

export const useAdAccess = () => {
  const { user, profile } = useUser();
  const [adAccessState, setAdAccessState] = useState<AdAccessState>({
    hasWatchedAd: false,
    adExpiryTime: null,
    isEliteUser: false,
    canAccessContent: false
  });

  // Check if user is elite plan subscriber
  const isEliteUser = profile?.plan === 'elite' || profile?.plan === 'premium';

  // Check if user has watched an ad recently
  const hasValidAdAccess = () => {
    const adExpiryTime = localStorage.getItem('adExpiryTime');
    if (!adExpiryTime) return false;
    
    const expiryTime = parseInt(adExpiryTime);
    const now = Date.now();
    
    return now < expiryTime;
  };

  // Check if user can access content
  const canAccessContent = () => {
    // Elite users always have access
    if (isEliteUser) return true;
    
    // Check if user has valid ad access
    return hasValidAdAccess();
  };

  // Mark ad as watched
  const markAdWatched = () => {
    const expiryTime = Date.now() + AD_WATCH_DURATION;
    localStorage.setItem('adExpiryTime', expiryTime.toString());
    localStorage.setItem('adWatched', 'true');
    
    setAdAccessState(prev => ({
      ...prev,
      hasWatchedAd: true,
      adExpiryTime: expiryTime,
      canAccessContent: true
    }));
  };

  // Clear ad access (for testing or logout)
  const clearAdAccess = () => {
    localStorage.removeItem('adExpiryTime');
    localStorage.removeItem('adWatched');
    
    setAdAccessState(prev => ({
      ...prev,
      hasWatchedAd: false,
      adExpiryTime: null,
      canAccessContent: isEliteUser
    }));
  };

  // Initialize ad access state
  useEffect(() => {
    const adExpiryTime = localStorage.getItem('adExpiryTime');
    const adWatched = localStorage.getItem('adWatched');
    
    setAdAccessState({
      hasWatchedAd: adWatched === 'true',
      adExpiryTime: adExpiryTime ? parseInt(adExpiryTime) : null,
      isEliteUser,
      canAccessContent: canAccessContent()
    });
  }, [user, profile, isEliteUser]);

  // Check for expired ad access
  useEffect(() => {
    const checkAdExpiry = () => {
      if (!isEliteUser && hasValidAdAccess()) {
        const adExpiryTime = localStorage.getItem('adExpiryTime');
        if (adExpiryTime) {
          const expiryTime = parseInt(adExpiryTime);
          const now = Date.now();
          
          if (now >= expiryTime) {
            clearAdAccess();
          }
        }
      }
    };

    // Check immediately
    checkAdExpiry();

    // Check every minute
    const interval = setInterval(checkAdExpiry, 60000);

    return () => clearInterval(interval);
  }, [isEliteUser]);

  return {
    ...adAccessState,
    markAdWatched,
    clearAdAccess,
    canAccessContent: canAccessContent(),
    isEliteUser,
    hasValidAdAccess: hasValidAdAccess()
  };
};
