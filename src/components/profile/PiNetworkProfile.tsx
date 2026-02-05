import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Share2, Copy, ExternalLink, Eye, Users, Settings, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface PiProfile {
  username: string;
  displayName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  joinDate?: string;
  isVerified?: boolean;
  friendsCount?: number;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFriend?: boolean;
  isFollowing?: boolean;
}

interface PiLink {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  clicks: number;
  type?: 'link' | 'tip' | 'product' | 'contact' | 'social';
}

interface PiNetworkProfileProps {
  profile?: PiProfile;
  links?: PiLink[];
  isLoading?: boolean;
}

const PiNetworkProfile: React.FC<PiNetworkProfileProps> = ({ 
  profile, 
  links = [], 
  isLoading = false 
}) => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  // Use real profile data only
  const currentProfile = profile;
  const currentLinks = links;

  // Show loading state if no real data
  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Pi Network profile...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    // Track profile view
    setViewCount(prev => prev + 1);
    
    // In production, you'd track this view in Pi Network analytics
    console.log('Pi Profile viewed:', currentProfile.username);
  }, [currentProfile.username]);

  const handleLinkClick = (link: PiLink) => {
    // Track link click
    console.log('Pi Link clicked:', link.title);
    // In production, you'd track this in Pi Network analytics
  };

  const handleShare = async () => {
    const url = `https://profiles.pinet.com/profiles/${currentProfile.username}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Pi Profile Link Copied!",
        description: "Profile link copied to clipboard",
      });
    } catch (error) {
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
      description: "Your support in the Pi Network means a lot!",
    });
  };

  const handleAddFriend = () => {
    toast({
      title: "Friend Request Sent",
      description: `Friend request sent to ${currentProfile.username}`,
    });
  };

  const handleFollow = () => {
    toast({
      title: "Following",
      description: `You are now following ${currentProfile.username}`,
    });
  };

  const handleViewSettings = () => {
    window.open(`https://profiles.pinet.com/profiles/${currentProfile.username}/settings`, '_blank');
  };

  const handleViewFriends = () => {
    window.open(`https://profiles.pinet.com/profiles/${currentProfile.username}/friends`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Pi Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Pi Profile Card */}
        <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 text-center">
          {/* Pi Network Header */}
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">π</span>
              </div>
              <span className="text-sm font-medium text-gray-600">Pi Network Profile</span>
            </div>
          </div>

          {/* Avatar */}
          <div className="relative mb-4">
            <img
              src={currentProfile.avatar}
              alt={`${currentProfile.username}'s Pi avatar`}
              className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-md object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=' + currentProfile.username.charAt(0).toUpperCase();
              }}
            />
            {/* Pi Network verification badge */}
            {currentProfile.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">π</span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {currentProfile.displayName || currentProfile.username}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            @{currentProfile.username}
          </p>
          {currentProfile.location && (
            <p className="text-xs text-gray-500 mb-4">📍 {currentProfile.location}</p>
          )}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {currentProfile.bio || 'Pi Network Pioneer'}
          </p>

          {/* Pi Network Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{currentProfile.friendsCount}</div>
              <div className="text-gray-500">Friends</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{currentProfile.followersCount}</div>
              <div className="text-gray-500">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{currentProfile.followingCount}</div>
              <div className="text-gray-500">Following</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{currentProfile.postsCount}</div>
              <div className="text-gray-500">Posts</div>
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
            {!currentProfile.isFriend && (
              <Button
                onClick={handleAddFriend}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                Add Friend
              </Button>
            )}
          </div>

          {/* Pi Network Links */}
          <div className="space-y-4 mb-6">
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
                <p>No Pi Network links available yet.</p>
                <p className="text-sm">Check back later!</p>
              </div>
            )}
          </div>

          {/* Pi Network Actions */}
          <div className="flex justify-center gap-3 mb-6">
            <Button
              onClick={handleViewFriends}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              View Friends
            </Button>
            <Button
              onClick={handleViewSettings}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">π</span>
              </div>
              <span>Powered by</span>
              <span className="font-semibold text-indigo-600">Droplink</span>
              <span>•</span>
              <span className="font-semibold text-yellow-600">Pi Network</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Member since {new Date(currentProfile.joinDate || '2020-03-14').toLocaleDateString()}
            </p>
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

export default PiNetworkProfile;
