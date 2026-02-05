/**
 * Pi Network Ad Network Service
 * Based on official Pi Platform Documentation
 * https://github.com/pi-apps/pi-platform-docs.git
 */

export interface PiAdConfig {
  adUnitId: string;
  adType: 'banner' | 'interstitial' | 'rewarded';
  position?: 'top' | 'bottom' | 'center';
  size?: 'small' | 'medium' | 'large';
}

export interface PiAdCallbacks {
  onAdLoaded?: () => void;
  onAdFailedToLoad?: (error: any) => void;
  onAdClicked?: () => void;
  onAdClosed?: () => void;
  onAdRewarded?: (reward: any) => void;
}

class PiAdNetworkService {
  private isInitialized = false;
  private adsEnabled = false;
  private currentAds: Map<string, any> = new Map();

  /**
   * Initialize Pi Ad Network
   */
  async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined' || !window.Pi) {
        console.warn('Pi SDK not available for ads');
        return false;
      }

      // Check if ads are enabled in environment - Enable for mainnet
      const adsEnabled = import.meta.env.VITE_ENABLE_PI_ADS !== 'false';
      if (!adsEnabled) {
        console.log('Pi ads disabled in environment');
        return false;
      }

      this.adsEnabled = true;
      this.isInitialized = true;
      console.log('Pi Ad Network initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Pi Ad Network:', error);
      return false;
    }
  }

  /**
   * Load a banner ad
   */
  async loadBannerAd(config: PiAdConfig, callbacks?: PiAdCallbacks): Promise<boolean> {
    if (!this.isInitialized || !this.adsEnabled) {
      console.warn('Pi Ad Network not initialized or disabled');
      return false;
    }

    try {
      // Create ad container element
      const adContainer = this.createAdContainer(config);
      
      // Note: Banner ads are managed via Developer Portal settings (Loading Banner Ads)
      // Following official docs: https://github.com/pi-apps/pi-platform-docs/blob/main/ads.md
      // Banner ads are not supported via SDK, use interstitial/rewarded via Pi.Ads methods
      if (window.Pi && window.Pi.Ads) {
        // For banner ads, we rely on Developer Portal configuration
        // Interstitial and rewarded ads use Pi.Ads.showAd() method
        return true;
      }
    } catch (error) {
      console.error('Failed to load banner ad:', error);
      if (callbacks?.onAdFailedToLoad) {
        callbacks.onAdFailedToLoad(error);
      }
    }
    return false;
  }

  /**
   * Load an interstitial ad
   */
  async loadInterstitialAd(config: PiAdConfig, callbacks?: PiAdCallbacks): Promise<boolean> {
    if (!this.isInitialized || !this.adsEnabled) {
      console.warn('Pi Ad Network not initialized or disabled');
      return false;
    }

    try {
      // Following official docs: Pi.Ads.requestAd("interstitial") to preload
      if (window.Pi && window.Pi.Ads) {
        const response = await window.Pi.Ads.requestAd("interstitial");
        if (response.result === "AD_LOADED") {
          this.currentAds.set(config.adUnitId, { type: "interstitial", ready: true });
          callbacks?.onAdLoaded?.();
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load interstitial ad:', error);
      if (callbacks?.onAdFailedToLoad) {
        callbacks.onAdFailedToLoad(error);
      }
    }
    return false;
  }

  /**
   * Load a rewarded ad
   */
  async loadRewardedAd(config: PiAdConfig, callbacks?: PiAdCallbacks): Promise<boolean> {
    if (!this.isInitialized || !this.adsEnabled) {
      console.warn('Pi Ad Network not initialized or disabled');
      return false;
    }

    try {
      // Following official docs: Pi.Ads.requestAd("rewarded") to preload
      if (window.Pi && window.Pi.Ads) {
        const response = await window.Pi.Ads.requestAd("rewarded");
        if (response.result === "AD_LOADED") {
          this.currentAds.set(config.adUnitId, { type: "rewarded", ready: true });
          callbacks?.onAdLoaded?.();
          return true;
        }
      }
    } catch (error) {
      console.error('Failed to load rewarded ad:', error);
      if (callbacks?.onAdFailedToLoad) {
        callbacks.onAdFailedToLoad(error);
      }
    }
    return false;
  }

  /**
   * Show an ad - Following official docs: Pi.Ads.showAd(adType)
   */
  async showAd(adUnitId: string): Promise<boolean> {
    const ad = this.currentAds.get(adUnitId);
    if (!ad || !window.Pi?.Ads) {
      return false;
    }

    try {
      const adType = ad.type as "interstitial" | "rewarded";
      const response = await window.Pi.Ads.showAd(adType);
      
      if (adType === "rewarded" && response.result === "AD_REWARDED") {
        // IMPORTANT: Verify adId with Pi Platform API before rewarding
        // Official docs: https://github.com/pi-apps/pi-platform-docs/blob/main/ads.md#rewarded-ads-status-verification-with-pi-platform-api
      }
      
      return response.result === "AD_CLOSED" || response.result === "AD_REWARDED";
    } catch (error) {
      console.error('Failed to show ad:', error);
      return false;
    }
  }

  /**
   * Hide an ad
   */
  async hideAd(adUnitId: string): Promise<boolean> {
    const ad = this.currentAds.get(adUnitId);
    if (!ad) {
      console.warn('Ad not found:', adUnitId);
      return false;
    }

    try {
      await ad.hide();
      return true;
    } catch (error) {
      console.error('Failed to hide ad:', error);
      return false;
    }
  }

  /**
   * Remove an ad
   */
  async removeAd(adUnitId: string): Promise<boolean> {
    const ad = this.currentAds.get(adUnitId);
    if (!ad) {
      console.warn('Ad not found:', adUnitId);
      return false;
    }

    try {
      await ad.destroy();
      this.currentAds.delete(adUnitId);
      return true;
    } catch (error) {
      console.error('Failed to remove ad:', error);
      return false;
    }
  }

  /**
   * Create ad container element
   */
  private createAdContainer(config: PiAdConfig): HTMLElement {
    const container = document.createElement('div');
    container.id = `pi-ad-${config.adUnitId}`;
    container.className = 'pi-ad-container';
    
    // Add styling based on position and size
    const styles: Record<string, string> = {
      position: 'relative',
      width: '100%',
      zIndex: '1000'
    };

    if (config.position === 'top') {
      styles.top = '0';
      styles.position = 'fixed';
    } else if (config.position === 'bottom') {
      styles.bottom = '0';
      styles.position = 'fixed';
    }

    if (config.size === 'small') {
      styles.height = '50px';
    } else if (config.size === 'medium') {
      styles.height = '90px';
    } else if (config.size === 'large') {
      styles.height = '250px';
    }

    Object.assign(container.style, styles);
    return container;
  }

  /**
   * Check if ads are enabled
   */
  isAdsEnabled(): boolean {
    return this.adsEnabled && this.isInitialized;
  }

  /**
   * Get current ads count
   */
  getAdsCount(): number {
    return this.currentAds.size;
  }

  /**
   * Clear all ads
   */
  async clearAllAds(): Promise<void> {
    const adIds = Array.from(this.currentAds.keys());
    for (const adId of adIds) {
      await this.removeAd(adId);
    }
  }
}

// Export singleton instance
export const piAdNetworkService = new PiAdNetworkService();
export default piAdNetworkService;
