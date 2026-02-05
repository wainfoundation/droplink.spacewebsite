/**
 * Pi Authentication Manager
 * 
 * This service manages Pi Network authentication using window.Pi
 * and provides username display throughout the app
 */

import { piAuthService } from './piAuthService';
import { piSDKCORSHandlerService } from './piSDKCORSHandler';

export interface PiUser {
  uid: string;
  username: string;
  displayName?: string;
  avatar?: string;
}

export interface PiAuthState {
  isAuthenticated: boolean;
  user: PiUser | null;
  loading: boolean;
  error: string | null;
}

class PiAuthManager {
  private authState: PiAuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  };

  private listeners: Array<(state: PiAuthState) => void> = [];

  constructor() {
    this.initialize();
  }

  /**
   * Initialize Pi authentication manager
   */
  private async initialize(): Promise<void> {
    try {
      // Check if user is already authenticated
      await this.checkExistingAuth();
    } catch (error) {
      console.error('Pi Auth Manager initialization failed:', error);
    }
  }

  /**
   * Check for existing authentication
   */
  private async checkExistingAuth(): Promise<void> {
    try {
      // Check localStorage for existing auth
      const storedAuth = localStorage.getItem('pi_auth_result');
      if (storedAuth) {
        const authData = JSON.parse(storedAuth);
        if (authData?.user?.uid && authData?.accessToken) {
          // Validate the stored auth
          const isValid = await this.validateStoredAuth(authData);
          if (isValid) {
            this.setAuthState({
              isAuthenticated: true,
              user: {
                uid: authData.user.uid,
                username: authData.user.username || '',
                displayName: authData.user.displayName || authData.user.username || '',
                avatar: authData.user.avatar
              },
              loading: false,
              error: null
            });
            console.log('✅ Existing Pi authentication found and validated');
            return;
          }
        }
      }

      // No valid auth found
      this.setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error checking existing auth:', error);
      this.setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Failed to check existing authentication'
      });
    }
  }

  /**
   * Validate stored authentication
   */
  private async validateStoredAuth(authData: any): Promise<boolean> {
    try {
      // Check if access token is still valid
      if (!authData.accessToken) return false;

      // You can add additional validation here if needed
      // For now, we'll assume stored auth is valid
      return true;
    } catch (error) {
      console.error('Error validating stored auth:', error);
      return false;
    }
  }

  /**
   * Authenticate with Pi Network using window.Pi
   */
  public async authenticate(scopes: string[] = ['payments', 'username']): Promise<PiUser> {
    this.setAuthState({
      ...this.authState,
      loading: true,
      error: null
    });

    try {
      console.log('🔐 Starting Pi Network authentication...');
      
      // Ensure Pi SDK is available
      if (!window.Pi) {
        throw new Error('Pi Network SDK not available. Please ensure you are using Pi Browser.');
      }

      // Use CORS handler for Pi authentication
      const authResult = await piSDKCORSHandlerService.handlePiAuthentication(scopes);

      if (!authResult || !authResult.user || !authResult.accessToken) {
        throw new Error('Authentication failed - no user data received');
      }

      console.log('✅ Pi Network authentication successful:', authResult);

      // Create user object
      const piUser: PiUser = {
        uid: authResult.user.uid,
        username: authResult.user.username || '',
        displayName: authResult.user.displayName || authResult.user.username || '',
        avatar: authResult.user.avatar
      };

      // Store authentication result
      localStorage.setItem('pi_auth_result', JSON.stringify(authResult));
      localStorage.setItem('pi_access_token', authResult.accessToken);

      // Update auth state
      this.setAuthState({
        isAuthenticated: true,
        user: piUser,
        loading: false,
        error: null
      });

      console.log('✅ Pi user authenticated:', piUser.username);
      return piUser;

    } catch (error: any) {
      console.error('❌ Pi Network authentication failed:', error);
      
      this.setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: error.message || 'Authentication failed'
      });

      throw error;
    }
  }

  /**
   * Sign out from Pi Network
   */
  public async signOut(): Promise<void> {
    try {
      console.log('🚪 Signing out from Pi Network...');
      
      // Clear stored data
      localStorage.removeItem('pi_auth_result');
      localStorage.removeItem('pi_access_token');

      // Update auth state
      this.setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });

      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  /**
   * Get current authentication state
   */
  public getAuthState(): PiAuthState {
    return this.authState;
  }

  /**
   * Get current user
   */
  public getCurrentUser(): PiUser | null {
    return this.authState.user;
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  /**
   * Get username for display
   */
  public getUsername(): string {
    if (this.authState.user?.username) {
      return this.authState.user.username;
    }
    if (this.authState.user?.displayName) {
      return this.authState.user.displayName;
    }
    return 'User';
  }

  /**
   * Get display name
   */
  public getDisplayName(): string {
    if (this.authState.user?.displayName) {
      return this.authState.user.displayName;
    }
    if (this.authState.user?.username) {
      return this.authState.user.username;
    }
    return 'User';
  }

  /**
   * Subscribe to auth state changes
   */
  public subscribe(listener: (state: PiAuthState) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Update auth state and notify listeners
   */
  private setAuthState(newState: PiAuthState): void {
    this.authState = newState;
    this.listeners.forEach(listener => listener(newState));
  }

  /**
   * Check if running in Pi Browser
   */
  public isRunningInPiBrowser(): boolean {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('pibrowser') || 
           userAgent.includes('pi network') || 
           userAgent.includes('pi-browser') ||
           typeof window.Pi !== 'undefined';
  }

  /**
   * Get Pi Network status
   */
  public getPiNetworkStatus(): {
    isPiBrowser: boolean;
    isAuthenticated: boolean;
    username: string;
    hasPiSDK: boolean;
  } {
    return {
      isPiBrowser: this.isRunningInPiBrowser(),
      isAuthenticated: this.isAuthenticated(),
      username: this.getUsername(),
      hasPiSDK: typeof window !== 'undefined' && typeof window.Pi !== 'undefined'
    };
  }
}

// Export singleton instance
export const piAuthManager = new PiAuthManager();
