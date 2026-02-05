
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async'
import SplashScreen from './components/SplashScreen.tsx'
import PiBrowserMobileOptimizer from './components/PiBrowserMobileOptimizer.tsx'
import { preloadPiSDK, loadPiSDK } from './utils/pi-sdk-loader'
import { piAuthService } from './services/piAuthService'
import { piAdNetworkService } from './services/piAdNetworkService'
import { domainValidationService } from './services/domainValidationService'
import { whiteScreenPreventionService } from './services/whiteScreenPrevention'
import { mainnetProductionFixService } from './services/mainnetProductionFix'
import { domainWhiteScreenFixService } from './services/domainWhiteScreenFix'
import { piBrowserDomainFixService } from './services/piBrowserDomainFix'
import { piSDKCORSHandlerService } from './services/piSDKCORSHandler'
import { piBrowserFixService } from './services/piBrowserFixService'

// Simplified Pi Browser detection
const isPiBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  const hostname = window.location.hostname.toLowerCase();
  
  return userAgent.includes('pibrowser') || 
         userAgent.includes('pi network') || 
         userAgent.includes('pi-browser') ||
         hostname.includes('pinet.com') ||
         hostname.includes('minepi.com') ||
         typeof window.Pi !== 'undefined';
};

const isPiMobile = () => {
  return isPiBrowser() && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const Root = () => {
  const [showSplash, setShowSplash] = useState(true); // Show splash screen
  const [isHydrated, setIsHydrated] = useState(false); // Start as not hydrated for proper loading
  const [isInitialized, setIsInitialized] = useState(false); // Track initialization
  
  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    console.log('🚀 Starting app initialization...');
    
    // Initialize Pi Browser fix service first
    piBrowserFixService.initialize();
    
    // Get browser detection results
    const status = piBrowserFixService.getStatus();
    const isPi = status.isPiBrowser;
    const isMobile = status.isPiMobile;
    
    console.log('🔍 Browser Detection:', {
      isPiBrowser: isPi,
      isPiMobile: isMobile,
      userAgent: navigator.userAgent,
      hostname: window.location.hostname
    });

    // Initialize Pi SDK (non-blocking)
    const initializePiSDK = async () => {
      try {
        if (isPi && !window.Pi) {
          console.log('📱 Loading Pi SDK...');
          await loadPiSDK();
        }
        
        if (window.Pi && typeof window.Pi.init === 'function') {
          // Initialize for mainnet (no sandbox flag)
          window.Pi.init({ version: "2.0" });
          console.log('✅ Pi SDK initialized for mainnet');
        }
      } catch (error) {
        console.warn('⚠️ Pi SDK initialization failed, continuing:', error);
      }
    };

    // Initialize services (non-blocking)
    const initializeServices = async () => {
      try {
        await Promise.all([
          piAuthService.initialize(),
          piAdNetworkService.initialize()
        ]);
        piAuthService.loadStoredAuth();
        console.log('✅ Services initialized');
      } catch (error) {
        console.warn('⚠️ Services initialization failed, continuing:', error);
      }
    };

    // Start initialization processes
    initializePiSDK();
    initializeServices();

    // Hydration logic
    const handleHydration = () => {
      if (isMobile) {
        // Pi Browser mobile: Short delay for stability
        setTimeout(() => {
          console.log('📱 Hydrating for Pi Browser mobile');
          setIsHydrated(true);
        }, 100);
      } else {
        // Other browsers: Immediate hydration
        console.log('🌐 Hydrating immediately');
        setIsHydrated(true);
      }
    };

    // Start hydration
    handleHydration();

    // Force initialization after timeout
    setTimeout(() => {
      if (!isInitialized) {
        console.log('⏰ Forcing initialization after timeout');
        setIsInitialized(true);
      }
    }, 3000);

    // Global error handlers
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
  
  return (
    <React.StrictMode>
      <HelmetProvider>
        <PiBrowserMobileOptimizer>
          {!isHydrated ? (
            <div 
              className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999
              }}
            >
              <div className="text-center space-y-4 px-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">Loading Droplink</h2>
                  <p className="text-sm text-gray-600">Initializing...</p>
                </div>
              </div>
            </div>
          ) : !isInitialized ? (
            <div 
              className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999
              }}
            >
              <div className="text-center space-y-4 px-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">Setting up Droplink</h2>
                  <p className="text-sm text-gray-600">Configuring services...</p>
                </div>
              </div>
            </div>
              ) : showSplash ? (
                <div key="splash-container">
                  <SplashScreen onComplete={handleSplashComplete} />
                </div>
              ) : (
                <App />
              )}
        </PiBrowserMobileOptimizer>
      </HelmetProvider>
    </React.StrictMode>
  );
};

// Error boundary for the entire app
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: any }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('App error:', error, errorInfo);
    
    // Check if it's a DOM manipulation error
    if (error.message && error.message.includes('removeChild')) {
      console.warn('DOM manipulation error detected - attempting recovery');
      // Try to recover by forcing a re-render
      setTimeout(() => {
        this.setState({ hasError: false, error: null });
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a DOM manipulation error and try to recover
      if (this.state.error && this.state.error.message && this.state.error.message.includes('removeChild')) {
        console.log('Attempting to recover from DOM manipulation error');
        return this.props.children;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">Please refresh the page to try again.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrap the app with error boundary
const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <Root />
  </ErrorBoundary>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<AppWithErrorBoundary />);
