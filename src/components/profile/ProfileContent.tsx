
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useUser } from "@/context/UserContext";
import { toast } from "@/hooks/use-toast";
import { DOMAIN_CONFIG } from "@/config/domain";
import PiAdsNetwork from "@/components/PiAdsNetwork";
import TipButton from "@/components/tipping/TipButton";
import ProfileStickers from "@/components/stickers/ProfileStickers";
import ProfileHeader from "./ProfileHeader";
import ProfileQrCode from "./ProfileQrCode";
import LinksList from "./LinksList";
import TipModal from "./TipModal";
import RecentTips from "./RecentTips";
import ShareProfileModal from "./ShareProfileModal";
import ShareDialog from "@/components/sharing/ShareDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  Copy, 
  QrCode, 
  ExternalLink, 
  Eye, 
  MousePointer,
  Download,
  Heart,
  MessageCircle
} from "lucide-react";

interface Link {
  id: string;
  title: string;
  url: string;
  icon: string;
  clicks: number;
  type?: "featured" | "social" | "regular";
}

interface PiLink {
  title: string;
  url: string;
}

interface ProfileData {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  imported_pi_avatar?: string | null;
  imported_pi_bio?: string | null;
  imported_pi_links?: PiLink[] | null;
  pi_profile_last_synced?: string | null;
  active_sticker_ids?: string[] | null;
  links: Link[];
}

interface ProfileContentProps {
  profileData: ProfileData;
  onLinkClick: (link: Link) => void;
  onTipSubmit: (amount: number, message: string) => void;
  onShareProfile: () => void;
  processingTip: boolean;
}

const ProfileContent = ({
  profileData,
  onLinkClick,
  onTipSubmit,
  onShareProfile,
  processingTip
}: ProfileContentProps) => {
  const [showQRCode, setShowQRCode] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { user, showAds } = useUser();
  const navigate = useNavigate();

  const profileUrl = DOMAIN_CONFIG.getProfileUrl(profileData.username);
  const displayAvatar = profileData.imported_pi_avatar || profileData.avatar_url;
  const displayBio = profileData.imported_pi_bio || profileData.bio;
  const isOwnProfile = user?.id === profileData.id;

  // Calculate total clicks
  const totalClicks = profileData.links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  const handleTipClick = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to send a tip",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setShowTipModal(true);
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profileData.display_name || profileData.username} on Droplink`,
        text: `Check out ${profileData.display_name || profileData.username}'s profile on Droplink`,
        url: profileUrl,
      }).catch(() => {
        // If native share fails, show QR dialog
        setShowShareDialog(true);
      });
    } else {
      setShowShareDialog(true);
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied!",
        description: "Profile URL copied to clipboard",
      });
    } catch (error) {
      console.error("Error copying URL:", error);
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const handleTipSubmit = (amount: number, message: string) => {
    onTipSubmit(amount, message);
    setShowTipModal(false);
  };

  return (
    <>
      <Helmet>
        <title>{profileData.display_name || profileData.username} | Droplink</title>
        <meta name="description" content={displayBio} />
        <meta property="og:title" content={`${profileData.display_name || profileData.username} | Droplink`} />
        <meta property="og:description" content={displayBio} />
        <meta property="og:url" content={profileUrl} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${profileData.display_name || profileData.username} | Droplink`} />
        <meta name="twitter:description" content={displayBio} />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        {/* Header with Profile Info */}
        <div className="relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10"></div>
          
          <div className="relative container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto text-center">
              {/* Profile Avatar */}
              <div className="mb-6">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {displayAvatar ? (
                    <img 
                      src={displayAvatar} 
                      alt={profileData.display_name || profileData.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-white font-bold">
                      {(profileData.display_name || profileData.username).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profileData.display_name || profileData.username}
                </h1>
                {displayBio && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {displayBio}
                  </p>
                )}
                
                {/* Profile URL */}
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-6">
                  <span>{profileUrl}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyUrl}
                    className="h-6 w-6 p-0 hover:bg-gray-100"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-3 mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareClick}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowQRCode(true)}
                    className="flex items-center space-x-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>QR Code</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="container mx-auto px-4 pb-12">
          <div className="max-w-md mx-auto">
            {/* Links List */}
            <div className="space-y-3 mb-8">
              {profileData.links.length > 0 ? (
                profileData.links.map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    className="w-full py-4 flex items-center justify-start gap-4 hover:bg-gray-50 transition-all duration-200 border border-gray-200 rounded-xl shadow-sm hover:shadow-md"
                    onClick={() => onLinkClick(link)}
                    disabled={processingTip}
                  >
                    <span className="text-xl">{link.icon}</span>
                    <span className="text-left font-medium text-gray-900">{link.title}</span>
                    {link.type === 'featured' && (
                      <Badge variant="secondary" className="ml-auto text-xs">
                        Featured
                      </Badge>
                    )}
                  </Button>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ExternalLink className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">No links added yet</p>
                </div>
              )}
            </div>

            {/* Tip Button */}
            <div className="mb-8">
              <TipButton
                recipientId={profileData.id}
                recipientUsername={profileData.username}
                className="w-full py-4 text-center bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                variant="default"
                size="lg"
                onClick={handleTipClick}
              />
            </div>

            {/* Stats (if own profile) */}
            {isOwnProfile && totalClicks > 0 && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MousePointer className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Total Clicks</span>
                  </div>
                  <span className="font-semibold text-gray-900">{totalClicks.toLocaleString()}</span>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <img 
                  src="/lovable-uploads/0d519e46-7a30-4f3d-a07a-17e763eeda19.png" 
                  alt="Droplink" 
                  className="w-5 h-5 object-contain"
                />
                <span className="text-sm text-gray-500">Powered by Droplink</span>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-xs text-gray-400">
                <span>Made with</span>
                <Heart className="w-3 h-3 text-red-500 fill-current" />
                <span>for the Pi Network</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pi Ads Network */}
        {showAds && <PiAdsNetwork />}

        {/* Profile Stickers */}
        {profileData.active_sticker_ids && profileData.active_sticker_ids.length > 0 && (
          <ProfileStickers stickerIds={profileData.active_sticker_ids} />
        )}

        {/* Modals */}
        {showQRCode && (
          <ProfileQrCode
            profileUrl={profileUrl}
            onClose={() => setShowQRCode(false)}
          />
        )}

        {showTipModal && (
          <TipModal
            recipientId={profileData.id}
            recipientUsername={profileData.username}
            onClose={() => setShowTipModal(false)}
            onSubmit={handleTipSubmit}
            processing={processingTip}
          />
        )}

        {showShareModal && (
          <ShareProfileModal
            profileUrl={profileUrl}
            username={profileData.username}
            onClose={() => setShowShareModal(false)}
          />
        )}

        {/* Recent Tips */}
        {!isOwnProfile && (
          <RecentTips profileId={profileData.id} />
        )}
      </div>

      {/* QR Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        profileUrl={profileUrl}
        username={profileData.username}
        displayName={profileData.display_name}
      />
    </>
  );
};

export default ProfileContent;
