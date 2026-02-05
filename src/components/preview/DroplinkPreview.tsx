import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ExternalLink, 
  Eye, 
  Smartphone, 
  Monitor, 
  Tablet,
  RefreshCw,
  Copy,
  Share2,
  Heart,
  Users,
  TrendingUp,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DroplinkPreviewProps {
  isOpen: boolean;
  onClose: () => void;
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
  profileUrl: string;
}

const DroplinkPreview: React.FC<DroplinkPreviewProps> = ({
  isOpen,
  onClose,
  profile,
  links,
  profileUrl
}) => {
  const { toast } = useToast();
  const [viewCount, setViewCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  useEffect(() => {
    if (isOpen) {
      setViewCount(prev => prev + 1);
    }
  }, [isOpen]);

  const handleLinkClick = (link: any) => {
    console.log('Link clicked:', link.title);
    // Track link click in analytics
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link",
        variant: "destructive",
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

  const getDeviceWidth = () => {
    switch (selectedDevice) {
      case 'mobile': return 'w-80';
      case 'tablet': return 'w-96';
      case 'desktop': return 'w-full max-w-md';
      default: return 'w-80';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="font-bold text-gray-900">Droplink Preview</span>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="w-3 h-3 mr-1" />
              Live Preview
            </Badge>
          </div>
          <Button onClick={onClose} variant="outline" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Device Selector */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-gray-700">Device Preview:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedDevice === 'mobile' ? 'default' : 'outline'}
                onClick={() => setSelectedDevice('mobile')}
                className="flex items-center gap-2"
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </Button>
              <Button
                size="sm"
                variant={selectedDevice === 'tablet' ? 'default' : 'outline'}
                onClick={() => setSelectedDevice('tablet')}
                className="flex items-center gap-2"
              >
                <Tablet className="w-4 h-4" />
                Tablet
              </Button>
              <Button
                size="sm"
                variant={selectedDevice === 'desktop' ? 'default' : 'outline'}
                onClick={() => setSelectedDevice('desktop')}
                className="flex items-center gap-2"
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center p-4">
          <div className={`${getDeviceWidth()} bg-black rounded-lg overflow-hidden shadow-2xl`}>
            {/* Mobile Header */}
            {selectedDevice === 'mobile' && (
              <div className="bg-black border-b border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <button className="text-white hover:text-white/80">
                    ← Back
                  </button>
                  <h1 className="text-white font-semibold">Profile</h1>
                  <button className="text-white hover:text-white/80">
                    ☰
                  </button>
                </div>
              </div>
            )}

            {/* Profile Content - Exact Droplink Style */}
            <div className="bg-black text-white text-center p-6">
              {/* Avatar */}
              <div className="relative mb-6">
                <img
                  src={profile.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${profile.username}`}
                  alt={`${profile.username}'s avatar`}
                  className="w-24 h-24 rounded-full mx-auto border-2 border-gray-700 shadow-lg object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=' + (profile.displayName || profile.username).charAt(0).toUpperCase();
                  }}
                />
                {/* Verification badge */}
                {profile.isVerified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full border-2 border-black flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Info */}
              <h1 className="text-2xl font-bold text-white mb-2">
                {profile.displayName || profile.username}
              </h1>
              <p className="text-sm text-gray-400 mb-6 px-4">
                {profile.bio || 'Welcome to my Droplink profile!'}
              </p>

              {/* Stats */}
              <div className="flex justify-center gap-6 mb-6 text-sm text-gray-400">
                <div className="text-center">
                  <div className="font-semibold text-white">{links.length}</div>
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
                {links && links.length > 0 ? (
                  links
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
                  <span className="font-semibold text-white">Droplink</span>
                  <span>•</span>
                  <span>Pi Network</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => window.open(profileUrl, '_blank')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Open in New Tab
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              This is exactly how your profile will appear when shared
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DroplinkPreview;
