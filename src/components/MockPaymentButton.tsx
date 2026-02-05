import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CreditCard, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import mockPaymentService, { MockPaymentOptions } from '@/services/mockPaymentService';

interface MockPaymentButtonProps {
  planId: string;
  planName: string;
  amount: number;
  onSuccess: (result: any) => void;
  onError: (error: any) => void;
  className?: string;
  disabled?: boolean;
}

const MockPaymentButton: React.FC<MockPaymentButtonProps> = ({
  planId,
  planName,
  amount,
  onSuccess,
  onError,
  className = '',
  disabled = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'approving' | 'completing' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleMockPayment = async () => {
    if (!mockPaymentService.isMockEnabled()) {
      toast({
        title: "Mock Payments Disabled",
        description: "Mock payments are only available in development mode",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Step 1: Create mock payment
      toast({
        title: "Creating Mock Payment",
        description: `Processing ${planName} payment...`,
      });

      const paymentOptions: MockPaymentOptions = {
        planId,
        planName,
        amount,
        userAddress: 'mock_user_address'
      };

      const paymentResult = await mockPaymentService.createMockPayment(paymentOptions);

      if (!paymentResult.success) {
        throw new Error(paymentResult.message);
      }

      setPaymentStep('approving');

      // Step 2: Approve mock payment
      toast({
        title: "Approving Payment",
        description: "Approving your mock payment...",
      });

      const approved = await mockPaymentService.approveMockPayment(paymentResult.paymentId);

      if (!approved) {
        throw new Error('Mock payment approval failed');
      }

      setPaymentStep('completing');

      // Step 3: Complete mock payment
      toast({
        title: "Completing Payment",
        description: "Finalizing your mock payment...",
      });

      const completed = await mockPaymentService.completeMockPayment(
        paymentResult.paymentId,
        paymentResult.txid
      );

      if (!completed) {
        throw new Error('Mock payment completion failed');
      }

      setPaymentStep('success');

      // Success
      toast({
        title: "Payment Successful!",
        description: `Mock payment completed for ${planName}`,
      });

      onSuccess({
        paymentId: paymentResult.paymentId,
        txid: paymentResult.txid,
        amount: paymentResult.amount,
        plan: paymentResult.plan,
        isMock: true
      });

    } catch (error: any) {
      console.error('Mock payment error:', error);
      setPaymentStep('error');

      toast({
        title: "Payment Failed",
        description: error.message || 'Mock payment failed',
        variant: "destructive"
      });

      onError(error);
    } finally {
      setIsProcessing(false);
      // Reset step after a delay
      setTimeout(() => setPaymentStep('idle'), 2000);
    }
  };

  const getButtonText = () => {
    switch (paymentStep) {
      case 'processing':
        return 'Processing Payment...';
      case 'approving':
        return 'Approving Payment...';
      case 'completing':
        return 'Completing Payment...';
      case 'success':
        return 'Payment Successful!';
      case 'error':
        return 'Payment Failed';
      default:
        return `Pay ${amount} π (Mock)`;
    }
  };

  const getButtonIcon = () => {
    switch (paymentStep) {
      case 'processing':
      case 'approving':
      case 'completing':
        return <Loader2 className="w-4 h-4 mr-2 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 mr-2 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 mr-2 text-red-500" />;
      default:
        return <CreditCard className="w-4 h-4 mr-2" />;
    }
  };

  const getButtonVariant = () => {
    switch (paymentStep) {
      case 'success':
        return 'default' as const;
      case 'error':
        return 'destructive' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={handleMockPayment}
        disabled={disabled || isProcessing}
        className={`w-full ${className}`}
        variant={getButtonVariant()}
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>
      
      {/* Mock Payment Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
          <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
          Mock Payment Mode
        </div>
      </div>
      
      {/* Payment Steps Indicator */}
      {isProcessing && (
        <div className="space-y-2">
          <div className="text-sm text-gray-600 text-center">Payment Progress</div>
          <div className="flex items-center justify-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${paymentStep === 'processing' ? 'bg-blue-500' : paymentStep === 'approving' || paymentStep === 'completing' || paymentStep === 'success' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`w-3 h-3 rounded-full ${paymentStep === 'approving' ? 'bg-blue-500' : paymentStep === 'completing' || paymentStep === 'success' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
            <div className="w-8 h-0.5 bg-gray-300"></div>
            <div className={`w-3 h-3 rounded-full ${paymentStep === 'completing' ? 'bg-blue-500' : paymentStep === 'success' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockPaymentButton;
