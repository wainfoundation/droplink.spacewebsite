/**
 * Pi Browser Domain Fix Service
 * 
 * This service specifically fixes Pi Browser issues for droplink.space and droplink2920.pinet.com
 */

class PiBrowserDomainFixService {
  private isInitialized: boolean = false;
  private currentDomain: string = '';
  private isPiBrowser: boolean = false;
  private isPiMobile: boolean = false;

  /**
   * Initialize Pi Browser domain fix
   */
  public initialize(): void {
    if (this.isInitialized) return;

    console.log('🔧 Initializing Pi Browser Domain Fix for droplink.space and droplink2920.pinet.com...');

    this.currentDomain = window.location.hostname;
    this.detectPiBrowser();
    this.applyDomainSpecificFixes();
    this.fixPiAuthentication();
    this.preventWhiteScreen();
    
    this.isInitialized = true;
    console.log('✅ Pi Browser Domain Fix initialized');
  }

  /**
   * Detect Pi Browser and domain
   */
  private detectPiBrowser(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    // Detect Pi Browser
    this.isPiBrowser = userAgent.includes('pibrowser') || 
                      userAgent.includes('pi network') || 
                      userAgent.includes('pi-browser') ||
                      hostname.includes('pinet.com') ||
                      hostname.includes('minepi.com');
    
    // Detect Pi Browser Mobile
    this.isPiMobile = this.isPiBrowser && (
      userAgent.includes('android') ||
      userAgent.includes('iphone') ||
      userAgent.includes('ipad') ||
      userAgent.includes('mobile')
    );

    console.log('🔍 Pi Browser Detection:', {
      domain: this.currentDomain,
      isPiBrowser: this.isPiBrowser,
      isPiMobile: this.isPiMobile,
      userAgent: userAgent.substring(0, 50) + '...'
    });
  }

  /**
   * Apply domain-specific fixes for droplink.space and droplink2920.pinet.com
   */
  private applyDomainSpecificFixes(): void {
    // Check if we're on the correct domains
    const isDroplinkDomain = this.currentDomain.includes('droplink.space') || 
                            this.currentDomain.includes('droplink2920.pinet.com');
    
    // Also check for Pi Browser domains
    const isPiBrowserDomain = this.currentDomain.includes('pinet.com') || 
                             this.currentDomain.includes('minepi.com');
    
    if (!isDroplinkDomain && !isPiBrowserDomain) {
      console.warn('⚠️ Not on droplink.space, droplink2920.pinet.com, or Pi Browser domain');
      return;
    }

    console.log('✅ On correct domain:', this.currentDomain);
    console.log('✅ Droplink domain:', isDroplinkDomain);
    console.log('✅ Pi Browser domain:', isPiBrowserDomain);

    // Apply immediate fixes
    this.applyImmediateFixes();
    
    // Apply domain-specific CSS
    this.applyDomainCSS();
    
    // Apply Pi Browser optimizations
    if (this.isPiBrowser) {
      this.applyPiBrowserOptimizations();
    }
  }

  /**
   * Apply immediate fixes to prevent white screen
   */
  private applyImmediateFixes(): void {
    // Immediate background color
    // Use login page background to prevent white flash
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = '#ffffff';
      document.documentElement.style.background = 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #e0e7ff 100%)';
    }
    
    if (document.body) {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.background = 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #e0e7ff 100%)';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.minHeight = '100vh';
    }

