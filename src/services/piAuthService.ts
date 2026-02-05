/**
 * Pi Network Authentication Service
 * Based on official Pi Platform Documentation
 * https://github.com/pi-apps/pi-platform-docs.git
 */

export interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
}

export interface PiPaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval: (paymentId: string) => void;
  onReadyForServerCompletion: (paymentId: string, txid: string) => void;
  onCancel: (paymentId: string) => void;
  onError: (error: any, payment: any) => void;
}

class PiAuthService {
  private isInitialized = false;
  private isAuthenticated = false;
  private authResult: PiAuthResult | null = null;

  /**
   * Initialize Pi SDK for Mainnet
   */
  async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        console.warn('Pi SDK not available');
        return false;
      }

      // Initialize Pi SDK with version 2.0 for mainnet production
      // Official docs: Pi.init({ version: "2.0" }) - no sandbox flag for mainnet
      window.Pi.init({ 
        version: "2.0"
      });
      
      this.isInitialized = true;
      console.log('Pi SDK initialized successfully for MAINNET production');
      return true;
    } catch (error) {
      console.error('Failed to initialize Pi SDK:', error);
      return false;
    }
  }

  /**
   * Authenticate user with Pi Network
   * Based on official documentation: https://github.com/pi-apps/pi-platform-docs.git
   */
  async authenticate(scopes: string[] = ['payments']): Promise<PiAuthResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!window.Pi) {
      throw new Error('Pi SDK not available');
    }

    try {
      // Handle incomplete payments callback as per official docs
      const onIncompletePaymentFound = (payment: any) => {
        console.log('Incomplete payment found:', payment);
        // Handle incomplete payment logic here
      };

      // Authenticate user with specified scopes
      const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
      
      this.isAuthenticated = true;
      this.authResult = authResult;
      
      // Store auth result in localStorage for persistence
      localStorage.setItem('pi_auth_result', JSON.stringify(authResult));
      
      console.log('Pi authentication successful:', authResult);
      return authResult;
    } catch (error) {
      console.error('Pi authentication failed:', error);
      // Do not use mock authentication in mainnet - throw error instead
      throw error;
    }
  }

  /**
   * Create a payment request
   * Based on official documentation: https://github.com/pi-apps/pi-platform-docs.git
   */
  async createPayment(paymentData: PiPaymentData, callbacks: PiPaymentCallbacks): Promise<void> {
    if (!this.isAuthenticated || !window.Pi) {
      throw new Error('User not authenticated or Pi SDK not available');
    }

    try {
      await window.Pi.createPayment(paymentData, callbacks);
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  isUserAuthenticated(): boolean {
    return this.isAuthenticated && this.authResult !== null;
  }

  /**
   * Get current auth result
   */
  getAuthResult(): PiAuthResult | null {
    return this.authResult;
  }

  /**
   * Get current user info
   */
  getCurrentUser() {
    return this.authResult?.user || null;
  }

  /**
   * Sign out user
   */
  signOut(): void {
    this.isAuthenticated = false;
    this.authResult = null;
    localStorage.removeItem('pi_auth_result');
    console.log('User signed out');
  }

  /**
   * Load stored authentication from localStorage
   */
  loadStoredAuth(): boolean {
    try {
      const storedAuth = localStorage.getItem('pi_auth_result');
      if (storedAuth) {
        this.authResult = JSON.parse(storedAuth);
        this.isAuthenticated = true;
        console.log('Loaded stored Pi authentication');
        return true;
      }
    } catch (error) {
      console.error('Failed to load stored authentication:', error);
    }
    return false;
  }

  /**
   * Check if running in Pi Browser
   */
  isRunningInPiBrowser(): boolean {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('pibrowser') || 
           userAgent.includes('pi network') || 
           userAgent.includes('pi-browser') ||
           window.location.href.includes('minepi.com') ||
           window.location.href.includes('pinet.com');
  }
}

// Export singleton instance
export const piAuthService = new PiAuthService();
export default piAuthService;
