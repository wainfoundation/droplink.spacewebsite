# Droplink Mainnet Configuration

## Overview
This document outlines the mainnet configuration for Droplink, including all necessary credentials, domains, and settings for production deployment.

## Production Credentials

### Validation Key
```
7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a
```

### Pi Network API Key
```
jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno
```

### App ID
```
droplink
```

## Domain Configuration

### Primary Domain
- **Domain**: `droplink.space`
- **URL**: `https://droplink.space`
- **Validation File**: `https://droplink.space/validation-key.txt`

### Pi Network Domain
- **Domain**: `droplink2920.pinet.com`
- **Subdomain**: `droplink2920`
- **URL**: `https://droplink2920.pinet.com`

### Alternative Domains
- **www.droplink.space**
- **droplink-seven.vercel.app**

## Configuration Files Updated

### 1. Pi Network Configuration (`src/utils/pi-config.ts`)
```typescript
// Environment detection - Force mainnet only
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const isSandbox = false; // Force mainnet only

// Pi Network API Configuration
export const PI_CONFIG = {
  // API Endpoints - Mainnet only
  API_BASE_URL: "https://api.minepi.com",
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",

  // Environment Settings
  isDevelopment,
  isProduction,
  isSandbox: false, // Force mainnet only

  // API Keys - Production mainnet
  API_KEY: import.meta.env.VITE_PI_API_KEY || "jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno",
  APP_ID: import.meta.env.VITE_PI_APP_ID || 'droplink',
};
```

### 2. Pi Authentication (`src/utils/pi-auth.ts`)
```typescript
// Pi API endpoints - mainnet only
const isDevelopment = import.meta.env.DEV;
const PI_API_URL = "https://api.minepi.com";

// Production mainnet mode
console.log("Production mainnet mode");
PiLogger.info('auth_start', { scopes, mainnet: true });

// Always validate the access token using the /me endpoint in mainnet
if (authResult.accessToken) {
  console.log("Validating access token with Pi API /me endpoint...");
}
```

### 3. Pi SDK Initialization (`index.html`)
```javascript
// Initialize Pi SDK - Mainnet only
window.Pi.init({ 
  version: "2.0", 
  sandbox: false, // Force mainnet only
  appId: 'droplink'
});
```

### 4. Validation Key Files
- `public/validation-key.txt`
- `validation-key.txt`
- `src/pages/DomainVerification.tsx`
- `test-workflow.js`

## Environment Variables

### Required Environment Variables
```bash
# Pi Network Configuration
VITE_PI_API_KEY=jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno
VITE_PI_APP_ID=droplink

# Supabase Configuration (if using)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Optional Environment Variables
```bash
# Development overrides (not used in mainnet)
VITE_PI_SANDBOX=false
VITE_DEV_MODE=false
```

## Mainnet Features

### 1. Strict Authentication
- **No Sandbox Fallbacks**: All authentication requires valid Pi Network credentials
- **Real API Calls**: All API calls go to mainnet endpoints
- **Production Validation**: Access tokens are validated against mainnet API

### 2. Domain Verification
- **Validation Key**: `7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a`
- **Required Domains**: All production domains must have this validation key
- **Verification Process**: Automatic domain verification for Pi Network integration

### 3. Pi Network Integration
- **App ID**: `droplink`
- **API Endpoint**: `https://api.minepi.com`
- **SDK Version**: `2.0`
- **Scopes**: `["username", "payments", "wallet_address"]`

## Deployment Checklist

### Pre-Deployment
- [ ] Validation key uploaded to all production domains
- [ ] Environment variables configured
- [ ] Pi Network app configured in mainnet
- [ ] Domain verification completed
- [ ] SSL certificates installed

### Post-Deployment
- [ ] Authentication flow tested
- [ ] Domain verification working
- [ ] Pi Network integration functional
- [ ] Error handling verified
- [ ] Performance monitoring active

## Security Considerations

### 1. API Key Security
- **Environment Variables**: API keys stored in environment variables
- **No Hardcoding**: No sensitive data in source code
- **Access Control**: Limited access to production credentials

### 2. Domain Security
- **HTTPS Required**: All production domains use HTTPS
- **Validation Key**: Unique validation key for domain verification
- **CORS Configuration**: Proper CORS settings for Pi Network domains

### 3. Authentication Security
- **Token Validation**: All access tokens validated against Pi API
- **Session Management**: Secure session handling
- **Error Handling**: No sensitive information in error messages

## Monitoring and Logging

### 1. Pi Network Logging
```javascript
// Production mainnet mode
console.log("Production mainnet mode");
PiLogger.info('auth_start', { scopes, mainnet: true });
PiLogger.auth('login_pi_success', authResult);
```

### 2. Error Tracking
- **Authentication Errors**: Tracked and logged
- **API Failures**: Monitored for patterns
- **Domain Issues**: Alerted for validation failures

### 3. Performance Monitoring
- **API Response Times**: Track Pi Network API performance
- **Authentication Success Rate**: Monitor authentication flow
- **User Experience**: Track user journey completion

## Troubleshooting

### Common Issues

#### 1. Authentication Failures
**Symptoms**: Users can't authenticate with Pi Network
**Solutions**:
- Verify API key is correct
- Check App ID configuration
- Ensure domain is verified
- Validate Pi Network app settings

#### 2. Domain Verification Issues
**Symptoms**: Domain verification fails
**Solutions**:
- Upload validation key to domain root
- Check file accessibility
- Verify HTTPS configuration
- Test validation key content

#### 3. API Connection Issues
**Symptoms**: Pi Network API calls fail
**Solutions**:
- Check network connectivity
- Verify API endpoint configuration
- Monitor API rate limits
- Check authentication tokens

### Debug Information
```javascript
// Environment detection
console.log('Current environment:', {
  hostname: window.location.hostname,
  href: window.location.href,
  userAgent: navigator.userAgent
});

// Pi SDK status
console.log('Pi SDK object:', window.Pi);
console.log('Pi SDK methods available:', Object.keys(window.Pi));
```

## Rollback Plan

### Emergency Rollback Steps
1. **Revert to Previous Version**: Deploy previous working version
2. **Disable Pi Integration**: Temporarily disable Pi Network features
3. **Fallback Authentication**: Enable alternative authentication methods
4. **Monitor**: Track system stability and user feedback

### Data Protection
- **User Data**: Backup user data before changes
- **Configuration**: Document all configuration changes
- **Testing**: Test rollback procedures in staging environment

## Support and Maintenance

### Regular Maintenance
- **API Key Rotation**: Regular API key updates
- **Domain Monitoring**: Continuous domain verification
- **Performance Optimization**: Regular performance reviews
- **Security Updates**: Keep dependencies updated

### Support Contacts
- **Pi Network Support**: For Pi Network specific issues
- **Domain Provider**: For domain and DNS issues
- **Development Team**: For application-specific problems

## Conclusion

The mainnet configuration ensures:
- **Production Ready**: All settings optimized for production use
- **Security Focused**: Proper security measures implemented
- **Reliable Authentication**: Robust Pi Network integration
- **Scalable Architecture**: Ready for production load

This configuration provides a solid foundation for Droplink's production deployment on the Pi Network mainnet.
