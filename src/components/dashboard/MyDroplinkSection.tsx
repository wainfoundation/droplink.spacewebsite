
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { useUserPlan } from "@/hooks/use-user-plan";
import { useLinks } from "@/hooks/useLinks";
import { useToast } from "@/hooks/use-toast";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import QuickSetupWizard from "./QuickSetupWizard";
import LinksSection from "./LinksSection";
import { DOMAIN_CONFIG } from "@/config/domain";
import { 
  Link as LinkIcon, 
  Plus, 
  Eye, 
  Edit3, 
  ExternalLink, 
  BarChart3,
  Users,
  TrendingUp,
  Copy,
  MoreVertical,
  Palette,
  Share2,
  Settings,
  Rocket,
  CheckCircle,
  QrCode,
  Globe,
  MessageCircle
} from "lucide-react";

const MyDroplinkSection = () => {
  const { user, profile } = useUser();
  const { limits } = useUserPlan();
  const { links } = useLinks(user?.id);
  const { toast } = useToast();
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const username = profile?.username || user?.email?.split('@')[0] || 'username';
  const displayName = profile?.display_name || profile?.username || 'Your Name';
  const bio = profile?.bio || 'Add a bio to tell people about yourself';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const activeLinks = links.filter(link => link.is_active).length;
  const profileUrl = DOMAIN_CONFIG.getProfileUrl(username);

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Profile URL Copied!",
        description: "Your profile link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually.",
        variant: "destructive",
      });
    }
  };

  const visitProfile = () => {
    window.open(`/@${username}`, '_blank');
  };

  const handleShareProfile = async () => {
    const shareData = {
      title: `${displayName} on Droplink`,
      text: `Check out ${displayName}'s links on Droplink`,
      url: profileUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
          description: "Your profile has been shared.",
        });
      } else {
        // Fallback to copying URL
        await copyProfileUrl();
      }
    } catch (error) {
      console.log('Share cancelled or failed');
    }
  };

  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;
    window.open(qrUrl, '_blank');
  };

  // Show setup wizard if no links and no profile setup
  const shouldShowSetupWizard = links.length === 0 && (!profile?.bio && !profile?.display_name);

  if (showSetupWizard || shouldShowSetupWizard) {
    return (
      <QuickSetupWizard
        onComplete={() => setShowSetupWizard(false)}
        onSkip={() => setShowSetupWizard(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5" />
              My Droplink
              <Badge variant="secondary" className="ml-2">
                {activeLinks} {activeLinks === 1 ? 'link' : 'links'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSetupWizard(true)}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Quick Setup
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={visitProfile}
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareProfile}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-lg font-semibold">{displayName}</h3>
                <p className="text-sm text-gray-500">@{username}</p>
                {bio && <p className="text-sm text-gray-600 mt-1">{bio}</p>}
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">{totalClicks.toLocaleString()} clicks</span>
                </div>
                <div className="flex items-center gap-1">
                  <LinkIcon className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">{activeLinks} active links</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyProfileUrl}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy URL
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={visitProfile}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateQRCode}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  QR Code
                </Button>
              </div>
              
              {/* Profile URL Display */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Your Profile URL:</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activeLinks} {activeLinks === 1 ? 'link' : 'links'} active
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <code className="text-sm bg-white px-2 py-1 rounded border flex-1 font-mono text-gray-800">
                    {profileUrl}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyProfileUrl}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Share this link to let people visit your profile and click your links
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={handleShareProfile}
            >
              <Share2 className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Native Share</div>
                <div className="text-xs text-gray-500">Share via system</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={copyProfileUrl}
            >
              <Copy className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Copy Link</div>
                <div className="text-xs text-gray-500">Copy to clipboard</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={generateQRCode}
            >
              <QrCode className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">QR Code</div>
                <div className="text-xs text-gray-500">Generate QR code</div>
              </div>
            </Button>
            
            <Button
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
              onClick={visitProfile}
            >
              <Eye className="w-6 h-6" />
              <div className="text-center">
                <div className="font-medium">Preview</div>
                <div className="text-xs text-gray-500">View your profile</div>
              </div>
            </Button>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900">How to share your profile</h4>
                <p className="text-sm text-blue-700 mt-1">
                  When someone visits your profile link, they'll see all your active links and can click them to visit your content. 
                  Your profile works just like Linktree - simple, clean, and effective!
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Links Management */}
      <LinksSection />
    </div>
  );
};

export default MyDroplinkSection;
