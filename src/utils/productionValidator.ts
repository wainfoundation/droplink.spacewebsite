/**
 * Production Environment Validator
 * Validates all required environment variables and configurations for production
 */

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class ProductionValidator {
  private requiredEnvVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_PI_SERVER_API_KEY',
    'VITE_PI_VALIDATION_KEY',
    'VITE_APP_DOMAIN'
  ];

  private optionalEnvVars = [
    'VITE_PI_WALLET_ADDRESS',
    'VITE_APP_SUBDOMAIN',
    'VITE_DROPLINK_SUBDOMAIN'
  ];

  validateEnvironment(): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required environment variables
    this.requiredEnvVars.forEach(envVar => {
      if (!import.meta.env[envVar]) {
        errors.push(`Missing required environment variable: ${envVar}`);
      }
    });

    // Check optional environment variables
    this.optionalEnvVars.forEach(envVar => {
      if (!import.meta.env[envVar]) {
        warnings.push(`Missing optional environment variable: ${envVar}`);
      }
    });

    // Validate Supabase configuration
    this.validateSupabaseConfig(errors, warnings);

    // Validate Pi Network configuration
    this.validatePiNetworkConfig(errors, warnings);

    // Validate domain configuration
    this.validateDomainConfig(errors, warnings);

    // Validate production flags
    this.validateProductionFlags(errors, warnings);

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private validateSupabaseConfig(errors: string[], warnings: string[]) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && !supabaseUrl.startsWith('https://')) {
      errors.push('VITE_SUPABASE_URL must use HTTPS in production');
    }

    if (supabaseKey && supabaseKey.length < 100) {
      warnings.push('VITE_SUPABASE_ANON_KEY appears to be invalid (too short)');
    }
  }

  private validatePiNetworkConfig(errors: string[], warnings: string[]) {
    const piApiKey = import.meta.env.VITE_PI_SERVER_API_KEY;
    const piValidationKey = import.meta.env.VITE_PI_VALIDATION_KEY;
    const piSandbox = import.meta.env.VITE_PI_SANDBOX;

    if (piApiKey && piApiKey.length < 50) {
      warnings.push('VITE_PI_SERVER_API_KEY appears to be invalid (too short)');
    }

    if (piValidationKey && piValidationKey.length < 100) {
      warnings.push('VITE_PI_VALIDATION_KEY appears to be invalid (too short)');
    }

    if (import.meta.env.PROD && piSandbox === 'true') {
      errors.push('VITE_PI_SANDBOX should be false in production');
    }
  }

  private validateDomainConfig(errors: string[], warnings: string[]) {
    const appDomain = import.meta.env.VITE_APP_DOMAIN;
    const appSubdomain = import.meta.env.VITE_APP_SUBDOMAIN;

    if (appDomain && !appDomain.includes('.')) {
      errors.push('VITE_APP_DOMAIN must be a valid domain');
    }

    if (appSubdomain && !appSubdomain.includes('.')) {
      warnings.push('VITE_APP_SUBDOMAIN should be a valid subdomain');
    }
  }

  private validateProductionFlags(errors: string[], warnings: string[]) {
    const isProduction = import.meta.env.VITE_IS_PRODUCTION;
    const isMainnet = import.meta.env.VITE_IS_MAINNET;
    const isSandbox = import.meta.env.VITE_IS_SANDBOX;

    if (import.meta.env.PROD && isProduction !== 'true') {
      warnings.push('VITE_IS_PRODUCTION should be true in production');
    }

    if (import.meta.env.PROD && isMainnet !== 'true') {
      warnings.push('VITE_IS_MAINNET should be true in production');
    }

    if (import.meta.env.PROD && isSandbox === 'true') {
      errors.push('VITE_IS_SANDBOX should be false in production');
    }
  }

  // Validate API connectivity
  async validateApiConnectivity(): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      // Test Supabase connection
      await this.testSupabaseConnection();
    } catch (error) {
      errors.push(`Supabase connection failed: ${error}`);
    }

    try {
      // Test Pi Network connection
      await this.testPiNetworkConnection();
    } catch (error) {
      warnings.push(`Pi Network connection failed: ${error}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  private async testSupabaseConnection(): Promise<void> {
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }
  }

  private async testPiNetworkConnection(): Promise<void> {
    const piApiKey = import.meta.env.VITE_PI_SERVER_API_KEY;
    
    if (!piApiKey) {
      throw new Error('Pi Network API key not configured');
    }

    // Test Pi Network API connectivity
    const response = await fetch('https://api.minepi.com/v2/payments', {
      method: 'GET',
      headers: {
        'Authorization': `Key ${piApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Pi Network API returned ${response.status}`);
    }
  }

  // Get environment summary
  getEnvironmentSummary(): Record<string, any> {
    return {
      nodeEnv: import.meta.env.NODE_ENV,
      isProduction: import.meta.env.PROD,
      isDevelopment: import.meta.env.DEV,
      hasSupabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
      hasSupabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      hasPiApiKey: !!import.meta.env.VITE_PI_SERVER_API_KEY,
      hasPiValidationKey: !!import.meta.env.VITE_PI_VALIDATION_KEY,
      piSandbox: import.meta.env.VITE_PI_SANDBOX,
      piNetwork: import.meta.env.VITE_PI_NETWORK,
      appDomain: import.meta.env.VITE_APP_DOMAIN,
      timestamp: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const productionValidator = new ProductionValidator();

// Export validation functions
export const validateEnvironment = () => productionValidator.validateEnvironment();
export const validateApiConnectivity = () => productionValidator.validateApiConnectivity();
export const getEnvironmentSummary = () => productionValidator.getEnvironmentSummary();
