/**
 * Pi Network Ads Helpers - Following Official Documentation
 * Based on: https://github.com/pi-apps/pi-platform-docs.git
 */

/**
 * Check if ad network is supported by checking native features
 * Official docs: Pi.nativeFeaturesList() should include "ad_network"
 */
export const isAdNetworkSupported = async (): Promise<boolean> => {
  try {
    if (!window.Pi || typeof window.Pi.nativeFeaturesList !== 'function') {
      return false;
    }

    // Official docs: Pi.nativeFeaturesList(): Promise<Array<NativeFeature>
    const nativeFeatures = await window.Pi.nativeFeaturesList();
    
    // Official docs: native features list should include "ad_network"
    const adNetworkSupported = nativeFeatures.includes("ad_network");
    
    return adNetworkSupported;
  } catch (error) {
    console.error('Error checking ad network support:', error);
    return false;
  }
};

/**
 * Get native features list
 * Official docs: Pi.nativeFeaturesList(): Promise<Array<NativeFeature>>
 */
export const getNativeFeatures = async (): Promise<string[]> => {
  try {
    if (!window.Pi || typeof window.Pi.nativeFeaturesList !== 'function') {
      return [];
    }

    const nativeFeatures = await window.Pi.nativeFeaturesList();
    return nativeFeatures;
  } catch (error) {
    console.error('Error getting native features:', error);
    return [];
  }
};

/**
 * Initialize Pi Ads - Following official docs
 */
export const initializePiAds = async (config?: {
  onReward?: (reward: any) => void;
  onAdError?: (error: any) => void;
  onAdNotSupported?: () => void;
}): Promise<boolean> => {
  try {
    // Check if Pi SDK is initialized
    if (!window.Pi) {
      config?.onAdNotSupported?.();
      return false;
    }

    // Check if ad network is supported
    const supported = await isAdNetworkSupported();
    if (!supported) {
      config?.onAdNotSupported?.();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error initializing Pi Ads:', error);
    config?.onAdError?.(error);
    return false;
  }
};

