import React, { useEffect, useState } from 'react';

interface PiBrowserMobileOptimizerProps {
  children: React.ReactNode;
}

const PiBrowserMobileOptimizer: React.FC<PiBrowserMobileOptimizerProps> = ({ children }) => {
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Detect Pi Browser mobile
    const isPiMobile = /pibrowser|pi network|pi-browser/i.test(navigator.userAgent) && 
                      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isPiMobile) {
      console.log('📱 Pi Browser mobile detected - applying essential optimizations');
      
      // Apply only essential optimizations to prevent conflicts
      const applyEssentialOptimizations = () => {
        // 1. Prevent white screen with immediate background
        document.body.style.backgroundColor = '#667eea';
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        
        // 2. Set viewport for mobile
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
        
        // 3. Visual Viewport API for mobile (essential only)
        if (window.visualViewport) {
          function updateViewportHeight() {
            document.documentElement.style.setProperty('--vh', window.visualViewport.height * 0.01 + 'px');
          }
          window.visualViewport.addEventListener('resize', updateViewportHeight);
          updateViewportHeight();
        }

        setIsOptimized(true);
        console.log('✅ Essential Pi Browser mobile optimizations applied');
      };

      // Apply optimizations immediately
      applyEssentialOptimizations();
    } else {
      // For non-Pi browsers, just mark as optimized
      setIsOptimized(true);
    }
  }, []);

  // Show loading state while optimizing
  if (!isOptimized) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999
        }}
      >
        <div className="text-center space-y-4 px-4">
          <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Optimizing for Pi Browser</h2>
            <p className="text-sm text-gray-600">Applying mobile optimizations...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default PiBrowserMobileOptimizer;