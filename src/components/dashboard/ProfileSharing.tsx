import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Download,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Globe,
  Settings,
  Eye,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getBaseUrl } from '@/utils/url-helper';
import { useUser } from '@/context/UserContext';

interface ProfileSharingProps {
  onClose?: () => void;
}

const ProfileSharing: React.FC<ProfileSharingProps> = ({ onClose }) => {
  const { user, profile } = useUser();
  const { toast } = useToast();
  
  const [shareUrl, setShareUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareStats, setShareStats] = useState({
    totalShares: 0,
    socialShares: 0,
    directShares: 0,
    qrScans: 0
  });

  // Generate share URL
  useEffect(() => {
    if (user?.id) {
      const baseUrl = getBaseUrl();
      const fullUrl = `${baseUrl}/profile/${user.id}`;
      setShareUrl(fullUrl);
      
      // Generate short URL (mock)
      const shortId = user.id.substring(0, 8);
      setShortUrl(`${baseUrl}/s/${shortId}`);
      
      // Generate QR code URL
      setQrCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}`);
    }
  }, [user?.id]);

  // Mock share stats
  useEffect(() => {
    const mockStats = {
      totalShares: Math.floor(Math.random() * 1000) + 100,
      socialShares: Math.floor(Math.random() * 500) + 50,
      directShares: Math.floor(Math.random() * 300) + 30,
      qrScans: Math.floor(Math.random() * 200) + 20
    };
    setShareStats(mockStats);
  }, []);

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Profile link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying link:', error);
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = async (platform: string) => {
    const text = `Check out my Droplink profile!`;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);

    let socialShareUrl = '';
    
    switch (platform) {
      case 'twitter':
        socialShareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        socialShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        socialShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        socialShareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        socialShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'email':
        socialShareUrl = `mailto:?subject=${encodeURIComponent('Check out my Droplink profile!')}&body=${encodedText}%20${encodedUrl}`;
        break;
      default:
        return;
    }

    window.open(socialShareUrl, '_blank', 'width=600,height=400');
  };

  const handleDownloadQR = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.href = qrCode;
      link.download = `droplink-qr-${user?.id}.png`;
      link.click();
    }
  };

  const socialPlatforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'telegram', name: 'Telegram', icon: MessageCircle, color: 'text-blue-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'text-gray-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Share2 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Share Your Profile</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Eye className="w-3 h-3 mr-1" />
            Public
          </Badge>
        </div>
      </div>

      {/* Share Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{shareStats.totalShares}</div>
            <div className="text-sm text-gray-600">Total Shares</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{shareStats.socialShares}</div>
            <div className="text-sm text-gray-600">Social Shares</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{shareStats.directShares}</div>
            <div className="text-sm text-gray-600">Direct Shares</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{shareStats.qrScans}</div>
            <div className="text-sm text-gray-600">QR Scans</div>
          </CardContent>
        </Card>
      </div>

      {/* Share URLs */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile URLs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Full URL */}
            <div className="space-y-2">
              <Label htmlFor="full-url">Full URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="full-url"
                  value={shareUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyUrl(shareUrl)}
                  className="flex items-center space-x-2"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(shareUrl, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open</span>
                </Button>
              </div>
            </div>

            {/* Short URL */}
            <div className="space-y-2">
              <Label htmlFor="short-url">Short URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="short-url"
                  value={shortUrl}
                  readOnly
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyUrl(shortUrl)}
                  className="flex items-center space-x-2"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center space-x-2">
              <QrCode className="w-4 h-4" />
              <span>QR Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {qrCode && (
                <div className="flex-shrink-0">
                  <img
                    src={qrCode}
                    alt="QR Code"
                    className="w-32 h-32 border rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 space-y-3">
                <p className="text-sm text-gray-600">
                  Scan this QR code to quickly access your profile
                </p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadQR}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyUrl(shareUrl)}
                    className="flex items-center space-x-2"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Media Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Share on Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    variant="outline"
                    onClick={() => handleSocialShare(platform.id)}
                    className="flex items-center space-x-2 h-12"
                  >
                    <IconComponent className={`w-5 h-5 ${platform.color}`} />
                    <span>{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Embed Code */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Embed Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Embed your profile on your website or blog
              </p>
              <div className="bg-gray-100 p-3 rounded-lg">
                <code className="text-sm text-gray-800">
                  {`<iframe src="${shareUrl}" width="400" height="600" frameborder="0"></iframe>`}
                </code>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopyUrl(`<iframe src="${shareUrl}" width="400" height="600" frameborder="0"></iframe>`)}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Embed Code</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
        <Button onClick={() => window.open(shareUrl, '_blank')}>
          <ExternalLink className="w-4 h-4 mr-2" />
          View Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileSharing;
