import React, { useState, useEffect } from 'react';
import { X, Play, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { showInterstitialAdAdvanced, showRewardedAdAdvanced } from '@/utils/pi-ads';
import { isRunningInPiBrowser } from '@/utils/pi-utils';

interface AuthAdModalProps {
  isOpen: boolean;
  onAdWatched: () => void;
  userName?: string;
}

const AuthAdModal: React.FC<AuthAdModalProps> = ({
  isOpen,
  onAdWatched,
  userName = 'User'
}) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [adType, setAdType] = useState<'interstitial' | 'rewarded'>('interstitial');
  const { toast } = useToast();
  const isPiBrowser = isRunningInPiBrowser();

  useEffect(() => {
    if (!isOpen) {
      setAdError(null);
      setIsWatchingAd(false);
    }
  }, [isOpen]);

  const handleWatchAd = async (type: 'interstitial' | 'rewarded' = 'interstitial') => {
    try {
      setIsWatchingAd(true);
      setAdError(null);
      setAdType(type);

      if (!isPiBrowser) {
        throw new Error('Pi Browser is required to watch ads. Please use Pi Browser to access Droplink.');
      }

      if (!window.Pi || !window.Pi.Ads) {
        throw new Error('Pi Ads SDK not available. Please ensure you are using Pi Browser.');
      }

      let success = false;

      if (type === 'rewarded') {
        const result = await showRewardedAdAdvanced();
        if (result.success) {
          success = true;
          // Store that ad was watched (expires in 24 hours)
          localStorage.setItem('adWatchedTime', Date.now().toString());
          localStorage.setItem('adExpiryTime', (Date.now() + 24 * 60 * 60 * 1000).toString());
          
          toast({
            title: "Ad Watched Successfully!",
            description: "You now have access to Droplink.",
          });
        } else {
          throw new Error(result.error || 'Failed to show ad');
        }
      } else {
        success = await showInterstitialAdAdvanced();
        if (success) {
          // Store that ad was watched (expires in 24 hours)
          localStorage.setItem('adWatchedTime', Date.now().toString());
          localStorage.setItem('adExpiryTime', (Date.now() + 24 * 60 * 60 * 1000).toString());
          
          toast({
            title: "Ad Watched Successfully!",
            description: "You now have access to Droplink.",
          });
        } else {
          throw new Error('Failed to show ad');
        }
      }

      if (success) {
        setIsWatchingAd(false);
        onAdWatched();
      }
    } catch (error: any) {
      console.error('Error watching ad:', error);
      setAdError(error.message || 'Failed to load ad. Please try again.');
      setIsWatchingAd(false);
      
      toast({
        title: "Ad Error",
        description: error.message || "Failed to load ad. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPiBrowser = () => {
    window.open('https://minepi.com/Wain2020', '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header - No close button, ad is required */}
        <div className="flex items-center gap-3 p-6 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Play className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Welcome, {userName}!</h2>
            <p className="text-sm text-white/90">Watch an ad to access Droplink</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Info Alert */}
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              To access any pages in Droplink, you need to watch an ad. This helps support the Pi Network ecosystem.
            </AlertDescription>
          </Alert>

          {/* Pi Browser Required Card */}
          {!isPiBrowser && (
            <Card className="border-2 border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Pi Browser Required</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      To watch ads and access Droplink, please use Pi Browser.
                    </p>
                    <Button
                      onClick={handleDownloadPiBrowser}
                      variant="outline"
                      size="sm"
                      className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
                    >
                      Download Pi Browser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {adError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{adError}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {isPiBrowser && (
              <>
                <Button
                  onClick={() => handleWatchAd('interstitial')}
                  disabled={isWatchingAd}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {isWatchingAd && adType === 'interstitial' ? (
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
                  onClick={() => handleWatchAd('rewarded')}
                  disabled={isWatchingAd}
                  variant="outline"
                  className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  {isWatchingAd && adType === 'rewarded' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Loading Rewarded Ad...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Watch Rewarded Ad (Earn Pi)
                    </>
                  )}
                </Button>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t">
            <p className="text-xs text-gray-500">
              By watching this ad, you support the Pi Network ecosystem and gain access to Droplink.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthAdModal;

