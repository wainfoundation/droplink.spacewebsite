/**
 * Pi Network Utility Functions - Production Mode
 */
// Removed PiLogger import to prevent build issues
import { NativeFeature } from './pi-types';

// Check if running in Pi Browser - Production Mode
export const isRunningInPiBrowser = (): boolean => {
  try {
    // Check for Pi Browser specific user agent strings first
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('pibrowser') || userAgent.includes('pi network') || userAgent.includes('pi-browser')) {
      console.log('browser_check', { result: 'pi_browser_via_useragent' });
      return true;
    }
    
    // Check if we're on a Pi Network domain
    const currentUrl = window.location.href.toLowerCase();
    if (currentUrl.includes('minepi.com') || currentUrl.includes('sandbox.minepi.com')) {
      console.log('browser_check', { result: 'pi_domain_detected' });
      return true;
    }
    
    // In production, we must be in actual Pi Browser
    if (typeof window !== 'undefined' && window.Pi) {
      console.log('browser_check', { result: 'pi_browser_detected' });
      return true;
    }
    
    console.log('browser_check', { result: 'not_pi_browser' });
    return false;
  } catch (error) {
    console.error('browser_check_error', error);
    return false;
  }
};

// Redirect to Pi Browser if not already in Pi Browser
export const redirectToPiBrowser = (currentUrl?: string): void => {
  const url = currentUrl || window.location.href;
  
  // Check if we're in sandbox mode
  const isSandbox = window.location.href.includes('sandbox.minepi.com') || 
                    import.meta.env.VITE_PI_SANDBOX === 'true';
  
  const piUrl = isSandbox 
    ? `https://sandbox.minepi.com/browser/open?url=${encodeURIComponent(url)}`
    : `https://minepi.com/browser/open?url=${encodeURIComponent(url)}`;
  
  console.log('redirect_to_pi_browser', { originalUrl: url, piUrl, isSandbox });
  window.location.href = piUrl;
};

// Auto-detect and redirect if not in Pi Browser
export const autoDetectAndRedirect = (): boolean => {
  const isPiBrowser = isRunningInPiBrowser();
  
  if (!isPiBrowser) {
    console.log("Not running in Pi Browser, redirecting...");
    console.log('auto_redirect', { reason: 'not_pi_browser' });
    redirectToPiBrowser();
    return false;
  }
  
  return true;
};

// Get native features available in Pi Browser
export const getNativeFeatures = async (): Promise<NativeFeature[]> => {
  try {
    if (!window.Pi) {
      console.warn('native_features_not_available', { reason: 'pi_sdk_not_available' });
      return [];
    }

    const features = await window.Pi.nativeFeaturesList();
    console.log('native_features_retrieved', { features });
    return features;
  } catch (error) {
    console.error('native_features_error', error);
    return [];
  }
};

// Check if ad network is supported
export const isAdNetworkSupported = async (): Promise<boolean> => {
  try {
    const features = await getNativeFeatures();
    const supported = features.includes("ad_network");
    console.log('ad_network_check', { supported, features });
    return supported;
  } catch (error) {
    console.error('ad_network_check_error', error);
    return false;
  }
};

// Initialize Pi SDK according to official documentation
export const initPiNetwork = (): boolean => {
  try {
    console.log("Initializing Pi Network SDK...");
    
    // Check if Pi SDK is available
    if (!window.Pi) {
      console.log("Pi SDK not available, using mock mode...");
      console.warn('init_pi_sdk_not_ready', { message: 'Pi SDK not yet loaded, using mock mode' });
      
      // Allow initialization to continue in mock mode
      console.log("Mock mode enabled - Pi SDK not required");
      return true;
    }

    console.log("Pi SDK found, initializing...");
    
    // Initialize Pi SDK according to official documentation
    try {
      window.Pi.init({ 
        version: "2.0",
        sandbox: false
      });
      console.log("Pi Network SDK initialized successfully");
      console.log('init_success', { version: "2.0" });
    } catch (initError) {
      console.warn("Pi SDK initialization failed, using mock mode:", initError);
      return true; // Continue in mock mode
    }

    // Test basic SDK functionality
    if (typeof window.Pi.authenticate !== 'function') {
      console.log("Pi SDK authenticate method not available, using mock mode");
      return true;
    }

    return true;
  } catch (error) {
    console.error("Pi Network initialization failed:", error);
    console.error('init_failed', error);
    // Return true to allow mock mode to continue
    return true;
  }
};

// Open share dialog in Pi Browser
export const openShareDialog = (title: string, message: string): void => {
  try {
    if (!window.Pi) {
      console.warn("Pi SDK not available for sharing");
      return;
    }

    window.Pi.openShareDialog(title, message);
    console.log('share_dialog_opened', { title, message });
  } catch (error) {
    console.error('share_dialog_error', error);
    console.error("Failed to open share dialog:", error);
  }
};

// Open URL in system browser
export const openUrlInSystemBrowser = async (url: string): Promise<void> => {
  try {
    if (!window.Pi) {
      console.warn("Pi SDK not available, opening in current browser");
      window.open(url, '_blank');
      return;
    }

    await window.Pi.openUrlInSystemBrowser(url);
    console.log('url_opened_in_system_browser', { url });
  } catch (error) {
    console.error('open_url_error', error);
    console.error("Failed to open URL in system browser:", error);
    // Fallback to regular browser
    window.open(url, '_blank');
  }
};
