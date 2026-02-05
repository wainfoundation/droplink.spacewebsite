/**
 * React Hook for Pi Authentication Manager
 * 
 * This hook provides easy access to Pi authentication state and methods
 */

import { useState, useEffect } from 'react';
import { piAuthManager, PiUser, PiAuthState } from '@/services/piAuthManager';

export function usePiAuthManager() {
  const [authState, setAuthState] = useState<PiAuthState>(piAuthManager.getAuthState());

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = piAuthManager.subscribe((newState) => {
      setAuthState(newState);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  /**
   * Authenticate with Pi Network
   */
  const authenticate = async (scopes: string[] = ['payments', 'username']): Promise<PiUser> => {
    return await piAuthManager.authenticate(scopes);
  };

  /**
   * Sign out from Pi Network
   */
  const signOut = async (): Promise<void> => {
    await piAuthManager.signOut();
  };

  /**
   * Get current user
   */
  const getCurrentUser = (): PiUser | null => {
    return piAuthManager.getCurrentUser();
  };

  /**
   * Check if authenticated
   */
  const isAuthenticated = (): boolean => {
    return piAuthManager.isAuthenticated();
  };

  /**
   * Get username for display
   */
  const getUsername = (): string => {
    return piAuthManager.getUsername();
  };

  /**
   * Get display name
   */
  const getDisplayName = (): string => {
    return piAuthManager.getDisplayName();
  };

  /**
   * Check if running in Pi Browser
   */
  const isRunningInPiBrowser = (): boolean => {
    return piAuthManager.isRunningInPiBrowser();
  };

  /**
   * Get Pi Network status
   */
  const getPiNetworkStatus = () => {
    return piAuthManager.getPiNetworkStatus();
  };

  return {
    // State
    isAuthenticated: authState.isAuthenticated,
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    
    // Methods
    authenticate,
    signOut,
    getCurrentUser,
    checkAuthenticated: isAuthenticated,
    getUsername,
    getDisplayName,
    isRunningInPiBrowser,
    getPiNetworkStatus
  };
}
