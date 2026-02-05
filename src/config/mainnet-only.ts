/**
 * Mainnet-Only Configuration
 * This file enforces mainnet-only operation for Droplink
 */

// Force mainnet-only environment
export const MAINNET_ONLY_CONFIG = {
  // Environment Enforcement
  FORCE_MAINNET: true,
  FORCE_PRODUCTION: true,
  DISABLE_DEVELOPMENT: true,
  DISABLE_TESTNET: true,
  DISABLE_SANDBOX: true,

  // Pi Network Mainnet Settings
  PI_NETWORK_MODE: 'mainnet',
  PI_SDK_SANDBOX: false,
  PI_SDK_MAINNET: true,
  PI_API_BASE_URL: 'https://api.minepi.com',
  PI_SDK_URL: 'https://sdk.minepi.com/pi-sdk.js',

  // Environment Detection Override
  isDevelopment: () => false,
  isProduction: () => true,
  isSandbox: () => false,
  isTestnet: () => false,
  isMainnet: () => true,

  // API Endpoints - Mainnet Only
  API_ENDPOINTS: {
    PI_API: 'https://api.minepi.com/v2',
    PI_BROWSER: 'https://minepi.com/browser/open',
    PI_SDK: 'https://sdk.minepi.com/pi-sdk.js',
    SUPABASE: 'https://jzzbmoopwnvgxxirulga.supabase.co'
  },

  // Domain Configuration - Mainnet Only
  DOMAINS: {
    PRIMARY: 'droplink.space',
    PI_DOMAIN: 'droplink2920.pinet.com',
    SUBDOMAIN: 'droplink2920',
    ALLOWED_ORIGINS: [
      'https://droplink2920.pinet.com',
      'https://droplink.space',
      'https://*.droplink.space',
      'https://*.pinet.com',
      'https://*.minepi.com',
      'https://pinet.com',
      'https://minepi.com',
      'https://droplink.space',
      'https://www.droplink.space'
    ],
    // Pi Browser specific domains
    PI_BROWSER_DOMAINS: [
      'droplink2920.pinet.com',
      '*.pinet.com',
      '*.minepi.com'
    ],
    // Production domains
    PRODUCTION_DOMAINS: [
      'droplink.space',
      'www.droplink.space',
      '*.droplink.space'
    ]
  },

  // Feature Flags - Mainnet Only
  FEATURES: {
    ENABLE_PI_PAYMENTS: true,
    ENABLE_PI_ADS: true,
    ENABLE_PI_PROFILES: true,
    ENABLE_LINK_MANAGEMENT: true,
    ENABLE_ANALYTICS: true,
    ENABLE_DEBUG: false,
    ENABLE_TESTNET_FEATURES: false,
    ENABLE_SANDBOX_FEATURES: false
  },

  // Security Settings - Mainnet Only
  SECURITY: {
    FORCE_HTTPS: true,
    REQUIRE_PI_BROWSER: false, // Allow all browsers but optimize for Pi
    VALIDATE_ORIGINS: true,
    ENFORCE_CSP: true,
    BLOCK_MIXED_CONTENT: true
  }
};

// Environment validation function
export const validateMainnetOnly = () => {
  const errors = [];
  
  // Check if any development/testnet flags are enabled
  if (import.meta.env.DEV) {
    errors.push('Development mode detected - forcing production mode');
  }
  
  if (import.meta.env.VITE_PI_SANDBOX === 'true') {
    errors.push('Sandbox mode detected - forcing mainnet mode');
  }
  
  if (import.meta.env.VITE_PI_NETWORK === 'testnet') {
    errors.push('Testnet mode detected - forcing mainnet mode');
  }

  return {
    isValid: true, // Always valid since we force mainnet
    errors,
    environment: 'PRODUCTION_MAINNET_ONLY'
  };
};

// Get environment info - always returns mainnet
export const getEnvironmentInfo = () => {
  return {
    mode: 'PRODUCTION',
    network: 'MAINNET',
    sandbox: false,
    testnet: false,
    development: false,
    production: true,
    mainnet: true
  };
};

// Log mainnet-only status
export const logMainnetOnlyStatus = () => {
  console.log('=== DROPLINK MAINNET-ONLY CONFIGURATION ===');
  console.log('Environment: PRODUCTION MAINNET ONLY');
  console.log('Network: MAINNET');
  console.log('Sandbox: DISABLED');
  console.log('Testnet: DISABLED');
  console.log('Development: DISABLED');
  console.log('Production: ENABLED');
  console.log('Mainnet: ENABLED');
  console.log('==========================================');
};

// Export default configuration
export default MAINNET_ONLY_CONFIG;
