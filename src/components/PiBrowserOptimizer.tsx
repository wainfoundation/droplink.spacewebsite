import React, { useEffect, useState } from 'react';

interface PiBrowserOptimizerProps {
  children: React.ReactNode;
}

const PiBrowserOptimizer: React.FC<PiBrowserOptimizerProps> = ({ children }) => {
  const [isPiBrowser, setIsPiBrowser] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);

  useEffect(() => {
    // Detect Pi Browser
    const userAgent = navigator.userAgent.toLowerCase();
    const isPiBrowserDetected = 
      userAgent.includes('pibrowser') || 
      userAgent.includes('pi network') || 
      userAgent.includes('pi-browser') ||
      window.location.href.includes('minepi.com') ||
      window.location.href.includes('pinet.com');

    setIsPiBrowser(isPiBrowserDetected);

    if (isPiBrowserDetected) {
      console.log('🔧 Pi Browser detected - applying essential optimizations');
      
      // Apply only essential optimizations
      document.body.classList.add('pi-browser-optimized');
      
      // Set viewport for mobile optimization
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }

      setIsOptimized(true);
      console.log('✅ Pi Browser optimizations applied');
    } else {
      console.log('🌐 Standard browser detected');
      setIsOptimized(true);
    }
  }, []);

  // Show loading state while optimizing
  if (!isOptimized) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00BFFF] mx-auto mb-4"></div>
          <p className="text-white text-lg">Initializing Droplink...</p>
          <p className="text-gray-400 text-sm mt-2">
            {isPiBrowser ? 'Optimizing for Pi Browser' : 'Loading mainnet configuration'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`pi-browser-optimized ${isPiBrowser ? 'pi-browser' : 'standard-browser'}`}>
      {children}
    </div>
  );
};

export default PiBrowserOptimizer;
