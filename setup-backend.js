#!/usr/bin/env node

/**
 * Complete Droplink Backend Setup Script
 * 
 * This script sets up the complete backend infrastructure for Droplink
 * including database schema, edge functions, and authentication.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Droplink Backend...\n');

// Check if Supabase CLI is installed
function checkSupabaseCLI() {
  return new Promise((resolve) => {
    const check = spawn('supabase', ['--version'], { stdio: 'pipe' });
    check.on('close', (code) => {
      resolve(code === 0);
    });
    check.on('error', () => {
      resolve(false);
    });
  });
}

// Install Supabase CLI if not available
async function installSupabaseCLI() {
  console.log('📦 Installing Supabase CLI...');
  return new Promise((resolve, reject) => {
    const install = spawn('npm', ['install', '-g', 'supabase'], { stdio: 'inherit' });
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Supabase CLI installed successfully\n');
        resolve();
      } else {
        console.log('❌ Failed to install Supabase CLI\n');
        reject(new Error('Supabase CLI installation failed'));
      }
    });
  });
}

// Login to Supabase
async function loginToSupabase() {
  console.log('🔐 Logging into Supabase...');
  return new Promise((resolve, reject) => {
    const login = spawn('supabase', ['login'], { stdio: 'inherit' });
    login.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Logged into Supabase successfully\n');
        resolve();
      } else {
        console.log('❌ Failed to login to Supabase\n');
        reject(new Error('Supabase login failed'));
      }
    });
  });
}

// Link to Supabase project
async function linkProject() {
  console.log('🔗 Linking to Supabase project...');
  return new Promise((resolve, reject) => {
    const link = spawn('supabase', ['link', '--project-ref', 'jzzbmoopwnvgxxirulga'], { stdio: 'inherit' });
    link.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Project linked successfully\n');
        resolve();
      } else {
        console.log('❌ Failed to link project\n');
        reject(new Error('Project linking failed'));
      }
    });
  });
}

// Deploy database schema
async function deploySchema() {
  console.log('🗄️ Deploying database schema...');
  return new Promise((resolve, reject) => {
    const deploy = spawn('supabase', ['db', 'push'], { stdio: 'inherit' });
    deploy.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Database schema deployed successfully\n');
        resolve();
      } else {
        console.log('❌ Failed to deploy database schema\n');
        reject(new Error('Schema deployment failed'));
      }
    });
  });
}

// Deploy edge functions
async function deployFunctions() {
  console.log('⚡ Deploying edge functions...');
  return new Promise((resolve, reject) => {
    const deploy = spawn('supabase', ['functions', 'deploy'], { stdio: 'inherit' });
    deploy.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Edge functions deployed successfully\n');
        resolve();
      } else {
        console.log('❌ Failed to deploy edge functions\n');
        reject(new Error('Functions deployment failed'));
      }
    });
  });
}

// Main setup function
async function setupBackend() {
  try {
    // Check if Supabase CLI is available
    const hasSupabaseCLI = await checkSupabaseCLI();
    if (!hasSupabaseCLI) {
      await installSupabaseCLI();
    } else {
      console.log('✅ Supabase CLI is already installed\n');
    }

    // Login to Supabase
    await loginToSupabase();

    // Link to project
    await linkProject();

    // Deploy database schema
    await deploySchema();

    // Deploy edge functions
    await deployFunctions();

    console.log('🎉 Droplink Backend Setup Complete!');
    console.log('\n📋 What was set up:');
    console.log('✅ Database schema with all tables');
    console.log('✅ Row Level Security (RLS) policies');
    console.log('✅ Edge functions for API endpoints');
    console.log('✅ Authentication system');
    console.log('✅ Analytics tracking');
    console.log('✅ User management');
    console.log('✅ Pi Network integration');
    
    console.log('\n🚀 Your backend is now ready!');
    console.log('📍 Supabase URL: https://jzzbmoopwnvgxxirulga.supabase.co');
    console.log('🔑 Anon Key: Configured in your environment');
    console.log('⚡ Edge Functions: Deployed and ready');

  } catch (error) {
    console.error('❌ Backend setup failed:', error.message);
    console.log('\n🔧 Manual setup instructions:');
    console.log('1. Install Supabase CLI: npm install -g supabase');
    console.log('2. Login: supabase login');
    console.log('3. Link project: supabase link --project-ref jzzbmoopwnvgxxirulga');
    console.log('4. Deploy schema: supabase db push');
    console.log('5. Deploy functions: supabase functions deploy');
    process.exit(1);
  }
}

// Run setup
setupBackend();
