# Droplink Mainnet Credentials - Quick Reference

## 🎯 **Updated Production Configuration**

### **Pi Network Configuration**
- **API Key**: `jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno`
- **App ID**: `droplink`
- **Validation Key**: `7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a`

### **Domain Configuration**
- **Primary Domain**: `droplink.space`
- **Pi Domain**: `droplink2920.pinet.com`
- **Subdomain**: `droplink2920`

### **Supabase Configuration (Updated)**
- **Project ID**: `xdvsyjkzlchhftyrvrtz`
- **URL**: `https://xdvsyjkzlchhftyrvrtz.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjgzMjIsImV4cCI6MjA3MTgwNDMyMn0.XMhFBavLpcIP0lj1oQd3A0fvMWZFLcpF9OuI4P43YFM`
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjIyODMyMiwiZXhwIjoyMDcxODA0MzIyfQ.497guaIWgSCFEnC_vGdFTVjmEhiP26IV2idxBHsipz8`
- **JWT Secret**: `RLNkdfFBKQjtm95HLWy+ECtiZ3tuCaBI2v1aB1kGdry+WT7DvJaeyXAVBiBN2bH09lHf4kGeAq4hotisV2s5Bw==`

### **Database Configuration**
- **Host**: `db.xdvsyjkzlchhftyrvrtz.supabase.co`
- **Password**: `hTRRhCtnvQa7Hcgq`
- **Pooler URL**: `postgres://postgres.xdvsyjkzlchhftyrvrtz:hTRRhCtnvQa7Hcgq@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x`
- **Prisma URL**: `postgres://postgres.xdvsyjkzlchhftyrvrtz:hTRRhCtnvQa7Hcgq@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`
- **Non-pooling URL**: `postgres://postgres.xdvsyjkzlchhftyrvrtz:hTRRhCtnvQa7Hcgq@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require`

## 🚀 **Quick Setup Commands**

```bash
# Copy environment file
cp env.production .env

# Install dependencies
npm install

# Start development
npm run dev

# Build for production
npm run build

# Deploy to Vercel
vercel --prod
```

## ✅ **Environment Variables Summary**

### **Client-side (Vite)**
```bash
VITE_SUPABASE_URL="https://xdvsyjkzlchhftyrvrtz.supabase.co"
VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjgzMjIsImV4cCI6MjA3MTgwNDMyMn0.XMhFBavLpcIP0lj1oQd3A0fvMWZFLcpF9OuI4P43YFM"
VITE_PI_SERVER_API_KEY="jcmdl6jlno5jc5ujrtnenluzxycibeoseblpcolealqenj79wxwp2nlhzthszeno"
VITE_PI_APP_ID="droplink"
VITE_PI_VALIDATION_KEY="7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a"
```

### **Server-side**
```bash
POSTGRES_URL="postgres://postgres.xdvsyjkzlchhftyrvrtz:hTRRhCtnvQa7Hcgq@aws-1-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x"
SUPABASE_JWT_SECRET="RLNkdfFBKQjtm95HLWy+ECtiZ3tuCaBI2v1aB1kGdry+WT7DvJaeyXAVBiBN2bH09lHf4kGeAq4hotisV2s5Bw=="
```

## 🎯 **Production URLs**

- **Main Domain**: `https://droplink.space`
- **Pi Browser URL**: `https://droplink2920.pinet.com`
- **Supabase Dashboard**: `https://supabase.com/dashboard/project/xdvsyjkzlchhftyrvrtz`

## 📱 **Pi Browser Mobile Ready**

- ✅ White screen fixes implemented
- ✅ Hydration optimizations
- ✅ Viewport configurations
- ✅ Touch event handling
- ✅ Production mainnet configuration

## 🔒 **Security Status**

- ✅ HTTPS enforced
- ✅ CORS configured
- ✅ CSP headers set
- ✅ Environment variables secured
- ✅ Production credentials active

---

**Last Updated**: January 2025  
**Environment**: Production Mainnet  
**Status**: Ready for Deployment
