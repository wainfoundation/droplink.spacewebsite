import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Share2, 
  Copy, 
  Download, 
  QrCode,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Send,
  Globe,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InlineQRShareProps {
  profileUrl: string;
  username: string;
  displayName?: string;
  className?: string;
}

const InlineQRShare: React.FC<InlineQRShareProps> = ({
  profileUrl,
  username,
  displayName,
  className = ""
}) => {
  const { toast } = useToast();
  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (profileUrl) {
      // Generate QR code using QR Server API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [profileUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Profile link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${username}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSocialShare = (platform: string) => {
    const shareText = `Check out ${displayName || username}'s links on Droplink!`;
    const encodedUrl = encodeURIComponent(profileUrl);
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
        shareUrl = `mailto:?subject=${encodeURIComponent(`${displayName || username}'s Droplink Profile`)}&body=${encodedText}%20${encodedUrl}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const socialPlatforms = [
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-700' },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle, color: 'text-green-500' },
    { id: 'telegram', name: 'Telegram', icon: Send, color: 'text-blue-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'text-gray-600' }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <Button
        onClick={() => setShowShare(!showShare)}
        className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 shadow-sm"
        size="sm"
      >
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>

      {/* Share Panel */}
      {showShare && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 p-6 w-80 z-50">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowShare(false)}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>

          {/* QR Code */}
          <div className="text-center mb-6">
            <div className="bg-white p-3 rounded-lg inline-block border">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-40 h-40"
                />
              )}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {socialPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Button
                  key={platform.id}
                  variant="ghost"
                  onClick={() => handleSocialShare(platform.id)}
                  className="h-10 flex flex-col items-center justify-center gap-1 hover:bg-gray-50"
                >
                  <IconComponent className={`h-4 w-4 ${platform.color}`} />
                  <span className="text-xs">{platform.name}</span>
                </Button>
              );
            })}
          </div>

          {/* URL Input */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                value={profileUrl}
                readOnly
                className="flex-1 text-xs"
              />
              <Button
                size="sm"
                onClick={handleCopyUrl}
                className="flex items-center space-x-1"
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InlineQRShare;
