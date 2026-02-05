
/**
 * Pi Network SDK Type Definitions
 */

// Global Pi Network SDK types
declare global {
  interface Window {
    Pi: {
      init: (config: { version: string } | any) => Promise<void> | void;
      authenticate: (scopes: string[], onIncompletePaymentFound?: (payment: any) => any) => Promise<any>;
      getUser?: () => Promise<any>;
      currentUser?: () => any;
      createPayment?: (paymentData: any, callbacks: any) => void;
      openPayments?: () => Promise<any>;
      getBalance?: () => Promise<number>;
      getWalletAddress?: () => Promise<string>;
      logout: () => void;
      nativeFeaturesList?: () => Promise<string[]>;
      openShareDialog?: (title: string, message: string) => void;
      openUrlInSystemBrowser?: (url: string) => Promise<void>;
      payments?: {
        createPayment: (paymentData: any, callbacks: any) => Promise<any>;
        completePayment: (paymentId: string, txid: string) => Promise<any>;
        cancelPayment: (paymentId: string) => Promise<any>;
      };
      Ads?: {
        isAdReady: (adType: "interstitial" | "rewarded") => Promise<{ type: string; ready: boolean }>;
        requestAd: (adType: "interstitial" | "rewarded") => Promise<any>;
        showAd: (adType: "interstitial" | "rewarded") => Promise<any>;
      };
      ads?: {
        isAdReady: () => boolean;
        requestAd: () => Promise<any>;
        showAd: () => Promise<any>;
        showInterstitialAdAdvanced: (options: any) => Promise<any>;
        showRewardedAdAdvanced: (options: any) => Promise<any>;
      };
    };
  }
}

// Pi Network Authentication Types
export interface PiAuthResult {
  accessToken: string;
  user: {
    uid: string;
    username: string;
    roles?: string[];
  };
}

// Pi Network Payment Types
export interface PiPayment {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata?: any;
  to_address?: string;
  created_at: string;
  status: 'pending' | 'completed' | 'cancelled' | 'failed';
  transaction?: {
    txid: string;
    verified: boolean;
  };
}

// Pi Network User Types
export interface PiUser {
  uid: string;
  username: string;
  roles?: string[];
}

// Pi Network Ad Types
export interface PiAd {
  id: string;
  type: 'interstitial' | 'rewarded';
  data?: any;
}

// Pi Network Native Features
export type NativeFeature = string;

// Pi Network Configuration Types
export interface PiConfig {
  isPiBrowser: boolean;
  isSandbox: boolean;
  isProduction: boolean;
  apiKey: string;
  appId: string;
  sdkVersion: string;
}

// Pi Network Error Types
export interface PiError {
  message: string;
  code?: string;
  details?: any;
}

// Pi Network Callback Types
export interface PiPaymentCallbacks {
  onReadyForServerApproval?: (paymentId: string) => void;
  onReadyForServerCompletion?: (paymentId: string, txid: string) => void;
  onCancel?: (paymentId: string) => void;
  onError?: (error: PiError, payment?: PiPayment) => void;
}

export interface PiAdCallbacks {
  onAdLoaded?: (ad: PiAd) => void;
  onAdShown?: (ad: PiAd) => void;
  onAdFailed?: (error: PiError) => void;
  onAdRewarded?: (reward: any) => void;
}
