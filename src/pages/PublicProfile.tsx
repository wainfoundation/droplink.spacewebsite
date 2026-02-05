// Public Profile Page
// Handles dynamic username routes like /username

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
  WifiOff,
  ArrowLeft,
  User,
  Link as LinkIcon,
  TrendingUp,
  Clock,
  Download,
  QrCode,
  Settings,
  MoreHorizontal
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRealtimeUpdates } from '@/hooks/useRealtimeUpdates';
import { useToast } from '@/hooks/use-toast';
import PublicProfileSharing from '@/components/PublicProfileSharing';
import { getProfileUrl } from '@/utils/url-helper';

const PublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');

  // Real-time updates
  const { isConnected, lastUpdate, updateCount } = useRealtimeUpdates({
    profileId: profile?.id,
    onUpdate: (update) => {
      console.log('🔄 Public profile real-time update:', update);
      
      if (update.type === 'profile' && update.action === 'update') {
        setProfile(prev => ({ ...prev, ...update.data }));
        setLastUpdated(new Date());
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
        setLastUpdated(new Date());
      }
    }
  });

  // Load profile data
  useEffect(() => {
    const loadProfileData = async () => {
      if (!username) return;

      try {
        setIsLoading(true);
        setError(null);

        // Get profile by username
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            throw new Error('Profile not found');
          }
          throw new Error(`Profile loading failed: ${profileError.message}`);
        }

        setProfile(profileData);
        
        // Set profile URL
        const currentProfileUrl = getProfileUrl(username);
        setProfileUrl(currentProfileUrl);

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

        // Get analytics
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('analytics')
          .select('*')
          .eq('user_id', profileData.id);

        if (!analyticsError && analyticsData) {
          const totalViews = analyticsData.filter(a => a.page_view).length;
          const totalClicks = analyticsData.filter(a => a.link_click).length;
          setAnalytics({
            total_views: totalViews,
            total_clicks: totalClicks,
            click_rate: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0
          });
        }

        // Track page view via API
        await fetch('/api/track-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profile_id: profileData.id
          })
        });

        // Also track in legacy analytics table
        await supabase.from('analytics').insert({
          user_id: profileData.id,
          page_view: true,
          ip_address: '127.0.0.1', // In production, get real IP
          user_agent: navigator.userAgent,
          referrer: document.referrer,
          created_at: new Date().toISOString()
        });

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        console.error('Profile loading failed:', errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [username]);

  // Handle link click with enhanced tracking
  const handleLinkClick = async (link: any) => {
    try {
      // Track click via API
      await fetch('/api/track-click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          link_id: link.id,
          user_id: profile?.id
        })
      });

      // Also update the legacy analytics table
      await supabase.from('analytics').insert({
        link_id: link.id,
        user_id: profile?.id,
        link_click: true,
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
        referrer: document.referrer,
        created_at: new Date().toISOString()
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
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
        <div className="text-center text-white">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
        <div className="text-center text-white p-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-white/80 mb-6">{error}</p>
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
          <p className="text-white/80">This profile doesn't exist yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 text-white">
      <Helmet>
        <title>{profile.display_name || profile.username} - Droplink</title>
        <meta name="description" content={profile.bio || `Check out ${profile.display_name || profile.username}'s profile`} />
        <meta property="og:title" content={`${profile.display_name || profile.username} - Droplink`} />
        <meta property="og:description" content={profile.bio || `Check out ${profile.display_name || profile.username}'s profile`} />
        <meta property="og:image" content={profile.avatar_url || '/default-avatar.png'} />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

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

      {/* Back Button */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
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
          <p className="text-white/80 mb-2">@{profile.username}</p>
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
              onClick={() => setShowShareModal(true)}
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
            <Button
              onClick={() => {
                const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
                window.open(qrUrl, '_blank');
              }}
              variant="outline"
              size="sm"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
          </div>
        </div>

        {/* Links */}
        <div className="w-full max-w-md space-y-3">
          {links.length === 0 ? (
            <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LinkIcon className="w-6 h-6" />
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

        {/* Analytics (if available) */}
        {analytics && (
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{analytics.total_views}</div>
              <div className="text-xs text-white/60">Views</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{analytics.total_clicks}</div>
              <div className="text-xs text-white/60">Clicks</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{analytics.click_rate.toFixed(1)}%</div>
              <div className="text-xs text-white/60">CTR</div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-white/60">
            Powered by <span className="font-semibold">Droplink</span>
          </p>
          {lastUpdated && (
            <p className="text-xs text-white/40 mt-1 flex items-center justify-center">
              <Clock className="w-3 h-3 mr-1" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Share Profile</h2>
                <Button
                  onClick={() => setShowShareModal(false)}
                  variant="ghost"
                  size="sm"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <PublicProfileSharing
                username={profile.username}
                displayName={profile.display_name || profile.username}
                bio={profile.bio}
                avatarUrl={profile.avatar_url}
                profileUrl={profileUrl}
                onShare={(platform) => {
                  console.log(`Shared to ${platform}`);
                  setShowShareModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfile;