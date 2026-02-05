import React, { useState } from 'react';
import { Play, Crown, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WatchAdModal from './WatchAdModal';
import { useUser } from '@/context/UserContext';
import { useAdAccess } from '@/hooks/useAdAccess';

interface AdAccessButtonProps {
  onAccessGranted?: () => void;
  title?: string;
  description?: string;
  contentName?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showPlanStatus?: boolean;
  disabled?: boolean;
}

const AdAccessButton: React.FC<AdAccessButtonProps> = ({
  onAccessGranted,
  title = "Watch Ad to Access Content",
  description = "Watch a Pi Network ad to access the requested content.",
  contentName = "this content",
  className = "",
  variant = "outline",
  size = "default",
  showPlanStatus = true,
  disabled = false
}) => {
  const { user, profile } = useUser();
  const { canAccessContent, isEliteUser, markAdWatched } = useAdAccess();
  const [showAdModal, setShowAdModal] = useState(false);

  // Check if user has a paid plan
  const hasPaidPlan = profile?.plan === 'elite' || profile?.plan === 'premium' || profile?.plan === 'pro';
  const isLoggedIn = !!user;

  const handleClick = () => {
    if (disabled) return;

    // If user has paid plan, grant access immediately
    if (hasPaidPlan) {
      onAccessGranted?.();
      return;
    }

    // If user can access content (recently watched ad), grant access
    if (canAccessContent) {
      onAccessGranted?.();
      return;
    }

    // If not logged in, redirect to auth
    if (!isLoggedIn) {
      window.location.href = '/auth';
      return;
    }

    // Show ad modal
    setShowAdModal(true);
  };

  const handleAdWatched = () => {
    markAdWatched();
    setShowAdModal(false);
    onAccessGranted?.();
  };

  const getButtonContent = () => {
    if (hasPaidPlan) {
      return (
        <>
          <Crown className="w-4 h-4" />
          <span>Ad-Free Access</span>
          {showPlanStatus && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {profile?.plan?.toUpperCase()}
            </Badge>
          )}
        </>
      );
    }

    if (canAccessContent) {
      return (
        <>
          <Play className="w-4 h-4" />
          <span>Access Content</span>
          <Badge variant="outline" className="ml-2 text-xs">
            Ad Watched
          </Badge>
        </>
      );
    }

    return (
      <>
        <Play className="w-4 h-4" />
        <span>Watch Ad to Access</span>
      </>
    );
  };

  const getButtonVariant = () => {
    if (hasPaidPlan) return "secondary";
    if (canAccessContent) return "default";
    return variant;
  };

  const getButtonClassName = () => {
    let baseClass = className;
    
    if (hasPaidPlan) {
      baseClass += " bg-green-100 text-green-700 border-green-200 hover:bg-green-200";
    } else if (canAccessContent) {
      baseClass += " bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200";
    }
    
    return baseClass;
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant={getButtonVariant()}
        size={size}
        className={getButtonClassName()}
        disabled={disabled}
      >
        {getButtonContent()}
      </Button>

      {/* Watch Ad Modal */}
      <WatchAdModal
        isOpen={showAdModal}
        onClose={() => setShowAdModal(false)}
        onAdWatched={handleAdWatched}
        title={title}
        description={description}
        contentName={contentName}
      />
    </>
  );
};

export default AdAccessButton;
