/**
 * Mobile Ad Optimizer Service
 * Handles Pi Browser mobile optimization for ad system
 */

class MobileAdOptimizer {
  private isPiMobile: boolean = false;
  private isInitialized: boolean = false;

  /**
   * Initialize mobile optimization
   */
  public initialize(): void {
    if (this.isInitialized) return;

    this.detectPiMobile();
    
    if (this.isPiMobile) {
      this.applyMobileOptimizations();
      this.setupViewportHandling();
      this.preventWhiteScreen();
    }

    this.isInitialized = true;
    console.log('Mobile Ad Optimizer initialized for Pi Browser mobile:', this.isPiMobile);
  }

  /**
   * Detect Pi Browser mobile
   */
  private detectPiMobile(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const isPiBrowser = userAgent.includes('pibrowser') || 
                       userAgent.includes('pi network') || 
                       userAgent.includes('pi-browser');
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    this.isPiMobile = isPiBrowser && isMobile;
  }

  /**
   * Apply mobile-specific optimizations
   */
  private applyMobileOptimizations(): void {
    // Add mobile-specific CSS
    const style = document.createElement('style');
    style.id = 'mobile-ad-optimizer';
    style.textContent = `
      /* Mobile Ad System Optimizations */
      .pi-mobile-optimized {
        -webkit-overflow-scrolling: touch;
        overscroll-behavior: contain;
        transform: translateZ(0);
        will-change: transform;
        backface-visibility: hidden;
        perspective: 1000px;
      }
      
      .pi-mobile-optimized * {
        -webkit-tap-highlight-color: transparent;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      
      .pi-mobile-optimized input,
      .pi-mobile-optimized textarea,
      .pi-mobile-optimized [contenteditable] {
        -webkit-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
        user-select: text;
      }
      
      .pi-mobile-optimized button {
        min-height: 44px;
        min-width: 44px;
        touch-action: manipulation;
        -webkit-tap-highlight-color: transparent;
      }
      
      /* Prevent white screen */
      .ad-modal-container {
        min-height: calc(var(--vh, 1vh) * 100);
        background: rgba(0, 0, 0, 0.5);
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 9999;
      }
      
      .ad-modal-content {
        background: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        max-height: calc(var(--vh, 1vh) * 90);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      /* Loading states */
      .ad-loading {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
      
      /* Prevent zoom on input focus */
      input, textarea, select {
        font-size: 16px !important;
      }
      
      /* Safe area handling */
      .ad-modal-container {
        padding-top: env(safe-area-inset-top);
        padding-bottom: env(safe-area-inset-bottom);
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
      }
    `;
    
    document.head.appendChild(style);
  }

  /**
   * Setup viewport handling for mobile
   */
  private setupViewportHandling(): void {
    // Set viewport meta tag
    let viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.setAttribute('name', 'viewport');
      document.head.appendChild(viewport);
    }
    
    viewport.setAttribute('content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
    );

    // Setup visual viewport API
    if (window.visualViewport) {
      const updateViewportHeight = () => {
        const vh = window.visualViewport.height * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      };
      
      window.visualViewport.addEventListener('resize', updateViewportHeight);
      updateViewportHeight();
    }

    // Prevent zoom on input focus
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          );
        }
      });
    });
  }

  /**
   * Prevent white screen issues
   */
  private preventWhiteScreen(): void {
    // Add loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'mobile-ad-loading';
    loadingIndicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      color: white;
      font-size: 18px;
      font-weight: 500;
    `;
    loadingIndicator.innerHTML = `
      <div style="text-align: center;">
        <div style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px;"></div>
        <div>Loading Ad System...</div>
      </div>
      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(loadingIndicator);

    // Remove loading indicator after a short delay
    setTimeout(() => {
      const loading = document.getElementById('mobile-ad-loading');
      if (loading) {
        loading.style.opacity = '0';
        loading.style.transition = 'opacity 0.3s ease';
        setTimeout(() => loading.remove(), 300);
      }
    }, 1000);
  }

  /**
   * Get mobile status
   */
  public getIsPiMobile(): boolean {
    return this.isPiMobile;
  }

  /**
   * Optimize ad modal for mobile
   */
  public optimizeAdModal(modalElement: HTMLElement): void {
    if (!this.isPiMobile || !modalElement) return;

    modalElement.classList.add('pi-mobile-optimized');
    
    // Add touch event optimizations
    modalElement.addEventListener('touchstart', (e) => {
      e.preventDefault();
    }, { passive: false });

    // Prevent scroll on modal
    modalElement.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
  }

  /**
   * Cleanup optimizations
   */
  public cleanup(): void {
    const style = document.getElementById('mobile-ad-optimizer');
    if (style) {
      style.remove();
    }
    
    const loading = document.getElementById('mobile-ad-loading');
    if (loading) {
      loading.remove();
    }
  }
}

export const mobileAdOptimizer = new MobileAdOptimizer();
