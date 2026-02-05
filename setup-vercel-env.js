#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🚀 Setting up Vercel Environment Variables for Droplink...\n');

// Production environment variables for Vercel
const vercelEnvVars = {
  // Application Configuration
  'NODE_ENV': 'production',
  'DROPLINK_ENV': 'mainnet',
  'APP_ENVIRONMENT': 'mainnet',
  'VITE_APP_NAME': 'Droplink',
  'VITE_APP_VERSION': '2.0.0',
  'VITE_APP_DESCRIPTION': 'Droplink - Drop All Your Links with Pi Network Integration',
  'VITE_APP_BASE_URL': 'https://droplink.space',
  'VITE_API_BASE_URL': 'https://api.droplink.space/api/v1',

  // Pi Network Mainnet Configuration
  'VITE_PI_SANDBOX': 'false',
  'VITE_PI_NETWORK': 'mainnet',
  'VITE_PI_ENVIRONMENT': 'mainnet',
  'VITE_PI_SDK_VERSION': '2.0',
  'VITE_PI_MAINNET': 'true',
  'VITE_PI_TESTNET': 'false',
  'VITE_IS_PRODUCTION': 'true',
  'VITE_IS_MAINNET': 'true',
  'VITE_IS_SANDBOX': 'false',
  'VITE_IS_TESTNET': 'false',
  'VITE_FORCE_MAINNET': 'true',

  // Pi Network Credentials
  'VITE_PI_SERVER_API_KEY': 'ebm7t8yojn4q0apodezl5byt5e7tmm2asppmqlzjvv8jayyncxjah64iip3yyp5r',
  'VITE_PI_APP_ID': 'droplink',
  'VITE_PI_NETWORK_APP_ID': 'droplink',
  'VITE_PI_NETWORK_API_KEY': 'ebm7t8yojn4q0apodezl5byt5e7tmm2asppmqlzjvv8jayyncxjah64iip3yyp5r',
  'VITE_PI_NETWORK_SECRET': 'ebm7t8yojn4q0apodezl5byt5e7tmm2asppmqlzjvv8jayyncxjah64iip3yyp5r',
  'VITE_PI_NETWORK_ENVIRONMENT': 'mainnet',
  'VITE_PI_NETWORK_SCOPES': 'username,payments',
  'VITE_PI_NETWORK_APP_NAME': 'Droplink',
  'VITE_PI_NETWORK_REDIRECT_URL': 'https://droplink.space/auth/pi/callback',
  'VITE_PI_NETWORK_CALLBACK_URL': 'https://droplink.space/pi-callback',
  'VITE_PI_NETWORK_VERSION': '2.0',
  'VITE_PI_VALIDATION_KEY': '7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a',
  'VITE_PI_WALLET_ADDRESS': 'GDSXE723WPHZ5RGIJCSYXTPKSOIGPTSXE4RF5U3JTNGTCHXON7ZVD4LJ',
  'VITE_SUBSCRIPTION_WALLET_ADDRESS': 'GDSXE723WPHZ5RGIJCSYXTPKSOIGPTSXE4RF5U3JTNGTCHXON7ZVD4LJ',

  // Pi Network Ads Configuration
  'VITE_ENABLE_PI_ADS': 'true',
  'VITE_PI_BANNER_ADS_ENABLED': 'true',
  'VITE_PI_INTERSTITIAL_ADS_ENABLED': 'true',
  'VITE_PI_REWARDED_ADS_ENABLED': 'true',

  // Pi Network Metadata Configuration
  'VITE_PINET_METADATA_ENABLED': 'true',
  'VITE_PINET_BACKEND_URL': 'https://droplink.space',
  'VITE_PINET_METADATA_TYPE': 'backend',
  'VITE_PINET_CACHE_DURATION': '300',

  // Pi Network Service Configuration
  'VITE_ENABLE_PI_AUTH': 'true',
  'VITE_ENABLE_PI_PAYMENTS': 'true',
  'VITE_ENABLE_PI_PROFILES': 'true',
  'VITE_PI_AUTH_ENABLED': 'true',
  'VITE_PI_PAYMENTS_ENABLED': 'true',
  'VITE_PI_ADS_ENABLED': 'true',
  'VITE_PI_PROFILES_ENABLED': 'true',

  // Supabase Database
  'VITE_SUPABASE_URL': 'https://jzzbmoopwnvgxxirulga.supabase.co',
  'VITE_SUPABASE_ANON_KEY': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6emJtb29wd252Z3h4aXJ1bGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDMxMjUsImV4cCI6MjA3NDc3OTEyNX0.5DqetNG0bvN620X8t5QP-sGEInb17ZCgY0Jfp7_qZWU',

  // Security Configuration
  'VITE_CORS_ORIGIN': 'https://droplink.space',
  'VITE_API_TIMEOUT': '30000',
  'VITE_AUTH_TIMEOUT': '30000',
  'VITE_TOKEN_REFRESH_ENABLED': 'true',

  // Domain Configuration
  'VITE_APP_DOMAIN': 'droplink.space',
  'VITE_APP_SUBDOMAIN': 'droplink2920.pinet.com',
  'VITE_DROPLINK_SUBDOMAIN': 'droplink2920',

  // Feature Flags
  'ENABLE_ANALYTICS': 'true',
  'ENABLE_PAYMENT_PROCESSING': 'true',
  'ENABLE_USER_PLANS': 'true',
  'ENABLE_AI_FEATURES': 'true',
  'ENABLE_PI_INTEGRATION': 'true',
  'ENABLE_MAINNET': 'true',
  'ENABLE_TESTNET': 'false',
  'ENABLE_SANDBOX': 'false',
  'ENABLE_DEBUG': 'false'
};

// Create .env.local file for Vercel
const envContent = Object.entries(vercelEnvVars)
  .map(([key, value]) => `${key}=${value}`)
  .join('\n');

fs.writeFileSync('.env.local', envContent);

console.log('✅ Environment variables written to .env.local');
console.log('📋 Total variables configured:', Object.keys(vercelEnvVars).length);
console.log('\n🔧 Key configurations:');
console.log('  - Pi Network: Mainnet Production');
console.log('  - API Key: New mainnet key configured');
console.log('  - App ID: droplink');
console.log('  - Domain: droplink.space');
console.log('  - Subdomain: droplink2920.pinet.com');
console.log('  - Supabase: Configured');
console.log('  - Pi Services: All enabled');

console.log('\n🚀 Vercel environment setup complete!');
console.log('📝 Next steps:');
console.log('  1. Deploy to Vercel');
console.log('  2. Verify environment variables in Vercel dashboard');
console.log('  3. Test Pi Network integration');
console.log('  4. Verify white screen prevention');

console.log('\n✨ Ready for production deployment!');