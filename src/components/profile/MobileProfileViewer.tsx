import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy, 
  ExternalLink,
  Heart,
  Eye,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MobileProfileViewerProps {
  profile: {
    username: string;
    displayName?: string;
    bio?: string;
    avatar?: string;
    isVerified?: boolean;
  };
  links: Array<{
    id: string;
    title: string;
    url: string;
    icon?: string;
    clicks?: number;
    is_active?: boolean;
  }>;
  onLinkClick?: (linkId: string) => void;
  onShare?: () => void;
  onCopy?: () => void;
}

const MobileProfileViewer: React.FC<MobileProfileViewerProps> = ({
  profile,
  links,
  onLinkClick,
  onShare,
  onCopy
}) => {
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  const handleLinkClick = (link: any) => {
    if (onLinkClick) {
      onLinkClick(link.id);
    }
    
    // Track click
    window.open(link.url, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Link Opened",
      description: `Opening ${link.title}...`,
    });
  };

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }

    const shareUrl = window.location.href;
    const shareText = `Check out ${profile.displayName || profile.username}'s links!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName || profile.username} - Droplink`,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
    }
  };

  const handleCopy = async () => {
    if (onCopy) {
      onCopy();
      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
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
  };

  const activeLinks = links.filter(link => link.is_active !== false);
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
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
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-white font-semibold">Droplink</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="text-white hover:bg-white/20"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-white hover:bg-white/20"
            >
              <Share2 className="h-4 w-4" />
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
              <div className="text-center text-sm text-gray-600">
                {activeLinks.length} links • {totalClicks} total clicks
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Profile Content */}
      <div className="p-6">
        <div className="max-w-sm mx-auto">
          {/* Profile Card */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white mb-6">
            <CardContent className="p-6 text-center">
              <div className="relative mb-4">
                <img
                  src={profile.avatar || 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=D'}
                  alt="Profile"
                  className="w-20 h-20 rounded-full mx-auto border-4 border-white/30 shadow-lg object-cover"
                />
                {profile.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
              
              <h1 className="text-xl font-bold mb-1">{profile.displayName || profile.username}</h1>
              <p className="text-sm opacity-90 mb-3">@{profile.username}</p>
              
              {profile.bio && (
                <p className="text-sm opacity-80 mb-4 leading-relaxed">{profile.bio}</p>
              )}
              
              <div className="flex justify-center gap-4 text-xs opacity-70">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>1.2k views</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  <span>{totalClicks} clicks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{activeLinks.length} links</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <div className="space-y-3">
            {activeLinks.map((link) => (
              <Card 
                key={link.id}
                className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-200 cursor-pointer"
                onClick={() => handleLinkClick(link)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                      {link.icon || '🔗'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{link.title}</h3>
                      <p className="text-sm text-white/70 truncate">{link.url}</p>
                      {link.clicks && link.clicks > 0 && (
                        <p className="text-xs text-white/60 mt-1">{link.clicks} clicks</p>
                      )}
                    </div>
                    <ExternalLink className="h-5 w-5 text-white/60" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-white/60 text-xs">
            <p>Powered by <span className="font-semibold">Droplink</span></p>
            <p className="mt-1">Your link hub on Pi Network</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileProfileViewer;
