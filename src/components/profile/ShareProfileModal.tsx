import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DOMAIN_CONFIG } from "@/config/domain";
import { 
  Share2, 
  Copy, 
  QrCode, 
  ExternalLink, 
  Download,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  Link as LinkIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareProfileModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  displayName?: string | null;
  bio?: string | null;
}

const ShareProfileModal = ({ 
  isOpen, 
  onOpenChange, 
  username, 
  displayName, 
  bio 
}: ShareProfileModalProps) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const { toast } = useToast();

  const profileUrl = DOMAIN_CONFIG.getProfileUrl(username);
  const shareText = `Check out ${displayName || username}'s links on Droplink!`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(profileUrl)}`;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile URL Copied!",
        description: "Share this link with your friends",
      });
    } catch (error) {
      console.error("Error copying URL:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy profile URL",
        variant: "destructive",
      });
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${username}-qrcode.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded!",
      description: "Save and share your QR code",
    });
  };

  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${displayName || username} on Droplink`,
          text: shareText,
          url: profileUrl,
        });
      } else {
        // Fallback to clipboard
        await handleCopyUrl();
      }
    } catch (error) {
      console.error("Error sharing:", error);
      // Fallback to clipboard
      await handleCopyUrl();
    }
  };

  const handleSocialShare = (platform: string) => {
    let shareUrl = "";
    
    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
        break;
      case "whatsapp":
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText + " " + profileUrl)}`;
        break;
      case "telegram":
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case "email":
        shareUrl = `mailto:?subject=${encodeURIComponent(`${displayName || username} on Droplink`)}&body=${encodeURIComponent(shareText + "\n\n" + profileUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  const shareOptions = [
    {
      name: "Twitter",
      icon: Twitter,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => handleSocialShare("twitter")
    },
    {
      name: "Facebook",
      icon: Facebook,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => handleSocialShare("facebook")
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-blue-700 hover:bg-blue-800",
      onClick: () => handleSocialShare("linkedin")
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => handleSocialShare("whatsapp")
    },
    {
      name: "Telegram",
      icon: MessageCircle,
      color: "bg-blue-400 hover:bg-blue-500",
      onClick: () => handleSocialShare("telegram")
    },
    {
      name: "Email",
      icon: Mail,
      color: "bg-gray-500 hover:bg-gray-600",
      onClick: () => handleSocialShare("email")
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Share Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Profile Preview */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {displayName ? displayName.charAt(0).toUpperCase() : username.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <h3 className="font-semibold">{displayName || username}</h3>
                {bio && <p className="text-sm text-gray-600">{bio}</p>}
              </div>
            </div>
          </div>

          {/* Profile URL */}
          <div className="space-y-2">
            <Label htmlFor="profile-url">Profile URL</Label>
            <div className="flex space-x-2">
              <Input
                id="profile-url"
                value={profileUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyUrl}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-3">
            <Label>Share on Social Media</Label>
            <div className="grid grid-cols-3 gap-2">
              {shareOptions.map((option) => (
                <Button
                  key={option.name}
                  variant="outline"
                  size="sm"
                  onClick={option.onClick}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <option.icon className="w-4 h-4" />
                  <span className="text-xs">{option.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Native Share */}
          <Button
            onClick={handleNativeShare}
            className="w-full"
            size="lg"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Profile
          </Button>

          {/* QR Code Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>QR Code</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowQRCode(!showQRCode)}
              >
                {showQRCode ? "Hide" : "Show"} QR Code
              </Button>
            </div>
            
            {showQRCode && (
              <div className="text-center space-y-3">
                <div className="flex justify-center">
                  <img
                    src={qrCodeUrl}
                    alt="Profile QR Code"
                    className="w-48 h-48 border rounded-lg"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadQR}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR Code
                </Button>
              </div>
            )}
          </div>

          {/* Share Tips */}
          <div className="text-center text-sm text-gray-500">
            <p>Share this link with friends to help grow your audience!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProfileModal; 