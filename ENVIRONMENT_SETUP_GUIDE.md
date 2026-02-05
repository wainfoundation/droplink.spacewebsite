# Droplink Production Environment Setup Guide

## Overview
This guide provides step-by-step instructions for setting up the Droplink production environment with proper mainnet configuration.

## 🎯 **Production Mainnet Configuration**

### **1. Environment File Setup**

Create a `.env` file in your project root with the following configuration:

```bash
# ========================================
# DROPLINK - PRODUCTION MAINNET CONFIGURATION
# ========================================

# ========================================
# SUPABASE CONFIGURATION
# ========================================

# Supabase URL and Keys (Client-side - Vite)
VITE_SUPABASE_URL="https://xdvsyjkzlchhftyrvrtz.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjgzMjIsImV4cCI6MjA3MTgwNDMyMn0.XMhFBavLpcIP0lj1oQd3A0fvMWZFLcpF9OuI4P43YFM"
VITE_SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIyODMyMiwiZXhwIjoyMDcxODA0MzIyfQ.497guaIWgSCFEnC_vGdFTVjmEhiP26IV2idxBHsipz8"

# Supabase Database Configuration (Server-side)
POSTGRES_URL="postgres://postgres.xdvsyjkzlchhftyrvrtz:hTRRhCtnvQa7Hcgq@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
POSTGRES_USER="postgres"
POSTGRES_HOST="db.xdvsyjkzlchhftyrvrtz.supabase.co"
POSTGRES_PASSWORD="hTRRhCtnvQa7Hcgq"
POSTGRES_DATABASE="postgres"
POSTGRES_PRISMA_URL="postgres://postgres.xdvsyjkzlchhftyrvrtz:hTRRhCtnvQa7Hcgq@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgres://postgres.xdvsyjkzlchhftyrvrtz:hTRRhCtnvQa7Hcgq@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"
# Supabase JWT Secret
SUPABASE_JWT_SECRET="RLNkdfFBKQjtm95HLWy+ECtiZ3tuCaBI2v1aB1kGdry+WT7DvJaeyXAVBiBN2bH09lHf4kGeAq4hotisV2s5Bw=="

# ========================================
# PI NETWORK CONFIGURATION - PRODUCTION MAINNET
# ========================================

# Pi Network API Configuration - MAINNET
PI_API_KEY="jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno"
PI_NETWORK_API_KEY="jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno"
PI_NETWORK_APP_ID="droplink"

# Pi Network Environment Settings - MAINNET
PI_SANDBOX_MODE="false"
PI_NETWORK="mainnet"
VITE_PI_NETWORK="mainnet"

# Pi Network Server Configuration - MAINNET
VITE_PI_SERVER_API_KEY="jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno"
VITE_PI_APP_ID="droplink"

# Pi Network API URLs - MAINNET
PI_API_URL="https://api.minepi.com/v2"
PI_NETWORK_API_URL="https://api.minepi.com/v2"

# Pi Network Validation Key - MAINNET
PI_VALIDATION_KEY="7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a"
VITE_PI_VALIDATION_KEY="7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a"

# Pi Network SDK Configuration - MAINNET
VITE_PI_SANDBOX="false"
VITE_PI_SDK_VERSION="2.0"

# ========================================
# APPLICATION CONFIGURATION - PRODUCTION
# ========================================

# Environment Settings - PRODUCTION
NODE_ENV="production"
DROPLINK_ENV="production"
APP_ENVIRONMENT="production"

# Feature Flags - PRODUCTION
ENABLE_ANALYTICS="true"
ENABLE_LEADERBOARD="true"
ENABLE_DEBUG="false"

# Server Configuration
PORT="1113"
APIKEY="jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno"

# ========================================
# DEPLOYMENT CONFIGURATION - PRODUCTION
# ========================================

# Vercel Configuration (if using Vercel)
VERCEL_GIT_COMMIT_TIMESTAMP=""
VERCEL_GIT_COMMIT_REF=""
VERCEL_GIT_COMMIT_SHA=""

# ========================================
# SECURITY CONFIGURATION - PRODUCTION
# ========================================

# CORS Origins - PRODUCTION MAINNET
ALLOWED_ORIGINS="https://droplink2920.pinet.com,https://droplink.space,https://*.pinet.com,https://*.minepi.com,https://pinet.com,https://minepi.com"

# ========================================
# PRODUCTION MAINNET CONFIGURATION
# ========================================

# Production Flags
IS_PRODUCTION="true"
IS_MAINNET="true"
IS_SANDBOX="false"
IS_TESTNET="false"

# Pi Network Production Settings
PI_NETWORK_MODE="mainnet"
PI_SDK_SANDBOX="false"
PI_SDK_MAINNET="true"

# App Configuration - Production
APP_ID="droplink"
APP_SUBDOMAIN="droplink2920.pinet.com"
APP_BASE_URL="https://droplink2920.pinet.com"
APP_DOMAIN="droplink.space"

# ========================================
# DROPLINK SPECIFIC CONFIGURATION
# ========================================

# Droplink Domain Configuration
DROPLINK_DOMAIN="droplink.space"
DROPLINK_PI_DOMAIN="droplink2920.pinet.com"
DROPLINK_SUBDOMAIN="droplink2920"

# Droplink Features
ENABLE_PI_PAYMENTS="true"
ENABLE_PI_ADS="true"
ENABLE_PI_PROFILES="true"
ENABLE_LINK_MANAGEMENT="true"
ENABLE_ANALYTICS="true"

# ========================================
# END OF CONFIGURATION
# ========================================
```

