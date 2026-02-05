#!/bin/bash

# 🚀 Droplink Backend Deployment Script
# This script automates the complete backend setup for Droplink

set -e  # Exit on any error

echo "🚀 Starting Droplink Backend Deployment..."

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

# Check if Supabase CLI is installed
check_supabase_cli() {
    print_status "Checking Supabase CLI installation..."
    
    if ! command -v supabase &> /dev/null; then
        print_error "Supabase CLI is not installed. Please install it first:"
        echo "npm install -g supabase"
        exit 1
    fi
    
    print_success "Supabase CLI is installed"
}

# Check if user is logged in to Supabase
check_supabase_login() {
    print_status "Checking Supabase login status..."
    
    if ! supabase status &> /dev/null; then
        print_warning "You need to login to Supabase. Please run:"
        echo "supabase login"
        exit 1
    fi
    
    print_success "Logged in to Supabase"
}

# Initialize Supabase project
init_supabase_project() {
    print_status "Initializing Supabase project..."
    
    if [ ! -f "supabase/config.toml" ]; then
        print_error "Supabase config not found. Please run:"
        echo "supabase init"
        exit 1
    fi
    
    print_success "Supabase project initialized"
}

# Link to Supabase project
link_supabase_project() {
    print_status "Linking to Supabase project..."
    
    # Check if already linked
    if supabase status &> /dev/null; then
        print_success "Already linked to Supabase project"
        return
    fi
    
    # Link to the project
    supabase link --project-ref pgkfqzdapxfnsmharqzv
    
    print_success "Linked to Supabase project"
}

# Deploy database schema
deploy_database_schema() {
    print_status "Deploying database schema..."
    
    # Apply the migration
    supabase db push
    
    print_success "Database schema deployed"
}

# Deploy edge functions
deploy_edge_functions() {
    print_status "Deploying edge functions..."
    
    # List of functions to deploy
    functions=(
        "check-admin"
        "user-management"
        "analytics"
        "pi-payment"
        "complete-payment"
        "process-subscription"
        "cancel-subscription"
        "import-pi-profile"
        "verify-pi-domain"
        "pinet-meta"
        "process-product-order"
        "secure-download"
        "record-tip"
    )
    
    for function in "${functions[@]}"; do
        if [ -d "supabase/functions/$function" ]; then
            print_status "Deploying function: $function"
            supabase functions deploy "$function"
            print_success "Deployed function: $function"
        else
            print_warning "Function directory not found: $function"
        fi
    done
    
    print_success "All edge functions deployed"
}

# Set up environment variables
setup_environment_variables() {
    print_status "Setting up environment variables..."
    
    # Create .env file if it doesn't exist
    if [ ! -f ".env" ]; then
        cat > .env << EOF
# Supabase Configuration
VITE_SUPABASE_URL=https://pgkfqzdapxfnsmharqzv.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBna2ZxemRhcHhmbnNtaGFycXp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3OTY4MjgsImV4cCI6MjA2MzM3MjgyOH0.wC3bLnf81t9xuDoxElEu9QRBTwcKfVs3J7sfZJ0g_s4

# Pi Network Configuration
VITE_PI_API_KEY=your_pi_api_key_here
VITE_PI_APP_ID=droplink
VITE_PI_SANDBOX=true

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id_here
EOF
        print_success "Created .env file"
    else
        print_warning ".env file already exists. Please check if it has the correct values."
    fi
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check if functions are accessible
    local base_url="https://pgkfqzdapxfnsmharqzv.supabase.co/functions/v1"
    
    # Test check-admin function
    print_status "Testing check-admin function..."
    curl -X POST "$base_url/check-admin" \
        -H "Content-Type: application/json" \
        -d '{"piUserId":"test","username":"test"}' \
        --max-time 10 || print_warning "check-admin function test failed"
    
    print_success "Deployment verification completed"
}

# Main deployment function
main() {
    echo "🎯 Droplink Backend Deployment"
    echo "================================"
    
    # Run all deployment steps
    check_supabase_cli
    check_supabase_login
    init_supabase_project
    link_supabase_project
    deploy_database_schema
    deploy_edge_functions
    setup_environment_variables
    verify_deployment
    
    echo ""
    echo "🎉 Backend deployment completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update your .env file with your Pi Network API key"
    echo "2. Test the application: npm run dev"
    echo "3. Check Supabase dashboard for any errors"
    echo ""
    echo "📚 Documentation: BACKEND_SETUP_GUIDE.md"
    echo "🔧 Configuration: ENVIRONMENT_SETUP.md"
}

# Run main function
main "$@" 