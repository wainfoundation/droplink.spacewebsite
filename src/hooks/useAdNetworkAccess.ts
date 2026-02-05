/**
 * Hook for managing ad network access control
 * Tracks when users need to watch ads to access protected content
 */

import { useState, useEffect, useCallback } from 'react';
import { usePiAuth } from '@/hooks/usePiAuth';
import { usePiStorageKey } from '@/hooks/usePiStorage';

interface AdAccessConfig {
  enabled: boolean;
  frequency: 'always' | 'daily' | 'weekly' | 'session';
  adType: 'interstitial' | 'rewarded';
  skipEnabled: boolean;
  skipAfterSeconds: number;
  protectedRoutes: string[];
}

interface AdAccessState {
  needsAd: boolean;
  lastAdWatched: number | null;
  adCount: number;
  sessionAdWatched: boolean;
}

const DEFAULT_CONFIG: AdAccessConfig = {
  enabled: true,
  frequency: 'session',
  adType: 'interstitial',
  skipEnabled: true,
  skipAfterSeconds: 5,
  protectedRoutes: ['/dashboard', '/home', '/profile', '/tools']
};

export function useAdNetworkAccess(config: Partial<AdAccessConfig> = {}) {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };
  const { currentUser, isAuthenticated } = usePiAuth();
  
  // Storage for ad access state
  const adAccessStorage = usePiStorageKey<AdAccessState>('ad_access_state', {
    autoLoad: true,
    autoSave: true,
    debounceMs: 0
  });

  const [showAdModal, setShowAdModal] = useState(false);
  const [currentRoute, setCurrentRoute] = useState<string>('');

  // Check if current route is protected
  const isProtectedRoute = useCallback((route: string) => {
    return mergedConfig.protectedRoutes.some(protectedRoute => 
      route.startsWith(protectedRoute)
    );
  }, [mergedConfig.protectedRoutes]);

  // Check if user needs to watch an ad
  const checkAdRequirement = useCallback(async (route: string) => {
    if (!mergedConfig.enabled || !isAuthenticated || !currentUser) {
      return false;
    }

    if (!isProtectedRoute(route)) {
      return false;
    }

    const now = Date.now();
    const state = adAccessStorage.data || {
      needsAd: false,
      lastAdWatched: null,
      adCount: 0,
      sessionAdWatched: false
    };

    // Check frequency requirements
    switch (mergedConfig.frequency) {
      case 'always':
        return true;
      
      case 'daily':
        if (!state.lastAdWatched) return true;
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        return state.lastAdWatched < oneDayAgo;
      
      case 'weekly':
        if (!state.lastAdWatched) return true;
        const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
        return state.lastAdWatched < oneWeekAgo;
      
      case 'session':
        return !state.sessionAdWatched;
      
      default:
        return false;
    }
  }, [mergedConfig, isAuthenticated, currentUser, adAccessStorage.data, isProtectedRoute]);

  // Handle ad completion
  const handleAdComplete = useCallback(async (success: boolean) => {
    if (!success) {
      setShowAdModal(false);
      return;
    }

    const now = Date.now();
    const currentState = adAccessStorage.data || {
      needsAd: false,
      lastAdWatched: null,
      adCount: 0,
      sessionAdWatched: false
    };

    // Update ad access state
    const newState: AdAccessState = {
      needsAd: false,
      lastAdWatched: now,
      adCount: currentState.adCount + 1,
      sessionAdWatched: true
    };

    await adAccessStorage.setData(newState);
    setShowAdModal(false);

    console.log('Ad completed successfully, access granted');
  }, [adAccessStorage]);

  // Check route access
  const checkRouteAccess = useCallback(async (route: string) => {
    setCurrentRoute(route);
    
    const needsAd = await checkAdRequirement(route);
    if (needsAd) {
      setShowAdModal(true);
      return false; // Access denied until ad is watched
    }
    
    return true; // Access granted
  }, [checkAdRequirement]);

  // Reset session ad state
  const resetSessionAdState = useCallback(async () => {
    const currentState = adAccessStorage.data || {
      needsAd: false,
      lastAdWatched: null,
      adCount: 0,
      sessionAdWatched: false
    };

    await adAccessStorage.setData({
      ...currentState,
      sessionAdWatched: false
    });
  }, [adAccessStorage]);

  // Force show ad modal (for testing or manual triggers)
  const forceShowAd = useCallback(() => {
    setShowAdModal(true);
  }, []);

  // Skip ad requirement for current session
  const skipAdRequirement = useCallback(async () => {
    const currentState = adAccessStorage.data || {
      needsAd: false,
      lastAdWatched: null,
      adCount: 0,
      sessionAdWatched: false
    };

    await adAccessStorage.setData({
      ...currentState,
      sessionAdWatched: true
    });

    setShowAdModal(false);
  }, [adAccessStorage]);

  // Get ad statistics
  const getAdStats = useCallback(() => {
    const state = adAccessStorage.data || {
      needsAd: false,
      lastAdWatched: null,
      adCount: 0,
      sessionAdWatched: false
    };

    return {
      totalAdsWatched: state.adCount,
      lastAdWatched: state.lastAdWatched ? new Date(state.lastAdWatched) : null,
      sessionAdWatched: state.sessionAdWatched,
      daysSinceLastAd: state.lastAdWatched 
        ? Math.floor((Date.now() - state.lastAdWatched) / (24 * 60 * 60 * 1000))
        : null
    };
  }, [adAccessStorage.data]);

  // Auto-check route access when route changes
  useEffect(() => {
    if (currentRoute && isAuthenticated) {
      checkRouteAccess(currentRoute);
    }
  }, [currentRoute, isAuthenticated, checkRouteAccess]);

  return {
    // State
    showAdModal,
    currentRoute,
    adAccessState: adAccessStorage.data,
    adStats: getAdStats(),
    
    // Actions
    checkRouteAccess,
    handleAdComplete,
    resetSessionAdState,
    forceShowAd,
    skipAdRequirement,
    
    // Configuration
    config: mergedConfig,
    
    // Utilities
    isProtectedRoute,
    checkAdRequirement
  };
}
