/**
 * Mock Payment Service for Testing
 * Simulates Pi Network payments without real transactions
 */

export interface MockPaymentResult {
  success: boolean;
  paymentId: string;
  txid: string;
  amount: number;
  plan: string;
  message: string;
}

export interface MockPaymentOptions {
  planId: string;
  planName: string;
  amount: number;
  userAddress?: string;
}

class MockPaymentService {
  private isEnabled: boolean = true;

  /**
   * Initialize mock payment service
   */
  initialize(): void {
    console.log('Mock Payment Service initialized');
    this.isEnabled = true;
  }

  /**
   * Check if mock payments are enabled
   */
  isMockEnabled(): boolean {
    return this.isEnabled && import.meta.env.DEV;
  }

  /**
   * Create a mock payment
   */
  async createMockPayment(options: MockPaymentOptions): Promise<MockPaymentResult> {
    console.log('Creating mock payment:', options);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate mock payment ID and transaction ID
    const paymentId = `mock_payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const txid = `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Simulate payment success (90% success rate for testing)
    const success = Math.random() > 0.1;

    if (success) {
      console.log('Mock payment successful:', { paymentId, txid });
      return {
        success: true,
        paymentId,
        txid,
        amount: options.amount,
        plan: options.planName,
        message: `Mock payment successful for ${options.planName} plan`
      };
    } else {
      console.log('Mock payment failed');
      return {
        success: false,
        paymentId,
        txid: '',
        amount: options.amount,
        plan: options.planName,
        message: 'Mock payment failed (simulated)'
      };
    }
  }

  /**
   * Approve a mock payment
   */
  async approveMockPayment(paymentId: string): Promise<boolean> {
    console.log('Approving mock payment:', paymentId);
    
    // Simulate approval delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock approval always succeeds
    return true;
  }

  /**
   * Complete a mock payment
   */
  async completeMockPayment(paymentId: string, txid: string): Promise<boolean> {
    console.log('Completing mock payment:', paymentId, txid);
    
    // Simulate completion delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock completion always succeeds
    return true;
  }

  /**
   * Get mock payment status
   */
  async getMockPaymentStatus(paymentId: string): Promise<'pending' | 'approved' | 'completed' | 'failed'> {
    console.log('Getting mock payment status:', paymentId);
    
    // Simulate status check delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Return random status for testing
    const statuses: Array<'pending' | 'approved' | 'completed' | 'failed'> = ['pending', 'approved', 'completed', 'failed'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  }

  /**
   * Get mock payment history
   */
  async getMockPaymentHistory(): Promise<Array<{
    id: string;
    amount: number;
    plan: string;
    status: string;
    date: string;
    txid?: string;
  }>> {
    console.log('Getting mock payment history');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return mock payment history
    return [
      {
        id: 'mock_payment_1',
        amount: 5,
        plan: 'Starter Plan',
        status: 'completed',
        date: new Date(Date.now() - 86400000).toISOString(),
        txid: 'mock_tx_1'
      },
      {
        id: 'mock_payment_2',
        amount: 10,
        plan: 'Pro Plan',
        status: 'completed',
        date: new Date(Date.now() - 172800000).toISOString(),
        txid: 'mock_tx_2'
      }
    ];
  }

  /**
   * Disable mock payments (for production)
   */
  disable(): void {
    this.isEnabled = false;
    console.log('Mock payments disabled');
  }

  /**
   * Enable mock payments (for development)
   */
  enable(): void {
    this.isEnabled = true;
    console.log('Mock payments enabled');
  }
}

// Create singleton instance
const mockPaymentService = new MockPaymentService();

// Export named functions for easier importing
export const createMockPayment = (options: MockPaymentOptions) => mockPaymentService.createMockPayment(options);
export const approveMockPayment = (paymentId: string) => mockPaymentService.approveMockPayment(paymentId);
export const completeMockPayment = (paymentId: string, txid: string) => mockPaymentService.completeMockPayment(paymentId, txid);
export const getMockPaymentStatus = (paymentId: string) => mockPaymentService.getMockPaymentStatus(paymentId);
export const getMockPaymentHistory = () => mockPaymentService.getMockPaymentHistory();
export const generateMockTxid = () => `mock_tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
export const getMockPayments = () => mockPaymentService.getMockPaymentHistory();
export const clearMockPayments = () => {
  // Clear any stored mock payments
  localStorage.removeItem('mock_payments');
  return Promise.resolve();
};

export default mockPaymentService;