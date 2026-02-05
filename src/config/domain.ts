// Domain configuration for Droplink
export const DOMAIN_CONFIG = {
  // Main domain
  MAIN_DOMAIN: 'droplink-space.lovable.app',
  
  // Development domain
  DEV_DOMAIN: 'localhost:2222',
  
  // Protocol
  PROTOCOL: import.meta.env.MODE === 'production' ? 'https' : 'http',
  
  // Get current domain
  getCurrentDomain: () => {
    if (typeof window !== 'undefined') {
      // Always use the current window location for dynamic domain detection
      return window.location.hostname;
    }
    // Fallback to configured domain
    return import.meta.env.MODE === 'production' ? DOMAIN_CONFIG.MAIN_DOMAIN : DOMAIN_CONFIG.DEV_DOMAIN;
  },
  
  // Get full URL
  getFullUrl: (path: string = '') => {
    const domain = DOMAIN_CONFIG.getCurrentDomain();
    const protocol = DOMAIN_CONFIG.PROTOCOL;
    // Ensure we use the correct protocol based on domain
    const urlProtocol = domain.includes('localhost') ? 'http' : 'https';
    return `${urlProtocol}://${domain}${path}`;
  },
  
  // Get profile URL
  getProfileUrl: (username: string) => {
    return DOMAIN_CONFIG.getFullUrl(`/${username}`);
  },
  
  // Get dashboard URL
  getDashboardUrl: () => {
    return DOMAIN_CONFIG.getFullUrl('/dashboard');
  },
  
  // Check if current domain is production
  isProduction: () => {
    return DOMAIN_CONFIG.getCurrentDomain() === DOMAIN_CONFIG.MAIN_DOMAIN;
  },
  
  // Check if current domain is development
  isDevelopment: () => {
    return DOMAIN_CONFIG.getCurrentDomain() === DOMAIN_CONFIG.DEV_DOMAIN;
  }
};

// SEO configuration
export const SEO_CONFIG = {
  SITE_NAME: 'Droplink',
  SITE_DESCRIPTION: 'Create beautiful link-in-bio pages for your Pi Network presence',
  SITE_KEYWORDS: 'link in bio, pi network, cryptocurrency, social media, links, profile',
  DEFAULT_OG_IMAGE: '/og-image.png',
  TWITTER_HANDLE: '@droplink',
  
  // Generate meta tags for profile
  generateProfileMeta: (profile: {
    username: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
  }) => {
    const title = `${profile.display_name || profile.username} - Droplink`;
    const description = profile.bio || `Check out ${profile.display_name || profile.username}'s links on Droplink`;
    const image = profile.avatar_url || DOMAIN_CONFIG.getFullUrl(SEO_CONFIG.DEFAULT_OG_IMAGE);
    const url = DOMAIN_CONFIG.getProfileUrl(profile.username);
    
    return {
      title,
      description,
      image,
      url,
      siteName: SEO_CONFIG.SITE_NAME,
      type: 'profile'
    };
  }
};

// Analytics configuration
export const ANALYTICS_CONFIG = {
  // Track profile views
  trackProfileView: async (profileId: string, metadata?: {
    userAgent?: string;
    referrer?: string;
    ipAddress?: string;
  }) => {
    try {
      const response = await fetch('/api/analytics/profile-view', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId,
          ...metadata
        })
      });
      
      if (!response.ok) {
        console.error('Failed to track profile view');
      }
    } catch (error) {
      console.error('Error tracking profile view:', error);
    }
  },
  
  // Track link clicks
  trackLinkClick: async (linkId: string, metadata?: {
    userAgent?: string;
    referrer?: string;
    ipAddress?: string;
  }) => {
    try {
      const response = await fetch('/api/analytics/link-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkId,
          ...metadata
        })
      });
      
      if (!response.ok) {
        console.error('Failed to track link click');
      }
    } catch (error) {
      console.error('Error tracking link click:', error);
    }
  }
};

export default DOMAIN_CONFIG;