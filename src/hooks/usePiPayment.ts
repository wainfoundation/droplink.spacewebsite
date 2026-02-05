
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';

export interface PaymentData {
  amount: number;
  memo: string;
  metadata?: Record<string, any>;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  error?: string;
}

// Updated pricing to match demo exactly
export const planPricing = {
  free: { monthly: 0, annual: 0 },
  basic: { monthly: 10, annual: 8 },
  pro: { monthly: 20, annual: 16 },
  premium: { monthly: 30, annual: 24 }
};

export const usePiPayment = () => {
  const [processingPayment, setProcessingPayment] = useState(false);
  const { toast } = useToast();
  const { refreshUserData } = useUser();

  const handleSubscribe = async (planName: string, billingCycle: 'monthly' | 'yearly' = 'monthly'): Promise<PaymentResult> => {
    setProcessingPayment(true);
    
    try {
      // Get the correct price based on plan and billing cycle
      const pricing = planPricing[planName as keyof typeof planPricing];
      const price = pricing ? (billingCycle === 'annual' ? pricing.annual : pricing.monthly) : 0;
      
      console.log(`Processing MAINNET payment for ${planName} plan (${billingCycle}) - ${price}π`);
      
      // Check if Pi SDK is available
      if (!window.Pi) {
        throw new Error("Pi Network SDK not available");
      }
      
      // Create payment data for Pi Network
      const paymentData = {
        amount: price,
        memo: `Droplink ${planName} plan - ${billingCycle === 'annual' ? 'Annual' : 'Monthly'} subscription`,
        metadata: {
          planName,
          billingCycle,
          app: 'droplink',
          timestamp: Date.now()
        }
      };
      
      // Create Pi payment using the SDK
      const payment = await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('Payment ready for server approval:', paymentId);
          toast({
            title: "Payment Created",
            description: "Your payment is ready for approval.",
          });
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('Payment ready for server completion:', paymentId, txid);
          toast({
            title: "Payment Approved",
            description: "Your payment has been approved and is being processed.",
          });
        },
        onCancel: (paymentId: string) => {
          console.log('Payment cancelled:', paymentId);
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled.",
            variant: "destructive"
          });
        },
        onError: (error: any, payment: any) => {
          console.error('Payment error:', error, payment);
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment.",
            variant: "destructive"
          });
        }
      });
      
      console.log('Pi payment created successfully:', payment);
      
      toast({
        title: "Payment Successful!",
        description: `Your ${planName} plan has been activated successfully for ${price}π/${billingCycle === 'annual' ? 'year' : 'month'}.`,
      });
      
      // Update user plan in context
      await refreshUserData();
      
      return {
        success: true,
        paymentId: payment.identifier || `payment_${Date.now()}`,
      };
      
    } catch (error: any) {
      console.error('Payment error:', error);
      
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      });
      
      return {
        success: false,
        error: error.message || 'Payment failed'
      };
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePayment = async (paymentData: PaymentData): Promise<PaymentResult> => {
    setProcessingPayment(true);
    
    try {
      console.log('Processing MAINNET payment:', paymentData);
      
      // Check if Pi SDK is available
      if (!window.Pi) {
        throw new Error("Pi Network SDK not available");
      }
      
      // Create Pi payment using the SDK
      const payment = await window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('Payment ready for server approval:', paymentId);
          toast({
            title: "Payment Created",
            description: "Your payment is ready for approval.",
          });
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          console.log('Payment ready for server completion:', paymentId, txid);
          toast({
            title: "Payment Approved",
            description: "Your payment has been approved and is being processed.",
          });
        },
        onCancel: (paymentId: string) => {
          console.log('Payment cancelled:', paymentId);
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled.",
            variant: "destructive"
          });
        },
        onError: (error: any, payment: any) => {
          console.error('Payment error:', error, payment);
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment.",
            variant: "destructive"
          });
        }
      });
      
      console.log('Pi payment created successfully:', payment);
      
      toast({
        title: "Payment Successful!",
        description: `Payment of ${paymentData.amount} Pi completed successfully.`,
      });
      
      return {
        success: true,
        paymentId: payment.identifier || `payment_${Date.now()}`,
      };
      
    } catch (error: any) {
      console.error('Payment error:', error);
      
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment",
        variant: "destructive",
      });
      
      return {
        success: false,
        error: error.message || 'Payment failed'
      };
    } finally {
      setProcessingPayment(false);
    }
  };

  return {
    handleSubscribe,
    handlePayment,
    processingPayment,
  };
};
