/**
 * Pi Network Payment Service
 * Based on official Pi Platform Documentation
 * https://github.com/pi-apps/pi-platform-docs.git
 */

import { piAuthService } from './piAuthService';

export interface PiPaymentRequest {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}

export interface PiPaymentResult {
  paymentId: string;
  txid?: string;
  status: 'pending' | 'approved' | 'completed' | 'cancelled' | 'failed';
}

export interface PiPaymentCallbacks {
  onReadyForServerApproval?: (paymentId: string) => void;
  onReadyForServerCompletion?: (paymentId: string, txid: string) => void;
  onCancel?: (paymentId: string) => void;
  onError?: (error: any, payment: any) => void;
}

class PiPaymentService {
  private isInitialized = false;
  private pendingPayments: Map<string, PiPaymentResult> = new Map();
  private platformWalletAddress: string;

  constructor() {
    // Get platform wallet address from environment variables (for processing)
    this.platformWalletAddress = import.meta.env.VITE_PI_WALLET_ADDRESS || 'GDSXE723WPHZ5RGIJCSYXTPKSOIGPTSXE4RF5U3JTNGTCHXON7ZVD4LJ';
  }

  /**
   * Initialize Pi Payment Service
   */
  async initialize(): Promise<boolean> {
    try {
      if (!piAuthService.isUserAuthenticated()) {
        console.warn('User not authenticated for payments');
        return false;
      }

      this.isInitialized = true;
      console.log('Pi Payment Service initialized successfully with platform wallet:', this.platformWalletAddress);
      return true;
    } catch (error) {
      console.error('Failed to initialize Pi Payment Service:', error);
      return false;
    }
  }

  /**
   * Get the platform wallet address (for processing)
   */
  getPlatformWalletAddress(): string {
    return this.platformWalletAddress;
  }

  /**
   * Get the user's receiving wallet address
   */
  getUserWalletAddress(): string | null {
    return localStorage.getItem('userWalletAddress');
  }

  /**
   * Set the user's receiving wallet address
   */
  setUserWalletAddress(walletAddress: string): void {
    localStorage.setItem('userWalletAddress', walletAddress);
  }

