/**
 * Production Configuration for Droplink
 * Pi Network Mainnet Integration
 */

export const PRODUCTION_CONFIG = {
  // Pi Network Production Credentials
  PI_NETWORK: {
    API_KEY: "jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno",
    APP_ID: "droplink",
    VALIDATION_KEY: "7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a",
    API_BASE_URL: "https://api.minepi.com",
    SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
    SDK_VERSION: "2.0",
    SANDBOX: false, // Force mainnet
  },

  // Domain Configuration
  DOMAINS: {
    PRIMARY: "droplink.space",
    PI_DOMAIN: "droplink2920.pinet.com",
    SUBDOMAIN: "droplink2920",
    PRODUCTION_URL: "https://droplink.space",
    PI_BROWSER_URL: "https://droplink2920.pinet.com",
  },

  // Environment Settings
  ENVIRONMENT: {
    NODE_ENV: "production",
    IS_PRODUCTION: true,
    IS_SANDBOX: false,
    IS_DEVELOPMENT: false,
  },

  // Pi Browser Configuration
  PI_BROWSER: {
    REQUIRED: true,
    REDIRECT_URL: "https://droplink2920.pinet.com",
    DOWNLOAD_URL: "https://minepi.com/download",
    SUPPORTED_FEATURES: [
      "authentication",
      "payments",
      "wallet_address",
      "ads"
    ],
  },

  // Security Configuration
  SECURITY: {
    HTTPS_REQUIRED: true,
    CSP_ENABLED: true,
    XSS_PROTECTION: true,
    CONTENT_TYPE_OPTIONS: "nosniff",
    FRAME_OPTIONS: "DENY",
    REFERRER_POLICY: "strict-origin-when-cross-origin",
  },

  // Mobile Optimization
  MOBILE: {
    VIEWPORT_OPTIMIZATION: true,
    TOUCH_OPTIMIZATION: true,
    ZOOM_PREVENTION: true,
    HYDRATION_DELAY: 200, // ms
  },

  // Performance Configuration
  PERFORMANCE: {
    LAZY_LOADING: true,
    CODE_SPLITTING: true,
    CACHE_STRATEGY: "aggressive",
    PRELOAD_CRITICAL_RESOURCES: true,
  },

  // Analytics and Monitoring
  ANALYTICS: {
    ENABLED: true,
    ERROR_TRACKING: true,
    PERFORMANCE_MONITORING: true,
    USER_BEHAVIOR_TRACKING: true,
  },
};

// Helper functions for production environment
export const isProduction = () => PRODUCTION_CONFIG.ENVIRONMENT.IS_PRODUCTION;
export const isPiBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('pibrowser') || 
         userAgent.includes('pi network') || 
         userAgent.includes('pi-browser') ||
         window.location.href.includes('minepi.com') ||
         window.location.href.includes('pinet.com');
};

export const getPiConfig = () => ({
  apiKey: PRODUCTION_CONFIG.PI_NETWORK.API_KEY,
  appId: PRODUCTION_CONFIG.PI_NETWORK.APP_ID,
  validationKey: PRODUCTION_CONFIG.PI_NETWORK.VALIDATION_KEY,
  apiBaseUrl: PRODUCTION_CONFIG.PI_NETWORK.API_BASE_URL,
  sdkUrl: PRODUCTION_CONFIG.PI_NETWORK.SDK_URL,
  sdkVersion: PRODUCTION_CONFIG.PI_NETWORK.SDK_VERSION,
  sandbox: PRODUCTION_CONFIG.PI_NETWORK.SANDBOX,
});

export const getDomainConfig = () => ({
  primary: PRODUCTION_CONFIG.DOMAINS.PRIMARY,
  piDomain: PRODUCTION_CONFIG.DOMAINS.PI_DOMAIN,
  subdomain: PRODUCTION_CONFIG.DOMAINS.SUBDOMAIN,
  productionUrl: PRODUCTION_CONFIG.DOMAINS.PRODUCTION_URL,
  piBrowserUrl: PRODUCTION_CONFIG.DOMAINS.PI_BROWSER_URL,
});

export default PRODUCTION_CONFIG;
