import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy, 
  QrCode, 
  Download, 
  ExternalLink,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Mail,
  Link as LinkIcon,
  Eye,
  Smartphone,
  Monitor,
  Globe,
  CheckCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedSharingProps {
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  profileUrl: string;
  piProfileUrl: string;
  totalClicks?: number;
  totalLinks?: number;
}

const EnhancedSharing: React.FC<EnhancedSharingProps> = ({
  username,
  displayName,
  bio,
  avatarUrl,
  profileUrl,
  piProfileUrl,
  totalClicks = 0,
  totalLinks = 0
}) => {
  const { toast } = useToast();
  const [showQRCode, setShowQRCode] = useState(false);
  const [showEmbedCode, setShowEmbedCode] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(profileUrl);

  const shareText = `Check out ${displayName || username}'s links on Droplink!`;
  const shareTitle = `${displayName || username} - Droplink Profile`;

  const handleCopyUrl = async (url: string, type: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: `${type} link copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: selectedUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await handleCopyUrl(selectedUrl, 'Profile');
    }
  };

  const handleSocialShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(selectedUrl);
    const encodedText = encodeURIComponent(shareText);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodedText}%20${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const generateQRCode = () => {
    // Simple QR code generation using a service
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedUrl)}`;
    return qrUrl;
  };

  const generateEmbedCode = () => {
    return `<iframe 
  src="${selectedUrl}" 
  width="300" 
  height="400" 
  frameborder="0" 
  title="${shareTitle}">
</iframe>`;
  };

  const copyEmbedCode = async () => {
    const embedCode = generateEmbedCode();
    await handleCopyUrl(embedCode, 'Embed');
  };

  const downloadQRCode = () => {
    const qrUrl = generateQRCode();
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `${username}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Profile Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl p-6 text-center text-white">
            <div className="relative mb-4">
              <img
                src={avatarUrl || 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=D'}
                alt="Profile"
                className="w-16 h-16 rounded-full mx-auto border-4 border-white shadow-md object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-white text-xs font-bold">✓</span>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-1">{displayName || username}</h3>
            <p className="text-sm opacity-90 mb-2">@{username}</p>
            <p className="text-sm opacity-80 mb-4">{bio || 'Welcome to my Linktree!'}</p>
            <div className="flex justify-center gap-4 text-xs opacity-70">
              <span>{totalClicks} clicks</span>
              <span>•</span>
              <span>{totalLinks} links</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* URL Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Profile URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedUrl === profileUrl 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedUrl(profileUrl)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <LinkIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Linktree Style</h4>
                  <p className="text-sm text-gray-600">{profileUrl}</p>
                </div>
                {selectedUrl === profileUrl && (
                  <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                )}
              </div>
            </div>
            
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedUrl === piProfileUrl 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedUrl(piProfileUrl)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium">Pi Network Style</h4>
                  <p className="text-sm text-gray-600">{piProfileUrl}</p>
                </div>
                {selectedUrl === piProfileUrl && (
                  <CheckCircle className="w-5 h-5 text-blue-500 ml-auto" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => handleCopyUrl(selectedUrl, 'Profile')}
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <Copy className="h-5 w-5" />
              <span className="text-xs">Copy Link</span>
            </Button>
            
            <Button
              onClick={handleNativeShare}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <Share2 className="h-5 w-5" />
              <span className="text-xs">Share</span>
            </Button>
            
            <Button
              onClick={() => setShowQRCode(!showQRCode)}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <QrCode className="h-5 w-5" />
              <span className="text-xs">QR Code</span>
            </Button>
            
            <Button
              onClick={() => setShowEmbedCode(!showEmbedCode)}
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2"
            >
              <Monitor className="h-5 w-5" />
              <span className="text-xs">Embed</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Section */}
      {showQRCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                QR Code
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowQRCode(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="bg-white p-4 rounded-lg inline-block">
              <img
                src={generateQRCode()}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-gray-600 mt-4 mb-4">
              Scan this QR code to visit your profile
            </p>
            <Button onClick={downloadQRCode} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Embed Code Section */}
      {showEmbedCode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Embed Code
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowEmbedCode(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Copy this code to embed your profile on your website:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{generateEmbedCode()}</code>
                </pre>
              </div>
              <Button onClick={copyEmbedCode} variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Copy Embed Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Media Sharing */}
      <Card>
        <CardHeader>
          <CardTitle>Share on Social Media</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Button
              onClick={() => handleSocialShare('twitter')}
              variant="outline"
              className="h-12 flex items-center justify-center gap-2"
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              Twitter
            </Button>
            
            <Button
              onClick={() => handleSocialShare('facebook')}
              variant="outline"
              className="h-12 flex items-center justify-center gap-2"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </Button>
            
            <Button
              onClick={() => handleSocialShare('linkedin')}
              variant="outline"
              className="h-12 flex items-center justify-center gap-2"
            >
              <Linkedin className="h-4 w-4 text-blue-700" />
              LinkedIn
            </Button>
            
            <Button
              onClick={() => handleSocialShare('whatsapp')}
              variant="outline"
              className="h-12 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
              WhatsApp
            </Button>
            
            <Button
              onClick={() => handleSocialShare('telegram')}
              variant="outline"
              className="h-12 flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-blue-500" />
              Telegram
            </Button>
            
            <Button
              onClick={() => handleSocialShare('email')}
              variant="outline"
              className="h-12 flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4 text-gray-600" />
              Email
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Sharing Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,247</div>
              <div className="text-sm text-gray-600">Profile Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">342</div>
              <div className="text-sm text-gray-600">Link Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">27.4%</div>
              <div className="text-sm text-gray-600">Click Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">89</div>
              <div className="text-sm text-gray-600">Shares</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSharing;
