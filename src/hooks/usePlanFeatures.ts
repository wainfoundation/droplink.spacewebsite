import { useUser } from '@/context/UserContext';

export interface PlanFeatures {
  maxLinks: number;
  hasPiDomain: boolean;
  hasPiTips: boolean;
  showAds: boolean;
  templateCount: number;
  hasQRCode: boolean;
  hasAnalytics: boolean;
  hasDigitalProducts: boolean;
  hasAdvancedAnalytics: boolean;
  hasSEOTools: boolean;
  hasPrioritySupport: boolean;
  hasCustomThemes: boolean;
}

export const usePlanFeatures = () => {
  const { currentPlan } = useUser();

  const getPlanFeatures = (plan: string): PlanFeatures => {
    switch (plan) {
      case 'free':
        return {
          maxLinks: 1,
          hasPiDomain: false,
          hasPiTips: false,
          showAds: true,
          templateCount: 3,
          hasQRCode: false,
          hasAnalytics: false,
          hasDigitalProducts: false,
          hasAdvancedAnalytics: false,
          hasSEOTools: false,
          hasPrioritySupport: false,
          hasCustomThemes: false,
        };
      
      case 'starter':
        return {
          maxLinks: -1, // Unlimited
          hasPiDomain: true,
          hasPiTips: true,
          showAds: false,
          templateCount: 33,
          hasQRCode: true,
          hasAnalytics: true,
          hasDigitalProducts: false,
          hasAdvancedAnalytics: false,
          hasSEOTools: false,
          hasPrioritySupport: false,
          hasCustomThemes: false,
        };
      
      case 'pro':
        return {
          maxLinks: -1, // Unlimited
          hasPiDomain: true,
          hasPiTips: true,
          showAds: false,
          templateCount: 66,
          hasQRCode: true,
          hasAnalytics: true,
          hasDigitalProducts: true,
          hasAdvancedAnalytics: true,
          hasSEOTools: true,
          hasPrioritySupport: true,
          hasCustomThemes: true,
        };
      
      default:
        return {
          maxLinks: 1,
          hasPiDomain: false,
          hasPiTips: false,
          showAds: true,
          templateCount: 3,
          hasQRCode: false,
          hasAnalytics: false,
          hasDigitalProducts: false,
          hasAdvancedAnalytics: false,
          hasSEOTools: false,
          hasPrioritySupport: false,
          hasCustomThemes: false,
        };
    }
  };

  const features = getPlanFeatures(currentPlan || 'free');

  const canAddLink = (currentLinkCount: number): boolean => {
    if (features.maxLinks === -1) return true; // Unlimited
    return currentLinkCount < features.maxLinks;
  };

  const canUseFeature = (feature: keyof PlanFeatures): boolean => {
    return features[feature] === true;
  };

  const getUpgradeMessage = (feature: keyof PlanFeatures): string => {
    const planName = currentPlan === 'free' ? 'Starter' : 'Pro';
    const featureNames: Record<keyof PlanFeatures, string> = {
      maxLinks: 'unlimited links',
      hasPiDomain: '.pi domain access',
      hasPiTips: 'Pi tips',
      showAds: 'ad-free experience',
      templateCount: 'more templates',
      hasQRCode: 'QR code generation',
      hasAnalytics: 'analytics',
      hasDigitalProducts: 'digital product sales',
      hasAdvancedAnalytics: 'advanced analytics',
      hasSEOTools: 'SEO tools',
      hasPrioritySupport: 'priority support',
      hasCustomThemes: 'custom themes',
    };

    return `Upgrade to ${planName} plan to access ${featureNames[feature]}`;
  };

  const getFeatureLimit = (feature: keyof PlanFeatures): number | string => {
    switch (feature) {
      case 'maxLinks':
        return features.maxLinks === -1 ? 'Unlimited' : features.maxLinks;
      case 'templateCount':
        return features.templateCount;
      default:
        return features[feature] ? 'Available' : 'Not Available';
    }
  };

  return {
    features,
    currentPlan: currentPlan || 'free',
    canAddLink,
    canUseFeature,
    getUpgradeMessage,
    getFeatureLimit,
  };
};

export default usePlanFeatures;
