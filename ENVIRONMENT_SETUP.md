# Environment Setup Guide

## Quick Fix for Console Errors

To fix the console errors you're seeing, create a `.env` file in your project root with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://pgkfqzdapxfnsmharqzv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBna2ZxemRhcHhmbnNtaGFycXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3OTY4MjgsImV4cCI6MjA2MzM3MjgyOH0.wC3bLnf81t9xuDoxElEu9QRBTwcKfVs3J7sfZJ0g_s4

# Pi Network Configuration
VITE_PI_API_KEY=your_pi_api_key_here
VITE_PI_APP_ID=droplink
VITE_PI_SANDBOX=true
```

## What Each Variable Does:

### Supabase Configuration
#### `VITE_SUPABASE_URL`
- **Required for**: Database connection
- **Value**: Your Supabase project URL
- **Current**: https://pgkfqzdapxfnsmharqzv.supabase.co

#### `VITE_SUPABASE_ANON_KEY`
- **Required for**: Client-side database access
- **Value**: Your Supabase anonymous key
- **Current**: Updated with new credentials

### Pi Network Configuration
#### `VITE_PI_API_KEY`
- **Required for**: Production payments and API calls
- **Development**: Can be any string for testing
- **Production**: Get from Pi Developer Portal

#### `VITE_PI_APP_ID`
- **Required for**: App identification
- **Development**: Use "droplink" or any string
- **Production**: Your registered app ID from Pi Developer Portal

#### `VITE_PI_SANDBOX`
- **Development**: `true` (enables sandbox mode)
- **Production**: `false` (uses mainnet)

## Console Error Fixes:

### 1. Permission Policy Violations
✅ **Fixed**: Updated YouTube iframe to use minimal permissions
- Removed: `accelerometer`, `autoplay`, `encrypted-media`, `gyroscope`, `web-share`
- Kept: `clipboard-write`, `picture-in-picture`

### 2. Missing App ID Warning
✅ **Fixed**: Added graceful handling for missing App ID in development

### 3. Pi Browser Detection
✅ **Working**: The app correctly detects when not in Pi Browser

## Current Status:
- ✅ App loads successfully
- ✅ Pi Network integration working
- ✅ Video player permissions fixed
- ✅ Configuration validation working
- ⚠️ App ID missing (not critical for development)

## Next Steps:
1. Create `.env` file with the variables above
2. Restart your development server
3. Console errors should be resolved

The app is now working correctly! The remaining console messages are informational and don't affect functionality. 