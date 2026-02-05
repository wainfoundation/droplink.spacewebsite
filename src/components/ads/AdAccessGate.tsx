import React, { useState, useEffect } from 'react';
import WatchAdModal from './WatchAdModal';

interface AdAccessGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showModal?: boolean;
  title?: string;
  description?: string;
  contentName?: string;
}

const AdAccessGate: React.FC<AdAccessGateProps> = ({
  children,
  fallback,
  showModal = true,
  title = "Watch Ad to Access Content",
  description = "Watch a Pi Network ad to access the requested content.",
  contentName = "this page"
}) => {
  const [showAdModal, setShowAdModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isPiMobile, setIsPiMobile] = useState(false);

  // Detect Pi Browser mobile
  useEffect(() => {
    const isPiMobileDetected = /pibrowser|pi network|pi-browser/i.test(navigator.userAgent) && 
                              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    setIsPiMobile(isPiMobileDetected);

    if (isPiMobileDetected) {
      // Apply mobile-specific optimizations to prevent white screen
      const style = document.createElement('style');
      style.textContent = `
        .ad-access-gate {
          min-height: calc(var(--vh, 1vh) * 100);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .ad-access-gate * {
          -webkit-tap-highlight-color: transparent;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Check if user has access
  const checkAccess = () => {
    // Check if user is elite plan subscriber
    const isEliteUser = localStorage.getItem('userPlan') === 'elite' || 
                       localStorage.getItem('userPlan') === 'premium';
    
    if (isEliteUser) {
      setHasAccess(true);
      return;
    }

    // Check if user has watched an ad recently
    const adExpiryTime = localStorage.getItem('adExpiryTime');
    if (adExpiryTime) {
      const expiryTime = parseInt(adExpiryTime);
      const now = Date.now();
      
      if (now < expiryTime) {
        setHasAccess(true);
        return;
      }
    }

    // No access - show modal or fallback
    if (showModal) {
      setShowAdModal(true);
    } else {
      setHasAccess(false);
    }
  };

  // Handle ad watched
  const handleAdWatched = () => {
    setHasAccess(true);
    setShowAdModal(false);
  };

  // Handle modal close
  const handleModalClose = () => {
    setShowAdModal(false);
    setHasAccess(false);
  };

  // Check access on mount
  React.useEffect(() => {
    checkAccess();
  }, []);

  // If user has access, show children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If showing modal, show it
  if (showAdModal) {
    return (
      <>
        <WatchAdModal
          isOpen={showAdModal}
          onClose={handleModalClose}
          onAdWatched={handleAdWatched}
          title={title}
          description={description}
          contentName={contentName}
        />
        {fallback || <div className="min-h-screen bg-gray-50" />}
      </>
    );
  }

  // Show fallback content
  return (
    <div className={`min-h-screen bg-gray-50 ${isPiMobile ? 'ad-access-gate' : ''}`}>
      {fallback || <div className="min-h-screen bg-gray-50" />}
    </div>
  );
};

export default AdAccessGate;
