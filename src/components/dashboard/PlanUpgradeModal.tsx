
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, Shield, Lock, CreditCard } from 'lucide-react';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature?: string | null;
  currentPlan: string;
  onUpgrade: (planName: string) => Promise<void>;
  processingPayment: boolean;
}

const plans = [
  {
    name: 'free',
    title: 'Free',
    price: 0,
    icon: Star,
    features: [
      '1 Link Only',
      'Basic Profile',
      'Pi Ads Shown',
      'Droplink Badge',
      '3 Basic Templates'
    ],
    popular: false
  },
  {
    name: 'basic',
    title: 'Starter',
    price: 8,
    icon: Zap,
    features: [
      'Unlimited Links',
      '.pi Domain Access',
      'Pi Tips Enabled',
      'No Ads',
      'QR Codes',
      'Basic Analytics',
      'Email Support',
      '33+ Templates',
      'Custom Button Styles'
    ],
    popular: false
  },
  {
    name: 'pro',
    title: 'Pro',
    price: 12,
    icon: Crown,
    features: [
      'Everything in Starter',
      'Digital Product Sales',
      'Advanced Analytics',
      'SEO Tools',
      'Link Scheduling',
      'Custom Themes',
      '66+ Premium Templates',
      'Email/Phone Collection',
      'Location Analytics',
      'Hide Droplink Branding'
    ],
    popular: true
  },
  {
    name: 'premium',
    title: 'Premium',
    price: 18,
    icon: Shield,
    features: [
      'Everything in Pro',
      'Sell Products with Pi',
      'Priority Support',
      'Custom CSS',
      'API Access',
      '99+ Exclusive Templates',
      'White-label Option',
      'Historical Analytics',
      'Team Access',
      'Data Export'
    ],
    popular: false
  }
];

const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose,
  feature,
  currentPlan,
  onUpgrade,
  processingPayment
}) => {
  const getFeatureRequirement = (featureName: string) => {
    switch (featureName) {
      case 'analytics':
      case 'qr_codes':
      case 'pi_tips':
      case 'pi_domain':
      case 'custom_themes':
        return 'basic';
      case 'product_sales':
      case 'store':
      case 'advanced_analytics':
      case 'seo_tools':
      case 'scheduling':
      case 'email_capture':
      case 'location_analytics':
      case 'branding_removal':
        return 'pro';
      case 'api_access':
      case 'custom_css':
      case 'team_access':
      case 'data_export':
      case 'priority_support':
      case 'whitelabel':
        return 'premium';
      default:
        return 'basic';
    }
  };

  const requiredPlan = feature ? getFeatureRequirement(feature) : 'basic';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <span>Upgrade Your Plan</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Feature Requirement */}
          {feature && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {feature.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} requires {requiredPlan} plan or higher
                </span>
              </div>
            </div>
          )}

          {/* Current Plan Status */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">Current Plan:</span>
                <span className="ml-2 font-medium capitalize">{currentPlan}</span>
              </div>
              {currentPlan !== 'free' && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  Active
                </Badge>
              )}
            </div>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const isCurrentPlan = currentPlan === plan.name;
              const isUpgradeable = currentPlan === 'free' || 
                (currentPlan === 'basic' && plan.name !== 'basic') ||
                (currentPlan === 'pro' && plan.name === 'premium');

              return (
                <Card key={plan.name} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-500 text-white">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Icon className="h-6 w-6 text-blue-600" />
                      <CardTitle className="text-xl">{plan.title}</CardTitle>
                    </div>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">π/month</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Check className="h-4 w-4 text-green-500" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : "default"}
                      disabled={isCurrentPlan || !isUpgradeable || processingPayment}
                      onClick={() => onUpgrade(plan.name)}
                    >
                      {processingPayment ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : isCurrentPlan ? (
                        'Current Plan'
                      ) : !isUpgradeable ? (
                        'Downgrade Not Available'
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Upgrade to {plan.title}</span>
                        </div>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Test Mode Notice */}
          {(import.meta.env.DEV || import.meta.env.VITE_PI_SANDBOX === 'true') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-800 font-medium">🧪 Test Mode</span>
                <span className="text-yellow-600 text-sm">
                  Mock payments are enabled for testing. No real charges will be made.
                </span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanUpgradeModal;
