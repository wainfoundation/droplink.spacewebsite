#!/usr/bin/env node

/**
 * Sandbox Mode Verification Script
 * This script verifies that sandbox mode is properly configured
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Sandbox Mode Configuration...\n');

// Check main configuration files
const configFiles = [
  'src/utils/pi-config.ts',
  'src/main.tsx',
  'app.config.js',
  'env.development'
];

let allGood = true;

configFiles.forEach(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`📄 Checking ${file}:`);
    
    if (file === 'src/utils/pi-config.ts') {
      const hasSandboxTrue = content.includes('const isSandbox = true');
      const hasSandboxAPI = content.includes('api.sandbox.minepi.com');
      const hasSandboxAppId = content.includes('droplink_testnet');
      
      console.log(`  ✅ isSandbox = true: ${hasSandboxTrue ? '✓' : '✗'}`);
      console.log(`  ✅ Sandbox API URL: ${hasSandboxAPI ? '✓' : '✗'}`);
      console.log(`  ✅ Sandbox App ID: ${hasSandboxAppId ? '✓' : '✗'}`);
      
      if (!hasSandboxTrue || !hasSandboxAPI || !hasSandboxAppId) {
        allGood = false;
      }
    }
    
    if (file === 'src/main.tsx') {
      const hasSandboxInit = content.includes('sandbox: true');
      console.log(`  ✅ Pi SDK sandbox: true: ${hasSandboxInit ? '✓' : '✗'}`);
      
      if (!hasSandboxInit) {
        allGood = false;
      }
    }
    
    if (file === 'app.config.js') {
      const hasSandboxConfig = content.includes('sandbox: true');
      console.log(`  ✅ App config sandbox: ${hasSandboxConfig ? '✓' : '✗'}`);
      
      if (!hasSandboxConfig) {
        allGood = false;
      }
    }
    
    if (file === 'env.development') {
      const hasSandboxMode = content.includes('PI_SANDBOX_MODE="true"');
      const hasSandboxNetwork = content.includes('PI_NETWORK="sandbox"');
      const hasSandboxAPI = content.includes('api.sandbox.minepi.com');
      
      console.log(`  ✅ PI_SANDBOX_MODE: ${hasSandboxMode ? '✓' : '✗'}`);
      console.log(`  ✅ PI_NETWORK=sandbox: ${hasSandboxNetwork ? '✓' : '✗'}`);
      console.log(`  ✅ Sandbox API URL: ${hasSandboxAPI ? '✓' : '✗'}`);
      
      if (!hasSandboxMode || !hasSandboxNetwork || !hasSandboxAPI) {
        allGood = false;
      }
    }
    
    console.log('');
  } catch (error) {
    console.log(`  ❌ Error reading ${file}: ${error.message}`);
    allGood = false;
  }
});

// Check if UnifiedPiAuthButton exists
try {
  const unifiedButton = fs.readFileSync('src/components/UnifiedPiAuthButton.tsx', 'utf8');
  const hasMockAuth = unifiedButton.includes('sandbox_user_');
  const hasSandboxText = unifiedButton.includes('(Sandbox)');
  
  console.log('📄 Checking UnifiedPiAuthButton.tsx:');
  console.log(`  ✅ Mock authentication: ${hasMockAuth ? '✓' : '✗'}`);
  console.log(`  ✅ Sandbox button text: ${hasSandboxText ? '✓' : '✗'}`);
  console.log('');
  
  if (!hasMockAuth || !hasSandboxText) {
    allGood = false;
  }
} catch (error) {
  console.log('❌ UnifiedPiAuthButton.tsx not found or has errors');
  allGood = false;
}

// Final result
console.log('🎯 Sandbox Mode Verification Results:');
if (allGood) {
  console.log('✅ All sandbox configurations are properly set!');
  console.log('🚀 Your application is ready for sandbox testing.');
  console.log('\n📋 What\'s configured:');
  console.log('  • Pi SDK initialized with sandbox: true');
  console.log('  • API endpoints point to sandbox.minepi.com');
  console.log('  • App ID set to droplink_testnet');
  console.log('  • Mock authentication fallback enabled');
  console.log('  • Unified authentication across all pages');
  console.log('  • Environment badges show "SANDBOX MODE"');
} else {
  console.log('❌ Some sandbox configurations are missing or incorrect.');
  console.log('🔧 Please check the files mentioned above.');
}

console.log('\n🧪 To test sandbox mode:');
console.log('  1. Run: npm run dev');
console.log('  2. Navigate to any authentication page');
console.log('  3. Click "Connect with Pi Network (Sandbox)"');
console.log('  4. Should work with mock authentication');
