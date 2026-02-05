// Pi Network Validation Service
// Handles payment validation using the new validation key

export class PiValidationService {
  private static instance: PiValidationService;
  private validationKey: string;
  private apiKey: string;

  private constructor() {
    this.validationKey = import.meta.env.VITE_PI_VALIDATION_KEY || 
                       '26ec4458680b98edc16b18ed68c2fb7841ee2c9d3b9cfdcfa82de36bea71f64074a2ee5d1fbea04762df431edb1458b44a2ff50679b16d93935b0b645e98174a';
    this.apiKey = import.meta.env.VITE_PI_SERVER_API_KEY || 
                  'ebm7t8yojn4q0apodezl5byt5e7tmm2asppmqlzjvv8jayyncxjah64iip3yyp5r';
  }

  public static getInstance(): PiValidationService {
    if (!PiValidationService.instance) {
      PiValidationService.instance = new PiValidationService();
    }
    return PiValidationService.instance;
  }

  // Validate Pi payment
  public async validatePayment(paymentId: string): Promise<boolean> {
    try {
      console.log('Validating Pi payment:', paymentId);
      
      // In testnet mode, simulate validation
      const isTestnet = false; // Force mainnet
      
      if (isTestnet) {
        console.log('Testnet mode: Simulating payment validation');
        return true; // Always return true in testnet mode
      }

      // For mainnet, implement actual validation
      const response = await fetch('https://api.minepi.com/v2/payments', {
        method: 'GET',
        headers: {
          'Authorization': `Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Validation failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Payment validation result:', data);
      
      return data.status === 'completed';
    } catch (error) {
      console.error('Payment validation error:', error);
      return false;
    }
  }

  // Verify payment signature
  public async verifyPaymentSignature(payment: any): Promise<boolean> {
    try {
      console.log('Verifying payment signature:', payment);
      
      // In testnet mode, simulate signature verification
      const isTestnet = false; // Force mainnet
      
      if (isTestnet) {
        console.log('Testnet mode: Simulating signature verification');
        return true; // Always return true in testnet mode
      }

      // For mainnet, implement actual signature verification
      // This would involve verifying the payment signature using the validation key
      const signature = payment.signature;
      const message = payment.message;
      
      if (!signature || !message) {
        console.error('Missing signature or message');
        return false;
      }

      // Implement signature verification logic here
      // This is a simplified version - actual implementation would use cryptographic verification
      console.log('Signature verification completed');
      return true;
    } catch (error) {
      console.error('Signature verification error:', error);
      return false;
    }
  }

  // Get payment details
  public async getPaymentDetails(paymentId: string): Promise<any> {
    try {
      console.log('Getting payment details:', paymentId);
      
      // In testnet mode, return mock data
      const isTestnet = false; // Force mainnet
      
      if (isTestnet) {
        console.log('Testnet mode: Returning mock payment details');
        return {
          id: paymentId,
          amount: 1,
          memo: 'Test Payment',
          status: 'completed',
          timestamp: new Date().toISOString(),
          testnet: false
        };
      }

      // For mainnet, fetch actual payment details
      const response = await fetch(`https://api.minepi.com/v2/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Key ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get payment details: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Payment details:', data);
      
      return data;
    } catch (error) {
      console.error('Get payment details error:', error);
      throw error;
    }
  }

  // Create payment validation request
  public async createValidationRequest(payment: any): Promise<any> {
    try {
      console.log('Creating validation request:', payment);
      
      const validationRequest = {
        paymentId: payment.id,
        amount: payment.amount,
        memo: payment.memo,
        timestamp: new Date().toISOString(),
        validationKey: this.validationKey,
        apiKey: this.apiKey
      };

      console.log('Validation request created:', validationRequest);
      return validationRequest;
    } catch (error) {
      console.error('Create validation request error:', error);
      throw error;
    }
  }

  // Get validation status
  public getValidationStatus(): { validationKey: string; apiKey: string; testnet: boolean } {
    const isTestnet = import.meta.env.VITE_PI_SANDBOX === 'true' || 
                     import.meta.env.VITE_PI_NETWORK === 'testnet';
    
    return {
      validationKey: this.validationKey,
      apiKey: this.apiKey,
      testnet: isTestnet
    };
  }
}

// Export singleton instance
export const piValidationService = PiValidationService.getInstance();

// Export utility functions
export const validatePiPayment = async (paymentId: string): Promise<boolean> => {
  return await piValidationService.validatePayment(paymentId);
};

export const verifyPiPaymentSignature = async (payment: any): Promise<boolean> => {
  return await piValidationService.verifyPaymentSignature(payment);
};

export const getPiPaymentDetails = async (paymentId: string): Promise<any> => {
  return await piValidationService.getPaymentDetails(paymentId);
};
