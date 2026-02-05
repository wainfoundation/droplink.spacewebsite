
export default {
  name: 'Droplink',
  slug: 'droplink',
  version: '1.0.0',
  platforms: ['web'],
  web: {
    bundler: 'vite',
    favicon: '/favicon-32x32.png'
  },
  extra: {
    piNetwork: {
      apiKey: process.env.VITE_PI_API_KEY,
      sandbox: true, // Enable sandbox mode
      supportedFeatures: [
        'authentication',
        'payments', 
        'wallet_address',
        'ads'
      ]
    }
  },
  security: {
    https: true,
    requiresPiBrowser: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' *.minepi.com; connect-src 'self' *.minepi.com *.supabase.co; img-src 'self' data: *.minepi.com",
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
  piNetwork: {
    compliance: {
      enforceHttps: true,
      requirePiBrowser: true,
      validatePayments: true,
      secureStorage: true,
      auditLogging: true
    }
  }
};
