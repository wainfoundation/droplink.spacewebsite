import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AuthAdModal from './AuthAdModal';
import { useUser } from '@/context/UserContext';

interface PostAuthAdGateProps {
  children: React.ReactNode;
}

/**
 * PostAuthAdGate - Shows ad modal after Pi authentication and requires watching ad to access any pages
 */
const PostAuthAdGate: React.FC<PostAuthAdGateProps> = ({ children }) => {
  const [showAdModal, setShowAdModal] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const { isLoggedIn, user, profile } = useUser();
  const location = useLocation();

  // Excluded routes that don't require ad watching
  const excludedRoutes = [
    '/auth',
    '/login',
    '/signup',
    '/',
    '/home',
    '/about',
    '/contact',
    '/pricing',
    '/terms',
    '/privacy'
  ];

  // Check if current route is excluded
  const isExcludedRoute = excludedRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route)
  );

  // Check if user has watched an ad
  const checkAdAccess = () => {
    // If not logged in or excluded route, allow access
    if (!isLoggedIn || isExcludedRoute) {
      setHasAccess(true);
      setShowAdModal(false);
      return;
    }

    // Check if user is on an elite/premium plan (skip ads)
    const userPlan = localStorage.getItem('userPlan');
    if (userPlan === 'elite' || userPlan === 'premium') {
      setHasAccess(true);
      setShowAdModal(false);
      return;
    }

    // Check if ad was watched recently (24 hours)
    const adExpiryTime = localStorage.getItem('adExpiryTime');
    if (adExpiryTime) {
      const expiryTime = parseInt(adExpiryTime);
      const now = Date.now();
      
      if (now < expiryTime) {
        setHasAccess(true);
        setShowAdModal(false);
        return;
      }
    }

    // Check if user just authenticated (show ad modal)
    const justAuthenticated = sessionStorage.getItem('pi_just_authenticated');
    if (justAuthenticated === 'true') {
      setShowAdModal(true);
      setHasAccess(false);
      // Clear the flag
      sessionStorage.removeItem('pi_just_authenticated');
      return;
    }

    // No ad watched - require watching ad
    setShowAdModal(true);
    setHasAccess(false);
  };

  // Check access when user logs in or route changes
  useEffect(() => {
    checkAdAccess();
  }, [isLoggedIn, location.pathname, user]);

  const handleAdWatched = () => {
    // Store ad watched time (expires in 24 hours)
    localStorage.setItem('adWatchedTime', Date.now().toString());
    localStorage.setItem('adExpiryTime', (Date.now() + 24 * 60 * 60 * 1000).toString());
    
    setHasAccess(true);
    setShowAdModal(false);
  };

  // Get user name from profile or user metadata
  const getUserName = () => {
    if (profile?.username) return profile.username;
    if (profile?.display_name) return profile.display_name;
    if (user?.user_metadata?.username) return user.user_metadata.username;
    if (user?.user_metadata?.pi_username) return user.user_metadata.pi_username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // If ad modal is showing, show only the modal
  if (showAdModal) {
    return (
      <AuthAdModal
        isOpen={showAdModal}
        onAdWatched={handleAdWatched}
        userName={getUserName()}
      />
    );
  }

  // If has access, show children
  if (hasAccess) {
    return <>{children}</>;
  }

  // Loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-lg font-semibold text-gray-900">Checking Access</h2>
        <p className="text-sm text-gray-600">Verifying access requirements...</p>
      </div>
    </div>
  );
};

export default PostAuthAdGate;

