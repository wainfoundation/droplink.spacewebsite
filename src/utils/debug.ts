// Debug utilities for development
export const debug = {
  log: (message: string, data?: any) => {
    if (import.meta.env.MODE === 'development') {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  
  warn: (message: string, data?: any) => {
    if (import.meta.env.MODE === 'development') {
      console.warn(`[DEBUG] ${message}`, data);
    }
  },
  
  error: (message: string, data?: any) => {
    if (import.meta.env.MODE === 'development') {
      console.error(`[DEBUG] ${message}`, data);
    }
  },
  
  // Check if we're in a browser environment
  isBrowser: () => typeof window !== 'undefined',
  
  // Check if we're in development mode
  isDevelopment: () => import.meta.env.MODE === 'development',
  
  // Check if we're in production mode
  isProduction: () => import.meta.env.MODE === 'production',
  
  // Get current environment info
  getEnvironmentInfo: () => ({
    mode: import.meta.env.MODE,
    isBrowser: typeof window !== 'undefined',
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
    location: typeof window !== 'undefined' ? window.location.href : 'N/A',
    timestamp: new Date().toISOString()
  })
};

export default debug;
