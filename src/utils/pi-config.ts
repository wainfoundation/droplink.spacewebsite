/**
 * Pi Network Configuration - Complete Integration
 */

// Environment detection - Production mainnet mode
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const isSandbox = false; // Mainnet mode enabled
const isTesting = false; // Production mode - no testing

// Pi Network API Configuration
export const PI_CONFIG = {
  // API Endpoints - Dynamic based on environment
  API_BASE_URL: isSandbox ? "https://api.sandbox.minepi.com" : "https://api.minepi.com",
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",

  // Environment Settings - Mainnet mode
  isDevelopment: isDevelopment,
  isProduction: isProduction,
  isSandbox: isSandbox, // Mainnet mode enabled
  isTesting: isTesting, // Mainnet mode - no testing

  // Mainnet Credentials
  API_KEY: import.meta.env.VITE_PI_SERVER_API_KEY || "ycni5p8hs19mzihvyj5gldy5838kpcqyhd7faka6gxriakocpfpybqm5hpjyqcfx",
  APP_ID: import.meta.env.VITE_PI_APP_ID || 'droplink',
  VALIDATION_KEY: import.meta.env.VITE_PI_VALIDATION_KEY || "26ec4458680b98edc16b18ed68c2fb7841ee2c9d3b9cfdcfa82de36bea71f64074a2ee5d1fbea04762df431edb1458b44a2ff50679b16d93935b0b645e98174a",
  
  // Domain Configuration - Mainnet Mode
  DOMAIN: import.meta.env.VITE_APP_DOMAIN || "droplink.space",
  PI_DOMAIN: import.meta.env.VITE_APP_SUBDOMAIN || "droplink2920.pinet.com",
  SUBDOMAIN: import.meta.env.VITE_DROPLINK_SUBDOMAIN || "droplink2920",
  
  // SDK Version
  SDK_VERSION: "2.0",
  
  // Browser Detection - Real Pi Browser check
  isPiBrowser: () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    // Check for Pi Browser user agent
    const isPiUserAgent = userAgent.includes('pibrowser') || 
                         userAgent.includes('pi network') || 
                         userAgent.includes('pi-browser');
    
    // Check for Pi Network domains
    const isPiDomain = hostname.includes('pinet.com') || 
                       hostname.includes('minepi.com') ||
                       hostname.includes('droplink2920.pinet.com');
    
    // Check for Pi SDK availability
    const hasPiSDK = typeof window.Pi !== 'undefined';
    
    console.log('Pi Browser Detection:', {
      userAgent: isPiUserAgent,
      domain: isPiDomain,
      sdk: hasPiSDK,
      hostname,
      userAgentString: userAgent
    });
    
    return isPiUserAgent || isPiDomain || hasPiSDK;
  },
  
  // Production Mode Settings - Real authentication required
  allowMockAuth: false,
  allowOfflineMode: false,
  skipPiSDKCheck: false,
  skipBrowserCheck: false
};

// Get Pi configuration based on environment
export const getPiConfig = () => {
  return {
    isPiBrowser: PI_CONFIG.isPiBrowser(),
    isSandbox: PI_CONFIG.isSandbox,
    isProduction: PI_CONFIG.isProduction,
    isTesting: PI_CONFIG.isTesting,
    apiKey: PI_CONFIG.API_KEY,
    appId: PI_CONFIG.APP_ID,
    sdkVersion: PI_CONFIG.SDK_VERSION,
    allowMockAuth: PI_CONFIG.allowMockAuth,
    allowOfflineMode: PI_CONFIG.allowOfflineMode,
    skipPiSDKCheck: PI_CONFIG.skipPiSDKCheck,
    skipBrowserCheck: PI_CONFIG.skipBrowserCheck
  };
};

// Get environment badge for UI - Show production mode
export const getEnvironmentBadge = () => {
  if (PI_CONFIG.isSandbox) {
    return { text: 'SANDBOX', color: 'bg-orange-100 text-orange-800' };
  }
  return { text: 'MAINNET', color: 'bg-green-100 text-green-800' };
};

  // Get Pi Browser URL for redirects - Dynamic based on environment
export const getPiBrowserUrl = (currentUrl: string) => {
  const encodedUrl = encodeURIComponent(currentUrl);
  // Use sandbox URL for sandbox mode, mainnet URL for production
  return isSandbox 
    ? `https://sandbox.minepi.com/browser/open?url=${encodedUrl}`
    : `https://minepi.com/browser/open?url=${encodedUrl}`;
};

// Validate configuration - Production requirements
export const validatePiConfig = () => {
  const config = getPiConfig();
  const errors = [];

  // Production requirements
  if (!config.apiKey) {
    errors.push('Pi Network API Key is required for production');
  }
  
  if (!config.appId) {
    errors.push('Pi Network App ID is required for production');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Log configuration status - Show mainnet mode
export const logPiConfigStatus = () => {
  const config = getPiConfig();
  const validation = validatePiConfig();
  
  console.log('=== Pi Network Configuration ===');
  console.log('Environment:', PI_CONFIG.isSandbox ? 'SANDBOX (Testnet)' : 'MAINNET (Production)');
  console.log('API Base URL:', PI_CONFIG.API_BASE_URL);
  console.log('Pi Browser:', config.isPiBrowser ? 'Detected' : 'Not Detected');
  console.log('API Key:', config.apiKey ? 'Configured' : 'Missing');
  console.log('App ID:', config.appId ? 'Configured' : 'Missing');
  console.log('Validation:', validation.isValid ? 'Passed' : 'Failed');
  
  if (!validation.isValid) {
    console.warn('Configuration Errors:', validation.errors);
  }
  
  // Log configuration status
  console.log('=== Pi Network Configuration Status ===');
  console.log('Environment:', PI_CONFIG.isSandbox ? 'sandbox (testnet)' : 'mainnet (production)');
  console.log('API Base URL:', PI_CONFIG.API_BASE_URL);
  console.log('Pi Browser:', config.isPiBrowser);
  console.log('Has API Key:', !!config.apiKey);
  console.log('Has App ID:', !!config.appId);
  console.log('Is Valid:', validation.isValid);
  console.log('Errors:', validation.errors);
  console.log('=====================================');
}; 