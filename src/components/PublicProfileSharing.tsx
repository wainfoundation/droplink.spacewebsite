import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Share2, 
  Copy, 
  Download, 
  QrCode, 
  Link as LinkIcon,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  ExternalLink,
  Check,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PublicProfileSharingProps {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  profileUrl: string;
  onShare?: (platform: string) => void;
}

const PublicProfileSharing: React.FC<PublicProfileSharingProps> = ({
  username,
  displayName,
  bio,
  avatarUrl,
  profileUrl,
  onShare
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const shareText = `Check out ${displayName}'s profile on Droplink!`;
  const shareTitle = `${displayName} - Droplink Profile`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Profile URL copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = async () => {
    try {
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;
      setQrCodeUrl(qrUrl);
    } catch (err) {
      toast({
        title: "QR Code Failed",
        description: "Failed to generate QR code.",
        variant: "destructive",
      });
    }
  };

  const shareToPlatform = (platform: string) => {
    const encodedUrl = encodeURIComponent(profileUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
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
        shareUrl = `mailto:?subject=${encodedTitle}&body=${encodedText}%20${encodedUrl}`;
        break;
      case 'sms':
        shareUrl = `sms:?body=${encodedText}%20${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      onShare?.(platform);
    }
  };

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.href = qrCodeUrl;
      link.download = `${username}-qrcode.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const shareOptions = [
    {
      platform: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      platform: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      platform: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700 hover:bg-blue-800'
    },
    {
      platform: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      platform: 'telegram',
      name: 'Telegram',
      icon: MessageCircle,
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      platform: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700'
    },
    {
      platform: 'sms',
      name: 'SMS',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Preview */}
      <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <img
              src={avatarUrl || '/default-avatar.png'}
              alt={displayName}
              className="w-16 h-16 rounded-full border-2 border-white/20"
              onError={(e) => {
                e.currentTarget.src = '/default-avatar.png';
              }}
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold">{displayName}</h3>
              <p className="text-white/80">@{username}</p>
              {bio && (
                <p className="text-sm text-white/70 mt-1">{bio}</p>
              )}
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              <LinkIcon className="w-3 h-3 mr-1" />
              Droplink
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Share URL */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Profile URL</label>
        <div className="flex space-x-2">
          <Input
            value={profileUrl}
            readOnly
            className="flex-1"
          />
          <Button
            onClick={copyToClipboard}
            variant={copied ? "default" : "outline"}
            size="sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Share to Social Media</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {shareOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.platform}
                onClick={() => shareToPlatform(option.platform)}
                variant="outline"
                className={`${option.color} text-white border-0 hover:text-white`}
                size="sm"
              >
                <Icon className="w-4 h-4 mr-2" />
                {option.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* QR Code */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">QR Code</label>
          <Button
            onClick={generateQRCode}
            variant="outline"
            size="sm"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Generate QR
          </Button>
        </div>
        
        {qrCodeUrl && (
          <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
            <img
              src={qrCodeUrl}
              alt="QR Code"
              className="w-24 h-24 border rounded"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-2">
                Scan this QR code to visit the profile
              </p>
              <Button
                onClick={downloadQRCode}
                variant="outline"
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Embed Code */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Embed Code</label>
        <div className="space-y-2">
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                const embedCode = `<iframe src="${profileUrl}" width="400" height="600" frameborder="0"></iframe>`;
                navigator.clipboard.writeText(embedCode);
                toast({
                  title: "Embed Code Copied!",
                  description: "HTML embed code copied to clipboard.",
                });
              }}
              variant="outline"
              size="sm"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Embed Code
            </Button>
            <Button
              onClick={() => {
                const previewUrl = `${profileUrl}?embed=true`;
                window.open(previewUrl, '_blank');
              }}
              variant="outline"
              size="sm"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview Embed
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            Use this code to embed the profile on your website
          </p>
        </div>
      </div>

      {/* Share Stats */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <Share2 className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Share Tips</span>
        </div>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Share on social media for maximum visibility</li>
          <li>• Use QR codes for offline sharing</li>
          <li>• Embed in your website or blog</li>
          <li>• Include in email signatures</li>
        </ul>
      </div>
    </div>
  );
};

export default PublicProfileSharing;
