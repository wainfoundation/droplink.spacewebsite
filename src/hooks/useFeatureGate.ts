
import { useUserPlan } from "@/hooks/use-user-plan";

export const useFeatureGate = () => {
  const { plan, limits } = useUserPlan();

  const hasFeatureAccess = (feature: string): boolean => {
    const featureMap: Record<string, boolean> = {
      // Link features
      'unlimited_links': limits.maxLinks === Infinity,
      'link_animations': limits.hasLinkAnimations,
      'spotlight_links': limits.hasSpotlightLinks,
      
      // Pi Network features
      'pi_tips': limits.hasPiTips,
      'pi_domain': limits.hasPiDomain,
      'pi_ad_network': limits.canUsePiAdNetwork,
      
      // Analytics features
      'analytics': limits.hasAnalytics,
      'advanced_analytics': limits.hasAdvancedAnalytics,
      'location_analytics': limits.hasLocationAnalytics,
      'performance_analytics': limits.hasPerformanceAnalytics,
      'historical_insights': limits.hasHistoricalInsights,
      
      // QR Codes
      'qr_codes': limits.hasQRCode,
      
      // Customization features
      'custom_themes': limits.hasCustomThemes,
      'custom_css': limits.hasCustomCSS,
      'custom_button_styles': limits.hasCustomButtonStyles,
      'branding_removal': limits.hasBrandingRemoval,
      
      // Product sales
      'product_sales': limits.hasDigitalStore,
      'digital_store': limits.hasDigitalStore,
      'advanced_pi_payments': limits.hasAdvancedPiPayments,
      
      // Advanced features
      'scheduling': limits.hasScheduling,
      'seo_tools': limits.hasSEOTools,
      'advanced_seo': limits.hasAdvancedSEO,
      'email_capture': limits.hasEmailCapture,
      'email_phone_collection': limits.hasEmailPhoneCollection,
      
      // Premium features
      'api_access': limits.hasAPIAccess,
      'team_access': limits.hasTeamAccess,
      'data_export': limits.hasDataExport,
      'priority_support': limits.hasPrioritySupport,
      'whitelabel': limits.hasWhitelabel,
      
      // Security features
      'multi_factor_auth': limits.hasMultiFactorAuth,
      'password_protection': limits.hasPasswordProtection,
      
      // Additional features
      'file_uploads': limits.hasFileUploads,
      'multi_language': limits.hasMultiLanguage,
      'group_access': limits.hasGroupAccess,
      'automations': limits.hasAutomations,
      'booking_system': limits.hasBookingSystem,
      'community_rewards': limits.hasCommunityRewards,
      'community_contributor_status': limits.hasCommunityContributorStatus,
      'tailored_onboarding': limits.hasTailoredOnboarding,
      
      // Template access
      'template_preview': limits.hasTemplatePreview,
      
      // Support features
      'email_support': limits.hasEmailSupport,
      'community_support': limits.hasCommunitySupport,
      
      // Ads and branding
      'show_ads': limits.showAds,
      'show_droplink_badge': limits.showDroplinkBadge,
      
      // Legacy feature names for backward compatibility
      'link_shortener': limits.hasAdvancedSEO,
      'social_planner': limits.hasAutomations,
      'instagram_reply': limits.hasAutomations,
    };

    return featureMap[feature] || false;
  };

  const getRequiredPlan = (feature: string): string => {
    const featurePlanMap: Record<string, string> = {
      // Link features
      'unlimited_links': 'basic',
      'link_animations': 'basic',
      'spotlight_links': 'pro',
      
      // Pi Network features
      'pi_tips': 'basic',
      'pi_domain': 'basic',
      'pi_ad_network': 'free',
      
      // Analytics features
      'analytics': 'basic',
      'advanced_analytics': 'pro',
      'location_analytics': 'pro',
      'performance_analytics': 'pro',
      'historical_insights': 'premium',
      
      // QR Codes
      'qr_codes': 'basic',
      
      // Customization features
      'custom_themes': 'basic',
      'custom_css': 'premium',
      'custom_button_styles': 'basic',
      'branding_removal': 'pro',
      
      // Product sales
      'product_sales': 'pro',
      'digital_store': 'pro',
      'advanced_pi_payments': 'premium',
      
      // Advanced features
      'scheduling': 'pro',
      'seo_tools': 'pro',
      'advanced_seo': 'pro',
      'email_capture': 'pro',
      'email_phone_collection': 'pro',
      
      // Premium features
      'api_access': 'premium',
      'team_access': 'premium',
      'data_export': 'premium',
      'priority_support': 'premium',
      'whitelabel': 'premium',
      
      // Security features
      'multi_factor_auth': 'pro',
      'password_protection': 'pro',
      
      // Additional features
      'file_uploads': 'premium',
      'multi_language': 'pro',
      'group_access': 'pro',
      'automations': 'premium',
      'booking_system': 'premium',
      'community_rewards': 'pro',
      'community_contributor_status': 'premium',
      'tailored_onboarding': 'premium',
      
      // Template access
      'template_preview': 'free',
      
      // Support features
      'email_support': 'basic',
      'community_support': 'free',
      
      // Ads and branding
      'show_ads': 'free',
      'show_droplink_badge': 'free',
      
      // Legacy feature names for backward compatibility
      'link_shortener': 'pro',
      'social_planner': 'premium',
      'instagram_reply': 'premium',
    };

    return featurePlanMap[feature] || 'premium';
  };

  const checkFeatureAccess = (feature: string): { hasAccess: boolean; requiredPlan?: string } => {
    const hasAccess = hasFeatureAccess(feature);
    
    if (!hasAccess) {
      return {
        hasAccess: false,
        requiredPlan: getRequiredPlan(feature)
      };
    }

    return { hasAccess: true };
  };

  return {
    hasFeatureAccess,
    getRequiredPlan,
    checkFeatureAccess,
    currentPlan: plan,
    limits
  };
};
