/**
 * Pi Network Ad Network Modal
 * Shows ads before users can access protected content
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Play, Eye, RefreshCw, Shield, Globe, Clock, SkipForward } from 'lucide-react';
import { isAdReady, requestAd, showAd } from '@/utils/pi-ads';
import { usePiAuth } from '@/hooks/usePiAuth';

interface AdNetworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdComplete: (success: boolean) => void;
  title?: string;
  description?: string;
  adType?: 'interstitial' | 'rewarded';
  skipEnabled?: boolean;
  skipAfterSeconds?: number;
}

interface AdStatus {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  duration: number;
  skipAfter: number;
}

export default function AdNetworkModal({
  isOpen,
  onClose,
  onAdComplete,
  title = "Watch Ad to Access Home",
  description = "Watch a short ad to unlock full access to Droplink home content",
  adType = "interstitial",
  skipEnabled = true,
  skipAfterSeconds = 5
}: AdNetworkModalProps) {
  const [adStatus, setAdStatus] = useState<AdStatus>({
    isReady: false,
    isLoading: true,
    error: null,
    duration: 30,
    skipAfter: skipAfterSeconds
  });
  const [skipCountdown, setSkipCountdown] = useState(skipAfterSeconds);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adNetworkSupported, setAdNetworkSupported] = useState(false);
  const { currentUser } = usePiAuth();

  // Check if Pi Network ad network is supported
  useEffect(() => {
    const checkAdNetworkSupport = async () => {
      try {
        if (typeof window !== 'undefined' && window.Pi?.nativeFeaturesList) {
          const nativeFeaturesList = await window.Pi.nativeFeaturesList();
          const supported = nativeFeaturesList.includes("ad_network");
          setAdNetworkSupported(supported);
          console.log('Ad network supported:', supported);
        } else {
          setAdNetworkSupported(false);
        }
      } catch (error) {
        console.error('Error checking ad network support:', error);
        setAdNetworkSupported(false);
      }
    };

    if (isOpen) {
      checkAdNetworkSupport();
    }
  }, [isOpen]);

  // Check ad readiness
  useEffect(() => {
    const checkAdReadiness = async () => {
      if (!isOpen || !adNetworkSupported) return;

      try {
        setAdStatus(prev => ({ ...prev, isLoading: true, error: null }));
        
        const ready = await isAdReady(adType);
        setAdStatus(prev => ({ 
          ...prev, 
          isReady: ready, 
          isLoading: false 
        }));

        if (!ready) {
          console.log('Ad not ready, requesting new ad...');
          await requestNewAd();
        }
      } catch (error) {
        console.error('Error checking ad readiness:', error);
        setAdStatus(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to check ad availability' 
        }));
      }
    };

    if (isOpen) {
      checkAdReadiness();
    }
  }, [isOpen, adNetworkSupported, adType]);

  // Skip countdown timer
  useEffect(() => {
    if (!isOpen || !skipEnabled || isWatchingAd) return;

    const timer = setInterval(() => {
      setSkipCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, skipEnabled, isWatchingAd]);

  // Request new ad
  const requestNewAd = useCallback(async () => {
    try {
      setAdStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await requestAd(adType);
      
      if (response.result === "ADS_NOT_SUPPORTED") {
        setAdStatus(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: "Ads not supported on this Pi Browser version" 
        }));
        return false;
      }
      
      if (response.result !== "AD_LOADED") {
        setAdStatus(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: "Failed to load ad" 
        }));
        return false;
      }
      
      setAdStatus(prev => ({ 
        ...prev, 
        isReady: true, 
        isLoading: false 
      }));
      
      return true;
    } catch (error) {
      console.error('Error requesting ad:', error);
      setAdStatus(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: "Failed to request ad" 
      }));
      return false;
    }
  }, [adType]);

  // Show ad
  const handleWatchAd = async () => {
    if (!adStatus.isReady && !adStatus.isLoading) {
      const success = await requestNewAd();
      if (!success) return;
    }

    try {
      setIsWatchingAd(true);
      setAdStatus(prev => ({ ...prev, isLoading: true, error: null }));
      
      const response = await showAd(adType);
      
      if (response.result === "AD_CLOSED" || response.result === "AD_REWARDED") {
        console.log('Ad completed successfully:', response.result);
        onAdComplete(true);
        onClose();
      } else {
        console.log('Ad not completed:', response.result);
        setAdStatus(prev => ({ 
          ...prev, 
          error: "Ad was not completed" 
        }));
        onAdComplete(false);
      }
    } catch (error) {
      console.error('Error showing ad:', error);
      setAdStatus(prev => ({ 
        ...prev, 
        error: "Failed to show ad" 
      }));
      onAdComplete(false);
    } finally {
      setIsWatchingAd(false);
      setAdStatus(prev => ({ ...prev, isLoading: false }));
    }
  };

  // Skip ad
  const handleSkipAd = () => {
    if (skipCountdown > 0) return;
    onAdComplete(false);
    onClose();
  };

  // Refresh ad
  const handleRefreshAd = async () => {
    await requestNewAd();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-sm">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pi Network Ads Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Pi Network Ads</span>
              </div>
              <Badge variant="default" className="bg-blue-600 text-white">
                Supported
              </Badge>
            </div>
            
            <div className="space-y-2 text-sm text-blue-800">
              <div>Real Pi Network Ad Network</div>
              <div>Using official Pi SDK ad network</div>
            </div>

            <Separator className="my-3" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Ad Ready:</span>
                <Badge variant={adStatus.isReady ? "default" : "secondary"}>
                  {adStatus.isLoading ? "Loading..." : adStatus.isReady ? "Yes" : "No"}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshAd}
                disabled={adStatus.isLoading}
                className="h-8"
              >
                <RefreshCw className={`w-4 h-4 ${adStatus.isLoading ? 'animate-spin' : ''}`} />
                <span className="ml-1">Refresh Ad</span>
              </Button>
            </div>
          </div>

          {/* Ad Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Duration: {adStatus.duration}s</span>
            </div>
            <div className="flex items-center gap-2">
              <SkipForward className="w-4 h-4 text-gray-500" />
              <span>Skip available: After {adStatus.skipAfter}s</span>
            </div>
          </div>

          {/* Error Display */}
          {adStatus.error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-sm text-red-800">
                <strong>Error:</strong> {adStatus.error}
              </div>
              {adStatus.error.includes("not supported") && (
                <div className="text-xs text-red-600 mt-1">
                  Please update your Pi Browser to the latest version.
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleWatchAd}
              disabled={adStatus.isLoading || isWatchingAd || !adNetworkSupported}
              className="w-full h-12 text-base font-medium"
            >
              <Play className="w-5 h-5 mr-2" />
              {isWatchingAd ? "Watching Ad..." : "Watch Ad to Continue"}
            </Button>

            {skipEnabled && (
              <Button
                variant="outline"
                onClick={handleSkipAd}
                disabled={skipCountdown > 0 || isWatchingAd}
                className="w-full"
              >
                {skipCountdown > 0 ? `Skip for Now (${skipCountdown}s)` : "Skip for Now"}
              </Button>
            )}
          </div>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Shield className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Pi Network Ads:</strong> This ad is powered by Pi Network's official ad network. 
              Watching ads helps support the platform and provides you with access to premium content.
            </div>
          </div>

          {/* User Info */}
          {currentUser && (
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              <Globe className="w-3 h-3" />
              <span>Signed in as: {currentUser.username || currentUser.uid}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
