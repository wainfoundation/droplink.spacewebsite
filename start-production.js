#!/usr/bin/env node

/**
 * Start Droplink in Production Mode
 * 
 * This script starts the development server with sandbox mode disabled
 * for production Pi Network features in the mainnet environment.
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Droplink in Production Mode...\n');

// FORCE MAINNET ONLY - NO SANDBOX - NO TESTNET
process.env.NODE_ENV = 'production';
process.env.VITE_PI_SANDBOX = 'false';
process.env.PI_SANDBOX_MODE = 'false';
process.env.VITE_IS_SANDBOX = 'false';
process.env.IS_SANDBOX = 'false';
process.env.VITE_IS_MAINNET = 'true';
process.env.IS_MAINNET = 'true';
process.env.VITE_PI_NETWORK = 'mainnet';
process.env.PI_NETWORK = 'mainnet';

// Force mainnet mode - disable all sandbox/testnet
process.env.VITE_FORCE_MAINNET = 'true';
process.env.FORCE_MAINNET = 'true';
process.env.VITE_IS_PRODUCTION = 'true';
process.env.IS_PRODUCTION = 'true';
process.env.VITE_ENABLE_PI_ADS = 'true';
process.env.VITE_ENABLE_PI_PAYMENTS = 'true';
process.env.VITE_ENABLE_PI_AUTH = 'true';

// Disable testnet/sandbox completely
process.env.VITE_IS_TESTNET = 'false';
process.env.IS_TESTNET = 'false';
process.env.VITE_DISABLE_SANDBOX = 'true';
process.env.DISABLE_SANDBOX = 'true';

// Check if .env file exists, if not create one with production settings
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file with production configuration...');
  
  const envContent = `# Production Mode Configuration
NODE_ENV=production
VITE_PI_SANDBOX=false
PI_SANDBOX_MODE=false
VITE_IS_SANDBOX=false
IS_SANDBOX=false
VITE_IS_MAINNET=true
IS_MAINNET=true
VITE_PI_NETWORK=mainnet
PI_NETWORK=mainnet
VITE_PI_APP_ID=droplink
PI_NETWORK_APP_ID=droplink
VITE_PI_SERVER_API_KEY=jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno
PI_API_KEY=jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno
VITE_PI_VALIDATION_KEY=7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a
PI_VALIDATION_KEY=7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a
VITE_SUPABASE_URL=https://xdvsyjkzlchhftyrvrtz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjgzMjIsImV4cCI6MjA3MTgwNDMyMn0.XMhFBavLpcIP0lj1oQd3A0fvMWZFLcpF9OuI4P43YFM
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with production configuration\n');
}

// Start the development server
console.log('🌐 Starting development server...');
console.log('🚫 Sandbox Mode: COMPLETELY DISABLED');
console.log('🚫 Testnet Mode: COMPLETELY DISABLED');
console.log('🚀 Mainnet Mode: FORCED ENABLED');
console.log('🔗 Mainnet API: https://api.minepi.com');
console.log('🌍 Production Browser: https://minepi.com');
console.log('📱 App ID: droplink');
console.log('💰 Pi Payments: MAINNET ENABLED');
console.log('📺 Pi Ads: MAINNET ENABLED');
console.log('🔐 Pi Auth: MAINNET ENABLED\n');

const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'production',
    VITE_PI_SANDBOX: 'false',
    PI_SANDBOX_MODE: 'false',
    VITE_IS_SANDBOX: 'false',
    IS_SANDBOX: 'false',
    VITE_IS_MAINNET: 'true',
    IS_MAINNET: 'true',
    VITE_PI_NETWORK: 'mainnet',
    PI_NETWORK: 'mainnet',
    VITE_FORCE_MAINNET: 'true',
    FORCE_MAINNET: 'true',
    VITE_IS_PRODUCTION: 'true',
    IS_PRODUCTION: 'true',
    VITE_ENABLE_PI_ADS: 'true',
    VITE_ENABLE_PI_PAYMENTS: 'true',
    VITE_ENABLE_PI_AUTH: 'true',
    VITE_IS_TESTNET: 'false',
    IS_TESTNET: 'false',
    VITE_DISABLE_SANDBOX: 'true',
    DISABLE_SANDBOX: 'true'
  }
});

devServer.on('error', (error) => {
  console.error('❌ Failed to start development server:', error);
  process.exit(1);
});

devServer.on('close', (code) => {
  console.log(`\n🛑 Development server stopped with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping development server...');
  devServer.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Stopping development server...');
  devServer.kill('SIGTERM');
});
