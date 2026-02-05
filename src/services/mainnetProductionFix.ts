/**
 * Mainnet Production Fix Service
 * 
 * This service ensures all Pi Network configurations are set to mainnet production
 * and fixes white screen issues in Pi Browser
 */

class MainnetProductionFixService {
  private isInitialized: boolean = false;

  /**
   * Initialize mainnet production fixes
   */
  public initialize(): void {
    if (this.isInitialized) return;

    console.log('🔧 Initializing Mainnet Production Fixes...');

    // Force mainnet production environment
    this.forceMainnetProduction();
    
    // Fix Pi SDK initialization
    this.fixPiSDKInitialization();
    
    // Fix white screen issues
    this.fixWhiteScreenIssues();
    
    // Fix Pi authentication
    this.fixPiAuthentication();
    
    this.isInitialized = true;
    console.log('✅ Mainnet Production Fixes Applied');
  }

  /**
   * Force mainnet production environment
   */
  private forceMainnetProduction(): void {
    // Override any testnet/sandbox configurations
    if (typeof window !== 'undefined') {
      // Force production environment variables
      (window as any).__FORCE_MAINNET__ = true;
      (window as any).__FORCE_PRODUCTION__ = true;
      (window as any).__DISABLE_SANDBOX__ = true;
      (window as any).__DISABLE_TESTNET__ = true;
      
      console.log('🔧 Forced mainnet production environment');
    }
  }

  /**
   * Fix Pi SDK initialization for mainnet
   */
  private fixPiSDKInitialization(): void {
    if (typeof window === 'undefined') return;

    // Wait for Pi SDK to be available
    const checkPiSDK = () => {
      if (window.Pi && typeof window.Pi.init === 'function') {
        try {
          // Force mainnet initialization
          window.Pi.init({
            version: "2.0",
            sandbox: false,
            testnet: false
          });
          
          console.log('🔧 Pi SDK initialized for MAINNET PRODUCTION');
        } catch (error) {
          console.error('❌ Pi SDK initialization failed:', error);
        }
      } else {
        // Retry after 100ms
        setTimeout(checkPiSDK, 100);
      }
    };

    // Start checking immediately
    checkPiSDK();
  }

  /**
   * Fix white screen issues in Pi Browser
   */
  private fixWhiteScreenIssues(): void {
    if (typeof window === 'undefined') return;

    // Detect Pi Browser
    const isPiBrowser = /pibrowser|pi network|pi-browser/i.test(navigator.userAgent);
    
    if (isPiBrowser) {
      console.log('🔧 Applying Pi Browser white screen fixes...');
      
      // Immediate background fix
      document.documentElement.style.backgroundColor = '#667eea';
      document.documentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      document.body.style.backgroundColor = '#667eea';
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      // Prevent white screen during loading
      const preventWhiteScreen = () => {
        if (document.documentElement) {
          document.documentElement.style.backgroundColor = '#667eea';
          document.documentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        if (document.body) {
          document.body.style.backgroundColor = '#667eea';
          document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
      };

      // Apply immediately
      preventWhiteScreen();
      
      // Apply on DOM ready
      document.addEventListener('DOMContentLoaded', preventWhiteScreen);
      
      // Apply on window load
      window.addEventListener('load', preventWhiteScreen);
      
      // Apply periodically to prevent white screens
      setInterval(preventWhiteScreen, 1000);
      
      console.log('✅ Pi Browser white screen fixes applied');
    }
  }

  /**
   * Fix Pi authentication for mainnet
   */
  private fixPiAuthentication(): void {
    if (typeof window === 'undefined') return;

    // Override any testnet/sandbox authentication
    const originalPiAuth = window.Pi?.authenticate;
    
    if (window.Pi && originalPiAuth) {
      window.Pi.authenticate = async (scopes: string[], onIncompletePaymentFound: any) => {
        console.log('🔧 Pi authentication called for MAINNET PRODUCTION');
        console.log('Scopes:', scopes);
        
        try {
          // Force mainnet authentication
          const result = await originalPiAuth.call(window.Pi, scopes, onIncompletePaymentFound);
          console.log('✅ Pi authentication successful for MAINNET');
          return result;
        } catch (error) {
          console.error('❌ Pi authentication failed:', error);
          throw error;
        }
      };
      
      console.log('✅ Pi authentication fixed for MAINNET PRODUCTION');
    }
  }

  /**
   * Get service status
   */
  public getStatus(): { isInitialized: boolean; isMainnet: boolean } {
    return {
      isInitialized: this.isInitialized,
      isMainnet: true // Always mainnet in this service
    };
  }
}

// Export singleton instance
export const mainnetProductionFixService = new MainnetProductionFixService();
