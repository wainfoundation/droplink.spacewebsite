
import React, { useState, useEffect } from "react";
import { Play, Volume2, AlertTriangle, ExternalLink, Clock, Users, Star, Zap } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface YouTubePlayerProps {
  videoId?: string;
  title?: string;
  description?: string;
}

const YouTubePlayer = ({ 
  videoId = "Oin7Ka7lXsg", // Updated to the new video ID
  title = "Droplink - Transform Your Pi Domain",
  description = "See how Droplink helps you monetize your Pi Network presence"
}: YouTubePlayerProps) => {
  const isMobile = useIsMobile();
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if iframe is blocked by CSP
    const checkIframeSupport = () => {
      try {
        const testIframe = document.createElement('iframe');
        testIframe.src = 'about:blank';
        testIframe.style.display = 'none';
        document.body.appendChild(testIframe);
        document.body.removeChild(testIframe);
        return true;
      } catch (error) {
        console.warn('Iframe support check failed:', error);
        return false;
      }
    };

    if (!checkIframeSupport()) {
      setIframeError(true);
    }
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIsLoading(false);
  };

  const fallbackContent = (
    <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
      <div className="text-center p-8">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Video Unavailable</h3>
        <p className="text-gray-600 mb-4">
          The video cannot be displayed due to browser security settings.
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-none mx-auto">
      {/* Professional Video Card - Full Screen Size */}
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full">

        {/* Video Container - Full Screen Size */}
        <div className="relative w-full">
          {/* Professional Video Frame - Maximized */}
          <div className="relative w-full bg-gray-900" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden', minHeight: '400px' }}>
            {iframeError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="h-8 w-8 text-white ml-1" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Video Unavailable</h3>
                  <p className="text-gray-300 mb-6 max-w-md">
                    The video cannot be displayed due to browser security settings.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 z-10">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-white text-sm">Loading video...</p>
                    </div>
                  </div>
                )}
                <iframe 
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?si=xbf409te2teMt74I&controls=1&rel=0&modestbranding=1&disablekb=1&autoplay=0&showinfo=0`}
                  title="Droplink Demo Video" 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                  referrerPolicy="strict-origin-when-cross-origin" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  loading="lazy"
                  className="rounded-none"
                />
              </>
            )}
          </div>

          {/* No text overlays - Clean video player */}
        </div>

        {/* Professional Video Info Section */}
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Video Details */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-600 mb-4 max-w-2xl">{description}</p>
              
              {/* Video Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>5:30 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>2.3K views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>4.9/5 rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  <span>HD Quality</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="border-gray-300">
                <Volume2 className="h-4 w-4 mr-2" />
                Turn on Sound
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Call to Action */}
      <div className="mt-8 text-center">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Ready to Transform Your Pi Domain?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of creators who are already using Droplink to monetize their Pi Network presence and build professional profiles.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
              <Zap className="h-5 w-5 mr-2" />
              Start Building Free
            </Button>
            <Button size="lg" variant="outline" className="border-gray-300 px-8 py-3">
              <Play className="h-5 w-5 mr-2" />
              Watch More Demos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YouTubePlayer;
