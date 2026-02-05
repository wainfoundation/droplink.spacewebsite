#!/usr/bin/env node

import fs from 'fs';

console.log('🔍 Checking Mainnet Production Configuration...\n');

// Check environment files
const envProduction = fs.readFileSync('env.production', 'utf8');
const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

console.log('✅ Environment Files Loaded\n');

// Check for mainnet production settings
const mainnetChecks = {
  'VITE_PI_SANDBOX="false"': envProduction.includes('VITE_PI_SANDBOX="false"'),
  'VITE_PI_NETWORK="mainnet"': envProduction.includes('VITE_PI_NETWORK="mainnet"'),
  'VITE_IS_PRODUCTION="true"': envProduction.includes('VITE_IS_PRODUCTION="true"'),
  'VITE_IS_MAINNET="true"': envProduction.includes('VITE_IS_MAINNET="true"'),
  'VITE_IS_SANDBOX="false"': envProduction.includes('VITE_IS_SANDBOX="false"'),
  'VITE_IS_TESTNET="false"': envProduction.includes('VITE_IS_TESTNET="false"'),
  'VITE_FORCE_MAINNET="true"': envProduction.includes('VITE_FORCE_MAINNET="true"'),
  'PI_SANDBOX_MODE="false"': envProduction.includes('PI_SANDBOX_MODE="false"'),
  'PI_NETWORK="mainnet"': envProduction.includes('PI_NETWORK="mainnet"')
};

console.log('🌐 Mainnet Production Configuration:');
Object.entries(mainnetChecks).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅' : '❌'}`);
});

// Check for testnet/sandbox settings that should be false
const antiTestnetChecks = {
  'No VITE_PI_SANDBOX="true"': !envProduction.includes('VITE_PI_SANDBOX="true"'),
  'No VITE_PI_TESTNET="true"': !envProduction.includes('VITE_PI_TESTNET="true"'),
  'No VITE_IS_SANDBOX="true"': !envProduction.includes('VITE_IS_SANDBOX="true"'),
  'No VITE_IS_TESTNET="true"': !envProduction.includes('VITE_IS_TESTNET="true"'),
  'No PI_SANDBOX_MODE="true"': !envProduction.includes('PI_SANDBOX_MODE="true"'),
  'No PI_NETWORK="testnet"': !envProduction.includes('PI_NETWORK="testnet"'),
  'No PI_NETWORK="sandbox"': !envProduction.includes('PI_NETWORK="sandbox"')
};

console.log('\n🚫 Anti-Testnet/Sandbox Configuration:');
Object.entries(antiTestnetChecks).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅' : '❌'}`);
});

// Check API key
const hasNewApiKey = envProduction.includes('ebm7t8yojn4q0apodezl5byt5e7tmm2asppmqlzjvv8jayyncxjah64iip3yyp5r');
const hasOldApiKey = envProduction.includes('3svdrfuudpqt9f14rep9bavbf3nhwj6v6o5ruffvqmo3sya5tnowk6zkzh4ewqsu');

console.log('\n🔑 API Key Configuration:');
console.log(`  New API Key: ${hasNewApiKey ? '✅' : '❌'}`);
console.log(`  Old API Key: ${hasOldApiKey ? '❌ (Should be removed)' : '✅ (Removed)'}`);

// Check Vercel configuration
const vercelMainnetChecks = {
  'VITE_PI_SANDBOX="false"': vercelJson.env?.VITE_PI_SANDBOX === 'false',
  'VITE_PI_NETWORK="mainnet"': vercelJson.env?.VITE_PI_NETWORK === 'mainnet',
  'VITE_IS_PRODUCTION="true"': vercelJson.env?.VITE_IS_PRODUCTION === 'true',
  'VITE_IS_MAINNET="true"': vercelJson.env?.VITE_IS_MAINNET === 'true',
  'VITE_IS_SANDBOX="false"': vercelJson.env?.VITE_IS_SANDBOX === 'false',
  'VITE_IS_TESTNET="false"': vercelJson.env?.VITE_IS_TESTNET === 'false',
  'VITE_FORCE_MAINNET="true"': vercelJson.env?.VITE_FORCE_MAINNET === 'true'
};

console.log('\n🚀 Vercel Mainnet Configuration:');
Object.entries(vercelMainnetChecks).forEach(([key, value]) => {
  console.log(`  ${key}: ${value ? '✅' : '❌'}`);
});

// Final verification
const allMainnetChecks = Object.values(mainnetChecks).every(Boolean);
const allAntiTestnetChecks = Object.values(antiTestnetChecks).every(Boolean);
const apiKeyCorrect = hasNewApiKey && !hasOldApiKey;
const vercelMainnetCorrect = Object.values(vercelMainnetChecks).every(Boolean);

console.log('\n🎯 Final Verification:');
console.log(`  Mainnet Configuration: ${allMainnetChecks ? '✅' : '❌'}`);
console.log(`  Anti-Testnet Configuration: ${allAntiTestnetChecks ? '✅' : '❌'}`);
console.log(`  API Key Configuration: ${apiKeyCorrect ? '✅' : '❌'}`);
console.log(`  Vercel Configuration: ${vercelMainnetCorrect ? '✅' : '❌'}`);

const overallStatus = allMainnetChecks && allAntiTestnetChecks && apiKeyCorrect && vercelMainnetCorrect;

console.log(`\n${overallStatus ? '🎉' : '❌'} Overall Status: ${overallStatus ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}`);

if (overallStatus) {
  console.log('\n✅ Droplink is properly configured for MAINNET PRODUCTION!');
  console.log('🚀 Ready for deployment with Pi Network mainnet integration');
  console.log('🔧 Pi authentication should work correctly');
  console.log('📱 White screen issues should be resolved');
} else {
  console.log('\n❌ Some configurations need attention');
  console.log('Please check the failed items above');
}

console.log('\n🔧 Mainnet Production Fixes Applied:');
console.log('  - Forced mainnet production environment');
console.log('  - Disabled all testnet/sandbox configurations');
console.log('  - Fixed Pi SDK initialization for mainnet');
console.log('  - Applied white screen prevention for Pi Browser');
console.log('  - Fixed Pi authentication for mainnet');
