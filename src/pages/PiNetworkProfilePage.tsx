import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PiNetworkProfile from '@/components/profile/PiNetworkProfile';
import { useToast } from '@/hooks/use-toast';
import { piProfileService, PiProfileData } from '@/services/piProfileService';
import { supabase } from '@/integrations/supabase/client';

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

const PiNetworkProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [profile, setProfile] = useState<PiProfile | null>(null);
  const [links, setLinks] = useState<PiLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPiProfileData = async () => {
      if (!username) {
        setError('Pi username is required');
        setIsLoading(false);
        return;
      }

      // Validate username
      if (!piProfileService.validateUsername(username)) {
        setError('Invalid Pi Network username');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch profile data from Pi Network service
        const profileData = await piProfileService.getProfile(username);
        
        if (!profileData) {
          setError('Pi profile not found');
          setIsLoading(false);
          return;
        }

        // Try to get real user profile data from Supabase first
        let realProfile = null;
        try {
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

          if (!profileError && userProfile) {
            realProfile = userProfile;
          }
        } catch (error) {
          console.error('Error fetching real profile:', error);
        }

        // Transform to component interface - use real data if available, otherwise fallback to Pi service data
        const profile: PiProfile = {
          username: realProfile?.username || profileData.username,
          displayName: realProfile?.display_name || profileData.displayName,
          avatar: realProfile?.avatar_url || profileData.avatar,
          bio: realProfile?.bio || profileData.bio,
          location: realProfile?.location || profileData.location,
          joinDate: realProfile?.created_at ? new Date(realProfile.created_at).toISOString().split('T')[0] : profileData.joinDate,
          isVerified: realProfile?.is_verified || profileData.isVerified,
          friendsCount: profileData.friendsCount,
          followersCount: profileData.followersCount,
          followingCount: profileData.followingCount,
          postsCount: profileData.postsCount,
          isFriend: profileData.isFriend,
          isFollowing: profileData.isFollowing
        };

        // Fetch real user links from Supabase
        let userLinks: PiLink[] = [];
        
        try {
          // First, try to find the user by username
          const { data: userProfile, error: profileError } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('username', username)
            .single();

          if (!profileError && userProfile) {
            // Fetch user's actual links
            const { data: linksData, error: linksError } = await supabase
              .from('links')
              .select('*')
              .eq('user_id', userProfile.id)
              .eq('is_active', true)
              .order('created_at', { ascending: false });

            if (!linksError && linksData) {
              userLinks = linksData.map(link => ({
                id: link.id,
                title: link.title,
                url: link.url,
                description: link.description,
                icon: link.icon || '🔗',
                is_active: link.is_active,
                clicks: link.clicks || 0,
                type: link.type || 'link'
              }));
            }
          }
        } catch (error) {
          console.error('Error fetching user links:', error);
        }

        // If no real links found, use default Pi Network links
        if (userLinks.length === 0) {
          userLinks = [
            { 
              id: 'default_1', 
              title: 'My Pi Apps', 
              url: `https://apps.pinet.com/${username}`, 
              icon: '📱', 
              is_active: true, 
              clicks: Math.floor(Math.random() * 100) + 10 
            },
            { 
              id: 'default_2', 
              title: 'Pi Mining Pool', 
              url: `https://mining.pinet.com/${username}`, 
              icon: '⛏️', 
              is_active: true, 
              clicks: Math.floor(Math.random() * 100) + 10 
            },
            { 
              id: 'default_3', 
              title: 'Pi Marketplace', 
              url: `https://marketplace.pinet.com/${username}`, 
              icon: '🛒', 
              is_active: true, 
              clicks: Math.floor(Math.random() * 100) + 10 
            },
            { 
              id: 'default_4', 
              title: 'Pi Developer Tools', 
              url: `https://dev.pinet.com/${username}`, 
              icon: '💻', 
              is_active: true, 
              clicks: Math.floor(Math.random() * 100) + 10 
            },
            { 
              id: 'default_5', 
              title: 'Pi Community', 
              url: `https://community.pinet.com/${username}`, 
              icon: '👥', 
              is_active: true, 
              clicks: Math.floor(Math.random() * 100) + 10 
            }
          ];
        }

        setProfile(profile);
        setLinks(userLinks);

        // Track profile view
        await piProfileService.trackProfileView(username);

        // In production, you would:
        // 1. Fetch profile data from Pi Network API
        // 2. Fetch links from your database
        // 3. Track the view in analytics
        // 4. Handle authentication and permissions

      } catch (err) {
        console.error('Error fetching Pi profile:', err);
        setError('Failed to load Pi profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPiProfileData();
  }, [username]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">π</span>
          </div>
          <h1 className="text-2xl font-bold mb-4">Pi Profile Not Found</h1>
          <p className="mb-6">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.history.back()}
              className="block w-full px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.open('https://profiles.pinet.com', '_blank')}
              className="block w-full px-4 py-2 bg-yellow-500/20 backdrop-blur-sm text-white rounded-lg hover:bg-yellow-500/30 transition-colors"
            >
              Visit Pi Network
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PiNetworkProfile 
      profile={profile || undefined}
      links={links}
      isLoading={isLoading}
    />
  );
};

export default PiNetworkProfilePage;
