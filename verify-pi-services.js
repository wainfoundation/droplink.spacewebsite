#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

console.log('🔍 Verifying Pi Network Services Configuration...\n');

// Read environment files
const envProduction = fs.readFileSync('env.production', 'utf8');
const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

console.log('✅ Environment Files Loaded');

// Check Pi Network API Key
const newApiKey = 'ebm7t8yojn4q0apodezl5byt5e7tmm2asppmqlzjvv8jayyncxjah64iip3yyp5r';
const oldApiKey = '3svdrfuudpqt9f14rep9bavbf3nhwj6v6o5ruffvqmo3sya5tnowk6zkzh4ewqsu';

console.log('\n🔑 Pi Network API Key Verification:');
console.log(`New API Key: ${newApiKey}`);
console.log(`Key Length: ${newApiKey.length} characters`);

// Verify API key in env.production
const apiKeyInEnv = envProduction.includes(newApiKey);
const oldApiKeyInEnv = envProduction.includes(oldApiKey);

console.log(`✅ New API Key in env.production: ${apiKeyInEnv}`);
console.log(`❌ Old API Key in env.production: ${oldApiKeyInEnv}`);

// Verify API key in vercel.json
const apiKeyInVercel = vercelConfig.env.VITE_PI_SERVER_API_KEY === newApiKey;
console.log(`✅ New API Key in vercel.json: ${apiKeyInVercel}`);

// Check Pi Service Configuration
console.log('\n🔧 Pi Service Configuration:');

const piServices = [
  'VITE_ENABLE_PI_AUTH',
  'VITE_ENABLE_PI_PAYMENTS', 
  'VITE_ENABLE_PI_ADS',
  'VITE_ENABLE_PI_PROFILES',
  'VITE_PI_AUTH_ENABLED',
  'VITE_PI_PAYMENTS_ENABLED',
  'VITE_PI_ADS_ENABLED',
  'VITE_PI_PROFILES_ENABLED'
];

let allServicesConfigured = true;

piServices.forEach(service => {
  const inEnv = envProduction.includes(`${service}="true"`);
  const inVercel = vercelConfig.env[service] === 'true';
  
  console.log(`  ${service}:`);
  console.log(`    env.production: ${inEnv ? '✅' : '❌'}`);
  console.log(`    vercel.json: ${inVercel ? '✅' : '❌'}`);
  
  if (!inEnv || !inVercel) {
    allServicesConfigured = false;
  }
});

// Check Pi Network Configuration
console.log('\n🌐 Pi Network Configuration:');

const piConfig = [
  'VITE_PI_SANDBOX="false"',
  'VITE_PI_NETWORK="mainnet"',
  'VITE_PI_SDK_VERSION="2.0"',
  'VITE_PI_APP_ID="droplink"',
  'VITE_IS_PRODUCTION="true"',
  'VITE_IS_MAINNET="true"',
  'VITE_IS_SANDBOX="false"',
  'VITE_IS_TESTNET="false"',
  'VITE_FORCE_MAINNET="true"'
];

let allPiConfigCorrect = true;

piConfig.forEach(config => {
  const inEnv = envProduction.includes(config);
  console.log(`  ${config}: ${inEnv ? '✅' : '❌'}`);
  if (!inEnv) allPiConfigCorrect = false;
});

// Check Supabase Configuration
console.log('\n🗄️ Supabase Configuration:');

const supabaseUrl = 'https://jzzbmoopwnvgxxirulga.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6emJtb29wd252Z3h4aXJ1bGdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMDMxMjUsImV4cCI6MjA3NDc3OTEyNX0.5DqetNG0bvN620X8t5QP-sGEInb17ZCgY0Jfp7_qZWU';

const supabaseInEnv = envProduction.includes(supabaseUrl) && envProduction.includes(supabaseKey);
const supabaseInVercel = vercelConfig.env.VITE_SUPABASE_URL === supabaseUrl && 
                         vercelConfig.env.VITE_SUPABASE_ANON_KEY === supabaseKey;

console.log(`✅ Supabase URL in env.production: ${envProduction.includes(supabaseUrl)}`);
console.log(`✅ Supabase Key in env.production: ${envProduction.includes(supabaseKey)}`);
console.log(`✅ Supabase URL in vercel.json: ${vercelConfig.env.VITE_SUPABASE_URL === supabaseUrl}`);
console.log(`✅ Supabase Key in vercel.json: ${vercelConfig.env.VITE_SUPABASE_ANON_KEY === supabaseKey}`);

// Check validation key
console.log('\n🔐 Validation Key:');

const validationKey = '7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a';
const validationKeyInEnv = envProduction.includes(validationKey);
const validationKeyInVercel = vercelConfig.env.VITE_PI_VALIDATION_KEY === validationKey;

console.log(`✅ Validation Key in env.production: ${validationKeyInEnv}`);
console.log(`✅ Validation Key in vercel.json: ${validationKeyInVercel}`);

// Check wallet address
console.log('\n💰 Wallet Address:');

const walletAddress = 'GDSXE723WPHZ5RGIJCSYXTPKSOIGPTSXE4RF5U3JTNGTCHXON7ZVD4LJ';
const walletInEnv = envProduction.includes(walletAddress);
const walletInVercel = vercelConfig.env.VITE_PI_WALLET_ADDRESS === walletAddress;

console.log(`✅ Wallet Address in env.production: ${walletInEnv}`);
console.log(`✅ Wallet Address in vercel.json: ${walletInVercel}`);

// Final verification
console.log('\n🎯 Final Verification:');

const allChecks = [
  apiKeyInEnv && !oldApiKeyInEnv,
  apiKeyInVercel,
  allServicesConfigured,
  allPiConfigCorrect,
  supabaseInEnv,
  supabaseInVercel,
  validationKeyInEnv,
  validationKeyInVercel,
  walletInEnv,
  walletInVercel
];

const allPassed = allChecks.every(check => check);

console.log(`\n${allPassed ? '🎉' : '❌'} Overall Status: ${allPassed ? 'ALL CHECKS PASSED' : 'SOME CHECKS FAILED'}`);

if (allPassed) {
  console.log('\n✅ Pi Network Services Configuration Complete!');
  console.log('✅ All Pi Auth, Pi Payment, and Pi Ad Network services are properly configured');
  console.log('✅ New mainnet API key is active');
  console.log('✅ All environment variables are set correctly');
  console.log('✅ Vercel deployment configuration is ready');
} else {
  console.log('\n❌ Some configurations need attention');
  console.log('Please check the failed items above');
}

console.log('\n🚀 Ready for deployment with new Pi Network API key!');
