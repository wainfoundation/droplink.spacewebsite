
// Pi SDK loader following official Pi Network documentation
// Based on: https://github.com/pi-apps/pi-platform-docs.git

let piSDKLoaded = false;

export const loadPiSDK = async (): Promise<boolean> => {
  console.log('Loading Pi SDK following official documentation');

  // Return cached result if already loaded
  if (piSDKLoaded) {
    return true;
  }

  try {
    // Check if Pi SDK script is already loaded
    if (!window.Pi) {
      console.log('Pi SDK not available, loading from official CDN');
      
      // Load Pi SDK script following official documentation
      await loadPiSDKScript();
    }

    // Initialize Pi SDK following official documentation
    if (window.Pi && typeof window.Pi.init === 'function') {
      window.Pi.init({ version: "2.0" });
      console.log('Pi SDK initialized successfully following official docs');
    }

    piSDKLoaded = true;
    return true;
  } catch (error) {
    console.error('Pi SDK load error:', error);
    return false;
  }
};

const loadPiSDKScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.querySelector('script[src*="pi-sdk.js"]')) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    // Use official Pi Network SDK CDN as per documentation
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    console.log('Loading Pi SDK from official CDN');
    script.async = true;
    
    script.onload = () => {
      console.log('Pi SDK script loaded from official CDN');
      // Initialize Pi SDK following official documentation
      if (window.Pi && typeof window.Pi.init === 'function') {
        try {
          // Initialize following official docs: Pi.init({ version: "2.0" })
          window.Pi.init({ version: "2.0" });
          console.log('Pi SDK initialized following official documentation');
        } catch (error) {
          console.warn('Pi SDK initialization error:', error);
          // Don't block the app if Pi SDK fails to initialize
        }
      }
      resolve();
    };
    
    script.onerror = () => {
      const error = new Error('Failed to load Pi SDK script');
      console.error('Pi SDK script load error:', error);
      // Don't reject, just resolve to prevent blocking the app
      console.warn('Pi SDK script failed to load, continuing without it');
      resolve();
    };
    
    document.head.appendChild(script);
  });
};

// Preload Pi SDK when running in Pi Browser for better performance
export const preloadPiSDK = () => {
  if (typeof window !== 'undefined') {
    // Always try to preload, but don't block if it fails
    // Use setTimeout to make it completely non-blocking
    setTimeout(() => {
      loadPiSDK().catch(error => {
        console.error('Pi SDK preload error:', error);
        console.warn('Pi SDK preload failed, continuing without it');
      });
    }, 100);
  }
};

export default loadPiSDK;
