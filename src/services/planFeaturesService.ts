export type PlanType = 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM';

export interface PlanFeatures {
  // Basic Features
  links: number | 'unlimited';
  templates: number;
  showAds: boolean;
  showDroplinkBadge: boolean;
  
  // Pi Network Features
  showPiTips: boolean;
  showPiDomain: boolean;
  showProductSales: boolean;
  
  // Analytics & Tracking
  analytics: boolean;
  advancedAnalytics: boolean;
  locationAnalytics: boolean;
  historicalAnalytics: boolean;
  
  // Customization
  customThemes: boolean;
  customCSS: boolean;
  brandingRemoval: boolean;
  
  // Tools & Features
  qrCode: boolean;
  scheduling: boolean;
  seo: boolean;
  emailCapture: boolean;
  
  // Advanced Features
  apiAccess: boolean;
  teamAccess: boolean;
  dataExport: boolean;
  prioritySupport: boolean;
  whiteLabel: boolean;
}

export interface PlanConfig {
  id: PlanType;
  name: string;
  price: number;
  currency: 'π';
  icon: string;
  color: string;
  badgeEmoji: string;
  features: PlanFeatures;
  limitations: string[];
}

export const PLAN_CONFIGS: Record<PlanType, PlanConfig> = {
  FREE: {
    id: 'FREE',
    name: 'Free',
    price: 0,
    currency: 'π',
    icon: '⭐',
    color: 'bg-gray-500',
    badgeEmoji: '❤️',
    features: {
      links: 1,
      templates: 3,
      showAds: true,
      showDroplinkBadge: true,
      showPiTips: false,
      showPiDomain: false,
      showProductSales: false,
      analytics: false,
      advancedAnalytics: false,
      locationAnalytics: false,
      historicalAnalytics: false,
      customThemes: false,
      customCSS: false,
      brandingRemoval: false,
      qrCode: false,
      scheduling: false,
      seo: false,
      emailCapture: false,
      apiAccess: false,
      teamAccess: false,
      dataExport: false,
      prioritySupport: false,
      whiteLabel: false,
    },
    limitations: [
      'No .pi Domain',
      'No Pi Tips',
      'No Analytics',
      'No QR Codes',
      'No Custom Themes',
      'Ads displayed'
    ]
  },
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    price: 8,
    currency: 'π',
    icon: '⚡',
    color: 'bg-blue-500',
    badgeEmoji: '⚡',
    features: {
      links: 'unlimited',
      templates: 33,
      showAds: false,
      showDroplinkBadge: false,
      showPiTips: true,
      showPiDomain: true,
      showProductSales: false,
      analytics: true,
      advancedAnalytics: false,
      locationAnalytics: false,
      historicalAnalytics: false,
      customThemes: true,
      customCSS: false,
      brandingRemoval: false,
      qrCode: true,
      scheduling: false,
      seo: false,
      emailCapture: false,
      apiAccess: false,
      teamAccess: false,
      dataExport: false,
      prioritySupport: false,
      whiteLabel: false,
    },
    limitations: [
      'No Product Sales',
      'No Link Scheduling',
      'No SEO Tools',
      'No Email Capture'
    ]
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    price: 12,
    currency: 'π',
    icon: '👑',
    color: 'bg-purple-500',
    badgeEmoji: '👑',
    features: {
      links: 'unlimited',
      templates: 66,
      showAds: false,
      showDroplinkBadge: false,
      showPiTips: true,
      showPiDomain: true,
      showProductSales: true,
      analytics: true,
      advancedAnalytics: true,
      locationAnalytics: true,
      historicalAnalytics: false,
      customThemes: true,
      customCSS: false,
      brandingRemoval: true,
      qrCode: true,
      scheduling: true,
      seo: true,
      emailCapture: true,
      apiAccess: false,
      teamAccess: false,
      dataExport: false,
      prioritySupport: false,
      whiteLabel: false,
    },
    limitations: [
      'No Custom CSS',
      'No API Access',
      'Basic Support'
    ]
  },
  PREMIUM: {
    id: 'PREMIUM',
    name: 'Premium',
    price: 18,
    currency: 'π',
    icon: '💎',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    badgeEmoji: '💎',
    features: {
      links: 'unlimited',
      templates: 99,
      showAds: false,
      showDroplinkBadge: false,
      showPiTips: true,
      showPiDomain: true,
      showProductSales: true,
      analytics: true,
      advancedAnalytics: true,
      locationAnalytics: true,
      historicalAnalytics: true,
      customThemes: true,
      customCSS: true,
      brandingRemoval: true,
      qrCode: true,
      scheduling: true,
      seo: true,
      emailCapture: true,
      apiAccess: true,
      teamAccess: true,
      dataExport: true,
      prioritySupport: true,
      whiteLabel: true,
    },
    limitations: []
  }
};

export const getPlanConfig = (plan: PlanType): PlanConfig => {
  return PLAN_CONFIGS[plan];
};

export const hasFeature = (plan: PlanType, feature: keyof PlanFeatures): boolean => {
  return PLAN_CONFIGS[plan].features[feature];
};

export const getAvailableTemplates = (plan: PlanType): number => {
  return PLAN_CONFIGS[plan].features.templates;
};

export const canAddLink = (plan: PlanType, currentLinks: number): boolean => {
  const planConfig = PLAN_CONFIGS[plan];
  if (planConfig.features.links === 'unlimited') return true;
  return currentLinks < planConfig.features.links;
};

export const getUpgradePlan = (currentPlan: PlanType): PlanType | null => {
  const planOrder: PlanType[] = ['FREE', 'STARTER', 'PRO', 'PREMIUM'];
  const currentIndex = planOrder.indexOf(currentPlan);
  return currentIndex < planOrder.length - 1 ? planOrder[currentIndex + 1] : null;
};

export const getPlanPrice = (plan: PlanType): string => {
  const config = PLAN_CONFIGS[plan];
  return `${config.price}${config.currency}`;
};

export const getPlanDescription = (plan: PlanType): string => {
  const descriptions = {
    FREE: 'Perfect for getting started with basic link sharing',
    STARTER: 'Great for creators who want .pi domains, unlimited links and Pi tips',
    PRO: 'Ideal for serious creators who want to sell digital products and get advanced analytics',
    PREMIUM: 'Best for businesses wanting to sell products and get full customization'
  };
  return descriptions[plan];
};
