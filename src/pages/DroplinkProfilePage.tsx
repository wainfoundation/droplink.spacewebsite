import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import DroplinkExactStyle from '@/components/profile/LinktreeExactStyle';
import { ProfileService, Profile, Link } from '@/services/profileService';
import { SEO_CONFIG } from '@/config/domain';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, Share2, Copy } from 'lucide-react';
import ErrorBoundary from '@/components/ErrorBoundary';
import debug from '@/utils/debug';

// Types are now imported from ProfileService

const DroplinkProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileViews, setProfileViews] = useState(0);

  useEffect(() => {
    const fetchProfileData = async () => {
      debug.log('DroplinkProfilePage: Starting to fetch profile data', { username });
      
      if (!username) {
        debug.warn('DroplinkProfilePage: No username provided');
        setError('Username is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        debug.log('DroplinkProfilePage: Fetching profile for username', username);

        // Fetch profile data using ProfileService
        const profileData = await ProfileService.getProfileByUsername(username);
        
        if (!profileData) {
          debug.warn('DroplinkProfilePage: Profile not found', { username });
          setError('Profile not found');
          setIsLoading(false);
          return;
        }

        debug.log('DroplinkProfilePage: Profile found', { profileId: profileData.id, username: profileData.username });

        // Fetch links data
        const linksData = await ProfileService.getProfileLinks(profileData.id);
        debug.log('DroplinkProfilePage: Links fetched', { linksCount: linksData.length });

        // Fetch profile stats
        const stats = await ProfileService.getProfileStats(profileData.id);
        setProfileViews(stats.total_views);
        debug.log('DroplinkProfilePage: Stats fetched', stats);

        setProfile(profileData);
        setLinks(linksData);

        // Track profile view (don't await to avoid blocking)
        ProfileService.trackProfileView(profileData.id, {
          userAgent: navigator.userAgent,
          referrer: document.referrer || undefined
        }).catch(error => {
          console.warn('Failed to track profile view:', error);
        });

      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  const handleShare = async () => {
    const profileUrl = `${window.location.origin}/${username}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.display_name || username} - Droplink`,
          text: `Check out ${profile?.display_name || username}'s links on Droplink`,
          url: profileUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      try {
        await navigator.clipboard.writeText(profileUrl);
        toast({
          title: "Link Copied!",
          description: "Profile link copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const handleLinkClick = async (linkId: string, url: string) => {
    // Open link immediately
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Track link click in background (don't await to avoid blocking)
    ProfileService.trackLinkClick(linkId, {
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined
    }).catch(error => {
      console.warn('Failed to track link click:', error);
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold mb-2">Loading Profile</h2>
          <p className="text-white/80">Please wait while we load {username}'s profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">😔</span>
          </div>
          <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
          <p className="mb-6 text-white/90">
            {error === 'Profile not found' 
              ? `The profile "${username}" doesn't exist or has been removed.`
              : 'Something went wrong while loading this profile.'
            }
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/')}
              className="w-full bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Droplink Home
            </Button>
            <Button 
              onClick={() => navigate('/signup')}
              variant="outline"
              className="w-full bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
            >
              Create Your Own Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Generate SEO meta tags using SEO_CONFIG
  const metaData = SEO_CONFIG.generateProfileMeta({
    username: profile.username,
    display_name: profile.display_name,
    bio: profile.bio,
    avatar_url: profile.avatar_url
  });

  return (
    <ErrorBoundary>
      <Helmet>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <meta name="author" content={profile.display_name || profile.username} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={metaData.url} />
        <meta property="og:title" content={metaData.title} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:image" content={metaData.image} />
        <meta property="og:site_name" content={metaData.siteName} />
        <meta property="profile:username" content={profile.username} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={metaData.url} />
        <meta property="twitter:title" content={metaData.title} />
        <meta property="twitter:description" content={metaData.description} />
        <meta property="twitter:image" content={metaData.image} />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={metaData.url} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": profile.display_name || profile.username,
            "url": metaData.url,
            "description": profile.bio,
            "image": profile.avatar_url,
            "sameAs": links.filter(link => link.type === 'social').map(link => link.url)
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        {/* Floating Action Buttons */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <Button
            onClick={handleShare}
            size="sm"
            className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            onClick={() => window.open(metaData.url, '_blank')}
            size="sm"
            variant="outline"
            className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>

        {/* Profile Stats (Optional - can be hidden) */}
        {profileViews > 0 && (
          <div className="fixed bottom-4 left-4 z-50">
            <div className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-full border border-white/30">
              {profileViews.toLocaleString()} views
            </div>
          </div>
        )}

        {/* Main Profile Component */}
        <DroplinkExactStyle 
          profile={{
            id: profile.id,
            username: profile.username,
            displayName: profile.display_name,
            bio: profile.bio,
            avatar: profile.avatar_url,
            theme: profile.theme,
            is_active: true
          }}
          links={links.map(link => ({
            ...link,
            onClick: () => handleLinkClick(link.id, link.url)
          }))}
          isLoading={false}
        />
      </div>
    </ErrorBoundary>
  );
};

export default DroplinkProfilePage;
