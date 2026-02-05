import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, Crown, Zap, Star, ArrowRight } from 'lucide-react';
import { usePlanFeatures } from '@/hooks/usePlanFeatures';
import { useNavigate } from 'react-router-dom';

interface FeatureRestrictionProps {
  feature: string;
  currentPlan: string;
  requiredPlan: 'starter' | 'pro';
  children?: React.ReactNode;
  showUpgrade?: boolean;
}

const FeatureRestriction: React.FC<FeatureRestrictionProps> = ({
  feature,
  currentPlan,
  requiredPlan,
  children,
  showUpgrade = true
}) => {
  const { getUpgradeMessage } = usePlanFeatures();
  const navigate = useNavigate();

  const canAccess = () => {
    if (requiredPlan === 'starter') {
      return currentPlan === 'starter' || currentPlan === 'pro';
    }
    if (requiredPlan === 'pro') {
      return currentPlan === 'pro';
    }
    return false;
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'starter':
        return <Zap className="w-5 h-5 text-blue-600" />;
      case 'pro':
        return <Crown className="w-5 h-5 text-purple-600" />;
      default:
        return <Star className="w-5 h-5 text-gray-600" />;
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'starter':
        return 'bg-blue-100 text-blue-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (canAccess()) {
    return <>{children}</>;
  }

  return (
    <Card className="border-dashed border-2 border-gray-300 bg-gray-50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-2 w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
          <Lock className="w-6 h-6 text-gray-500" />
        </div>
        <CardTitle className="text-lg text-gray-700">Feature Locked</CardTitle>
        <p className="text-sm text-gray-600">
          This feature requires a {requiredPlan} plan or higher
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="text-xs">
            Current: {currentPlan}
          </Badge>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <Badge className={getPlanColor(requiredPlan)}>
            <div className="flex items-center gap-1">
              {getPlanIcon(requiredPlan)}
              {requiredPlan}
            </div>
          </Badge>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Upgrade Required:</strong> {getUpgradeMessage('hasPiDomain' as any)}
          </AlertDescription>
        </Alert>

        {showUpgrade && (
          <div className="space-y-2">
            <Button 
              className="w-full" 
              onClick={() => navigate('/dashboard', { state: { tab: 'plans' } })}
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to {requiredPlan === 'starter' ? 'Starter' : 'Pro'} Plan
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/auth', { state: { selectedPlan: requiredPlan } })}
            >
              View All Plans
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeatureRestriction;
