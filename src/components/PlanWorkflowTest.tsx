import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Crown, Zap, Star, Loader2, Settings } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import FeatureRestriction from './FeatureRestriction';

const PlanWorkflowTest = () => {
  const { user, currentPlan, refreshUserData } = useUser();
  const { features, canUseFeature, getUpgradeMessage } = usePlanFeatures();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isTesting, setIsTesting] = useState(false);

  const testFeatures = [
    { key: 'maxLinks', name: 'Link Limit', description: 'Maximum number of links allowed' },
    { key: 'hasPiDomain', name: '.pi Domain', description: 'Access to custom .pi domains' },
    { key: 'hasPiTips', name: 'Pi Tips', description: 'Accept Pi tips from followers' },
    { key: 'showAds', name: 'Ads Display', description: 'Show Pi ads to users' },
    { key: 'templateCount', name: 'Templates', description: 'Number of available templates' },
    { key: 'hasQRCode', name: 'QR Codes', description: 'Generate QR codes for links' },
    { key: 'hasAnalytics', name: 'Analytics', description: 'Basic analytics and insights' },
    { key: 'hasDigitalProducts', name: 'Digital Products', description: 'Sell digital products' },
    { key: 'hasAdvancedAnalytics', name: 'Advanced Analytics', description: 'Advanced analytics features' },
    { key: 'hasSEOTools', name: 'SEO Tools', description: 'Search engine optimization tools' },
    { key: 'hasPrioritySupport', name: 'Priority Support', description: 'Priority customer support' },
    { key: 'hasCustomThemes', name: 'Custom Themes', description: 'Custom theme customization' }
  ];

  const handleTestFeature = (featureKey: string) => {
    const feature = testFeatures.find(f => f.key === featureKey);
    if (!feature) return;

    if (canUseFeature(featureKey as keyof typeof features)) {
      toast({
        title: "Feature Available",
        description: `${feature.name} is available on your ${currentPlan} plan.`,
      });
    } else {
      toast({
        title: "Feature Locked",
        description: getUpgradeMessage(featureKey as keyof typeof features),
        variant: "destructive",
      });
    }
  };

  const handleUpgrade = (planId: string) => {
    navigate('/auth', { state: { selectedPlan: planId } });
  };

  const runCompleteTest = async () => {
    setIsTesting(true);
    
    try {
      // Test all features
      for (const feature of testFeatures) {
        await new Promise(resolve => setTimeout(resolve, 200));
        handleTestFeature(feature.key);
      }
      
      toast({
        title: "Test Complete",
        description: "All plan features have been tested successfully.",
      });
    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Some features failed to test properly.",
        variant: "destructive",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getFeatureIcon = (featureKey: string) => {
    if (canUseFeature(featureKey as keyof typeof features)) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getFeatureStatus = (featureKey: string) => {
    if (canUseFeature(featureKey as keyof typeof features)) {
      return 'Available';
    }
    return 'Locked';
  };

  const getFeatureColor = (featureKey: string) => {
    if (canUseFeature(featureKey as keyof typeof features)) {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Plan Workflow Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Current Plan Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Current Plan</div>
                  <div className="text-2xl font-bold capitalize">{currentPlan || 'free'}</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Available Features</div>
                  <div className="text-2xl font-bold text-green-600">
                    {testFeatures.filter(f => canUseFeature(f.key as keyof typeof features)).length}
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-sm text-gray-600">Locked Features</div>
                  <div className="text-2xl font-bold text-red-600">
                    {testFeatures.filter(f => !canUseFeature(f.key as keyof typeof features)).length}
                  </div>
                </div>
              </Card>
            </div>

            {/* Feature Tests */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Feature Tests</h3>
                <Button 
                  onClick={runCompleteTest} 
                  disabled={isTesting}
                  variant="outline"
                >
                  {isTesting ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testing...
                    </div>
                  ) : (
                    'Test All Features'
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testFeatures.map((feature) => (
                  <Card key={feature.key} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getFeatureIcon(feature.key)}
                        <span className="font-medium">{feature.name}</span>
                      </div>
                      <Badge className={getFeatureColor(feature.key)}>
                        {getFeatureStatus(feature.key)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleTestFeature(feature.key)}
                    >
                      Test Feature
                    </Button>
                  </Card>
                ))}
              </div>
            </div>

            {/* Feature Restrictions Demo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Feature Restrictions Demo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pi Domain Feature */}
                <FeatureRestriction
                  feature="pi-domain"
                  currentPlan={currentPlan || 'free'}
                  requiredPlan="starter"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>.pi Domain Setup</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>This feature is available for Starter and Pro plans.</p>
                    </CardContent>
                  </Card>
                </FeatureRestriction>

                {/* Digital Products Feature */}
                <FeatureRestriction
                  feature="digital-products"
                  currentPlan={currentPlan || 'free'}
                  requiredPlan="pro"
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Digital Product Sales</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>This feature is available for Pro plan only.</p>
                    </CardContent>
                  </Card>
                </FeatureRestriction>
              </div>
            </div>

            {/* Upgrade Options */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Upgrade Options</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentPlan !== 'starter' && currentPlan !== 'pro' && (
                  <Card className="p-6 border-2 border-blue-200 bg-blue-50">
                    <div className="text-center">
                      <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <h4 className="text-lg font-semibold">Upgrade to Starter</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Get unlimited links, .pi domains, and Pi tips
                      </p>
                      <Button 
                        onClick={() => handleUpgrade('starter')}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                      >
                        Upgrade to Starter - 5 π
                      </Button>
                    </div>
                  </Card>
                )}
                
                {currentPlan !== 'pro' && (
                  <Card className="p-6 border-2 border-purple-200 bg-purple-50">
                    <div className="text-center">
                      <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <h4 className="text-lg font-semibold">Upgrade to Pro</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Get everything plus digital products and advanced features
                      </p>
                      <Button 
                        onClick={() => handleUpgrade('pro')}
                        className="w-full bg-purple-600 hover:bg-purple-700"
                      >
                        Upgrade to Pro - 15 π
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Current Plan Benefits */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Current Plan Benefits</h3>
              
              <Alert>
                <AlertDescription>
                  <strong>Plan:</strong> {currentPlan || 'free'} | 
                  <strong> Features Available:</strong> {testFeatures.filter(f => canUseFeature(f.key as keyof typeof features)).length} / {testFeatures.length}
                </AlertDescription>
              </Alert>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Available Features:</h4>
                  <ul className="space-y-1">
                    {testFeatures
                      .filter(f => canUseFeature(f.key as keyof typeof features))
                      .map((feature) => (
                        <li key={feature.key} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Locked Features:</h4>
                  <ul className="space-y-1">
                    {testFeatures
                      .filter(f => !canUseFeature(f.key as keyof typeof features))
                      .map((feature) => (
                        <li key={feature.key} className="flex items-center gap-2 text-sm">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <span>{feature.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanWorkflowTest;