    console.log('🎨 Applied immediate fixes for domain:', this.currentDomain);
  }

  /**
   * Apply domain-specific CSS
   */
  private applyDomainCSS(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* Droplink Domain White Screen Prevention */
      html, body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        background-color: #667eea !important;
        min-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      
      /* Pi Browser Mobile Optimizations */
      @media screen and (max-width: 768px) {
        html, body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          background-color: #667eea !important;
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
        
        /* Prevent zoom on input focus */
        input, textarea, select {
          font-size: 16px !important;
        }
      }
      
      /* Pi Browser Loading Overlay */
      .pi-browser-loading {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .pi-browser-spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255,255,255,0.3);
        border-top: 4px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    
    document.head.appendChild(style);
    console.log('🎨 Applied domain-specific CSS for:', this.currentDomain);
  }

  /**
   * Apply Pi Browser optimizations
   */
  private applyPiBrowserOptimizations(): void {
    // Create loading overlay for Pi Browser
    this.createPiBrowserLoadingOverlay();
    
    // Apply Pi Browser specific optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Pi Browser Specific Optimizations */
      body {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      /* Allow text selection on inputs */
      input, textarea, [contenteditable] {
        -webkit-user-select: text;
        user-select: text;
      }
      
      /* Optimize touch targets */
      button, a, input, textarea, select {
        min-height: 44px;
        min-width: 44px;
      }
      
      /* Prevent white screen flash */
      * {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
    `;
    
    document.head.appendChild(style);
    console.log('🔧 Applied Pi Browser optimizations');
  }

  /**
   * Create Pi Browser loading overlay
   */
  private createPiBrowserLoadingOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = 'pi-browser-loading';
    overlay.id = 'pi-browser-domain-loading';
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div class="pi-browser-spinner"></div>
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">Loading Droplink</div>
        <div style="font-size: 16px; color: rgba(255,255,255,0.8);">Pi Browser Detected</div>
        <div style="font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 8px;">Domain: ${this.currentDomain}</div>
        <div style="font-size: 12px; color: rgba(255,255,255,0.5); margin-top: 4px;">Initializing Pi Network...</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    console.log('📱 Created Pi Browser loading overlay');
  }

  /**
   * Fix Pi authentication for the domain
   */
  private fixPiAuthentication(): void {
    if (!this.isPiBrowser) return;

    console.log('🔐 Fixing Pi authentication for domain:', this.currentDomain);

    // Wait for Pi SDK to be available
    const checkPiSDK = () => {
      if (window.Pi && typeof window.Pi.init === 'function') {
        try {
          // Initialize Pi SDK for mainnet
          window.Pi.init({
            version: "2.0",
            sandbox: false,
            testnet: false
          });
          
          console.log('✅ Pi SDK initialized for domain:', this.currentDomain);
          
          // Remove loading overlay after Pi SDK is ready
          setTimeout(() => {
            this.removeLoadingOverlay();
          }, 1000);
          
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
   * Prevent white screen issues
   */
  private preventWhiteScreen(): void {
    // Apply immediate background
    this.forceBackgroundColor();
    
    // Set up fallback mechanisms
    this.setupFallbackMechanisms();
    
    // Optimize viewport for mobile
    if (this.isPiMobile) {
      this.optimizeViewport();
    }
  }

  /**
   * Force background color
   */
  private forceBackgroundColor(): void {
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = '#667eea';
      document.documentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    if (document.body) {
      document.body.style.backgroundColor = '#667eea';
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }

  /**
   * Set up fallback mechanisms
   */
  private setupFallbackMechanisms(): void {
    // Fallback 1: Check and fix white screen every 100ms
    const fallbackTimer = setInterval(() => {
      if (this.isWhiteScreen()) {
        this.fixWhiteScreen();
      }
    }, 100);

    // Fallback 2: Force background on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
      this.forceBackgroundColor();
      this.removeLoadingOverlay();
    });

    // Fallback 3: Force background on window load
    window.addEventListener('load', () => {
      this.forceBackgroundColor();
      this.removeLoadingOverlay();
    });

    console.log('🔄 Set up fallback mechanisms for white screen prevention');
  }

  /**
   * Optimize viewport for mobile
   */
  private optimizeViewport(): void {
    // Set viewport meta tag for mobile
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    
    // Set up visual viewport API
    if (window.visualViewport) {
      const updateViewportHeight = () => {
        document.documentElement.style.setProperty('--vh', window.visualViewport.height * 0.01 + 'px');
      };
      
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      updateViewportHeight();
    }
    
    console.log('📱 Optimized viewport for mobile');
  }

  /**
   * Check if white screen is present
   */
  private isWhiteScreen(): boolean {
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    
    return (
      bodyStyle.backgroundColor === 'rgba(0, 0, 0, 0)' ||
      bodyStyle.backgroundColor === 'white' ||
      htmlStyle.backgroundColor === 'rgba(0, 0, 0, 0)' ||
      htmlStyle.backgroundColor === 'white'
    );
  }

  /**
   * Fix white screen
   */
  private fixWhiteScreen(): void {
    this.forceBackgroundColor();
    console.log('🔧 Fixed white screen for domain:', this.currentDomain);
  }

  /**
   * Remove loading overlay
   */
  private removeLoadingOverlay(): void {
    const overlay = document.getElementById('pi-browser-domain-loading');
    if (overlay) {
      overlay.remove();
      console.log('📱 Removed Pi Browser loading overlay');
    }
  }

  /**
   * Get service status
   */
  public getStatus(): {
    isInitialized: boolean;
    domain: string;
    isPiBrowser: boolean;
    isPiMobile: boolean;
  } {
    return {
      isInitialized: this.isInitialized,
      domain: this.currentDomain,
      isPiBrowser: this.isPiBrowser,
      isPiMobile: this.isPiMobile
    };
  }
}

// Export singleton instance
export const piBrowserDomainFixService = new PiBrowserDomainFixService();
