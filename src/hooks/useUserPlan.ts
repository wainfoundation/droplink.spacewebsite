import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';

export type PlanType = 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM';

export interface PlanFeatures {
  name: string;
  price: string;
  description: string;
  features: {
    templates: string;
    links: string;
    included: string[];
    limitations: string[];
  };
  limits: {
    maxLinks: number;
    maxTemplates: number;
    hasAnalytics: boolean;
    hasQrCodes: boolean;
    hasProductSales: boolean;
    hasCustomCss: boolean;
    hasAds: boolean;
    hasPiTips: boolean;
    hasCustomDomain: boolean;
  };
}

export const PLANS: Record<PlanType, PlanFeatures> = {
  FREE: {
    name: "Free Plan",
    price: "0π/month",
    description: "Perfect for getting started with basic link sharing",
    features: {
      templates: "3+",
      links: "1",
      included: [
        "1 Link Only",
        "Basic Profile",
        "Pi Ads Shown",
        "Droplink Badge",
        "3 Basic Templates"
      ],
      limitations: [
        "No .pi Domain",
        "No Pi Tips",
        "No Analytics",
        "No QR Codes",
        "No Custom Themes",
        "Ads displayed"
      ]
    },
    limits: {
      maxLinks: 1,
      maxTemplates: 3,
      hasAnalytics: false,
      hasQrCodes: false,
      hasProductSales: false,
      hasCustomCss: false,
      hasAds: true,
      hasPiTips: false,
      hasCustomDomain: false
    }
  },
  STARTER: {
    name: "Starter Plan",
    price: "10π/month (8π/year)",
    description: "Great for creators who want .pi domains, unlimited links and Pi tips",
    features: {
      templates: "33+",
      links: "∞",
      included: [
        "Unlimited Links",
        ".pi Domain Access",
        "Pi Tips Enabled",
        "No Ads",
        "QR Codes",
        "Basic Analytics",
        "Email Support",
        "33+ Templates",
        "Custom Button Styles"
      ],
      limitations: [
        "No Product Sales",
        "No Link Scheduling",
        "No SEO Tools",
        "No Email Capture"
      ]
    },
    limits: {
      maxLinks: Infinity,
      maxTemplates: 33,
      hasAnalytics: true,
      hasQrCodes: true,
      hasProductSales: false,
      hasCustomCss: false,
      hasAds: false,
      hasPiTips: true,
      hasCustomDomain: true
    }
  },
  PRO: {
    name: "Pro Plan",
    price: "20π/month (16π/year)",
    description: "Ideal for serious creators who want to sell digital products and get advanced analytics",
    features: {
      templates: "66+",
      links: "∞",
      included: [
        "Everything in Starter",
        "Digital Product Sales",
        "Advanced Analytics",
        "SEO Tools",
        "Link Scheduling",
        "Custom Themes",
        "66+ Premium Templates",
        "Email/Phone Collection",
        "Location Analytics",
        "Hide Droplink Branding"
      ],
      limitations: [
        "No Custom CSS",
        "No API Access",
        "Basic Support"
      ]
    },
    limits: {
      maxLinks: Infinity,
      maxTemplates: 66,
      hasAnalytics: true,
      hasQrCodes: true,
      hasProductSales: true,
      hasCustomCss: false,
      hasAds: false,
      hasPiTips: true,
      hasCustomDomain: true
    }
  },
  PREMIUM: {
    name: "Premium Plan",
    price: "30π/month (24π/year)",
    description: "Best for businesses wanting to sell products and get full customization",
    features: {
      templates: "99+",
      links: "∞",
      included: [
        "Everything in Pro",
        "Sell Products with Pi",
        "Priority Support",
        "Custom CSS",
        "API Access",
        "99+ Exclusive Templates",
        "White-label Option",
        "Historical Analytics",
        "Team Access",
        "Data Export"
      ],
      limitations: []
    },
    limits: {
      maxLinks: Infinity,
      maxTemplates: 99,
      hasAnalytics: true,
      hasQrCodes: true,
      hasProductSales: true,
      hasCustomCss: true,
      hasAds: false,
      hasPiTips: true,
      hasCustomDomain: true
    }
  }
};

