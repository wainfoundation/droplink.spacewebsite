import React, { useState, useEffect } from 'react';
import { X, Play, Shield, Star, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { piAdNetworkService } from '@/services/piAdNetworkService';
import { mobileAdOptimizer } from '@/services/mobileAdOptimizer';

interface WatchAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdWatched: () => void;
  title?: string;
  description?: string;
  contentName?: string;
}

const WatchAdModal: React.FC<WatchAdModalProps> = ({
  isOpen,
  onClose,
  onAdWatched,
  title = "Watch Ad to Access Content",
  description = "Watch a Pi Network ad to access the requested content.",
  contentName = "this page"
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [isPiMobile, setIsPiMobile] = useState(false);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize mobile optimizer
  useEffect(() => {
    mobileAdOptimizer.initialize();
    setIsPiMobile(mobileAdOptimizer.getIsPiMobile());
  }, []);

  // Optimize modal for mobile when it opens
  useEffect(() => {
    if (isOpen && modalRef.current && isPiMobile) {
      mobileAdOptimizer.optimizeAdModal(modalRef.current);
    }
  }, [isOpen, isPiMobile]);

  const handleWatchAd = async () => {
    try {
      setIsWatchingAd(true);
      setAdError(null);

      // Initialize Pi Ad Network if not already done
      await piAdNetworkService.initialize();

      // Load and show interstitial ad
      const adConfig = {
        adUnitId: 'droplink-interstitial',
        adType: 'interstitial' as const,
        position: 'center' as const,
        size: 'large' as const
      };

      const adCallbacks = {
        onAdLoaded: () => {
          console.log('Ad loaded successfully');
        },
        onAdFailedToLoad: (error: any) => {
          console.error('Ad failed to load:', error);
          setAdError('Failed to load ad. Please try again.');
          setIsWatchingAd(false);
        },
        onAdClicked: () => {
          console.log('Ad clicked');
        },
        onAdClosed: () => {
          console.log('Ad closed');
          setIsWatchingAd(false);
          onAdWatched();
          toast({
            title: "Ad Watched Successfully!",
            description: "You now have access to the content.",
          });
        },
        onAdRewarded: (reward: any) => {
          console.log('Ad rewarded:', reward);
          setIsWatchingAd(false);
          onAdWatched();
          toast({
            title: "Ad Watched Successfully!",
            description: "You now have access to the content.",
          });
        }
      };

      // Load interstitial ad
      const adLoaded = await piAdNetworkService.loadInterstitialAd(adConfig, adCallbacks);
      
      if (!adLoaded) {
        throw new Error('Failed to load ad');
      }

    } catch (error: any) {
      console.error('Error watching ad:', error);
      setAdError(error.message || 'Failed to load ad. Please try again.');
      setIsWatchingAd(false);
      
      toast({
        title: "Ad Error",
        description: "Failed to load ad. Please try again or upgrade to skip ads.",
        variant: "destructive",
      });
    }
  };

  const handleUpgradeToElite = () => {
    // Navigate to pricing page or show upgrade modal
    window.location.href = '/pricing?plan=elite';
  };

  const handleDownloadPiBrowser = () => {
    // Open Pi Browser download page
    window.open('https://minepi.com/download', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{
      minHeight: isPiMobile ? 'calc(var(--vh, 1vh) * 100)' : '100%'
    }}>
      <div 
        ref={modalRef}
        className={`bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-y-auto ${
          isPiMobile ? 'pi-mobile-optimized' : ''
        }`} 
        style={{
          maxHeight: isPiMobile ? 'calc(var(--vh, 1vh) * 90)' : '90vh',
          touchAction: 'pan-y'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">👁️</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600">{description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Standard Browser Card */}
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Standard Browser</h3>
                  <p className="text-sm text-gray-700">
                    For the best experience, download Pi Browser from the App Store or Google Play.
                  </p>
                  <Button
                    onClick={handleDownloadPiBrowser}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Download Pi Browser
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Elite Plan Card */}
          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Elite Plan Users</h3>
                  <p className="text-sm text-gray-700">
                    Elite plan subscribers enjoy an ad-free experience across all Droplink pages. 
                    Upgrade to Elite plan to skip ads and get direct access to all content.
                  </p>
                  <Button
                    onClick={handleUpgradeToElite}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    Upgrade to Elite
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {adError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{adError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleWatchAd}
              disabled={isWatchingAd}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              {isWatchingAd ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Loading Ad...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Watch Ad to Continue
                </>
              )}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-xs text-gray-500">
              By watching this ad, you support the Pi Network ecosystem and gain access to the requested content.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Lightbulb className="w-4 h-4" />
              <p className="text-sm font-medium">
                Tip: Purchase the 10π "Ad-Free Experience" feature to skip ads and get direct access to all content!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchAdModal;
