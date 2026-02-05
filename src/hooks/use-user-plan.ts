
import { useUser } from '@/context/UserContext';

export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'premium';

export const useUserPlan = () => {
  const { 
    isLoggedIn, 
    subscription, 
    isLoading, 
    profile, 
    showAds,
    isAdmin,
    currentPlan
  } = useUser();

  // Use currentPlan from UserContext
  let plan: SubscriptionPlan = currentPlan || 'free';
  
  if (isAdmin) {
    plan = 'premium'; // Admin users get premium plan by default
  }
  
  const subscriptionEnd = subscription?.expires_at ? new Date(subscription.expires_at) : null;
  const username = profile?.username || null;

  // Updated limitations to match demo features exactly
  const limits = {
    // Link limits
    maxLinks: plan === 'free' ? 1 : Infinity, // Free: 1 link only, others: unlimited
    maxSocialProfiles: plan === 'free' ? 1 : Infinity,
    
    // Template limits (matching demo)
    maxTemplates: plan === 'free' ? 3 : plan === 'basic' ? 33 : plan === 'pro' ? 66 : 99,
    
    // Pi Network features
    canWithdrawTips: plan !== 'free', // Only paid plans can withdraw tips
    hasPiDomain: plan !== 'free', // .pi domain only for paid plans
    hasPiTips: plan !== 'free', // Pi tips for paid plans
    
    // Analytics features
    hasAnalytics: plan !== 'free', // Basic analytics for paid plans
    hasAdvancedAnalytics: plan === 'pro' || plan === 'premium', // Advanced analytics for Pro+
    
    // QR Codes
    hasQRCode: plan !== 'free', // QR codes for paid plans
    
    // Customization features
    hasCustomThemes: plan !== 'free', // Custom themes for paid plans
    hasCustomCSS: plan === 'premium', // Custom CSS only for Premium
    hasBrandingRemoval: plan === 'pro' || plan === 'premium', // Remove branding for Pro+
    
    // Product sales
    hasDigitalStore: plan === 'pro' || plan === 'premium', // Product sales for Pro+
    
    // Advanced features
    hasScheduling: plan === 'pro' || plan === 'premium', // Link scheduling for Pro+
    hasSEOTools: plan === 'pro' || plan === 'premium', // SEO tools for Pro+
    hasEmailCapture: plan === 'pro' || plan === 'premium', // Email capture for Pro+
    hasLocationAnalytics: plan === 'pro' || plan === 'premium', // Location analytics for Pro+
    
    // Premium features
    hasAPIAccess: plan === 'premium', // API access only for Premium
    hasTeamAccess: plan === 'premium', // Team access only for Premium
    hasDataExport: plan === 'premium', // Data export only for Premium
    hasPrioritySupport: plan === 'premium', // Priority support only for Premium
    hasWhitelabel: plan === 'premium', // Whitelabel only for Premium
    
    // Support features
    hasEmailSupport: plan !== 'free', // Email support for paid plans
    hasCommunitySupport: true, // All plans have community support
    
    // Ads and branding
    showDroplinkBadge: plan === 'free', // Badge required on free accounts
    showAds: plan === 'free', // Ads only on free plan
    
    // Template access
    hasTemplatePreview: true, // All users can preview all templates
    canUseTemplate: (templateTier: string) => {
      // Template access based on plan
      if (plan === 'free') return templateTier === 'free';
      if (plan === 'basic') return ['free', 'basic'].includes(templateTier);
      if (plan === 'pro') return ['free', 'basic', 'pro'].includes(templateTier);
      return true; // premium gets all templates
    },
    
    // Additional features from demo
    hasCustomButtonStyles: plan !== 'free', // Custom button styles for paid plans
    hasLinkAnimations: plan !== 'free', // Link animations for paid plans
    hasSpotlightLinks: plan === 'pro' || plan === 'premium', // Spotlight links for Pro+
    hasPerformanceAnalytics: plan === 'pro' || plan === 'premium', // Performance analytics for Pro+
    hasEmailPhoneCollection: plan === 'pro' || plan === 'premium', // Email/phone collection for Pro+
    hasCommunityRewards: plan === 'pro' || plan === 'premium', // Community rewards for Pro+
    hasMultiFactorAuth: plan === 'pro' || plan === 'premium', // MFA for Pro+
    hasHistoricalInsights: plan === 'premium', // Historical insights only for Premium
    hasAdvancedPiPayments: plan === 'premium', // Advanced Pi payments only for Premium
    hasCommunityContributorStatus: plan === 'premium', // Community contributor status only for Premium
    hasTailoredOnboarding: plan === 'premium', // Tailored onboarding only for Premium
    hasBookingSystem: plan === 'premium', // Booking system only for Premium
    hasGroupAccess: plan === 'pro' || plan === 'premium', // Group access for Pro+
    hasAutomations: plan === 'premium', // Automations only for Premium
    hasFileUploads: plan === 'premium', // File uploads only for Premium
    hasMultiLanguage: plan === 'pro' || plan === 'premium', // Multi-language for Pro+
    hasAdvancedSEO: plan === 'pro' || plan === 'premium', // Advanced SEO for Pro+
    hasPasswordProtection: plan === 'pro' || plan === 'premium', // Password protection for Pro+
    hasCustomDomain: plan !== 'free', // Custom domain for paid plans
    canUsePiAdNetwork: plan === 'free' || plan === 'basic', // Pi ads for free and basic
  };

  return {
    isLoggedIn,
    plan,
    username,
    subscriptionEnd,
    isLoading,
    showAds,
    limits
  };
};

export default useUserPlan;