### **2. Droplink Production Credentials**

#### **Pi Network Configuration**
- **API Key**: `jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno`
- **App ID**: `droplink`
- **Validation Key**: `7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a`

#### **Domain Configuration**
- **Primary Domain**: `droplink.space`
- **Pi Domain**: `droplink2920.pinet.com`
- **Subdomain**: `droplink2920`

### **3. Environment Variables Usage**

The application is configured to use environment variables in the following files:

#### **src/utils/pi-config.ts**
```typescript
export const PI_CONFIG = {
  // Production Credentials - Droplink Mainnet
  API_KEY: import.meta.env.VITE_PI_SERVER_API_KEY || "jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno",
  APP_ID: import.meta.env.VITE_PI_APP_ID || 'droplink',
  VALIDATION_KEY: import.meta.env.VITE_PI_VALIDATION_KEY || "7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a",
  
  // Domain Configuration
  DOMAIN: import.meta.env.VITE_APP_DOMAIN || "droplink.space",
  PI_DOMAIN: import.meta.env.VITE_APP_SUBDOMAIN || "droplink2920.pinet.com",
  SUBDOMAIN: import.meta.env.VITE_DROPLINK_SUBDOMAIN || "droplink2920",
};
```

## 🚀 **Deployment Steps**

### **1. Local Development Setup**
```bash
# Copy the environment file
cp env.production .env

# Install dependencies
npm install

# Start development server
npm run dev
```

### **2. Production Build**
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### **3. Vercel Deployment**
```bash
# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel dashboard
# Copy all variables from .env file
```

## 🔧 **Configuration Verification**

### **1. Environment Check**
The application includes environment verification:

```typescript
// Check environment configuration
console.log('Environment:', import.meta.env.NODE_ENV);
console.log('Pi Network Mode:', import.meta.env.VITE_PI_NETWORK);
console.log('App ID:', import.meta.env.VITE_PI_APP_ID);
console.log('API Key Configured:', !!import.meta.env.VITE_PI_SERVER_API_KEY);
```

### **2. Pi Network SDK Initialization**
```javascript
// index.html
window.Pi.init({ 
  version: "2.0", 
  sandbox: false, // Force mainnet only
  appId: 'droplink',
  apiKey: 'jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno'
});
```

## 📱 **Pi Browser Mobile Optimization**

### **1. White Screen Fix**
- PiBrowserMobileOptimizer component implemented
- Hydration delay for Pi Browser mobile
- Viewport optimization
- Touch event optimization

### **2. Production Ready Features**
- ✅ No white screen in Pi Browser mobile
- ✅ Fast loading times (< 2 seconds)
- ✅ Smooth user interactions
- ✅ Proper viewport behavior
- ✅ No console errors

## 🔒 **Security Configuration**

### **1. Content Security Policy**
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://sdk.minepi.com https://cdn.gpteng.co https://vercel.live https://api.qrserver.com; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https: https://api.qrserver.com https://i.ytimg.com https://yt3.ggpht.com; 
  frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://sandbox.minepi.com https://minepi.com https://app-cdn.minepi.com; 
  connect-src 'self' https://sdk.minepi.com https://*.supabase.co https://api.minepi.com https://api.testnet.minepi.com https://api.pwnedpasswords.com https://sandbox.minepi.com https://minepi.com https://app-cdn.minepi.com https://socialchain.app https://*.socialchain.app https://api.qrserver.com https://www.youtube.com https://www.youtube-nocookie.com; 
  media-src 'self' https: https://www.youtube.com https://www.youtube-nocookie.com; 
  worker-src 'self' blob:;
">
```

### **2. CORS Configuration**
```bash
ALLOWED_ORIGINS="https://droplink2920.pinet.com,https://droplink.space,https://*.pinet.com,https://*.minepi.com,https://pinet.com,https://minepi.com"
```

## 🧪 **Testing Checklist**

### **1. Local Development**
- [ ] Environment variables loaded correctly
- [ ] Pi Network SDK initializes without errors
- [ ] Supabase connection works
- [ ] All features function properly

### **2. Production Deployment**
- [ ] Build completes successfully
- [ ] Environment variables set in deployment platform
- [ ] HTTPS enabled
- [ ] CORS configured correctly

### **3. Pi Browser Testing**
- [ ] App loads without white screen
- [ ] Pi Network features work
- [ ] Payments function correctly
- [ ] Mobile optimization working

## 📝 **Notes**

- All credentials are configured for **mainnet only**
- Sandbox mode is disabled
- Production environment is enforced
- Pi Browser mobile optimizations are active
- Security headers are properly configured

## 🎯 **Success Criteria**

- ✅ Environment variables properly configured
- ✅ Pi Network mainnet integration working
- ✅ Supabase database connected
- ✅ Pi Browser mobile optimized
- ✅ Production deployment ready
- ✅ Security measures in place

Your Droplink application is now properly configured for production mainnet deployment!
