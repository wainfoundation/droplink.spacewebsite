#!/bin/bash

# Droplink Dashboard Setup Script
echo "🚀 Setting up Droplink Dashboard..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create environment files if they don't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# Pi Network Configuration
VITE_PI_API_KEY=your_pi_api_key_here
VITE_PI_SANDBOX=true

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# App Configuration
VITE_APP_URL=http://localhost:5173
EOF
    echo "⚠️  Please update the .env file with your actual API keys"
fi

# Check if Pi Browser is mentioned
echo "📱 Pi Browser Check:"
echo "   Make sure you have Pi Browser installed for testing Pi Network features"
echo "   Download from: https://minepi.com/browser"

# Run linting
echo "🔍 Running linter..."
npm run lint

# Build check
echo "🏗️  Testing build..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Update your .env file with actual API keys"
echo "   2. Run 'npm run dev' to start development server"
echo "   3. Test Pi Network features in Pi Browser"
echo "   4. Check the documentation for more details"
echo ""
echo "📚 Documentation:"
echo "   - README.md - Main documentation"
echo "   - CONTRIBUTING.md - How to contribute"
echo "   - PROJECT_STRUCTURE.md - Project organization"
echo "   - ENVIRONMENT_SETUP.md - Environment setup guide"
