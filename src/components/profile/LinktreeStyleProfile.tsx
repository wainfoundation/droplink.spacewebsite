import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, Copy, ExternalLink, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import MobileProfileViewer from './MobileProfileViewer';

interface PublicProfile {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  theme?: string;
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
  };
}

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  clicks: number;
  type?: 'link' | 'tip' | 'product' | 'contact' | 'social';
}

interface LinktreeStyleProfileProps {
  profile?: PublicProfile;
  links?: Link[];
  isLoading?: boolean;
}

const LinktreeStyleProfile: React.FC<LinktreeStyleProfileProps> = ({ 
  profile, 
  links = [], 
  isLoading = false 
}) => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Use real profile data only
  const currentProfile = profile;
  const currentLinks = links;

  // Show loading state if no real data
  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Track profile view
    setViewCount(prev => prev + 1);
    
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // In production, you'd track this view in analytics
    console.log('Profile viewed:', currentProfile.username);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, [currentProfile.username]);

  const handleLinkClick = (link: Link) => {
    // Track link click
    console.log('Link clicked:', link.title);
    // In production, you'd track this in analytics
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
    }
  };

  const handleLike = () => {
    setLikeCount(prev => prev + 1);
    toast({
      title: "Thanks!",
      description: "Your support means a lot!",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  // Use mobile viewer for mobile devices
  if (isMobile) {
    return (
      <MobileProfileViewer
        profile={{
          username: currentProfile.username,
          displayName: currentProfile.displayName,
          bio: currentProfile.bio,
          avatar: currentProfile.avatar,
          isVerified: true
        }}
        links={currentLinks}
        onLinkClick={(linkId) => {
          const link = currentLinks.find(l => l.id === linkId);
          if (link) handleLinkClick(link);
        }}
        onShare={handleShare}
        onCopy={handleCopy}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 text-center">
          {/* Avatar */}
          <div className="relative mb-4">
            <img
              src={currentProfile.avatar}
              alt={`${currentProfile.username}'s avatar`}
              className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=' + (currentProfile.displayName || currentProfile.username).charAt(0).toUpperCase();
              }}
            />
            {/* Online indicator */}
            <div className="absolute bottom-2 right-1/2 transform translate-x-6 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          {/* Profile Info */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {currentProfile.displayName || currentProfile.username}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {currentProfile.bio || 'Welcome to my Droplink profile!'}
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-6 mb-6 text-sm text-gray-500">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{currentLinks.length}</div>
              <div>Links</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{viewCount}</div>
              <div>Views</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{likeCount}</div>
              <div>Likes</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-3 mb-6">
            <Button
              onClick={handleLike}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Heart className="h-4 w-4" />
              Like
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>

          {/* Links List */}
          <div className="space-y-4">
            {currentLinks && currentLinks.length > 0 ? (
              currentLinks
                .filter(link => link.is_active)
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link)}
                    className="block w-full px-6 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-3 group"
                  >
                    <span className="text-xl">{link.icon || '🔗'}</span>
                    <span>{link.title}</span>
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No links available yet.</p>
                <p className="text-sm">Check back later!</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>Powered by</span>
              <span className="font-semibold text-indigo-600">Droplink</span>
              <span>•</span>
              <span>Pi Network</span>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default LinktreeStyleProfile;
