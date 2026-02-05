import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Eye, 
  Share2, 
  Copy, 
  ExternalLink, 
  Heart, 
  MessageCircle, 
  Mail,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Globe,
  Settings,
  Edit,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { useLinks } from '@/hooks/useLinks';
import { getBaseUrl } from '@/utils/url-helper';

interface ProfilePreviewSystemProps {
  selectedTemplate?: string;
  customTemplate?: any;
  onEdit?: () => void;
  onShare?: () => void;
}

const ProfilePreviewSystem: React.FC<ProfilePreviewSystemProps> = ({
  selectedTemplate = 'modern-dark',
  customTemplate,
  onEdit,
  onShare
}) => {
  const { user, profile } = useUser();
  const { links } = useLinks(user?.id);
  const { toast } = useToast();
  
  const [isLive, setIsLive] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Get current template styles
  const getTemplateStyles = () => {
    if (customTemplate) {
      return customTemplate;
    }

    const templates = {
      'modern-dark': {
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        primary: '#8B5CF6',
        secondary: '#EC4899',
        text: '#ffffff',
        cardBg: 'rgba(255, 255, 255, 0.1)',
        border: 'rgba(255, 255, 255, 0.2)'
      },
      'modern-light': {
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        primary: '#3B82F6',
        secondary: '#10B981',
        text: '#1f2937',
        cardBg: 'rgba(255, 255, 255, 0.8)',
        border: 'rgba(0, 0, 0, 0.1)'
      },
      'minimal': {
        background: '#ffffff',
        primary: '#000000',
        secondary: '#666666',
        text: '#000000',
        cardBg: '#ffffff',
        border: '#e5e5e5'
      }
    };

    return templates[selectedTemplate as keyof typeof templates] || templates['modern-dark'];
  };

  const styles = getTemplateStyles();

  // Generate share URL
  useEffect(() => {
    if (user?.id) {
      const baseUrl = getBaseUrl();
      setShareUrl(`${baseUrl}/profile/${user.id}`);
    }
  }, [user?.id]);

  // Simulate real-time updates
  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        setViewCount(prev => prev + Math.floor(Math.random() * 3));
        setClickCount(prev => prev + Math.floor(Math.random() * 2));
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isLive]);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${profile?.display_name || user?.email} - Droplink Profile`,
          text: `Check out my Droplink profile!`,
          url: shareUrl
        });
      } else {
        // Fallback to copy to clipboard
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "Profile link copied to clipboard",
        });
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Error",
        description: "Failed to share profile",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Profile link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  const getSocialIcon = (platform: string) => {
    const icons = {
      instagram: Instagram,
      youtube: Youtube,
      twitter: Twitter,
      facebook: Facebook,
      linkedin: Linkedin,
      github: Github,
      website: Globe,
      email: Mail
    };
    return icons[platform as keyof typeof icons] || Globe;
  };

  const getSocialColor = (platform: string) => {
    const colors = {
      instagram: 'from-pink-500 to-purple-600',
      youtube: 'from-red-500 to-red-600',
      twitter: 'from-blue-400 to-blue-500',
      facebook: 'from-blue-600 to-blue-700',
      linkedin: 'from-blue-700 to-blue-800',
      github: 'from-gray-700 to-gray-800',
      website: 'from-gray-500 to-gray-600',
      email: 'from-gray-500 to-gray-600'
    };
    return colors[platform as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Profile Preview Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Eye className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Profile Preview</h3>
          {isLive && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            disabled={isSharing}
            className="flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>{isSharing ? 'Sharing...' : 'Share'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="flex items-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy Link'}</span>
          </Button>
        </div>
      </div>

      {/* Profile Preview Card */}
      <Card 
        className="overflow-hidden"
        style={{
          background: styles.background,
          border: `1px solid ${styles.border}`
        }}
      >
        <CardContent className="p-0">
          {/* Profile Header */}
          <div className="relative p-6 text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-4">
              <Avatar className="w-20 h-20 mx-auto border-4 border-white shadow-lg">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="text-2xl font-bold" style={{ color: styles.primary }}>
                  {profile?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              {isLive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              )}
            </div>

            {/* Name and Username */}
            <h1 className="text-2xl font-bold mb-1" style={{ color: styles.text }}>
              {(() => {
                // Get Pi username from localStorage first
                const piAuthResult = localStorage.getItem('pi_auth_result');
                if (piAuthResult) {
                  try {
                    const piAuth = JSON.parse(piAuthResult);
                    if (piAuth.user && piAuth.user.username) {
                      return piAuth.user.username;
                    }
                  } catch (error) {
                    console.error('Error parsing Pi auth result in ProfilePreviewSystem:', error);
                  }
                }
                return profile?.display_name || user?.user_metadata?.username || 'User';
              })()}
            </h1>
            <p className="text-sm opacity-80 mb-4" style={{ color: styles.text }}>
              @{(() => {
                // Get Pi username from localStorage first
                const piAuthResult = localStorage.getItem('pi_auth_result');
                if (piAuthResult) {
                  try {
                    const piAuth = JSON.parse(piAuthResult);
                    if (piAuth.user && piAuth.user.username) {
                      return piAuth.user.username;
                    }
                  } catch (error) {
                    console.error('Error parsing Pi auth result in ProfilePreviewSystem:', error);
                  }
                }
                return profile?.username || user?.user_metadata?.username || 'user';
              })()}
            </p>

            {/* Bio */}
            <p className="text-sm mb-6 opacity-90 max-w-sm mx-auto" style={{ color: styles.text }}>
              {profile?.bio || 'Hi! I\'m using Droplink to manage my Pi Network presence. Connect with me!'}
            </p>

            {/* Stats */}
            <div className="flex justify-center space-x-6 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: styles.primary }}>
                  {viewCount.toLocaleString()}
                </div>
                <div className="text-xs opacity-80" style={{ color: styles.text }}>
                  Views
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: styles.secondary }}>
                  {clickCount.toLocaleString()}
                </div>
                <div className="text-xs opacity-80" style={{ color: styles.text }}>
                  Clicks
                </div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: styles.primary }}>
                  {links?.length || 0}
                </div>
                <div className="text-xs opacity-80" style={{ color: styles.text }}>
                  Links
                </div>
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="px-6 pb-6">
            <div className="space-y-3">
              {links && links.length > 0 ? (
                links.map((link, index) => {
                  const IconComponent = getSocialIcon(link.platform || 'website');
                  const gradientClass = getSocialColor(link.platform || 'website');
                  
                  return (
                    <div
                      key={link.id}
                      className="group relative"
                    >
                      <div
                        className="flex items-center p-4 rounded-lg transition-all duration-200 hover:scale-105 cursor-pointer"
                        style={{
                          background: styles.cardBg,
                          border: `1px solid ${styles.border}`,
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${gradientClass} flex items-center justify-center mr-4`}>
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate" style={{ color: styles.text }}>
                            {link.title}
                          </div>
                          <div className="text-sm opacity-80 truncate" style={{ color: styles.text }}>
                            {link.url}
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 opacity-60" style={{ color: styles.text }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8" style={{ color: styles.text }}>
                  <div className="text-4xl mb-4">🔗</div>
                  <p className="text-sm opacity-80">No links yet</p>
                  <p className="text-xs opacity-60 mt-1">Add your first link to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6">
            <div className="text-center">
              <p className="text-xs opacity-60" style={{ color: styles.text }}>
                Powered by Droplink
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={onEdit}
          className="flex items-center space-x-2"
        >
          <Edit className="w-4 h-4" />
          <span>Edit Profile</span>
        </Button>
        <Button
          variant="outline"
          onClick={onShare}
          className="flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Profile</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfilePreviewSystem;
