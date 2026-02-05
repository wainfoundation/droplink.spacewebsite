import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  X, 
  Copy, 
  Download, 
  Share2,
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
  Youtube,
  Instagram
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  profileUrl: string;
  username: string;
  displayName?: string;
}

const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  onClose,
  profileUrl,
  username,
  displayName
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  useEffect(() => {
    if (isOpen && profileUrl) {
      // Generate QR code using QR Server API
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;
      setQrCodeUrl(qrUrl);
    }
  }, [isOpen, profileUrl]);

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
      case 'youtube':
        // YouTube doesn't support direct sharing, so we copy the text
        navigator.clipboard.writeText(`${shareText} ${profileUrl}`);
        toast({
          title: "Copied!",
          description: "Share text copied to clipboard",
        });
        return;
      case 'instagram':
        // Instagram doesn't support direct sharing, so we copy the text
        navigator.clipboard.writeText(`${shareText} ${profileUrl}`);
        toast({
          title: "Copied!",
          description: "Share text copied to clipboard",
        });
        return;
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
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'email', name: 'Email', icon: Mail, color: 'text-gray-600' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Share</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* QR Code Section */}
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-xl inline-block shadow-sm border border-gray-200">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  className="w-48 h-48"
                />
              )}
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="mb-6">
            <div className="grid grid-cols-3 gap-3">
              {socialPlatforms.map((platform) => {
                const IconComponent = platform.icon;
                return (
                  <Button
                    key={platform.id}
                    variant="ghost"
                    onClick={() => handleSocialShare(platform.id)}
                    className="h-12 flex flex-col items-center justify-center gap-1 hover:bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    <IconComponent className={`h-5 w-5 ${platform.color}`} />
                    <span className="text-xs font-medium">{platform.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* URL Input with Copy */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Input
                value={profileUrl}
                readOnly
                className="flex-1 text-sm bg-gray-50"
              />
              <Button
                size="sm"
                onClick={handleCopyUrl}
                className="flex items-center space-x-1 bg-gray-900 hover:bg-gray-800 text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDialog;
