import React, { useState, useEffect, useRef } from "react";
import { Play, Volume2, AlertTriangle, ExternalLink } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductionYouTubePlayerProps {
  videoId?: string;
  title?: string;
  description?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
}

const ProductionYouTubePlayer = ({ 
  videoId = "9NANXmay6k0",
  title = "Droplink - Transform Your Pi Domain",
  description = "See how Droplink helps you monetize your Pi Network presence",
  showControls = true,
  autoPlay = false,
  muted = true
}: ProductionYouTubePlayerProps) => {
  const isMobile = useIsMobile();
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

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

  const buildYouTubeUrl = () => {
    const params = new URLSearchParams({
      si: 'xbf409te2teMt74I',
      rel: '0',
      modestbranding: '1',
      disablekb: '1',
      ...(showControls && { controls: '1' }),
      ...(autoPlay && { autoplay: '1' }),
      ...(muted && { mute: '1' })
    });

    return `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`;
  };

  const fallbackContent = (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
      <div className="text-center p-8 max-w-md">
        <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2 text-gray-900">Video Unavailable</h3>
        <p className="text-gray-600 mb-6">
          The video cannot be displayed due to browser security settings or network restrictions.
        </p>
        <div className="space-y-3">
          <div className="text-sm text-gray-500">
            <p>Or try refreshing the page</p>
          </div>
        </div>
      </div>
    </div>
  );

  const loadingContent = (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 z-10">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-sm text-gray-600">Loading video...</p>
      </div>
    </div>
  );

  return (
    <section className="py-8 md:py-16 px-2 md:px-4 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
            See Droplink in Action
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            Watch how creators are transforming their Pi domains into powerful business hubs
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto" ref={containerRef}>
          <div className={`relative ${isMobile ? '' : 'bg-white rounded-xl md:rounded-2xl shadow-xl'} overflow-hidden`}>
            {/* Video Container - Responsive 16:9 aspect ratio */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
              {iframeError ? (
                fallbackContent
              ) : (
                <>
                  {isLoading && loadingContent}
                  {isVisible && (
                    <iframe 
                      ref={iframeRef}
                      src={buildYouTubeUrl()}
                      title={`${title} - YouTube video player`}
                      frameBorder="0" 
                      allow="" 
                      referrerPolicy="strict-origin-when-cross-origin" 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                      onLoad={handleIframeLoad}
                      onError={handleIframeError}
                      loading="lazy"
                    />
                  )}
                  {!isVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-sm text-gray-600">Click to load video</p>
                        <button 
                          onClick={() => setIsVisible(true)}
                          className="mt-4 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Load Video
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Video Info - Hidden on mobile for full-screen experience */}
            {!isMobile && !iframeError && (
              <div className="p-3 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-1 md:mb-2">{title}</h3>
                <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">{description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Volume2 className="h-3 w-3 md:h-4 md:w-4" />
                      <span>Turn on sound for best experience</span>
                    </div>
                  </div>
                  <div className="text-xs md:text-sm text-primary font-medium">
                    Powered by Pi Network
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Call to Action - Mobile optimized */}
          <div className="text-center mt-6 md:mt-8">
            <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4 px-2">
              Ready to transform your Pi domain like this?
            </p>
            <div className="flex flex-col gap-3 md:flex-row md:gap-4 justify-center px-4 md:px-0">
              <a 
                href="/auth" 
                className="bg-gradient-to-r from-primary to-secondary text-white px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium hover:shadow-lg transition-all text-sm md:text-base text-center"
              >
                Start Building Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductionYouTubePlayer;
