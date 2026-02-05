# 🚀 Pi Network Production Mainnet Setup

This guide will help you configure Droplink for Pi Network production mainnet using the [official Pi Platform Documentation](https://github.com/pi-apps/pi-platform-docs.git).

## ✅ Configuration Complete

Your Droplink application has been updated for Pi Network production mainnet:

### **Updated Files:**
- ✅ `src/utils/pi-config.ts` - Production API endpoints
- ✅ `src/utils/pi-auth.ts` - Production authentication
- ✅ `index.html` - Production SDK initialization
- ✅ `src/pages/LoginPage.tsx` - Removed testnet warnings
- ✅ `src/pages/SignupPage.tsx` - Removed testnet warnings

### **Production Configuration:**
- **API Base URL**: `https://api.minepi.com` (Production)
- **SDK URL**: `https://sdk.minepi.com/pi-sdk.js`
- **Environment**: Production Mainnet
- **Sandbox Mode**: Disabled
- **App ID**: `droplink`

## 🔧 Required Environment Variables

Create a `.env.production` file with:

```bash
# Pi Network Production Mainnet Configuration
VITE_PI_API_KEY=your_production_api_key_here
VITE_PI_APP_ID=droplink
VITE_PI_SANDBOX=false

# Supabase Configuration (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
VITE_APP_ENV=production
VITE_APP_URL=https://droplink.space
```

## 📋 Developer Portal Setup

1. **Access Developer Portal**: Open `develop.pi` in Pi Browser
2. **Register Your App**: Create a new app called "Droplink"
3. **Get API Key**: Copy your production API key
4. **Configure Scopes**: Enable `payments` and `username` scopes
5. **Set Callback URLs**: Add your production domain

## 🔐 Authentication Flow

Following the [official documentation](https://github.com/pi-apps/pi-platform-docs.git):

```javascript
// Initialize Pi SDK
Pi.init({ version: "2.0", sandbox: false, appId: 'droplink' });

// Authenticate user
const scopes = ['payments', 'username'];
const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);
```

## 💰 Payment Integration

For production payments, implement the complete flow:

1. **User-to-App Payments**: Use `Pi.createPayment()`
2. **Server-Side Approval**: Required for all payments
3. **Server-Side Completion**: Required for all payments
4. **Platform API**: Validate payments on your server

## 🌐 Deployment Checklist

- [ ] Set production environment variables
- [ ] Configure domain in Developer Portal
- [ ] Test authentication flow
- [ ] Test payment flow
- [ ] Deploy to production server
- [ ] Verify Pi Browser compatibility

## 🔍 Testing Production

1. **Pi Browser**: Test in Pi Browser app
2. **Authentication**: Verify real Pi Network login
3. **Payments**: Test with real Pi tokens
4. **API Calls**: Verify production API responses

## 📚 Official Documentation

- [Pi Platform Documentation](https://github.com/pi-apps/pi-platform-docs.git)
- [Authentication Guide](https://github.com/pi-apps/pi-platform-docs/blob/master/authentication.md)
- [Payments Guide](https://github.com/pi-apps/pi-platform-docs/blob/master/payments.md)
- [SDK Reference](https://github.com/pi-apps/pi-platform-docs/blob/master/SDK_reference.md)

## 🚨 Important Notes

- **No Testnet**: All operations now use real Pi Network mainnet
- **Real Tokens**: All payments use real Pi tokens
- **Production API**: All API calls go to production endpoints
- **Pi Browser Required**: Best experience in Pi Browser app

Your Droplink application is now configured for Pi Network production mainnet! 🎉
