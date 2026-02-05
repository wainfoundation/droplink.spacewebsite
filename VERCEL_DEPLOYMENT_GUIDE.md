# Vercel Deployment Guide for Droplink

## 🚀 Quick Deployment

### 1. **Environment Variables Setup**

In your Vercel dashboard, add these environment variables:

```bash
# Pi Network Configuration - MAINNET
NODE_ENV=production
VITE_PI_SANDBOX=false
PI_SANDBOX_MODE=false
VITE_IS_SANDBOX=false
IS_SANDBOX=false
VITE_IS_MAINNET=true
IS_MAINNET=true
VITE_PI_NETWORK=mainnet
PI_NETWORK=mainnet
VITE_FORCE_MAINNET=true
FORCE_MAINNET=true
VITE_IS_PRODUCTION=true
IS_PRODUCTION=true

# Pi Network API Keys - MAINNET
VITE_PI_SERVER_API_KEY=jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno
PI_API_KEY=jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno

# Pi Network Validation Key - MAINNET
VITE_PI_VALIDATION_KEY=7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a
PI_VALIDATION_KEY=7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a

# Supabase Configuration
VITE_SUPABASE_URL=https://xdvsyjkzlchhftyrvrtz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjgzMjIsImV4cCI6MjA3MTgwNDMyMn0.XMhFBavLpcIP0lj1oQd3A0fvMWZFLcpF9OuI4P43YFM

# Pi Network Features - MAINNET
VITE_ENABLE_PI_ADS=true
VITE_ENABLE_PI_PAYMENTS=true
VITE_ENABLE_PI_AUTH=true
ENABLE_PI_PAYMENTS=true
ENABLE_PI_ADS=true
ENABLE_PI_PROFILES=true

# App Configuration
APP_ID=droplink
APP_SUBDOMAIN=droplink2920.pinet.com
APP_BASE_URL=https://droplink2920.pinet.com
APP_DOMAIN=droplink.space
```

### 2. **Deployment Commands**

```bash
# Install dependencies
npm install

# Build for production
npm run build:vercel

# Deploy to Vercel
vercel --prod
```

### 3. **Vercel Configuration**

The `vercel.json` file is already configured with:
- ✅ Mainnet environment variables
- ✅ Proper CSP headers for Pi Network
- ✅ Build command: `npm run build:vercel`
- ✅ Output directory: `dist`
- ✅ Framework: `vite`

### 4. **Domain Configuration**

For Pi Network deployment, configure your custom domain:
- **Primary Domain**: `droplink.space`
- **Pi Network Subdomain**: `droplink2920.pinet.com`

### 5. **Troubleshooting**

#### Common Issues:

1. **Build Fails**: Check environment variables are set correctly
2. **Pi SDK Not Loading**: Verify CSP headers allow `https://sdk.minepi.com`
3. **Authentication Issues**: Ensure mainnet mode is enabled
4. **CORS Errors**: Check Supabase configuration

#### Debug Commands:

```bash
# Check build locally
npm run build:vercel

# Preview build
npm run preview

# Check environment variables
vercel env ls
```

### 6. **Post-Deployment**

After successful deployment:

1. ✅ Test Pi authentication
2. ✅ Test Pi payments
3. ✅ Test Pi ads
4. ✅ Verify mainnet connectivity
5. ✅ Check console for errors

### 7. **Monitoring**

Monitor your deployment:
- **Vercel Dashboard**: Check build logs and performance
- **Browser Console**: Monitor Pi SDK initialization
- **Network Tab**: Verify API calls to mainnet

## 🎯 Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Pi SDK loads from mainnet
- ✅ Authentication works in Pi Browser
- ✅ No console errors
- ✅ All features functional

## 📞 Support

If you encounter issues:
1. Check Vercel build logs
2. Verify environment variables
3. Test in Pi Browser
4. Check browser console for errors
