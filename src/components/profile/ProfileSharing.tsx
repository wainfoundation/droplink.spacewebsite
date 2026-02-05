import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Share2, 
  Copy, 
  Check, 
  QrCode, 
  Download,
  Globe,
  Smartphone,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Mail
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCodeGenerator from "../dashboard/QRCodeGenerator";

interface ProfileSharingProps {
  username: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  plan: string;
}

const ProfileSharing = ({ 
  username, 
  displayName, 
  bio, 
  avatarUrl, 
  plan
}: ProfileSharingProps) => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("share");

  const profileUrl = `${window.location.origin}/profile/${username}`;
  const shareText = `Check out ${displayName || username}'s profile on Droplink: ${profileUrl}`;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: "Copied!",
        description: `${field} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${displayName || username}'s Profile`,
          text: shareText,
          url: profileUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copying URL
      copyToClipboard(profileUrl, "Profile URL");
    }
  };

  const shareToSocial = (platform: string) => {
    let url = "";
    let text = shareText;
    
    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we copy the text
        copyToClipboard(text, "Instagram Share Text");
        return;
      case 'email':
        url = `mailto:?subject=${encodeURIComponent(`${displayName || username}'s Profile`)}&body=${encodeURIComponent(text)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  const downloadProfileImage = () => {
    // In a real implementation, you would generate a profile image
    // For now, we'll just copy the profile URL
    copyToClipboard(profileUrl, "Profile URL");
    toast({
      title: "Profile Image",
      description: "Profile image download feature coming soon!",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Share Your Profile</h2>
          <p className="text-gray-600">Share your profile with the world</p>
        </div>
        <Badge variant="secondary">
          {plan === 'free' ? 'Free' : plan === 'starter' ? 'Starter' : 'Pro'}
        </Badge>
      </div>

      {/* Profile Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  (displayName || username).charAt(0).toUpperCase()
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {displayName || username}
                </h3>
                <p className="text-gray-600">@{username}</p>
                {bio && <p className="text-sm text-gray-700 mt-1">{bio}</p>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="share" className="flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Quick Share</span>
          </TabsTrigger>
          <TabsTrigger value="qr" className="flex items-center space-x-2">
            <QrCode className="w-4 h-4" />
            <span>QR Code</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="share" className="space-y-6">
          {/* Profile URL */}
          <Card>
            <CardHeader>
              <CardTitle>Your Profile URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={profileUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(profileUrl, "Profile URL")}
                >
                  {copiedField === "Profile URL" ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <Button
                onClick={shareProfile}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </CardContent>
          </Card>

          {/* Social Media Sharing */}
          <Card>
            <CardHeader>
              <CardTitle>Share to Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('twitter')}
                  className="flex items-center space-x-2"
                >
                  <Twitter className="w-4 h-4" />
                  <span>Twitter</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('facebook')}
                  className="flex items-center space-x-2"
                >
                  <Facebook className="w-4 h-4" />
                  <span>Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('linkedin')}
                  className="flex items-center space-x-2"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('instagram')}
                  className="flex items-center space-x-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => shareToSocial('email')}
                  className="flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(profileUrl, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>View</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(shareText, "Share Message")}
                  className="flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Share Message</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadProfileImage}
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Profile Image</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr" className="space-y-6">
          <QRCodeGenerator 
            profileUrl={profileUrl}
            username={username}
            userPlan={plan}
          />
        </TabsContent>
      </Tabs>

      {/* Usage Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Sharing Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile Sharing
              </h4>
              <p className="text-gray-600">Use the native share button on mobile devices for easy sharing</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center">
                <Globe className="w-4 h-4 mr-2" />
                Social Media
              </h4>
              <p className="text-gray-600">Share your profile URL in your social media bios and posts</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center">
                <QrCode className="w-4 h-4 mr-2" />
                QR Codes
              </h4>
              <p className="text-gray-600">Generate QR codes for offline sharing on business cards and materials</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSharing;
