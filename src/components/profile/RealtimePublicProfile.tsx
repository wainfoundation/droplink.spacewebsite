// Real-time Public Profile Component
// Updates instantly when changes are made in the dashboard

import React, { useState, useEffect } from 'react';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { dashboardDataService } from '@/services/dashboardDataService';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Heart, 
  Eye, 
  Share2, 
  Copy,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RealtimePublicProfileProps {
  username: string;
  className?: string;
}

const RealtimePublicProfile: React.FC<RealtimePublicProfileProps> = ({ 
  username, 
  className 
}) => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Real-time updates
  const { isConnected, lastUpdate, updateCount } = useRealtimeUpdates({
    profileId: profile?.id,
    onUpdate: (update) => {
      console.log('🔄 Public profile real-time update:', update);
      
      if (update.type === 'profile' && update.action === 'update') {
        setProfile(prev => ({ ...prev, ...update.data }));
      } else if (update.type === 'link') {
        if (update.action === 'insert') {
          setLinks(prev => [...prev, update.data]);
        } else if (update.action === 'update') {
          setLinks(prev => prev.map(link => 
            link.id === update.data.id ? update.data : link
          ));
        } else if (update.action === 'delete') {
          setLinks(prev => prev.filter(link => link.id !== update.oldData?.id));
        }
      }
    }
  });

  // Load initial data
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get profile by username
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) {
          throw new Error(`Profile not found: ${profileError.message}`);
        }

        setProfile(profileData);

        // Get links for this profile
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', profileData.id)
          .eq('is_active', true)
          .order('position');

        if (linksError) {
          console.warn('Links loading error:', linksError);
        }

        setLinks(linksData || []);

        // Track page view
        await dashboardDataService.trackPageView(profileData.id, {
          referrer: document.referrer,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Profile loading failed:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    if (username) {
      loadProfileData();
    }
  }, [username]);

  // Handle link click
  const handleLinkClick = async (link: any) => {
    try {
      await dashboardDataService.trackLinkClick(link.id, {
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Link click tracking failed:', err);
    }
  };

  // Copy profile URL
  const copyProfileUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied!",
        description: "Profile URL copied to clipboard.",
      });
    });
  };

  // Share profile
  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.display_name || profile?.username}'s Profile`,
          text: `Check out ${profile?.display_name || profile?.username}'s profile`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled or failed');
      }
    } else {
      copyProfileUrl();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 to-blue-500">
        <div className="text-center text-white">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-500 to-pink-500">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😞</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-white/80">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-500 to-gray-600">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
          <p className="text-white/80">This profile doesn't exist yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 text-white ${className}`}>
      {/* Real-time Status Indicator */}
      <div className="fixed top-4 right-4 z-50">
        <div className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2">
          {isConnected ? (
            <Wifi className="w-4 h-4 text-green-400" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-400" />
          )}
          <span className="text-sm">
            {isConnected ? 'Live' : 'Offline'}
          </span>
          {updateCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {updateCount} updates
            </Badge>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        {/* Avatar */}
        <div className="relative mb-6">
          <img
            src={profile.avatar_url || '/default-avatar.png'}
            alt={profile.display_name || profile.username}
            className="w-24 h-24 rounded-full border-4 border-white/20 shadow-2xl"
            onError={(e) => {
              e.currentTarget.src = '/default-avatar.png';
            }}
          />
          {isConnected && (
            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {profile.display_name || profile.username}
          </h1>
          {profile.bio && (
            <p className="text-lg text-white/90 mb-4 max-w-md">
              {profile.bio}
            </p>
          )}
          
          {/* Social Links */}
          {profile.social_links && Object.keys(profile.social_links).length > 0 && (
            <div className="flex justify-center space-x-4 mb-6">
              {Object.entries(profile.social_links).map(([platform, url]) => (
                <a
                  key={platform}
                  href={url as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {platform}
                </a>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-2 mb-8">
            <Button
              onClick={shareProfile}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={copyProfileUrl}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
          </div>
        </div>

        {/* Links */}
        <div className="w-full max-w-md space-y-3">
          {links.length === 0 ? (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔗</span>
                </div>
                <p className="text-white/80">No links yet</p>
                <p className="text-sm text-white/60 mt-2">
                  {profile.display_name || profile.username} hasn't added any links yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            links.map((link, index) => (
              <Card
                key={link.id}
                className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 transform hover:scale-105"
              >
                <CardContent className="p-4">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleLinkClick(link)}
                    className="flex items-center space-x-3 text-white hover:text-white/80 transition-colors"
                  >
                    <span className="text-2xl">{link.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{link.title}</h3>
                      {link.description && (
                        <p className="text-sm text-white/70 mt-1">{link.description}</p>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 opacity-60" />
                  </a>
                  
                  {/* Link Stats */}
                  {link.clicks > 0 && (
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
                      <div className="flex items-center space-x-4 text-xs text-white/60">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {link.clicks} clicks
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/60">
            Powered by <span className="font-semibold">Droplink</span>
          </p>
          {lastUpdate && (
            <p className="text-xs text-white/40 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealtimePublicProfile;