export const useUserPlan = () => {
  const { user, profile } = useUser();
  const [currentPlan, setCurrentPlan] = useState<PlanType>('FREE');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserPlan = async () => {
      try {
        setIsLoading(true);
        
        // For demo purposes, we'll use FREE plan
        // In production, this would fetch from user's subscription data
        setCurrentPlan('FREE');
        
        // Mock loading delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('Error loading user plan:', error);
        setCurrentPlan('FREE');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserPlan();
    }
  }, [user]);

  const planFeatures = PLANS[currentPlan];
  const isFreePlan = currentPlan === 'FREE';
  const isStarterPlan = currentPlan === 'STARTER';
  const isProPlan = currentPlan === 'PRO';
  const isPremiumPlan = currentPlan === 'PREMIUM';

  const canAddLink = (currentLinkCount: number) => {
    return currentLinkCount < planFeatures.limits.maxLinks;
  };

  const canAccessAnalytics = () => {
    return planFeatures.limits.hasAnalytics;
  };

  const canUseQrCodes = () => {
    return planFeatures.limits.hasQrCodes;
  };

  const canSellProducts = () => {
    return planFeatures.limits.hasProductSales;
  };

  const canUseCustomCss = () => {
    return planFeatures.limits.hasCustomCss;
  };

  const hasAds = () => {
    return planFeatures.limits.hasAds;
  };

  const canUsePiTips = () => {
    return planFeatures.limits.hasPiTips;
  };

  const canUseCustomDomain = () => {
    return planFeatures.limits.hasCustomDomain;
  };

  const getUpgradePlan = (): PlanType | null => {
    switch (currentPlan) {
      case 'FREE':
        return 'STARTER';
      case 'STARTER':
        return 'PRO';
      case 'PRO':
        return 'PREMIUM';
      case 'PREMIUM':
        return null; // Already at highest tier
      default:
        return 'STARTER';
    }
  };

  const getUpgradePrice = (): string => {
    const upgradePlan = getUpgradePlan();
    if (!upgradePlan) return '';
    return PLANS[upgradePlan].price;
  };

  const getUpgradeFeatures = (): string[] => {
    const upgradePlan = getUpgradePlan();
    if (!upgradePlan) return [];
    
    const currentLimits = planFeatures.limits;
    const upgradeLimits = PLANS[upgradePlan].limits;
    
    const newFeatures: string[] = [];
    
    if (!currentLimits.hasAnalytics && upgradeLimits.hasAnalytics) {
      newFeatures.push('Advanced Analytics');
    }
    if (!currentLimits.hasQrCodes && upgradeLimits.hasQrCodes) {
      newFeatures.push('QR Codes');
    }
    if (!currentLimits.hasProductSales && upgradeLimits.hasProductSales) {
      newFeatures.push('Product Sales');
    }
    if (!currentLimits.hasCustomCss && upgradeLimits.hasCustomCss) {
      newFeatures.push('Custom CSS');
    }
    if (currentLimits.hasAds && !upgradeLimits.hasAds) {
      newFeatures.push('Remove Ads');
    }
    if (!currentLimits.hasPiTips && upgradeLimits.hasPiTips) {
      newFeatures.push('Pi Tips');
    }
    if (!currentLimits.hasCustomDomain && upgradeLimits.hasCustomDomain) {
      newFeatures.push('.pi Domain');
    }
    if (currentLimits.maxLinks === 1 && upgradeLimits.maxLinks === Infinity) {
      newFeatures.push('Unlimited Links');
    }
    
    return newFeatures;
  };

  return {
    currentPlan,
    planFeatures,
    isLoading,
    isFreePlan,
    isStarterPlan,
    isProPlan,
    isPremiumPlan,
    canAddLink,
    canAccessAnalytics,
    canUseQrCodes,
    canSellProducts,
    canUseCustomCss,
    hasAds,
    canUsePiTips,
    canUseCustomDomain,
    getUpgradePlan,
    getUpgradePrice,
    getUpgradeFeatures,
    PLANS
  };
}; 