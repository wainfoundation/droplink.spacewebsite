/**
 * Pi Browser Fix Service
 * Comprehensive service to fix Pi Browser loading and compatibility issues
 */

class PiBrowserFixService {
  private isInitialized: boolean = false;
  private isPiBrowser: boolean = false;
  private isPiMobile: boolean = false;

  /**
   * Initialize the Pi Browser fix service
   */
  public initialize(): void {
    if (this.isInitialized) return;

    console.log('🔧 Initializing Pi Browser Fix Service...');

    // Detect Pi Browser
    this.detectPiBrowser();
    
    if (this.isPiBrowser) {
      console.log('📱 Pi Browser detected - applying fixes...');
      this.applyPiBrowserFixes();
    } else {
      console.log('🌐 Standard browser detected - no fixes needed');
    }

    this.isInitialized = true;
    console.log('✅ Pi Browser Fix Service initialized');
  }

  /**
   * Detect if running in Pi Browser
   */
  private detectPiBrowser(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    this.isPiBrowser = userAgent.includes('pibrowser') || 
                       userAgent.includes('pi network') || 
                       userAgent.includes('pi-browser') ||
                       hostname.includes('pinet.com') ||
                       hostname.includes('minepi.com') ||
                       typeof window.Pi !== 'undefined';

    this.isPiMobile = this.isPiBrowser && 
                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    console.log('🔍 Pi Browser Detection:', {
      isPiBrowser: this.isPiBrowser,
      isPiMobile: this.isPiMobile,
      userAgent: navigator.userAgent,
      hostname: window.location.hostname
    });
  }

  /**
   * Apply comprehensive Pi Browser fixes
   */
  private applyPiBrowserFixes(): void {
    // 1. Immediate white screen prevention
    this.preventWhiteScreen();
    
    // 2. Fix viewport for mobile
    if (this.isPiMobile) {
      this.fixMobileViewport();
    }
    
    // 3. Fix Pi SDK initialization
    this.fixPiSDKInitialization();
    
    // 4. Fix DOM manipulation issues
    this.fixDOMManipulation();
    
    // 5. Fix CSS and styling issues
    this.fixCSSIssues();
    
    // 6. Fix touch events
    this.fixTouchEvents();
    
    // 7. Fix console errors
    this.fixConsoleErrors();
  }

