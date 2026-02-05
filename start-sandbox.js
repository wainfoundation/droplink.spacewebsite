#!/usr/bin/env node

/**
 * Start Droplink in Sandbox Mode
 * 
 * This script starts the development server with sandbox mode enabled
 * for testing Pi Network features in the testnet environment.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Droplink in Sandbox Mode...\n');

// Set environment variables for sandbox mode
process.env.NODE_ENV = 'development';
process.env.VITE_PI_SANDBOX = 'true';
process.env.PI_SANDBOX_MODE = 'true';
process.env.VITE_IS_SANDBOX = 'true';
process.env.IS_SANDBOX = 'true';
process.env.VITE_PI_NETWORK = 'testnet';
process.env.PI_NETWORK = 'testnet';

// Check if .env file exists, if not create one with sandbox settings
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file with sandbox configuration...');
  
  const envContent = `# Sandbox Mode Configuration
NODE_ENV=development
VITE_PI_SANDBOX=true
PI_SANDBOX_MODE=true
VITE_IS_SANDBOX=true
IS_SANDBOX=true
VITE_PI_NETWORK=testnet
PI_NETWORK=testnet
VITE_PI_APP_ID=droplink_testnet
PI_NETWORK_APP_ID=droplink_testnet
VITE_PI_SERVER_API_KEY=jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno
PI_API_KEY=jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno
VITE_PI_VALIDATION_KEY=7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a
PI_VALIDATION_KEY=7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with sandbox configuration\n');
}

// Start the development server
console.log('🌐 Starting development server...');
console.log('📍 Sandbox Mode: ENABLED');
console.log('🔗 Testnet API: https://api.testnet.minepi.com');
console.log('🌍 Sandbox Browser: https://sandbox.minepi.com');
console.log('📱 App ID: droplink_testnet\n');

const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    VITE_PI_SANDBOX: 'true',
    PI_SANDBOX_MODE: 'true',
    VITE_IS_SANDBOX: 'true',
    IS_SANDBOX: 'true',
    VITE_PI_NETWORK: 'testnet',
    PI_NETWORK: 'testnet'
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
