/**
 * Domain Validation Service
 * Handles domain validation and Pi Browser detection for proper loading
 */

class DomainValidationService {
  private isInitialized: boolean = false;
  private currentDomain: string = '';
  private isPiBrowser: boolean = false;
  private validationKey: string = '';

  /**
   * Initialize domain validation service
   */
  public initialize(): void {
    if (this.isInitialized) return;

    this.currentDomain = window.location.hostname;
    this.validationKey = import.meta.env.VITE_PI_VALIDATION_KEY || 
                        '7511661aac4538b1832d2c9ba117f6d972b26a54640598d3fbb9824013c7079203f65b02d125be3f418605cfb89ba0e4443e3ec997e3800eb464df0bc5410d2a';
    
    this.detectPiBrowser();
    this.validateDomain();
    
    this.isInitialized = true;
    console.log('Domain Validation Service initialized:', {
      domain: this.currentDomain,
      isPiBrowser: this.isPiBrowser,
      validationKey: this.validationKey.substring(0, 10) + '...'
    });
  }

  /**
   * Detect if running in Pi Browser
   */
  private detectPiBrowser(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    // Check for Pi Browser user agent
    const isPiUserAgent = userAgent.includes('pibrowser') || 
                         userAgent.includes('pi network') || 
                         userAgent.includes('pi-browser');
    
    // Check for Pi Network domains
    const isPiDomain = hostname.includes('pinet.com') || 
                       hostname.includes('minepi.com') ||
                       hostname.includes('droplink2920.pinet.com');
    
    // Check for Pi SDK availability
    const hasPiSDK = typeof window.Pi !== 'undefined';
    
    this.isPiBrowser = isPiUserAgent || isPiDomain || hasPiSDK;
    
    console.log('Pi Browser Detection:', {
      userAgent: isPiUserAgent,
      domain: isPiDomain,
      sdk: hasPiSDK,
      hostname,
      result: this.isPiBrowser
    });
  }

  /**
   * Validate domain configuration with enhanced Pi Browser support
   */
  private validateDomain(): void {
    const allowedDomains = [
      'droplink.space',
      'www.droplink.space',
      'droplink2920.pinet.com',
      'droplink.pinet.com',
      'pinet.com',
      'localhost',
      '127.0.0.1'
    ];

    // Enhanced domain validation for Pi Browser
    const isAllowedDomain = allowedDomains.some(domain => {
      if (domain.includes('*')) {
        // Handle wildcard domains
        const pattern = domain.replace(/\*/g, '.*');
        const regex = new RegExp(`^${pattern}$`);
        return regex.test(this.currentDomain);
      }
      return this.currentDomain.includes(domain);
    });

    // Special handling for Pi Browser domains
    const isPiBrowserDomain = this.currentDomain.includes('pinet.com') || 
                             this.currentDomain.includes('minepi.com');
    
    // Special handling for droplink.space in Pi Browser
    const isDroplinkDomain = this.currentDomain.includes('droplink.space');
    
    if ((isPiBrowserDomain || isDroplinkDomain) && this.isPiBrowser) {
      console.log('✅ Pi Browser domain detected - bypassing strict validation');
      console.log('✅ Domain:', this.currentDomain, 'is allowed in Pi Browser');
      return; // Allow Pi Browser domains
    }

    if (!isAllowedDomain) {
      console.warn('⚠️ Domain not in allowed list:', this.currentDomain);
      console.warn('⚠️ This may cause issues in Pi Browser');
    } else {
      console.log('✅ Domain validation passed:', this.currentDomain);
    }

    console.log('Domain Validation:', {
      domain: this.currentDomain,
      isAllowed: isAllowedDomain,
      isPiBrowser: this.isPiBrowser,
      isPiBrowserDomain: isPiBrowserDomain,
      allowedDomains
    });
  }


  /**
   * Get current domain
   */
  public getCurrentDomain(): string {
    return this.currentDomain;
  }

  /**
   * Check if running in Pi Browser
   */
  public getIsPiBrowser(): boolean {
    return this.isPiBrowser;
  }

  /**
   * Get validation key
   */
  public getValidationKey(): string {
    return this.validationKey;
  }

  /**
   * Check if domain is Pi Network domain
   */
  public isPiNetworkDomain(): boolean {
    return this.currentDomain.includes('pinet.com') || 
           this.currentDomain.includes('minepi.com');
  }

  /**
   * Check if domain is production domain
   */
  public isProductionDomain(): boolean {
    return this.currentDomain.includes('droplink.space');
  }

  /**
   * Get appropriate redirect URL for Pi Browser
   */
  public getPiBrowserUrl(): string {
    if (this.isPiNetworkDomain()) {
      return window.location.href;
    }
    
    // Redirect to Pi Network domain for Pi Browser
    return 'https://droplink2920.pinet.com' + window.location.pathname + window.location.search;
  }

  /**
   * Handle domain-specific optimizations
   */
  public applyDomainOptimizations(): void {
    if (this.isPiBrowser) {
      // Apply Pi Browser specific optimizations
      document.body.classList.add('pi-browser-optimized');
      
      // Set viewport for Pi Browser
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        );
      }
      
      console.log('Applied Pi Browser optimizations');
    }
  }

  /**
   * Validate domain with Pi Network
   */
  public async validateWithPiNetwork(): Promise<boolean> {
    try {
      // Skip validation for localhost/development
      if (this.currentDomain === 'localhost' || this.currentDomain === '127.0.0.1') {
        console.log('✅ Localhost detected - skipping Pi Network validation');
        return true;
      }

      // Skip validation for non-production domains
      if (!this.currentDomain.includes('droplink.space') && !this.currentDomain.includes('pinet.com')) {
        console.log('✅ Non-production domain detected - skipping Pi Network validation');
        return true;
      }

      const validationUrl = `https://${this.currentDomain}/validation-key.txt`;
      
      // Check if we're in Pi Browser first
      if (!this.isPiBrowser) {
        console.log('✅ Not in Pi Browser - skipping Pi Network validation');
        return true;
      }

      const response = await fetch(validationUrl, {
        method: 'GET',
        mode: 'cors'
      });

      if (!response.ok) {
        console.error('Validation file not accessible:', validationUrl);
        return false;
      }

      const content = await response.text();
      const trimmedContent = content.trim();

      const isValid = trimmedContent === this.validationKey;
      
      console.log('Pi Network Domain Validation:', {
        url: validationUrl,
        isValid,
        expected: this.validationKey.substring(0, 10) + '...',
        received: trimmedContent.substring(0, 10) + '...'
      });

      return isValid;
    } catch (error) {
      console.error('Domain validation error:', error);
      // Don't fail the app if validation fails
      console.log('⚠️ Domain validation failed, but continuing app initialization');
      return true;
    }
  }

  /**
   * Get domain status
   */
  public getDomainStatus() {
    return {
      domain: this.currentDomain,
      isPiBrowser: this.isPiBrowser,
      isPiNetworkDomain: this.isPiNetworkDomain(),
      isProductionDomain: this.isProductionDomain(),
      validationKey: this.validationKey.substring(0, 10) + '...'
    };
  }
}

export const domainValidationService = new DomainValidationService();
