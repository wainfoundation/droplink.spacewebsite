@echo off
echo 🚀 Setting up Droplink Dashboard...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Create environment files if they don't exist
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo # Pi Network Configuration
        echo VITE_PI_API_KEY=your_pi_api_key_here
        echo VITE_PI_SANDBOX=true
        echo.
        echo # Supabase Configuration
        echo VITE_SUPABASE_URL=your_supabase_url_here
        echo VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
        echo.
        echo # App Configuration
        echo VITE_APP_URL=http://localhost:5173
    ) > .env
    echo ⚠️  Please update the .env file with your actual API keys
)

REM Check if Pi Browser is mentioned
echo 📱 Pi Browser Check:
echo    Make sure you have Pi Browser installed for testing Pi Network features
echo    Download from: https://minepi.com/browser

REM Run linting
echo 🔍 Running linter...
npm run lint

REM Build check
echo 🏗️  Testing build...
npm run build

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo    1. Update your .env file with actual API keys
echo    2. Run 'npm run dev' to start development server
echo    3. Test Pi Network features in Pi Browser
echo    4. Check the documentation for more details
echo.
echo 📚 Documentation:
echo    - README.md - Main documentation
echo    - CONTRIBUTING.md - How to contribute
echo    - PROJECT_STRUCTURE.md - Project organization
echo    - ENVIRONMENT_SETUP.md - Environment setup guide

pause
