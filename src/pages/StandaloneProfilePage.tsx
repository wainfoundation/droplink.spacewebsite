import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  ExternalLink, 
  Eye, 
  Users,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle,
  ArrowLeft,
  Menu,
  X,
  Edit,
  Settings,
  Sparkles,
  Zap,
  Star,
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProfileStorage } from '@/utils/profileStorage';

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  avatar: string;
  location?: string;
  isVerified: boolean;
  theme: string;
  customColors?: {
    primary: string;
    secondary: string;
    background: string;
  };
}

interface LinkData {
  id: string;
  title: string;
  url: string;
  icon: string;
  description?: string;
  is_active: boolean;
  clicks: number;
  type?: string;
}

const StandaloneProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const loadProfileData = () => {
      if (!username) {
        setIsLoading(false);
        return;
      }

      try {
        // Load profile data from localStorage
        const profileKey = `profile_${username}`;
        const linksKey = `links_${username}`;
        
        const savedProfile = localStorage.getItem(profileKey);
        const savedLinks = localStorage.getItem(linksKey);

        if (savedProfile) {
          const profileData = JSON.parse(savedProfile);
          setProfile(profileData);
        } else {
          // Create default profile if not found
          const defaultProfile: ProfileData = {
            username: username,
            displayName: username.charAt(0).toUpperCase() + username.slice(1),
            bio: `Welcome to ${username}'s profile!`,
            avatar: `https://placehold.co/100x100/8B5CF6/FFFFFF?text=${username.charAt(0).toUpperCase()}`,
            location: 'Global',
            isVerified: false,
            theme: 'gradient',
            customColors: {
              primary: '#8B5CF6',
              secondary: '#EC4899',
              background: '#F3F4F6'
            }
          };
          setProfile(defaultProfile);
          // Save default profile to localStorage
          localStorage.setItem(profileKey, JSON.stringify(defaultProfile));
        }

        if (savedLinks) {
          const linksData = JSON.parse(savedLinks);
          setLinks(linksData);
        } else {
          // Create default links if not found
          const defaultLinks: LinkData[] = [
            {
              id: '1',
              title: 'My Website',
              url: 'https://example.com',
              icon: '🌐',
              is_active: true,
              clicks: Math.floor(Math.random() * 100) + 10
            },
            {
              id: '2',
              title: 'Instagram',
              url: 'https://instagram.com',
              icon: '📷',
              is_active: true,
              clicks: Math.floor(Math.random() * 100) + 10
            },
            {
              id: '3',
              title: 'YouTube',
              url: 'https://youtube.com',
              icon: '▶️',
              is_active: true,
              clicks: Math.floor(Math.random() * 100) + 10
            }
          ];
          setLinks(defaultLinks);
          // Save default links to localStorage
          localStorage.setItem(linksKey, JSON.stringify(defaultLinks));
        }

        // Track profile view
        setViewCount(prev => prev + 1);
        
        // Load view count from localStorage
        const viewCountKey = `views_${username}`;
        const savedViews = localStorage.getItem(viewCountKey);
        if (savedViews) {
          setViewCount(parseInt(savedViews) + 1);
          localStorage.setItem(viewCountKey, (parseInt(savedViews) + 1).toString());
        } else {
          localStorage.setItem(viewCountKey, '1');
        }


      } catch (error) {
        console.error('Error loading profile data:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [username, toast]);

  const handleLinkClick = async (link: LinkData) => {
    // Track link click
    const updatedLinks = links.map(l => 
      l.id === link.id ? { ...l, clicks: l.clicks + 1 } : l
    );
    setLinks(updatedLinks);
    
    // Save updated clicks to localStorage
    const linksKey = `links_${username}`;
    localStorage.setItem(linksKey, JSON.stringify(updatedLinks));
    
    // Update view count
    setViewCount(prev => prev + 1);
    const viewCountKey = `views_${username}`;
    const currentViews = ProfileStorage.loadViewCount(username || '');
    ProfileStorage.saveViewCount(username || '', currentViews + 1);
    
    // Open link in new tab
    window.open(link.url, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Link Clicked!",
      description: `${link.title} opened - Click tracked!`,
    });
  };



  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Profile URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL to clipboard",
        variant: "destructive",
      });
    }
  };

  const activeLinks = links.filter(link => link.is_active);
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-6"></div>
            <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-transparent border-r-white/40 animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">Loading profile...</p>
            <p className="text-sm opacity-70">Preparing your beautiful profile</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="mb-6">The profile you're looking for doesn't exist.</p>
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-purple-600"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-black border-b border-gray-800">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="text-white font-semibold">Droplink</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyUrl}
              className="text-white hover:bg-white/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-white/20"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-white/20 p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Button
                  variant={viewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('mobile')}
                  className="flex-1"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile View
                </Button>
                <Button
                  variant={viewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('desktop')}
                  className="flex-1"
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop View
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="p-6 animate-fade-in">
        <div className={`mx-auto ${viewMode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'} animate-slide-up`}>
          {/* Profile Card */}
          <Card className="bg-black border-gray-800 text-white mb-6">
            <CardContent className="p-8 text-center">
              <div className="relative mb-6">
                <div className="relative">
                  <img
                    src={profile.avatar}
                    alt="Profile"
                    className="w-24 h-24 rounded-full mx-auto border-2 border-gray-700 shadow-lg object-cover"
                  />
                  {profile.isVerified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h1 className="text-2xl font-bold mb-2 text-white">
                  {profile.displayName}
                </h1>
                <p className="text-sm text-gray-400 mb-3 flex items-center justify-center gap-2">
                  <span className="text-gray-400">@</span>
                  <span className="font-medium">{profile.username}</span>
                </p>
              </div>
              
              {profile.bio && (
                <div className="mb-6">
                  <p className="text-sm text-gray-300 leading-relaxed max-w-sm mx-auto">
                    {profile.bio}
                  </p>
                </div>
              )}
              

            </CardContent>
          </Card>

          {/* Links */}
          <div className="space-y-4">
            {activeLinks.map((link, index) => (
              <Card 
                key={link.id}
                className="bg-black border-gray-800 hover:bg-gray-900 hover:border-gray-700 transition-all duration-200 cursor-pointer group"
                onClick={() => handleLinkClick(link)}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center text-2xl group-hover:bg-gray-700 transition-colors">
                      {link.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white mb-1 text-lg group-hover:text-white/90 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-400 truncate mb-2 font-mono">
                        {link.url.length > 50 ? `${link.url.substring(0, 50)}...` : link.url}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-green-300" />
                          <span className="text-xs text-gray-500 font-medium">
                            {link.clicks.toLocaleString()} clicks
                          </span>
                          {link.clicks > 0 && (
                            <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-blue-300" />
                          <span className="text-xs text-gray-500">
                            {new Date().toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-colors">
                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer - Droplink Style */}
          <div className="text-center mt-8 text-gray-500 text-xs">
            <div className="border-t border-gray-800 pt-6">
              <div className="flex items-center justify-center gap-2">
                <span>Powered by</span>
                <span className="font-semibold text-white">Droplink</span>
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

export default StandaloneProfilePage;
