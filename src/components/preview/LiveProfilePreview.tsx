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
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DroplinkExactStyle from '@/components/profile/LinktreeExactStyle';

interface LiveProfilePreviewProps {
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
  piProfileUrl: string;
}

const LiveProfilePreview: React.FC<LiveProfilePreviewProps> = ({
  isOpen,
  onClose,
  profile,
  links,
  profileUrl,
  piProfileUrl
}) => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedUrl, setSelectedUrl] = useState(profileUrl);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Preview Refreshed",
        description: "Profile preview has been updated",
      });
    }, 1000);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(selectedUrl);
      toast({
        title: "URL Copied!",
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

  const handleOpenInNewTab = () => {
    window.open(selectedUrl, '_blank', 'noopener,noreferrer');
  };

  const getPreviewDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '600px' };
    }
  };

  const dimensions = getPreviewDimensions();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Live Profile Preview</h2>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Live
            </Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyUrl}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy URL
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleOpenInNewTab}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Profile Style Selector */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-center gap-4">
            <span className="text-sm font-medium text-gray-700">Profile Style:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedUrl === profileUrl ? 'default' : 'outline'}
                onClick={() => setSelectedUrl(profileUrl)}
              >
                Droplink Style
              </Button>
              <Button
                size="sm"
                variant={selectedUrl === piProfileUrl ? 'default' : 'outline'}
                onClick={() => setSelectedUrl(piProfileUrl)}
              >
                Pi Network Style
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Content - Full Profile */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full">
            <DroplinkExactStyle
              profile={{
                id: profile.username,
                username: profile.username,
                displayName: profile.displayName,
                bio: profile.bio,
                avatar: profile.avatar,
                theme: 'black',
                is_active: true
              }}
              links={links.map(link => ({
                ...link,
                is_active: link.is_active ?? true,
                clicks: link.clicks ?? 0
              }))}
              isLoading={false}
            />
          </div>
        </div>

        {/* Footer with Open Button */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Preview URL:</span> {selectedUrl}
            </div>
            <Button
              onClick={handleOpenInNewTab}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full Profile in New Tab
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveProfilePreview;