  /**
   * Get platform wallet balance from Pi Network API
   */
  async getPlatformWalletBalance(): Promise<number> {
    try {
      // Use mainnet API endpoint (https://api.minepi.com)
      const PI_API_URL = import.meta.env.VITE_PI_NETWORK_API_URL || "https://api.minepi.com/v2";
      const response = await fetch(`${PI_API_URL}/accounts/${this.platformWalletAddress}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch platform wallet balance: ${response.statusText}`);
      }
      
      const data = await response.json();
      const nativeBalance = data.balances?.find((balance: any) => balance.asset_type === 'native');
      return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
    } catch (error) {
      console.error('Failed to get platform wallet balance:', error);
      return 0;
    }
  }

  /**
   * Get user wallet balance from Pi Network API
   */
  async getUserWalletBalance(): Promise<number> {
    const userWalletAddress = this.getUserWalletAddress();
    if (!userWalletAddress) {
      return 0;
    }

    try {
      // Use mainnet API endpoint (https://api.minepi.com)
      const PI_API_URL = import.meta.env.VITE_PI_NETWORK_API_URL || "https://api.minepi.com/v2";
      const response = await fetch(`${PI_API_URL}/accounts/${userWalletAddress}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch user wallet balance: ${response.statusText}`);
      }
      
      const data = await response.json();
      const nativeBalance = data.balances?.find((balance: any) => balance.asset_type === 'native');
      return nativeBalance ? parseFloat(nativeBalance.balance) : 0;
    } catch (error) {
      console.error('Failed to get user wallet balance:', error);
      return 0;
    }
  }

  /**
   * Create a payment request (User-to-App)
   * Based on official documentation: https://github.com/pi-apps/pi-platform-docs.git
   */
  async createPayment(
    paymentRequest: PiPaymentRequest, 
    callbacks?: PiPaymentCallbacks
  ): Promise<PiPaymentResult> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!piAuthService.isUserAuthenticated()) {
      throw new Error('User not authenticated');
    }

    try {
      const paymentData = {
        amount: paymentRequest.amount,
        memo: paymentRequest.memo,
        metadata: {
          ...paymentRequest.metadata,
          platformWalletAddress: this.platformWalletAddress,
          userWalletAddress: this.getUserWalletAddress(),
          appId: 'droplink'
        }
      };

      const paymentCallbacks = {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('Payment ready for server approval:', paymentId);
          this.pendingPayments.set(paymentId, {
            paymentId,
            status: 'pending'
          });
          
          if (callbacks?.onReadyForServerApproval) {
            callbacks.onReadyForServerApproval(paymentId);
          }
          
          // Send to server for approval
          this.sendToServerForApproval(paymentId);
        },
        
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('Payment ready for server completion:', paymentId, txid);
          const payment = this.pendingPayments.get(paymentId);
          if (payment) {
            payment.txid = txid;
            payment.status = 'approved';
            this.pendingPayments.set(paymentId, payment);
          }
          
          if (callbacks?.onReadyForServerCompletion) {
            callbacks.onReadyForServerCompletion(paymentId, txid);
          }
          
          // Send to server for completion
          this.sendToServerForCompletion(paymentId, txid);
        },
        
        onCancel: (paymentId: string) => {
          console.log('Payment cancelled:', paymentId);
          const payment = this.pendingPayments.get(paymentId);
          if (payment) {
            payment.status = 'cancelled';
            this.pendingPayments.set(paymentId, payment);
          }
          
          if (callbacks?.onCancel) {
            callbacks.onCancel(paymentId);
          }
        },
        
        onError: (error: any, payment: any) => {
          console.error('Payment error:', error, payment);
          if (payment?.paymentId) {
            const paymentResult = this.pendingPayments.get(payment.paymentId);
            if (paymentResult) {
              paymentResult.status = 'failed';
              this.pendingPayments.set(payment.paymentId, paymentResult);
            }
          }
          
          if (callbacks?.onError) {
            callbacks.onError(error, payment);
          }
        }
      };

      // Create payment using Pi SDK
      await piAuthService.createPayment(paymentData, paymentCallbacks);
      
      // Return initial payment result
      return {
        paymentId: `payment_${Date.now()}`,
        status: 'pending'
      };
    } catch (error) {
      console.error('Payment creation failed:', error);
      throw error;
    }
  }

  /**
   * Send payment to server for approval
   */
  private async sendToServerForApproval(paymentId: string): Promise<void> {
    try {
      const response = await fetch('/api/payments/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          action: 'approve'
        })
      });

      if (!response.ok) {
        throw new Error('Server approval failed');
      }

      const result = await response.json();
      console.log('Payment approved by server:', result);
    } catch (error) {
      console.error('Failed to send payment for server approval:', error);
    }
  }

  /**
   * Send payment to server for completion
   */
  private async sendToServerForCompletion(paymentId: string, txid: string): Promise<void> {
    try {
      const response = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          txid,
          action: 'complete'
        })
      });

      if (!response.ok) {
        throw new Error('Server completion failed');
      }

      const result = await response.json();
      console.log('Payment completed by server:', result);
      
      // Update payment status
      const payment = this.pendingPayments.get(paymentId);
      if (payment) {
        payment.status = 'completed';
        this.pendingPayments.set(paymentId, payment);
      }
    } catch (error) {
      console.error('Failed to send payment for server completion:', error);
    }
  }

  /**
   * Get payment status
   */
  getPaymentStatus(paymentId: string): PiPaymentResult | null {
    return this.pendingPayments.get(paymentId) || null;
  }

  /**
   * Get all pending payments
   */
  getPendingPayments(): PiPaymentResult[] {
    return Array.from(this.pendingPayments.values());
  }

  /**
   * Clear completed payments
   */
  clearCompletedPayments(): void {
    for (const [paymentId, payment] of this.pendingPayments.entries()) {
      if (payment.status === 'completed' || payment.status === 'cancelled' || payment.status === 'failed') {
        this.pendingPayments.delete(paymentId);
      }
    }
  }

  /**
   * Create a simple payment (for testing)
   */
  async createSimplePayment(amount: number, memo: string): Promise<PiPaymentResult> {
    return this.createPayment({
      amount,
      memo,
      metadata: {
        timestamp: Date.now(),
        source: 'droplink'
      }
    });
  }

  /**
   * Create a premium upgrade payment
   */
  async createPremiumUpgradePayment(planName: string): Promise<PiPaymentResult> {
    const planPrices: Record<string, number> = {
      'basic': 1.0,
      'pro': 5.0,
      'premium': 10.0
    };

    const amount = planPrices[planName] || 1.0;
    
    return this.createPayment({
      amount,
      memo: `Upgrade to ${planName} plan`,
      metadata: {
        type: 'upgrade',
        plan: planName,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Approve a Pi payment (for server-side approval)
   */
  async approvePiPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await fetch('/api/payments/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          action: 'approve'
        })
      });

      if (!response.ok) {
        throw new Error('Payment approval failed');
      }

      const result = await response.json();
      console.log('Payment approved:', result);
      return true;
    } catch (error) {
      console.error('Failed to approve payment:', error);
      return false;
    }
  }

  /**
   * Complete a Pi payment (for server-side completion)
   */
  async completePiPayment(paymentId: string, txid: string): Promise<boolean> {
    try {
      const response = await fetch('/api/payments/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          txid,
          action: 'complete'
        })
      });

      if (!response.ok) {
        throw new Error('Payment completion failed');
      }

      const result = await response.json();
      console.log('Payment completed:', result);
      return true;
    } catch (error) {
      console.error('Failed to complete payment:', error);
      return false;
    }
  }
}

// Export singleton instance
export const piPaymentService = new PiPaymentService();
export default piPaymentService;

// Export individual functions for direct import
export const approvePiPayment = (paymentId: string) => piPaymentService.approvePiPayment(paymentId);
export const completePiPayment = (paymentId: string, txid: string) => piPaymentService.completePiPayment(paymentId, txid);