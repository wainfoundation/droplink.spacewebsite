import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share, ExternalLink, Star, Sparkles } from "lucide-react";

interface DemoPreviewProps {
  profileData?: {
    title?: string;
    bio?: string;
    avatar?: string;
    username?: string;
    selectedPlatforms?: string[];
    links?: Array<{ platform: string; url: string; }>;
    selectedTemplate?: string;
  };
  // Add username prop for onboarding flow
  username?: string;
}

type LinkItem = {
  id: string;
  title: string;
  icon: string;
  special?: boolean;
  url?: string;
};

const DemoPreview = ({ profileData, username }: DemoPreviewProps) => {
  const displayName = profileData?.title || "Your Name";
  const displayBio = profileData?.bio || "🚀 Pi Network Creator | 💎 Building the future | 🌟 Join my journey";
  // Use username prop first, then profileData username, then fallback
  const displayUsername = username || profileData?.username || "username";
  const avatarUrl = profileData?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${displayName}`;

  // Get template colors based on selection
  const getTemplateGradient = () => {
    switch (profileData?.selectedTemplate) {
      case "modern":
        return "from-blue-50 to-indigo-100";
      case "minimal":
        return "from-gray-50 to-gray-100";
      case "creative":
        return "from-purple-50 to-pink-100";
      case "business":
        return "from-slate-50 to-blue-100";
      case "social":
        return "from-pink-50 to-orange-100";
      case "portfolio":
        return "from-green-50 to-teal-100";
      default:
        return "from-blue-50 to-indigo-100";
    }
  };

  // Generate links based on user's platform selections and URLs
  const generateLinks = (): LinkItem[] => {
    const defaultLinks: LinkItem[] = [
      { id: "main", title: "🎯 My Main Link", icon: "🎯" },
      { id: "tip", title: "💰 Tip me in Pi", icon: "💰", special: true }
    ];

    const platformLinks: LinkItem[] = profileData?.links?.map((link, index) => ({
      id: `platform-${index}`,
      title: getPlatformTitle(link.platform),
      icon: getPlatformIcon(link.platform),
      url: link.url
    })) || [];

    return [...defaultLinks, ...platformLinks];
  };

  const getPlatformTitle = (platform: string) => {
    const titles = {
      youtube: "📺 YouTube Channel",
      instagram: "📷 Instagram",
      tiktok: "🎵 TikTok",
      twitter: "🐦 Twitter",
      website: "🌐 Website",
      whatsapp: "💬 WhatsApp",
      facebook: "📘 Facebook",
      spotify: "🎧 Spotify",
      linkedin: "💼 LinkedIn",
      discord: "🎮 Discord",
      twitch: "🎮 Twitch",
      telegram: "✈️ Telegram"
    };
    return titles[platform as keyof typeof titles] || `🔗 ${platform}`;
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      youtube: "📺", 
      instagram: "📷", 
      tiktok: "🎵",
      twitter: "🐦",
      website: "🌐",
      whatsapp: "💬",
      facebook: "📘",
      spotify: "🎧",
      linkedin: "💼",
      discord: "🎮",
      twitch: "🎮",
      telegram: "✈️"
    };
    return icons[platform as keyof typeof icons] || "🔗";
  };

  const links = generateLinks();

  return (
    <div className="w-full max-w-sm mx-auto">
      {/* Enhanced Mobile phone frame - no tilt animation */}
      <div className="relative bg-gray-900 rounded-3xl p-2 shadow-2xl">
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl animate-pulse-glow"></div>
        
        <div className="relative bg-white rounded-2xl overflow-hidden animate-fade-in">
          {/* Status bar */}
          <div className="bg-gray-900 text-white text-xs flex justify-between items-center px-4 py-1">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 bg-white rounded-sm"></div>
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          
          {/* Profile content */}
          <div className={`p-6 bg-gradient-to-br ${getTemplateGradient()} min-h-[500px] animate-slide-up`}>
            {/* Profile header with enhanced animations */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4 animate-scale-breathe">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg animate-pulse-glow">
                  <img 
                    src={avatarUrl}
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center animate-bounce-gentle">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                {/* Floating sparkles effect */}
                <div className="absolute -top-2 -right-2">
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </div>
              </div>
              
              <h1 className="text-xl font-bold text-gray-900 mb-1 animate-slide-in">{displayName}</h1>
              <p className="text-gray-600 text-sm mb-2 animate-slide-in" style={{ animationDelay: '0.1s' }}>@{displayUsername}</p>
              <p className="text-gray-700 text-sm leading-relaxed px-2 animate-slide-in" style={{ animationDelay: '0.2s' }}>
                {displayBio}
              </p>
              
              <div className="flex justify-center gap-4 mt-4 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                <Badge variant="secondary" className="text-xs animate-pulse-glow">
                  <Star className="w-3 h-3 mr-1" />
                  Live Preview
                </Badge>
              </div>
            </div>
            
            {/* Enhanced Links with staggered animations */}
            <div className="space-y-3 mb-6">
              {links.slice(0, 4).map((link, index) => (
                <Button 
                  key={link.id}
                  className={`w-full rounded-xl py-3 h-auto shadow-md transition-all duration-300 hover:scale-105 animate-slide-in ${
                    link.special 
                      ? "border-2 border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 animate-pulse-glow" 
                      : index === 0 
                        ? "bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white animate-glow"
                        : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 hover:shadow-lg"
                  }`}
                  variant={link.special || index > 0 ? "outline" : "default"}
                  style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-medium">{link.title}</span>
                    {link.special ? (
                      <Heart className="w-4 h-4 animate-bounce-gentle" />
                    ) : (
                      <ExternalLink className="w-4 h-4" />
                    )}
                  </div>
                </Button>
              ))}
            </div>
            
            {/* Social links preview with floating effect */}
            {profileData?.selectedPlatforms && profileData.selectedPlatforms.length > 0 && (
              <div className="flex justify-center gap-3 mb-4 animate-slide-in" style={{ animationDelay: '0.8s' }}>
                {profileData.selectedPlatforms.slice(0, 3).map((platform, index) => (
                  <Button 
                    key={platform} 
                    size="sm" 
                    variant="outline" 
                    className="w-10 h-10 p-0 rounded-full hover:scale-110 transition-transform"
                    style={{ animationDelay: `${0.9 + index * 0.1}s` }}
                  >
                    <span className="text-sm">{getPlatformIcon(platform)}</span>
                  </Button>
                ))}
                {profileData.selectedPlatforms.length > 3 && (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                    +{profileData.selectedPlatforms.length - 3}
                  </div>
                )}
              </div>
            )}
            
            {/* Share button with glow effect */}
            <div className="text-center animate-slide-in" style={{ animationDelay: '1s' }}>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-gray-500 hover:text-gray-700 animate-pulse-glow hover:animate-glow transition-all duration-300"
              >
                <Share className="w-4 h-4 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPreview;
