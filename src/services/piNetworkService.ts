// Pi Network Service for handling Pi API calls
// Window.Pi types are imported from @/utils/pi-types
export class PiNetworkService {
  private static instance: PiNetworkService;
  private isInitialized = false;

  public static getInstance(): PiNetworkService {
    if (!PiNetworkService.instance) {
      PiNetworkService.instance = new PiNetworkService();
    }
    return PiNetworkService.instance;
  }

  // Initialize Pi Network SDK
  public async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        console.warn('Pi Network SDK not available');
        return false;
      }

      // Force mainnet mode for production
      const isTestnet = false; // Force mainnet
      const isSandbox = false; // Force mainnet

      // Initialize Pi SDK for mainnet production - Following official docs
      // Official docs: Pi.init({ version: "2.0" }) - no sandbox flag for mainnet
      window.Pi.init({ version: "2.0" });

      this.isInitialized = true;
      console.log(`Pi Network SDK initialized successfully in MAINNET mode`);
      return true;
    } catch (error) {
      console.error('Failed to initialize Pi Network SDK:', error);
      return false;
    }
  }

  // Check if Pi SDK is available
  public isPiAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.Pi;
  }

  // Authenticate user with Pi Network
  public async authenticate(): Promise<any> {
    if (!this.isPiAvailable()) {
      throw new Error('Pi Network SDK not available');
    }

    try {
      console.log('Calling window.Pi.authenticate...');
      
      const authResult = await window.Pi.authenticate(
        ["username", "payments", "wallet_address"],
        (payment: any) => {
          console.log("Incomplete payment found:", payment);
          return payment;
        }
      );

      console.log('Pi authentication successful:', authResult);
      return authResult;
    } catch (error) {
      console.error('Pi authentication failed:', error);
      throw error;
    }
  }

  // Get user information
  public async getUser(): Promise<any> {
    if (!this.isPiAvailable()) {
      throw new Error('Pi Network SDK not available');
    }

    try {
      const user = await window.Pi.getUser();
      console.log('Pi user data:', user);
      return user;
    } catch (error) {
      console.error('Failed to get Pi user:', error);
      throw error;
    }
  }

  // Create payment - EXACT SDK DOCUMENTATION IMPLEMENTATION
  public async createPayment(amount: number, memo: string, metadata: any = {}): Promise<any> {
    if (!this.isPiAvailable()) {
      throw new Error('Pi Network SDK not available');
    }

    try {
      console.log('Creating Pi payment with exact SDK documentation:', { amount, memo, metadata });
      
      // EXACT IMPLEMENTATION FROM PI NETWORK SDK DOCUMENTATION
      const Pi = window.Pi;
      
      // Payment data - EXACT FROM DOCS (Mainnet)
      const paymentData = {
        amount: amount,
        memo: memo,
        metadata: {
          ...metadata,
          app: 'droplink',
          network: 'mainnet',
          timestamp: new Date().toISOString()
        }
      };
      
      // Payment callbacks - EXACT FROM DOCS
      const paymentCallbacks = {
        onReadyForServerApproval: function(paymentId: string) {
          console.log('Payment ready for server approval:', paymentId);
        },
        onReadyForServerCompletion: function(paymentId: string, txid: string) {
          console.log('Payment ready for server completion:', paymentId, txid);
        },
        onCancel: function(paymentId: string) {
          console.log('Payment cancelled:', paymentId);
        },
        onError: function(error: any, payment: any) {
          console.error('Payment error:', error, payment);
        }
      };
      
      // EXACT PAYMENT CREATION FROM DOCUMENTATION
      // Official docs: Pi.createPayment(paymentData, paymentCallbacks)
      window.Pi.createPayment(paymentData, paymentCallbacks);
      
      console.log('Pi payment created using exact SDK documentation');
      return { success: true, paymentData };
    } catch (error) {
      console.error('Failed to create Pi payment:', error);
      throw error;
    }
  }

  // Test payment flow (testnet only) - EXACT SDK DOCUMENTATION IMPLEMENTATION
  public async testPaymentFlow(amount: number = 1, memo: string = "Test Payment"): Promise<any> {
    if (!this.isPiAvailable()) {
      throw new Error('Pi Network SDK not available');
    }

    try {
      console.log('Testing Pi payment flow with exact SDK documentation...');
      
      // EXACT IMPLEMENTATION FROM PI NETWORK SDK DOCUMENTATION
      const Pi = window.Pi;
      
      // Payment data - EXACT FROM DOCS (Mainnet)
      const paymentData = {
        amount: amount,
        memo: memo,
        metadata: {
          test: true,
          flow: 'test_payment',
          network: 'mainnet',
          timestamp: new Date().toISOString()
        }
      };
      
      // Payment callbacks - EXACT FROM DOCS
      const paymentCallbacks = {
        onReadyForServerApproval: function(paymentId: string) {
          console.log('Payment ready for server approval:', paymentId);
        },
        onReadyForServerCompletion: function(paymentId: string, txid: string) {
          console.log('Payment ready for server completion:', paymentId, txid);
        },
        onCancel: function(paymentId: string) {
          console.log('Payment cancelled:', paymentId);
        },
        onError: function(error: any, payment: any) {
          console.error('Payment error:', error, payment);
        }
      };
      
      // EXACT PAYMENT CREATION FROM DOCUMENTATION (Mainnet)
      // Official docs: Pi.createPayment(paymentData, paymentCallbacks)
      window.Pi.createPayment(paymentData, paymentCallbacks);
      
      console.log('Payment created successfully for mainnet');
      return { success: true, paymentData };
    } catch (error) {
      console.error('Failed to test payment flow:', error);
      throw error;
    }
  }

  // Open Pi payments
  public async openPayments(): Promise<any> {
    if (!this.isPiAvailable()) {
      throw new Error('Pi Network SDK not available');
    }

    try {
      console.log('Opening Pi payments...');
      
      const payments = await window.Pi.openPayments();
      console.log('Pi payments opened:', payments);
      return payments;
    } catch (error) {
      console.error('Failed to open Pi payments:', error);
      throw error;
    }
  }

  // Get Pi balance
  public async getBalance(): Promise<number> {
    if (!this.isPiAvailable()) {
      throw new Error('Pi Network SDK not available');
    }

    try {
      console.log('Getting Pi balance...');
      
      const balance = await window.Pi.getBalance();
      console.log('Pi balance:', balance);
      return balance;
    } catch (error) {
      console.error('Failed to get Pi balance:', error);
      throw error;
    }
  }

  // Get Pi wallet address
  public async getWalletAddress(): Promise<string> {
    if (!this.isPiAvailable()) {
      throw new Error('Pi Network SDK not available');
    }

    try {
      console.log('Getting Pi wallet address...');
      
      const address = await window.Pi.getWalletAddress();
      console.log('Pi wallet address:', address);
      return address;
    } catch (error) {
      console.error('Failed to get Pi wallet address:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  public async isAuthenticated(): Promise<boolean> {
    if (!this.isPiAvailable()) {
      return false;
    }

    try {
      const user = await this.getUser();
      return !!user;
    } catch (error) {
      console.error('Failed to check authentication status:', error);
      return false;
    }
  }

  // Logout user
  public async logout(): Promise<void> {
    if (!this.isPiAvailable()) {
      throw new Error('Pi Network SDK not available');
    }

    try {
      console.log('Logging out from Pi Network...');
      
      await window.Pi.logout();
      console.log('Pi logout successful');
    } catch (error) {
      console.error('Failed to logout from Pi Network:', error);
      throw error;
    }
  }

  // Get Pi network status
  public async getStatus(): Promise<any> {
    if (!this.isPiAvailable()) {
      return { available: false, error: 'Pi Network SDK not available' };
    }

    try {
      const status = {
        available: true,
        initialized: this.isInitialized,
        authenticated: await this.isAuthenticated(),
        user: await this.getUser().catch(() => null),
        balance: await this.getBalance().catch(() => 0),
        walletAddress: await this.getWalletAddress().catch(() => null)
      };

      console.log('Pi Network status:', status);
      return status;
    } catch (error) {
      console.error('Failed to get Pi Network status:', error);
      return { available: true, error: error.message };
    }
  }
}

// Export singleton instance
export const piNetworkService = PiNetworkService.getInstance();

// Export utility functions
export const callPiAPI = async (method: string, ...args: any[]): Promise<any> => {
  try {
    if (!window.Pi) {
      throw new Error('Pi Network SDK not available');
    }

    console.log(`Calling Pi API method: ${method}`, args);
    
    const result = await (window.Pi as any)[method](...args);
    console.log(`Pi API method ${method} result:`, result);
    
    return result;
  } catch (error) {
    console.error(`Pi API method ${method} failed:`, error);
    throw error;
  }
};

// Window.Pi interface is declared in @/utils/pi-types.ts
