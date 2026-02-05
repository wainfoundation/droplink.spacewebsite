#!/bin/bash

# 🚀 Droplink Production Deployment Script
# Complete production deployment automation

set -e  # Exit on any error

echo "🚀 Starting Droplink Production Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Step 1: Pre-deployment checks
print_status "Step 1: Running pre-deployment checks..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

print_success "Pre-deployment checks completed"

# Step 2: Install dependencies
print_status "Step 2: Installing dependencies..."
npm install
print_success "Dependencies installed"

# Step 3: Run linting
print_status "Step 3: Running code linting..."
npm run lint
print_success "Linting completed"

# Step 4: Build for production
print_status "Step 4: Building for production..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_success "Production build completed"

# Step 5: Validate build
print_status "Step 5: Validating production build..."

# Check if main files exist
if [ ! -f "dist/index.html" ]; then
    print_error "Build validation failed - index.html not found"
    exit 1
fi

if [ ! -f "dist/assets" ]; then
    print_error "Build validation failed - assets directory not found"
    exit 1
fi

print_success "Build validation completed"

# Step 6: Environment validation
print_status "Step 6: Validating environment variables..."

# Check for required environment variables
required_vars=(
    "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY"
    "VITE_PI_SERVER_API_KEY"
    "VITE_PI_VALIDATION_KEY"
    "VITE_APP_DOMAIN"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_warning "Environment variable $var is not set"
    else
        print_success "Environment variable $var is set"
    fi
done

# Step 7: Deploy to Vercel
print_status "Step 7: Deploying to Vercel..."

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please login first:"
    echo "Run: vercel login"
    exit 1
fi

# Deploy to production
vercel --prod --yes

print_success "Deployment to Vercel completed"

# Step 8: Post-deployment verification
print_status "Step 8: Running post-deployment verification..."

# Get deployment URL
deployment_url=$(vercel ls | grep -o 'https://[^[:space:]]*' | head -1)

if [ -z "$deployment_url" ]; then
    print_warning "Could not determine deployment URL"
else
    print_success "Deployment URL: $deployment_url"
    
    # Test deployment
    print_status "Testing deployment..."
    if curl -s -o /dev/null -w "%{http_code}" "$deployment_url" | grep -q "200"; then
        print_success "Deployment is accessible and responding"
    else
        print_warning "Deployment may not be fully ready yet"
    fi
fi

# Step 9: Final status
print_success "🎉 Production deployment completed successfully!"
print_status "Next steps:"
echo "1. Verify your deployment at: $deployment_url"
echo "2. Test all functionality in production"
echo "3. Set up monitoring and analytics"
echo "4. Configure custom domain if needed"
echo "5. Announce your launch!"

print_success "Droplink is now live in production! 🚀"
