
/**
 * Pi Network Ads Module
 */
// Removed PiLogger import to prevent build issues

// Basic ad methods - Following official Pi Platform docs exactly
export const isAdReady = async (adType: "interstitial" | "rewarded"): Promise<{ type: string; ready: boolean }> => {
  try {
    if (!window.Pi?.Ads) {
      console.warn('Pi Ads not available:', { adType });
      return { type: adType, ready: false };
    }
    
    // Official docs: Pi.Ads.isAdReady(adType: AdType): Promise<IsAdReadyResponse>
    const response = await window.Pi.Ads.isAdReady(adType);
    return response;
  } catch (error) {
    console.error('Ad check error:', error);
    return { type: adType, ready: false };
  }
};

export const requestAd = async (adType: "interstitial" | "rewarded"): Promise<any> => {
  try {
    if (!window.Pi?.Ads) {
      throw new Error("Pi Ads not available");
    }
    
    // Official docs: Pi.Ads.requestAd(adType: AdType): Promise<RequestAdResponse>
    const response = await window.Pi.Ads.requestAd(adType);
    return response;
  } catch (error) {
    console.error("Error requesting ad:", error);
    throw error;
  }
};

export const showAd = async (adType: "interstitial" | "rewarded"): Promise<any> => {
  try {
    if (!window.Pi?.Ads) {
      throw new Error("Pi Ads not available");
    }
    
    // Official docs: Pi.Ads.showAd(adType: AdType): Promise<ShowAdResponse>
    const response = await window.Pi.Ads.showAd(adType);
    return response;
  } catch (error) {
    console.error("Error showing ad:", error);
    throw error;
  }
};

// Advanced ad methods with full error handling - Following official docs
export const showInterstitialAdAdvanced = async (): Promise<boolean> => {
  try {
    const isReadyResponse = await isAdReady("interstitial");
    
    if (isReadyResponse.ready === true) {
      const showResponse = await showAd("interstitial");
      return showResponse.result === "AD_CLOSED";
    }
    
    const requestResponse = await requestAd("interstitial");
    
    if (requestResponse.result !== "AD_LOADED") {
      return false;
    }
    
    const showResponse = await showAd("interstitial");
    return showResponse.result === "AD_CLOSED";
  } catch (error) {
    console.error('Interstitial ad error:', error);
    return false;
  }
};

export const showRewardedAdAdvanced = async (): Promise<{ success: boolean; adId?: string; error?: string }> => {
  try {
    // Check if ad is ready - Following official docs
    const isReadyResponse = await isAdReady("rewarded");
    
    if (isReadyResponse.ready === false) {
      // Request ad if not ready
      const requestResponse = await requestAd("rewarded");
      
      if (requestResponse.result === "ADS_NOT_SUPPORTED") {
        return { success: false, error: "ADS_NOT_SUPPORTED" };
      }
      
      if (requestResponse.result !== "AD_LOADED") {
        return { success: false, error: "AD_NOT_AVAILABLE" };
      }
    }
    
    // Show ad - Following official docs
    const showResponse = await showAd("rewarded");
    
    if (showResponse.result === "AD_REWARDED") {
      // IMPORTANT: Verify adId with Pi Platform API before rewarding user
      // Official docs: https://github.com/pi-apps/pi-platform-docs/blob/main/ads.md#rewarded-ads-status-verification-with-pi-platform-api
      return { success: true, adId: showResponse.adId };
    } else {
      return { success: false, error: showResponse.result };
    }
  } catch (error) {
    console.error('Rewarded ad error:', error);
    return { success: false, error: "UNEXPECTED_ERROR" };
  }
};
