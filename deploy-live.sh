#!/bin/bash

# ========================================
# DROPLINK LIVE DEPLOYMENT SCRIPT
# ========================================

echo "🚀 Starting Droplink Live Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed. dist directory not found."
    exit 1
fi

echo "✅ Build completed successfully!"

# Copy environment files
echo "📋 Setting up environment files..."
cp env.production .env.production

# Create production start script
echo "📝 Creating production start script..."
cat > start-live.js << 'EOF'
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Droplink in LIVE mode...');
console.log('🌐 Domain: https://droplink.space');
console.log('🔗 Pi Domain: https://droplink2920.pinet.com');
console.log('🔧 Environment: Production Mainnet');

// Start the production server
const server = spawn('npx', ['vite', 'preview', '--port', '3000', '--host'], {
  stdio: 'inherit',
  cwd: __dirname
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});
EOF

echo "✅ Production start script created!"

# Create deployment instructions
echo "📋 Creating deployment instructions..."
cat > DEPLOYMENT_INSTRUCTIONS.md << 'EOF'
# Droplink Live Deployment Instructions

## 🚀 Quick Deploy

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Follow the prompts to deploy

### Option 2: Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod --dir=dist`
3. Follow the prompts to deploy

### Option 3: Manual Server
1. Upload the `dist` folder to your server
2. Configure your web server to serve the files
3. Set up SSL certificate for HTTPS
4. Configure domain DNS to point to your server

## 🔧 Environment Variables

Make sure these environment variables are set in your hosting platform:

```bash
VITE_SUPABASE_URL=https://xdvsyjkzlchhftyrvrtz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjgzMjIsImV4cCI6MjA3MTgwNDMyMn0.XMhFBavLpcIP0lj1oQd3A0fvMWZFLcpF9OuI4P43YFM
VITE_APP_DOMAIN=droplink.space
VITE_APP_SUBDOMAIN=droplink2920.pinet.com
VITE_PI_SERVER_API_KEY=edr22s3psjofpb2nwiyejppzottvyecnmvu3syrq2i7xuk54nbbuewr3gavoelvy
VITE_PI_APP_ID=droplink
VITE_PI_VALIDATION_KEY=7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a
NODE_ENV=production
VITE_NODE_ENV=production
VITE_IS_PRODUCTION=true
VITE_IS_MAINNET=true
VITE_IS_SANDBOX=false
```

## 🌐 Domain Configuration

### DNS Settings
- Point `droplink.space` to your hosting platform
- Ensure SSL certificate is configured
- Set up redirects from www to non-www

### Pi Network Domain
- `droplink2920.pinet.com` should point to the same deployment
- Ensure validation key is accessible at `/validation-key.txt`

## ✅ Verification

After deployment, verify:
1. ✅ Site loads at https://droplink.space
2. ✅ Pi Network integration works
3. ✅ Authentication works
4. ✅ Database connections work
5. ✅ Validation key is accessible
6. ✅ Public profiles are shareable

## 🆘 Support

If you encounter issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Check Supabase dashboard for database issues
4. Verify domain DNS settings
EOF

echo "✅ Deployment instructions created!"

# Create a simple test script
echo "🧪 Creating test script..."
cat > test-live.js << 'EOF'
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xdvsyjkzlchhftyrvrtz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkdnN5amt6bGNoaGZ0eXJ2cnR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjgzMjIsImV4cCI6MjA3MTgwNDMyMn0.XMhFBavLpcIP0lj1oQd3A0fvMWZFLcpF9OuI4P43YFM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('❌ Supabase connection failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful!');
    return true;
  } catch (err) {
    console.error('❌ Connection test failed:', err);
    return false;
  }
}

testConnection();
EOF

echo "✅ Test script created!"

echo ""
echo "🎉 Droplink Live Deployment Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "1. Review DEPLOYMENT_INSTRUCTIONS.md"
echo "2. Deploy to your hosting platform"
echo "3. Configure environment variables"
echo "4. Test the live deployment"
echo ""
echo "🌐 Live URLs:"
echo "   Main: https://droplink.space"
echo "   Pi: https://droplink2920.pinet.com"
echo ""
echo "🔧 Test Connection: node test-live.js"
echo "🚀 Start Local: node start-live.js"
echo ""
