# Sandbox Mode Enabled - Pi Network Configuration

## Overview
This document outlines the changes made to enable sandbox mode for Pi Network authentication, allowing testing and development with the Pi Network testnet environment.

## Changes Made

### 1. Updated Pi Configuration (`src/utils/pi-config.ts`)

**Environment Settings**:
- **Before**: `isSandbox = false` (Force mainnet only)
- **After**: `isSandbox = true` (Enable sandbox mode)

**API Endpoints**:
- **Before**: `API_BASE_URL: "https://api.minepi.com"` (Mainnet)
- **After**: `API_BASE_URL: "https://api.testnet.minepi.com"` (Testnet)

**App ID**:
- **Before**: `APP_ID: 'droplink'` (Production App ID)
- **After**: `APP_ID: 'droplink_testnet'` (Sandbox App ID)

### 2. Updated Pi Authentication (`src/utils/pi-auth.ts`)

**API Endpoints**:
- **Before**: `PI_API_URL = "https://api.minepi.com"` (Mainnet)
- **After**: `PI_API_URL = "https://api.testnet.minepi.com"` (Testnet)

**Logging**:
- **Before**: `PiLogger.info('auth_start', { scopes, mainnet: true })`
- **After**: `PiLogger.info('auth_start', { scopes, sandbox: true })`

**Comments**:
- Updated all comments from "mainnet" to "sandbox" for clarity

### 3. Updated Pi SDK Initialization (`index.html`)

**SDK Configuration**:
- **Before**: `sandbox: false, appId: 'droplink'` (Mainnet)
- **After**: `sandbox: true, appId: 'droplink_testnet'` (Sandbox)

## Benefits of Sandbox Mode

### 1. Development & Testing
- **Safe Testing**: Test Pi Network features without affecting real accounts
- **No Real Transactions**: All payments and interactions are simulated
- **Development Environment**: Perfect for development and debugging

### 2. User Experience
- **Testnet Pi**: Users can test with testnet Pi tokens
- **No Financial Risk**: No real money or Pi tokens are involved
- **Full Feature Testing**: All Pi Network features work in sandbox mode

### 3. Development Workflow
- **Rapid Iteration**: Test changes quickly without production concerns
- **Debugging**: Easier to debug authentication and payment flows
- **Feature Development**: Develop new features safely

## Environment Detection

### Current Configuration
```typescript
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const isSandbox = true; // Enabled sandbox mode
```

### API Endpoints
- **Testnet API**: `https://api.testnet.minepi.com`
- **Testnet Browser**: `https://sandbox.minepi.com`
- **Testnet App ID**: `droplink_testnet`

## UI Indicators

### Environment Badge
The application will now show:
- **Text**: "TESTNET"
- **Color**: Orange badge (`bg-orange-100 text-orange-800`)

### Authentication Flow
- Users will be redirected to `https://sandbox.minepi.com` for authentication
- All Pi Network interactions will use the testnet environment
- Testnet Pi tokens will be used for payments and tips

## Testing Checklist

### Authentication Testing
- [ ] Pi Network authentication works in sandbox mode
- [ ] Users can sign in with testnet accounts
- [ ] Authentication redirects to sandbox.minepi.com
- [ ] User data is properly retrieved from testnet API

### Payment Testing
- [ ] Pi payments work with testnet tokens
- [ ] Payment callbacks function correctly
- [ ] Incomplete payments are handled properly
- [ ] Payment validation works with testnet API

### UI Testing
- [ ] Environment badge shows "TESTNET"
- [ ] All Pi Network buttons use sky blue styling
- [ ] Authentication flow is smooth and intuitive
- [ ] Error handling works correctly

### Browser Testing
- [ ] Works in regular browsers (with limitations)
- [ ] Works optimally in Pi Browser
- [ ] Redirects work correctly for non-Pi Browser users

## Switching Back to Production

To switch back to production mode, update these files:

### 1. `src/utils/pi-config.ts`
```typescript
const isSandbox = false; // Disable sandbox mode
API_BASE_URL: "https://api.minepi.com", // Mainnet API
APP_ID: 'droplink', // Production App ID
```

### 2. `src/utils/pi-auth.ts`
```typescript
const PI_API_URL = "https://api.minepi.com"; // Mainnet API
```

### 3. `index.html`
```javascript
window.Pi.init({ 
  version: "2.0", 
  sandbox: false, // Disable sandbox mode
  appId: 'droplink' // Production App ID
});
```

## Security Considerations

### Sandbox Mode Security
- **No Real Data**: All data in sandbox mode is test data
- **Separate Environment**: Testnet is completely separate from mainnet
- **No Financial Risk**: No real Pi tokens or money involved

### Production Considerations
- **API Keys**: Ensure production API keys are properly secured
- **Environment Variables**: Use proper environment variables for production
- **Domain Verification**: Verify domains for production deployment

## Monitoring & Logging

### Sandbox Logging
- All authentication attempts are logged with `sandbox: true`
- Payment interactions are logged with testnet identifiers
- Error handling includes sandbox-specific information

### Debug Information
- Console logs indicate sandbox mode operation
- Network requests show testnet API endpoints
- User feedback includes sandbox environment indicators

## Conclusion

Sandbox mode has been successfully enabled, providing a safe testing environment for Pi Network integration. All authentication, payments, and Pi Network features now operate in the testnet environment, allowing for comprehensive testing without any risk to real accounts or tokens.

The application will now:
- Use testnet API endpoints
- Redirect to sandbox.minepi.com for authentication
- Process testnet Pi tokens for payments
- Display "TESTNET" environment indicators
- Provide a complete testing environment for all Pi Network features
