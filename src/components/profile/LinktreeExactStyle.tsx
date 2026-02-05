import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Share2, 
  ExternalLink, 
  CheckCircle,
  ArrowLeft,
  Menu
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PublicProfile {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  theme: string;
  is_active: boolean;
}

interface Link {
  id: string | number;
  title: string;
  url: string;
  icon?: string;
  is_active: boolean;
  clicks?: number;
}

interface DroplinkExactStyleProps {
  profile?: PublicProfile;
  links?: Link[];
  isLoading?: boolean;
}

const DroplinkExactStyle: React.FC<DroplinkExactStyleProps> = ({
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
      <div className="min-h-screen bg-black flex items-center justify-center">
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="text-white hover:text-white/80"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-white font-semibold">Profile</h1>
            <button className="text-white hover:text-white/80">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`${isMobile ? 'pt-20' : ''} p-6`}>
        <div className={`mx-auto ${isMobile ? 'max-w-sm' : 'max-w-md'}`}>
          {/* Profile Card - Exact Droplink Style */}
          <div className="bg-black text-white text-center">
            {/* Avatar */}
            <div className="relative mb-6">
              <img
                src={currentProfile.avatar}
                alt={`${currentProfile.username}'s avatar`}
                className="w-24 h-24 rounded-full mx-auto border-2 border-gray-700 shadow-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=' + (currentProfile.displayName || currentProfile.username).charAt(0).toUpperCase();
                }}
              />
              {/* Verification badge */}
              {currentProfile.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Profile Info */}
            <h1 className="text-2xl font-bold text-white mb-2">
              {currentProfile.displayName || currentProfile.username}
            </h1>
            <p className="text-sm text-gray-400 mb-6 px-4">
              {currentProfile.bio || 'Welcome to my Droplink profile!'}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400">
              <div className="text-center">
                <div className="font-semibold text-white">{currentLinks.length}</div>
                <div>Links</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">{viewCount}</div>
                <div>Views</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-white">{likeCount}</div>
                <div>Likes</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 mb-6">
              <Button
                onClick={handleLike}
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-800 hover:border-gray-500"
              >
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="text-white border-gray-600 hover:bg-gray-800 hover:border-gray-500"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            {/* Links List - Exact Droplink Style */}
            <div className="space-y-3">
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
                      className="block w-full px-6 py-4 rounded-lg bg-black border border-gray-800 text-white font-medium hover:bg-gray-900 hover:border-gray-700 transition-all duration-200 flex items-center justify-center gap-3 group"
                    >
                      <span className="text-xl">{link.icon || '🔗'}</span>
                      <span>{link.title}</span>
                      <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                    </a>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No links available yet.</p>
                  <p className="text-sm">Check back later!</p>
                </div>
              )}
            </div>

            {/* Footer - Droplink Branding */}
            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <span>Powered by</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-sm"></div>
                  <span className="font-semibold text-white">Droplink</span>
                </div>
                <span>•</span>
                <span>Pi Network</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroplinkExactStyle;