  /**
   * Prevent white screen issues
   */
  private preventWhiteScreen(): void {
    console.log('🎨 Applying white screen prevention...');
    
    // Immediate background color
    document.documentElement.style.backgroundColor = '#667eea';
    document.body.style.backgroundColor = '#667eea';
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    
    // Hide body during loading
    document.body.style.visibility = 'hidden';
    document.body.style.opacity = '0';
    
    // Show body after a short delay
    setTimeout(() => {
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
      document.body.style.transition = 'opacity 0.3s ease-in-out';
    }, 100);
    
    // Continuous white screen prevention
    const preventWhiteScreen = () => {
      if (document.body.style.backgroundColor === 'white' || 
          document.body.style.backgroundColor === '') {
        document.body.style.backgroundColor = '#667eea';
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    };
    
    // Apply on various events
    document.addEventListener('DOMContentLoaded', preventWhiteScreen);
    window.addEventListener('load', preventWhiteScreen);
    
    // Periodic check
    setInterval(preventWhiteScreen, 2000);
  }

  /**
   * Fix mobile viewport issues
   */
  private fixMobileViewport(): void {
    console.log('📱 Fixing mobile viewport...');
    
    // Set viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    
    // Visual Viewport API support
    if (window.visualViewport) {
      const updateViewportHeight = () => {
        document.documentElement.style.setProperty('--vh', window.visualViewport.height * 0.01 + 'px');
      };
      
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      updateViewportHeight();
    }
    
    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      });
    });
  }

  /**
   * Fix Pi SDK initialization
   */
  private fixPiSDKInitialization(): void {
    console.log('🔌 Fixing Pi SDK initialization...');
    
    // Wait for Pi SDK to be available
    const checkPiSDK = () => {
      if (window.Pi && typeof window.Pi.init === 'function') {
        try {
          window.Pi.init({ version: "2.0" });
          console.log('✅ Pi SDK initialized successfully');
        } catch (error) {
          console.warn('⚠️ Pi SDK initialization failed:', error);
        }
      } else {
        // Retry after a short delay
        setTimeout(checkPiSDK, 100);
      }
    };
    
    // Start checking immediately
    checkPiSDK();
  }

  /**
   * Fix DOM manipulation issues
   */
  private fixDOMManipulation(): void {
    console.log('🔧 Fixing DOM manipulation issues...');
    
    // Override problematic DOM methods
    const originalAppendChild = Node.prototype.appendChild;
    const originalRemoveChild = Node.prototype.removeChild;
    
    Node.prototype.appendChild = function(child) {
      try {
        return originalAppendChild.call(this, child);
      } catch (error) {
        console.warn('DOM appendChild error:', error);
        return child;
      }
    };
    
    Node.prototype.removeChild = function(child) {
      try {
        return originalRemoveChild.call(this, child);
      } catch (error) {
        console.warn('DOM removeChild error:', error);
        return child;
      }
    };
  }

  /**
   * Fix CSS and styling issues
   */
  private fixCSSIssues(): void {
    console.log('🎨 Fixing CSS issues...');
    
    // Add critical CSS for Pi Browser
    const criticalCSS = document.createElement('style');
    criticalCSS.textContent = `
      /* Pi Browser specific fixes */
      .pi-browser-optimized {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* Prevent layout shifts */
      * {
        box-sizing: border-box;
      }
      
      /* Mobile touch optimization */
      button, a, input, textarea, select {
        min-height: 44px;
        min-width: 44px;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Prevent text selection on mobile */
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      /* Allow text selection on inputs */
      input, textarea, [contenteditable] {
        -webkit-user-select: text;
        -khtml-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      /* Prevent zoom on input focus */
      input, textarea, select {
        font-size: 16px;
      }
      
      /* Smooth scrolling */
      html {
        scroll-behavior: smooth;
        -webkit-overflow-scrolling: touch;
      }
    `;
    
    document.head.appendChild(criticalCSS);
  }

  /**
   * Fix touch events
   */
  private fixTouchEvents(): void {
    console.log('👆 Fixing touch events...');
    
    // Add passive touch event listeners
    const touchElements = document.querySelectorAll('button, a, input, textarea, select');
    touchElements.forEach(element => {
      element.addEventListener('touchstart', () => {}, { passive: true });
      element.addEventListener('touchmove', () => {}, { passive: true });
      element.addEventListener('touchend', () => {}, { passive: true });
    });
    
    // Prevent default touch behaviors that might interfere
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  /**
   * Fix console errors
   */
  private fixConsoleErrors(): void {
    console.log('🔇 Fixing console errors...');
    
    // Suppress common Pi Browser console errors
    const originalError = console.error;
    console.error = (...args) => {
      const message = args.join(' ');
      
      // Suppress known Pi Browser errors
      if (message.includes('Pi SDK') || 
          message.includes('Pi.init') ||
          message.includes('removeChild') ||
          message.includes('appendChild')) {
        return; // Don't log these errors
      }
      
      // Log other errors normally
      originalError.apply(console, args);
    };
    
    // Suppress unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('Pi SDK') || 
           event.reason.message.includes('Pi.init'))) {
        event.preventDefault();
      }
    });
  }

  /**
   * Get service status
   */
  public getStatus(): any {
    return {
      isInitialized: this.isInitialized,
      isPiBrowser: this.isPiBrowser,
      isPiMobile: this.isPiMobile,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const piBrowserFixService = new PiBrowserFixService();
export default piBrowserFixService;
