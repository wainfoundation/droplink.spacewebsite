import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Crown, 
  Zap, 
  Shield, 
  Star,
  ArrowRight,
  Loader2,
  CreditCard,
  Lock
} from 'lucide-react';
import { AVAILABLE_PLANS } from '@/services/planService';
import { createPiPayment } from '@/utils/pi-payments';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: string;
  onSuccess: (newPlan: string) => void;
}

const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSuccess
}) => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'processing' | 'success'>('select');

  const currentPlanData = AVAILABLE_PLANS.find(plan => plan.id === currentPlan);
  const selectedPlanData = AVAILABLE_PLANS.find(plan => plan.id === selectedPlan);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setPaymentStep('payment');
  };

  const handlePayment = async () => {
    if (!selectedPlanData) return;

    setIsProcessing(true);
    setPaymentStep('processing');

    try {
      // Create Pi payment
      const paymentData = {
        amount: selectedPlanData.price,
        memo: `Droplink ${selectedPlanData.name} - Monthly Subscription`,
        metadata: {
          planId: selectedPlanData.id,
          planName: selectedPlanData.name,
          interval: selectedPlanData.interval
        }
      };

      const result = await createPiPayment(paymentData, {
        onReadyForServerApproval: (paymentId) => {
          console.log('Payment ready for server approval:', paymentId);
        },
        onReadyForServerCompletion: (paymentId, txid) => {
          console.log('Payment ready for server completion:', paymentId, txid);
        },
        onCancel: (paymentId) => {
          console.log('Payment cancelled:', paymentId);
          setIsProcessing(false);
          setPaymentStep('payment');
          toast({
            title: "Payment Cancelled",
            description: "Your payment was cancelled. You can try again anytime.",
            variant: "destructive"
          });
        },
        onError: (error, payment) => {
          console.error('Payment error:', error, payment);
          setIsProcessing(false);
          setPaymentStep('payment');
          toast({
            title: "Payment Failed",
            description: "There was an error processing your payment. Please try again.",
            variant: "destructive"
          });
        }
      });

      if (result.success) {
        setPaymentStep('success');
        toast({
          title: "Payment Successful!",
          description: `Welcome to ${selectedPlanData.name}! Your features are now active.`,
        });
        
        // Update user plan
        onSuccess(selectedPlanData.id);
        
        // Close modal after delay
        setTimeout(() => {
          onClose();
          setPaymentStep('select');
          setSelectedPlan('');
        }, 2000);
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsProcessing(false);
      setPaymentStep('payment');
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Star className="w-5 h-5" />;
      case 'starter': return <Zap className="w-5 h-5" />;
      case 'pro': return <Crown className="w-5 h-5" />;
      case 'premium': return <Shield className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'bg-gray-500';
      case 'starter': return 'bg-blue-500';
      case 'pro': return 'bg-purple-500';
      case 'premium': return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const renderPlanComparison = () => {
    const planOrder = ['free', 'starter', 'pro', 'premium'];
    const currentIndex = planOrder.indexOf(currentPlan);

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choose Your Plan</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {AVAILABLE_PLANS.map((plan) => {
            const isCurrentPlan = plan.id === currentPlan;
            const isUpgrade = planOrder.indexOf(plan.id) > currentIndex;
            const isDowngrade = planOrder.indexOf(plan.id) < currentIndex;

            return (
              <Card 
                key={plan.id} 
                className={`relative cursor-pointer transition-all ${
                  selectedPlan === plan.id 
                    ? 'ring-2 ring-blue-500 border-blue-500' 
                    : 'hover:shadow-lg'
                } ${isCurrentPlan ? 'opacity-75' : ''}`}
                onClick={() => !isCurrentPlan && handlePlanSelect(plan.id)}
              >
                {isCurrentPlan && (
                  <Badge className="absolute -top-2 -right-2 bg-green-500">
                    Current
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-2">
                  <div className={`w-12 h-12 rounded-full ${getPlanColor(plan.id)} flex items-center justify-center mx-auto mb-2`}>
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold">
                    {plan.price === 0 ? 'Free' : `${plan.price}π`}
                    <span className="text-sm font-normal text-gray-600">
                      {plan.interval === 'monthly' ? '/month' : ''}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <ul className="space-y-2 text-sm">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </li>
                    ))}
                    {plan.features.length > 4 && (
                      <li className="text-blue-600 text-xs">
                        +{plan.features.length - 4} more features
                      </li>
                    )}
                  </ul>
                  
                  {!isCurrentPlan && (
                    <Button 
                      className="w-full mt-4"
                      variant={isUpgrade ? "default" : "outline"}
                      disabled={isProcessing}
                    >
                      {isUpgrade ? 'Upgrade' : 'Switch'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderPaymentStep = () => {
    if (!selectedPlanData) return null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold">Complete Your Upgrade</h3>
          <p className="text-gray-600">You're upgrading to {selectedPlanData.name}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Plan</span>
              <span className="font-semibold">{selectedPlanData.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Amount</span>
              <span className="font-semibold">{selectedPlanData.price}π</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Billing</span>
              <span className="font-semibold">Monthly</span>
            </div>
            <hr />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span>{selectedPlanData.price}π</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Button 
            onClick={handlePayment}
            className="w-full"
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Pay with Pi Network
              </>
            )}
          </Button>
          
          <Button 
            onClick={() => {
              setPaymentStep('select');
              setSelectedPlan('');
            }}
            variant="outline"
            className="w-full"
            disabled={isProcessing}
          >
            Back to Plans
          </Button>
        </div>

        <div className="text-center text-sm text-gray-600">
          <p>🔒 Secure payment powered by Pi Network</p>
          <p>You can cancel your subscription anytime</p>
        </div>
      </div>
    );
  };

  const renderProcessingStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold">Processing Your Payment</h3>
        <p className="text-gray-600">Please complete the payment in Pi Browser</p>
      </div>
      
      <Progress value={75} className="w-full" />
      
      <div className="text-sm text-gray-500">
        <p>Do not close this window</p>
        <p>You will be redirected once payment is complete</p>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      
      <div>
        <h3 className="text-xl font-semibold text-green-600">Payment Successful!</h3>
        <p className="text-gray-600">
          Welcome to {selectedPlanData?.name}! Your new features are now active.
        </p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800">What's Next?</h4>
        <ul className="text-sm text-green-700 mt-2 space-y-1">
          <li>• Explore your new features in the dashboard</li>
          <li>• Set up advanced analytics</li>
          <li>• Customize your profile with premium templates</li>
        </ul>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Upgrade Your Plan
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {paymentStep === 'select' && renderPlanComparison()}
          {paymentStep === 'payment' && renderPaymentStep()}
          {paymentStep === 'processing' && renderProcessingStep()}
          {paymentStep === 'success' && renderSuccessStep()}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanUpgradeModal;
