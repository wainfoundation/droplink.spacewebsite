/**
 * Domain White Screen Fix Service
 * 
 * This service specifically addresses domain-related white screen issues
 * by ensuring proper domain validation and Pi Browser compatibility
 */

class DomainWhiteScreenFixService {
  private isInitialized: boolean = false;
  private currentDomain: string = '';
  private isPiBrowser: boolean = false;
  private isPiMobile: boolean = false;
  private validationKey: string = '';

  /**
   * Initialize domain white screen fix
   */
  public initialize(): void {
    if (this.isInitialized) return;

    console.log('🔧 Initializing Domain White Screen Fix...');

    this.currentDomain = window.location.hostname;
    this.validationKey = import.meta.env.VITE_PI_VALIDATION_KEY || 
                        '7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a';
    
    this.detectEnvironment();
    this.applyDomainFixes();
    this.setupWhiteScreenPrevention();
    this.optimizeForPiBrowser();
    
    this.isInitialized = true;
    console.log('✅ Domain White Screen Fix initialized');
  }

  /**
   * Detect environment and browser type
   */
  private detectEnvironment(): void {
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

    console.log('🔍 Environment Detection:', {
      domain: this.currentDomain,
      isPiBrowser: this.isPiBrowser,
      isPiMobile: this.isPiMobile,
      userAgent: userAgent.substring(0, 50) + '...'
    });
  }

  /**
   * Apply domain-specific fixes
   */
  private applyDomainFixes(): void {
    // Apply immediate background to prevent white screen
    this.applyImmediateBackground();
    
    // Set up domain-specific optimizations
    this.setupDomainOptimizations();
    
    // Handle domain validation
    this.handleDomainValidation();
  }

  /**
   * Apply immediate background to prevent white screen
   */
  private applyImmediateBackground(): void {
    // Immediate background color to prevent white flash
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = '#667eea';
      document.documentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
    
    if (document.body) {
      document.body.style.backgroundColor = '#667eea';
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      document.body.style.minHeight = '100vh';
    }

    console.log('🎨 Applied immediate background to prevent white screen');
  }

  /**
   * Set up domain-specific optimizations
   */
  private setupDomainOptimizations(): void {
    // Add domain-specific CSS
    const style = document.createElement('style');
    style.textContent = `
      /* Domain White Screen Prevention */
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
      
      /* Loading overlay for Pi Browser */
      .pi-loading-overlay {
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
      
      .pi-loading-spinner {
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
    console.log('🎨 Applied domain-specific CSS optimizations');
  }

  /**
   * Handle domain validation
   */
  private handleDomainValidation(): void {
    const allowedDomains = [
      'droplink.space',
      'www.droplink.space',
      'droplink2920.pinet.com',
      'droplink.pinet.com',
      'pinet.com',
      'localhost',
      '127.0.0.1'
    ];

    const isAllowedDomain = allowedDomains.some(domain => 
      this.currentDomain.includes(domain)
    );

    if (!isAllowedDomain) {
      console.warn('⚠️ Domain not in allowed list:', this.currentDomain);
      // Apply additional fixes for unknown domains
      this.applyUnknownDomainFixes();
    } else {
      console.log('✅ Domain validation passed:', this.currentDomain);
    }
  }

  /**
   * Apply fixes for unknown domains
   */
  private applyUnknownDomainFixes(): void {
    // Force background color for unknown domains
    this.forceBackgroundColor();
    
    // Add additional CSS for unknown domains
    const style = document.createElement('style');
    style.textContent = `
      /* Unknown Domain Fixes */
      html, body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        background-color: #667eea !important;
        min-height: 100vh !important;
      }
      
      /* Force visibility */
      body {
        visibility: visible !important;
        opacity: 1 !important;
      }
    `;
    
    document.head.appendChild(style);
    console.log('🔧 Applied unknown domain fixes');
  }

  /**
   * Set up white screen prevention
   */
  private setupWhiteScreenPrevention(): void {
    // Create loading overlay for Pi Browser
    if (this.isPiBrowser) {
      this.createLoadingOverlay();
    }
    
    // Set up fallback mechanisms
    this.setupFallbackMechanisms();
    
    // Optimize viewport for mobile
    if (this.isPiMobile) {
      this.optimizeViewport();
    }
  }

  /**
   * Create loading overlay for Pi Browser
   */
  private createLoadingOverlay(): void {
    const overlay = document.createElement('div');
    overlay.className = 'pi-loading-overlay';
    overlay.id = 'pi-domain-loading';
    overlay.innerHTML = `
      <div style="text-align: center;">
        <div class="pi-loading-spinner"></div>
        <div style="font-size: 20px; font-weight: 600; margin-bottom: 10px;">Loading Droplink</div>
        <div style="font-size: 16px; color: rgba(255,255,255,0.8);">Initializing Pi Network...</div>
        <div style="font-size: 14px; color: rgba(255,255,255,0.6); margin-top: 8px;">Domain: ${this.currentDomain}</div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    console.log('📱 Created loading overlay for Pi Browser');
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

    // Fallback 4: Force background on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.forceBackgroundColor();
      }
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
   * Optimize for Pi Browser
   */
  private optimizeForPiBrowser(): void {
    if (!this.isPiBrowser) return;

    // Add Pi Browser specific optimizations
    const style = document.createElement('style');
    style.textContent = `
      /* Pi Browser Optimizations */
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
    `;
    
    document.head.appendChild(style);
    console.log('🔧 Applied Pi Browser optimizations');
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
    console.log('🔧 Fixed white screen');
  }

  /**
   * Force background color
   */
  private forceBackgroundColor(): void {
    // Use login page background to prevent white flash
    if (document.documentElement) {
      document.documentElement.style.backgroundColor = '#ffffff';
      document.documentElement.style.background = 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #e0e7ff 100%)';
    }
    
    if (document.body) {
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.background = 'linear-gradient(135deg, #eff6ff 0%, #ffffff 50%, #e0e7ff 100%)';
    }
  }

  /**
   * Remove loading overlay
   */
  private removeLoadingOverlay(): void {
    const overlay = document.getElementById('pi-domain-loading');
    if (overlay) {
      overlay.remove();
      console.log('📱 Removed loading overlay');
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
    validationKey: string;
  } {
    return {
      isInitialized: this.isInitialized,
      domain: this.currentDomain,
      isPiBrowser: this.isPiBrowser,
      isPiMobile: this.isPiMobile,
      validationKey: this.validationKey.substring(0, 10) + '...'
    };
  }
}

// Export singleton instance
export const domainWhiteScreenFixService = new DomainWhiteScreenFixService();
