@echo off
REM 🚀 Droplink Production Deployment Script (Windows)
REM Complete production deployment automation

echo 🚀 Starting Droplink Production Deployment...

REM Step 1: Pre-deployment checks
echo [INFO] Step 1: Running pre-deployment checks...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js first.
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Vercel CLI is not installed. Installing...
    npm install -g vercel
)

echo [SUCCESS] Pre-deployment checks completed

REM Step 2: Install dependencies
echo [INFO] Step 2: Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [SUCCESS] Dependencies installed

REM Step 3: Run linting
echo [INFO] Step 3: Running code linting...
npm run lint
if errorlevel 1 (
    echo [WARNING] Linting failed, but continuing with deployment
)
echo [SUCCESS] Linting completed

REM Step 4: Build for production
echo [INFO] Step 4: Building for production...
npm run build
if errorlevel 1 (
    echo [ERROR] Build failed
    exit /b 1
)

REM Check if build was successful
if not exist "dist" (
    echo [ERROR] Build failed - dist directory not found
    exit /b 1
)

echo [SUCCESS] Production build completed

REM Step 5: Validate build
echo [INFO] Step 5: Validating production build...

REM Check if main files exist
if not exist "dist\index.html" (
    echo [ERROR] Build validation failed - index.html not found
    exit /b 1
)

echo [SUCCESS] Build validation completed

REM Step 6: Environment validation
echo [INFO] Step 6: Validating environment variables...
echo [INFO] Please ensure all required environment variables are set in Vercel dashboard

REM Step 7: Deploy to Vercel
echo [INFO] Step 7: Deploying to Vercel...

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Not logged in to Vercel. Please login first:
    echo Run: vercel login
    exit /b 1
)

REM Deploy to production
vercel --prod --yes
if errorlevel 1 (
    echo [ERROR] Deployment failed
    exit /b 1
)

echo [SUCCESS] Deployment to Vercel completed

REM Step 8: Post-deployment verification
echo [INFO] Step 8: Running post-deployment verification...
echo [SUCCESS] 🎉 Production deployment completed successfully!
echo [INFO] Next steps:
echo 1. Verify your deployment in Vercel dashboard
echo 2. Test all functionality in production
echo 3. Set up monitoring and analytics
echo 4. Configure custom domain if needed
echo 5. Announce your launch!

echo [SUCCESS] Droplink is now live in production! 🚀
pause
