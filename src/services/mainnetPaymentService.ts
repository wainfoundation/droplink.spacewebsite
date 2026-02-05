/**
 * Mainnet Payment Service for Droplink
 * Handles Pi Network mainnet payments with proper wallet address integration
 */

import { useToast } from '@/hooks/use-toast';

export interface MainnetPaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}

export interface MainnetPaymentResult {
  success: boolean;
  paymentId?: string;
  txid?: string;
  error?: string;
}

export interface PaymentCallbacks {
  onReadyForServerApproval?: (paymentId: string) => void;
  onReadyForServerCompletion?: (paymentId: string, txid: string) => void;
  onCancel?: (paymentId: string) => void;
  onError?: (error: any, payment: any) => void;
}

class MainnetPaymentService {
  private platformWalletAddress: string;
  private isInitialized: boolean = false;

  constructor() {
    // Get platform wallet address from environment variables
    this.platformWalletAddress = import.meta.env.VITE_PI_WALLET_ADDRESS || 'GDSXE723WPHZ5RGIJCSYXTPKSOIGPTSXE4RF5U3JTNGTCHXON7ZVD4LJ';
  }

  /**
   * Initialize the payment service
   */
  async initialize(): Promise<boolean> {
    try {
      if (!window.Pi) {
        console.error('Pi SDK not available');
        return false;
      }

      this.isInitialized = true;
      console.log('Mainnet Payment Service initialized with platform wallet:', this.platformWalletAddress);
      return true;
    } catch (error) {
      console.error('Failed to initialize Mainnet Payment Service:', error);
      return false;
    }
  }

  /**
   * Get user's wallet address from Pi authentication
   */
  getUserWalletAddress(): string | null {
    // Try to get from localStorage first
    const storedAddress = localStorage.getItem('userWalletAddress');
    if (storedAddress) {
      return storedAddress;
    }

    // Try to get from Pi SDK if available
    if (window.Pi && window.Pi.getUser) {
      try {
        const user = window.Pi.getUser();
        return user?.walletAddress || null;
      } catch (error) {
        console.warn('Could not get wallet address from Pi SDK:', error);
      }
    }

    return null;
  }

  /**
   * Set user's wallet address
   */
  setUserWalletAddress(walletAddress: string): void {
    localStorage.setItem('userWalletAddress', walletAddress);
  }

  /**
   * Create a payment using Pi Network mainnet
   */
  async createPayment(
    paymentData: MainnetPaymentData,
    callbacks?: PaymentCallbacks
  ): Promise<MainnetPaymentResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (!window.Pi) {
        throw new Error('Pi Network SDK not available');
      }

      console.log('Creating mainnet payment:', paymentData);

      // Get user's wallet address
      const userWalletAddress = this.getUserWalletAddress();
      
      // Prepare payment data with wallet information
      const piPaymentData = {
        amount: paymentData.amount,
        memo: paymentData.memo,
        metadata: {
          ...paymentData.metadata,
          platformWalletAddress: this.platformWalletAddress,
          userWalletAddress: userWalletAddress,
          appId: 'droplink',
          network: 'mainnet',
          timestamp: Date.now()
        }
      };

      // Create payment callbacks
      const paymentCallbacks = {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log('Payment ready for server approval:', paymentId);
          // Auto-approve payment for mainnet
          try {
            await this.approvePayment(paymentId);
            console.log('Payment auto-approved:', paymentId);
          } catch (error) {
            console.error('Failed to auto-approve payment:', error);
          }
          callbacks?.onReadyForServerApproval?.(paymentId);
        },
        
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log('Payment ready for server completion:', paymentId, txid);
          // Auto-complete payment for mainnet
          try {
            await this.completePayment(paymentId, txid);
            console.log('Payment auto-completed:', paymentId);
          } catch (error) {
            console.error('Failed to auto-complete payment:', error);
          }
          callbacks?.onReadyForServerCompletion?.(paymentId, txid);
        },
        
        onCancel: (paymentId: string) => {
          console.log('Payment cancelled:', paymentId);
          callbacks?.onCancel?.(paymentId);
        },
        
        onError: (error: any, payment: any) => {
          console.error('Payment error:', error, payment);
          callbacks?.onError?.(error, payment);
        }
      };

      // Create the payment using Pi SDK
      // Official docs: Pi.createPayment(paymentData, callbacks): void
      window.Pi.createPayment(piPaymentData, paymentCallbacks);
      
      console.log('Pi payment created successfully for mainnet');

      return {
        success: true,
        paymentId: `payment_${Date.now()}`
      };

    } catch (error: any) {
      console.error('Payment creation failed:', error);
      return {
        success: false,
        error: error.message || 'Payment creation failed'
      };
    }
  }

  /**
   * Create a plan subscription payment
   */
  async createPlanPayment(
    planName: string,
    planPrice: number,
    billingCycle: 'monthly' | 'yearly' = 'monthly',
    userId?: string
  ): Promise<MainnetPaymentResult> {
    const paymentData: MainnetPaymentData = {
      amount: planPrice,
      memo: `Droplink ${planName} plan - ${billingCycle === 'yearly' ? 'Annual' : 'Monthly'} subscription`,
      metadata: {
        type: 'subscription',
        planName,
        billingCycle,
        userId,
        app: 'droplink'
      }
    };

    return this.createPayment(paymentData);
  }

  /**
   * Approve a payment (server-side)
   */
  async approvePayment(paymentId: string): Promise<boolean> {
    try {
      // In a real implementation, this would call your backend API
      // For now, we'll simulate the approval process
      console.log('Approving payment:', paymentId);
      
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Payment approved:', paymentId);
      return true;
    } catch (error) {
      console.error('Failed to approve payment:', error);
      return false;
    }
  }

  /**
   * Complete a payment (server-side)
   */
  async completePayment(paymentId: string, txid: string): Promise<boolean> {
    try {
      // In a real implementation, this would call your backend API
      console.log('Completing payment:', paymentId, 'with txid:', txid);
      
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Payment completed:', paymentId);
      return true;
    } catch (error) {
      console.error('Failed to complete payment:', error);
      return false;
    }
  }

  /**
   * Get payment status
   */
  getPaymentStatus(paymentId: string): string {
    // In a real implementation, this would query your backend
    return 'pending';
  }

  /**
   * Validate wallet address format
   */
  validateWalletAddress(address: string): boolean {
    // Pi wallet addresses are typically 56 characters long and start with 'G'
    return address && address.length === 56 && address.startsWith('G');
  }

  /**
   * Get platform wallet address
   */
  getPlatformWalletAddress(): string {
    return this.platformWalletAddress;
  }
}

// Export singleton instance
export const mainnetPaymentService = new MainnetPaymentService();
export default mainnetPaymentService;
