/**
 * White Screen Prevention Service for Pi Browser
 * 
 * This service prevents white screen issues in Pi Browser by:
 * 1. Applying immediate background colors
 * 2. Managing DOM visibility during loading
 * 3. Providing fallback mechanisms
 * 4. Optimizing for mobile viewport handling
 */

class WhiteScreenPreventionService {
  private isPiMobile: boolean = false;
  private isInitialized: boolean = false;
  private fallbackTimer: NodeJS.Timeout | null = null;

  /**
   * Initialize white screen prevention
   */
  public initialize(): void {
    this.detectPiMobile();
    
    if (this.isPiMobile) {
      this.applyImmediatePreventions();
      this.setupFallbackMechanisms();
      this.optimizeViewport();
    }
    
    this.isInitialized = true;
    console.log('White screen prevention service initialized');
  }

  /**
   * Detect Pi Browser mobile
   */
  private detectPiMobile(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    this.isPiMobile = (
      userAgent.includes('pibrowser') || 
      userAgent.includes('pi network') || 
      userAgent.includes('pi-browser')
    ) && (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    );
    
    console.log('Pi Browser mobile detected for white screen prevention:', this.isPiMobile);
  }

  /**
   * Apply immediate white screen prevention measures
   */
  private applyImmediatePreventions(): void {
    // 1. Set immediate background to prevent white flash
    document.body.style.backgroundColor = '#667eea';
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    document.body.style.minHeight = '100vh';
    document.body.style.overflowX = 'hidden';

    // 2. Hide body initially to prevent white screen
    document.body.style.visibility = 'hidden';
    document.body.style.opacity = '0';

    // 3. Apply critical CSS immediately
    this.injectCriticalCSS();

    // 4. Set up loading overlay
    this.createLoadingOverlay();
  }

  /**
   * Inject critical CSS to prevent white screen
   */
  private injectCriticalCSS(): void {
    const criticalStyle = document.createElement('style');
    criticalStyle.id = 'white-screen-prevention';
    criticalStyle.textContent = `
      /* Critical CSS for white screen prevention */
      html, body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        min-height: 100vh !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow-x: hidden !important;
      }
      
      /* Prevent white flash during loading */
      body.loading {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        visibility: hidden;
        opacity: 0;
      }
      
      /* Smooth transition when ready */
      body.ready {
        visibility: visible;
        opacity: 1;
        transition: opacity 0.3s ease-in-out;
      }
      
      /* Mobile viewport optimization */
      @media screen and (max-width: 768px) {
        body {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
          min-height: calc(var(--vh, 1vh) * 100) !important;
        }
      }
      
      /* Pi Browser specific optimizations */
      .pi-browser-optimized {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
    `;
    
    document.head.appendChild(criticalStyle);
  }

  /**
   * Create loading overlay to prevent white screen
   */
  private createLoadingOverlay(): void {
    const overlay = document.createElement('div');
    overlay.id = 'white-screen-overlay';
    overlay.className = 'pi-browser-loading';
    overlay.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        color: white;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="text-align: center;">
          <div style="
            width: 60px;
            height: 60px;
            border: 4px solid rgba(255,255,255,0.3);
            border-top: 4px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          "></div>
          <h2 style="margin: 0 0 10px; font-size: 24px; font-weight: 600;">Loading Droplink</h2>
          <p style="margin: 0; font-size: 16px; opacity: 0.8;">Optimizing for Pi Browser...</p>
        </div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(overlay);
  }

  /**
   * Setup fallback mechanisms for stubborn white screens
   */
  private setupFallbackMechanisms(): void {
    // Fallback 1: Check and fix white screen every 100ms
    this.fallbackTimer = setInterval(() => {
      if (this.isPiMobile && this.isWhiteScreen()) {
        this.fixWhiteScreen();
      }
    }, 100);

    // Fallback 2: Force background on DOM ready
    document.addEventListener('DOMContentLoaded', () => {
      this.forceBackgroundColor();
    });

    // Fallback 3: Force background on window load
    window.addEventListener('load', () => {
      this.forceBackgroundColor();
    });
  }

  /**
   * Check if white screen is present
   */
  private isWhiteScreen(): boolean {
    const bodyStyle = window.getComputedStyle(document.body);
    const backgroundColor = bodyStyle.backgroundColor;
    const backgroundImage = bodyStyle.backgroundImage;
    
    return (
      backgroundColor === 'rgba(0, 0, 0, 0)' || 
      backgroundColor === 'white' || 
      backgroundColor === 'rgb(255, 255, 255)' ||
      backgroundImage === 'none'
    );
  }

  /**
   * Fix white screen by forcing background
   */
  private fixWhiteScreen(): void {
    document.body.style.backgroundColor = '#667eea';
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    document.body.style.minHeight = '100vh';
    
    // Also fix html element
    document.documentElement.style.backgroundColor = '#667eea';
    document.documentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  }

  /**
   * Force background color on all elements
   */
  private forceBackgroundColor(): void {
    if (this.isPiMobile) {
      // Force on body
      document.body.style.backgroundColor = '#667eea';
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      // Force on html
      document.documentElement.style.backgroundColor = '#667eea';
      document.documentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      // Force on root element
      const root = document.getElementById('root');
      if (root) {
        root.style.backgroundColor = '#667eea';
        root.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    }
  }

  /**
   * Optimize viewport for mobile
   */
  private optimizeViewport(): void {
    if (this.isPiMobile) {
      // Set viewport meta tag
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');

      // Set up visual viewport handling
      if (window.visualViewport) {
        const updateViewportHeight = () => {
          document.documentElement.style.setProperty('--vh', window.visualViewport.height * 0.01 + 'px');
        };
        window.visualViewport.addEventListener('resize', updateViewportHeight);
        updateViewportHeight();
      }
    }
  }

  /**
   * Show app when ready
   */
  public showApp(): void {
    if (this.isPiMobile) {
      // Remove loading overlay
      const overlay = document.getElementById('white-screen-overlay');
      if (overlay) {
        overlay.remove();
      }

      // Show body with smooth transition
      document.body.classList.remove('loading');
      document.body.classList.add('ready');
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';

      // Clear fallback timer
      if (this.fallbackTimer) {
        clearInterval(this.fallbackTimer);
        this.fallbackTimer = null;
      }

      console.log('App shown successfully in Pi Browser');
    }
  }

  /**
   * Get service status
   */
  public getStatus(): { isPiMobile: boolean; isInitialized: boolean } {
    return {
      isPiMobile: this.isPiMobile,
      isInitialized: this.isInitialized
    };
  }

  /**
   * Cleanup service
   */
  public cleanup(): void {
    if (this.fallbackTimer) {
      clearInterval(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    
    // Remove critical styles
    const criticalStyle = document.getElementById('white-screen-prevention');
    if (criticalStyle) {
      criticalStyle.remove();
    }
    
    // Remove overlay
    const overlay = document.getElementById('white-screen-overlay');
    if (overlay) {
      overlay.remove();
    }
  }
}

// Export singleton instance
export const whiteScreenPreventionService = new WhiteScreenPreventionService();
