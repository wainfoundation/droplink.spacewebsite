import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Crown, Zap, Star, ArrowRight, Loader2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { mainnetPaymentService } from '@/services/mainnetPaymentService';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  badge: string;
  icon: React.ReactNode;
  color: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    description: 'Perfect for getting started with basic link sharing',
    features: [
      '1 Link Only',
      'Basic Profile',
      'Pi Ads Shown',
      '3 Basic Templates'
    ],
    badge: 'Free',
    icon: <Star className="w-6 h-6" />,
    color: 'text-gray-600'
  },
  {
    id: 'starter',
    name: 'Starter Plan',
    price: 10,
    description: 'Great for creators who want .pi domains and unlimited links',
    features: [
      'Unlimited Links',
      '.pi Domain Access',
      'Pi Tips Enabled',
      'No Ads',
      '33+ Templates',
      'QR Code Generation',
      'Basic Analytics'
    ],
    popular: true,
    badge: 'Popular',
    icon: <Zap className="w-6 h-6" />,
    color: 'text-blue-600'
  },
  {
    id: 'pro',
    name: 'Pro Plan',
    price: 20,
    description: 'For serious creators who want to sell digital products',
    features: [
      'Everything in Starter',
      'Digital Product Sales',
      'Advanced Analytics',
      'SEO Tools',
      '66+ Premium Templates',
      'Priority Support',
      'Custom Themes'
    ],
    badge: 'Advanced',
    icon: <Crown className="w-6 h-6" />,
    color: 'text-purple-600'
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 30,
    description: 'For businesses wanting full customization and API access',
    features: [
      'Everything in Pro',
      'Sell Products with Pi',
      'Custom CSS & Themes',
      'API Access',
      'White-label Option',
      'Team Access (up to 3 users)',
      'Priority 24/7 Support',
      'Data Export & Historical Analytics'
    ],
    badge: 'Enterprise',
    icon: <Crown className="w-6 h-6" />,
    color: 'text-yellow-600'
  }
];

const PlanManagement: React.FC = () => {
  const { user, currentPlan, refreshUserData } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const currentPlanData = PLANS.find(plan => plan.id === currentPlan) || PLANS[0];

  const handlePlanSelect = async (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan || !user) return;

    if (plan.price === 0) {
      // Free plan - no payment needed
      try {
        setIsProcessing(true);
        toast({
          title: "Switching to Free Plan",
          description: "Your plan has been updated successfully.",
        });
        
        // Simulate plan update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update user plan in localStorage
        const userPlanData = {
          planId: plan.id,
          userId: user.id,
          updatedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
        };
        localStorage.setItem('user_plan', JSON.stringify(userPlanData));
        
        await refreshUserData();
        toast({
          title: "Plan Updated",
          description: `You are now on the ${plan.name}!`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update plan. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Paid plan - redirect to payment
      setSelectedPlan(planId);
      navigate('/auth', { state: { selectedPlan: planId } });
    }
  };

  const handleUpgrade = async (planId: string) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan || !user || plan.price === 0) return;

    try {
      setIsProcessing(true);
      
      const result = await mainnetPaymentService.createPayment(
        {
          amount: plan.price,
          memo: `Droplink ${plan.name} plan upgrade`,
          metadata: {
            planId: plan.id,
            planName: plan.name,
            userId: user.id,
            app: 'droplink',
            type: 'upgrade'
          }
        },
        {
          onReadyForServerApproval: (paymentId: string) => {
            toast({
              title: "Payment Ready",
              description: "Your payment is ready for approval in Pi Wallet.",
            });
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            // Update user plan after successful payment
            const userPlanData = {
              planId: plan.id,
              userId: user.id,
              updatedAt: new Date().toISOString(),
              expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            };
            localStorage.setItem('user_plan', JSON.stringify(userPlanData));
            
            await refreshUserData();
            toast({
              title: "Upgrade Successful!",
              description: `You have been upgraded to ${plan.name}!`,
            });
          },
          onCancel: (paymentId: string) => {
            toast({
              title: "Payment Cancelled",
              description: "Payment was cancelled. Please try again.",
              variant: "destructive",
            });
            setIsProcessing(false);
          },
          onError: (error: any, payment: any) => {
            toast({
              title: "Payment Error",
              description: "An error occurred during payment. Please try again.",
              variant: "destructive",
            });
            setIsProcessing(false);
          }
        }
      );

      if (!result.success) {
        throw new Error(result.error || 'Payment failed');
      }
    } catch (error: any) {
      toast({
        title: "Upgrade Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const getPlanButtonText = (plan: Plan) => {
    if (plan.id === currentPlan) {
      return 'Current Plan';
    }
    if (plan.price === 0) {
      return 'Start Free';
    }
    return `Choose ${plan.name}`;
  };

  const getPlanButtonVariant = (plan: Plan) => {
    if (plan.id === currentPlan) {
      return 'secondary' as const;
    }
    if (plan.popular) {
      return 'default' as const;
    }
    return 'outline' as const;
  };

  const isCurrentPlan = (planId: string) => planId === currentPlan;
  const isUpgrade = (planId: string) => {
    const currentIndex = PLANS.findIndex(p => p.id === currentPlan);
    const targetIndex = PLANS.findIndex(p => p.id === planId);
    return targetIndex > currentIndex;
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Status */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`${currentPlanData.color}`}>
              {currentPlanData.icon}
            </div>
            Current Plan: {currentPlanData.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">{currentPlanData.description}</p>
          <div className="flex flex-wrap gap-2">
            {currentPlanData.features.map((feature, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={`relative ${
              plan.popular 
                ? 'border-2 border-blue-300 bg-blue-50 shadow-lg' 
                : isCurrentPlan(plan.id)
                ? 'border-2 border-green-300 bg-green-50'
                : 'hover:border-blue-200'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-3 py-1">
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            {isCurrentPlan(plan.id) && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-3 py-1">
                  Current
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-4">
              <div className={`mx-auto mb-2 ${plan.color}`}>
                {plan.icon}
              </div>
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-gray-900">
                {plan.price === 0 ? 'Free' : `${plan.price} π`}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {plan.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <div className="p-6 pt-0">
              <Button
                className={`w-full ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : isCurrentPlan(plan.id)
                    ? 'bg-green-600 hover:bg-green-700'
                    : ''
                }`}
                variant={getPlanButtonVariant(plan)}
                onClick={() => {
                  if (isCurrentPlan(plan.id)) return;
                  if (isUpgrade(plan.id)) {
                    handleUpgrade(plan.id);
                  } else {
                    handlePlanSelect(plan.id);
                  }
                }}
                disabled={isCurrentPlan(plan.id) || isProcessing}
              >
                {isProcessing && selectedPlan === plan.id ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {getPlanButtonText(plan)}
                    {!isCurrentPlan(plan.id) && <ArrowRight className="w-4 h-4" />}
                  </div>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Plan Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Why Upgrade?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Starter Plan Benefits</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Unlimited links for your content</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Custom .pi domain for branding</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Accept Pi tips from followers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Ad-free experience</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Pro Plan Benefits</h4>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Sell digital products directly</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Advanced analytics and insights</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>SEO optimization tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Priority customer support</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Info */}
      <Alert>
        <AlertDescription>
          <strong>Secure Payment:</strong> All payments are processed securely through Pi Network. 
          Your payment information is never stored on our servers.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PlanManagement;
