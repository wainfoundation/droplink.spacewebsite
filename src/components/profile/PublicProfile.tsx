import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShareDialog from "@/components/sharing/ShareDialog";
import EmptyProfileState from "./EmptyProfileState";
import { 
  ExternalLink, 
  Heart, 
  Share2, 
  Copy, 
  QrCode, 
  Eye, 
  Clock, 
  MapPin, 
  Globe,
  Star,
  Zap,
  Crown,
  Shield,
  Download,
  Play,
  Music,
  BookOpen,
  Coffee,
  MessageCircle,
  ShoppingBag,
  DollarSign,
  Gift,
  TrendingUp,
  Users,
  User,
  Calendar,
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Github,
  MessageCircle as Discord,
  Send as Telegram,
  Music as Spotify,
  Video as Twitch,
  Image as Pinterest,
  Palette as Behance,
  Target as Dribbble,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Lock,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPlanConfig, hasFeature, type PlanType } from "@/services/planFeaturesService";

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  type: 'link' | 'tip' | 'product' | 'contact' | 'social';
  is_active: boolean;
  clicks: number;
  thumbnail?: string;
  price?: number;
  currency?: string;
  category?: string;
  featured?: boolean;
}

interface Profile {
  id: string;
  username: string;
  display_name: string;
  bio: string;
  avatar_url?: string;
  cover_photo?: string;
  business_name?: string;
  professional_title?: string;
  industry?: string;
  location?: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  languages?: string[];
  skills?: string[];
  availability?: string;
  professional_bio?: string;
  experience?: string;
  education?: string;
  certifications?: string;
  social_links: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    youtube?: string;
    github?: string;
    discord?: string;
    telegram?: string;
    spotify?: string;
    twitch?: string;
    pinterest?: string;
    behance?: string;
    dribbble?: string;
  };
  plan: PlanType;
  template: string;
  custom_css?: string;
  show_ads: boolean;
  show_droplink_badge: boolean;
  created_at: string;
  updated_at: string;
}

interface PublicProfileProps {
  profile?: Profile;
  links?: Link[];
  isLoading?: boolean;
}

const PublicProfile: React.FC<PublicProfileProps> = ({ 
  profile, 
  links = [], 
  isLoading = false 
}) => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState('ocean-blue');
  const [isSharing, setIsSharing] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Use actual profile data or show empty state
  const currentProfile = profile || {
    id: '',
    username: username || '',
    display_name: '',
    bio: '',
    avatar_url: '',
    business_name: '',
    professional_title: '',
    industry: '',
    location: '',
    contact_email: '',
    website: '',
    languages: [],
    skills: [],
    availability: '',
    professional_bio: '',
    experience: '',
    education: '',
    certifications: '',
    social_links: {},
    plan: 'FREE',
    template: 'ocean-blue',
    show_ads: true,
    show_droplink_badge: true,
    created_at: '',
    updated_at: ''
  };

  // Use actual links or show empty state
  const currentLinks = links || [];
  const planConfig = getPlanConfig(currentProfile.plan as any);

  // Template configurations
  const templates = {
    'ocean-blue': {
      name: 'Ocean Blue',
      background: 'linear-gradient(135deg, #00aaff, #00d4ff)',
      textColor: 'text-white',
      buttonStyle: 'bg-white/90 hover:bg-white text-gray-800'
    },
    'sunset': {
      name: 'Sunset',
      background: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
      textColor: 'text-white',
      buttonStyle: 'bg-white/90 hover:bg-white text-gray-800'
    },
    'forest': {
      name: 'Forest',
      background: 'linear-gradient(135deg, #11998e, #38ef7d)',
      textColor: 'text-white',
      buttonStyle: 'bg-white/90 hover:bg-white text-gray-800'
    },
    'gradient-pro': {
      name: 'Gradient Pro',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      textColor: 'text-white',
      buttonStyle: 'bg-white/90 hover:bg-white text-gray-800'
    },
    'neon-lights': {
      name: 'Neon Lights',
      background: 'linear-gradient(135deg, #ff006e, #00f5ff)',
      textColor: 'text-white',
      buttonStyle: 'bg-white/90 hover:bg-white text-gray-800'
    },
    'royal-purple': {
      name: 'Royal Purple',
      background: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
      textColor: 'text-white',
      buttonStyle: 'bg-white/90 hover:bg-white text-gray-800'
    },
    'gold-rush': {
      name: 'Gold Rush',
      background: 'linear-gradient(135deg, #f7971e, #ffd200)',
      textColor: 'text-white',
      buttonStyle: 'bg-white/90 hover:bg-white text-gray-800'
    },
    'premium-dark': {
      name: 'Premium Dark',
      background: 'linear-gradient(135deg, #0f0f23, #2d2d44)',
      textColor: 'text-white',
      buttonStyle: 'bg-white/90 hover:bg-white text-gray-800'
    },
    'diamond': {
      name: 'Diamond',
      background: 'linear-gradient(135deg, #e8f5e8, #b8e6b8, #74c0fc)',
      textColor: 'text-gray-800',
      buttonStyle: 'bg-gray-800/90 hover:bg-gray-800 text-white'
    }
  };

  const currentTemplate = templates[currentProfile.template as keyof typeof templates] || templates['ocean-blue'];

  const getSocialIcon = (platform: string) => {
    const icons: Record<string, React.ReactNode> = {
      instagram: <Instagram className="w-4 h-4" />,
      twitter: <Twitter className="w-4 h-4" />,
      facebook: <Facebook className="w-4 h-4" />,
      linkedin: <Linkedin className="w-4 h-4" />,
      youtube: <Youtube className="w-4 h-4" />,
      github: <Github className="w-4 h-4" />,
      discord: <Discord className="w-4 h-4" />,
      telegram: <Telegram className="w-4 h-4" />,
      spotify: <Spotify className="w-4 h-4" />,
      twitch: <Twitch className="w-4 h-4" />,
      pinterest: <Pinterest className="w-4 h-4" />,
      behance: <Behance className="w-4 h-4" />,
      dribbble: <Dribbble className="w-4 h-4" />
    };
    return icons[platform] || <Globe className="w-4 h-4" />;
  };

  const getLinkIcon = (type: Link['type']) => {
    switch (type) {
      case 'tip': return <Heart className="w-4 h-4" />;
      case 'product': return <ShoppingBag className="w-4 h-4" />;
      case 'contact': return <MessageCircle className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      default: return <ExternalLink className="w-4 h-4" />;
    }
  };

  const handleLinkClick = (link: Link) => {
    // Track click
    console.log('Link clicked:', link.title);
    
    // Open link
    if (link.type === 'tip') {
      // Handle Pi tip
      toast({
        title: "Pi Tip",
        description: "Opening Pi tip interface...",
      });
    } else if (link.type === 'product') {
      // Handle product purchase
      toast({
        title: "Product",
        description: `Opening ${link.title}...`,
      });
    } else {
      // Regular link
      window.open(link.url, '_blank');
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentProfile.display_name} - Droplink Profile`,
          text: `Check out ${currentProfile.display_name}'s profile`,
          url: url
        });
      } catch (error) {
        console.log('Share cancelled');
        // If native share fails, show QR dialog
        setShowShareDialog(true);
      }
    } else {
      // Show QR sharing dialog for desktop
      setShowShareDialog(true);
    }
    setIsSharing(false);
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Profile link copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show clean empty profile if no data is configured
  if (!profile || (!profile.display_name && !profile.bio && currentLinks.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Mobile phone frame */}
        <div className="max-w-sm mx-auto p-4">
          <div className="relative bg-gray-900 rounded-3xl p-2 shadow-2xl">
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Status bar */}
              <div className="bg-gray-900 text-white text-xs flex justify-between items-center px-4 py-1">
                <span>9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 bg-white rounded-sm"></div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              
              {/* URL Bar */}
              <div className="bg-gray-100 px-4 py-2 border-b">
                <div className="bg-white rounded-lg px-3 py-1 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-mono text-sm font-bold text-blue-600">
                    {username || 'user'}.pi
                  </span>
                </div>
              </div>
              
              {/* Empty Profile content */}
              <div 
                className="p-4 min-h-[600px] flex flex-col items-center justify-center"
                style={{ background: currentTemplate.background }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white/60" />
                  </div>
                  <h1 className={`text-xl font-bold mb-2 ${currentTemplate.textColor}`}>
                    {username || 'User'}
                  </h1>
                  <p className={`text-sm ${currentTemplate.textColor}/60`}>
                    Profile not set up yet
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop view */}
        <div className="hidden md:block max-w-md mx-auto p-8">
          <div 
            className="rounded-2xl p-8 min-h-[600px] flex flex-col items-center justify-center"
            style={{ background: currentTemplate.background }}
          >
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-12 h-12 text-white/60" />
              </div>
              <h1 className={`text-2xl font-bold mb-4 ${currentTemplate.textColor}`}>
                {username || 'User'}
              </h1>
              <p className={`text-sm ${currentTemplate.textColor}/60`}>
                Profile not set up yet
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile phone frame */}
      <div className="max-w-sm mx-auto p-4">
        <div className="relative bg-gray-900 rounded-3xl p-2 shadow-2xl">
          <div className="bg-white rounded-2xl overflow-hidden">
            {/* Status bar */}
            <div className="bg-gray-900 text-white text-xs flex justify-between items-center px-4 py-1">
              <span>9:41</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-white rounded-sm"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>
            
            {/* URL Bar */}
            <div className="bg-gray-100 px-4 py-2 border-b">
              <div className="bg-white rounded-lg px-3 py-1 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-mono text-sm font-bold text-blue-600">
                  {currentProfile.username}.pi
                </span>
              </div>
            </div>
            
            {/* Profile content */}
            <div 
              className="p-4 min-h-[600px]"
              style={{ background: currentTemplate.background }}
            >
              {/* Pi Ads for Free Plan */}
              {currentProfile.show_ads && (
                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                  <p className="text-xs text-yellow-800 font-medium">📢 Pi Network Ad</p>
                  <p className="text-xs text-yellow-600 mt-1">Upgrade to remove ads</p>
                </div>
              )}
              
              {/* Profile header */}
              <div className="text-center mb-6">
                <div className="relative inline-block mb-3">
                  <Avatar className="w-20 h-20 border-4 border-white/30 shadow-lg">
                    <AvatarImage src={currentProfile.avatar_url} alt={currentProfile.display_name} />
                    <AvatarFallback className="bg-white/90 text-gray-800 text-xl font-bold">
                      {currentProfile.display_name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                
                <h1 className={`text-xl font-bold mb-1 drop-shadow-md ${currentTemplate.textColor}`}>
                  {currentProfile.display_name || currentProfile.username || 'User'}
                </h1>
                <p className={`${currentTemplate.textColor}/90 text-sm mb-2 drop-shadow-sm`}>
                  @{currentProfile.username}
                </p>
                {currentProfile.bio && (
                  <p className={`${currentTemplate.textColor}/90 text-sm leading-relaxed mb-4 drop-shadow-sm`}>
                    {currentProfile.bio}
                  </p>
                )}
                
                {/* Plan Badge */}
                <div className="flex justify-center gap-2 mb-4">
                  <Badge className={`text-xs text-white ${planConfig.color}`}>
                    {planConfig.icon}
                    <span className="ml-1">{planConfig.name}</span>
                  </Badge>
                </div>
              </div>
              
              {/* Links - only show if there are actual links */}
              {currentLinks.length > 0 && (
                <div className="space-y-3 mb-6">
                  {currentLinks.filter(link => link.is_active).map((link) => (
                  <div key={link.id} className="relative">
                    <Button 
                      className={`w-full ${
                        link.type === 'tip' 
                          ? 'border-2 border-white/50 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                          : link.featured
                          ? 'bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm'
                          : 'border-2 border-white/50 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                      } rounded-xl py-3 h-auto text-sm shadow-lg`}
                      variant={link.featured ? 'default' : 'outline'}
                      onClick={() => handleLinkClick(link)}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          {link.thumbnail && (
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                              <img src={link.thumbnail} alt={link.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="text-left">
                            <span className="font-medium">{link.title}</span>
                            {link.description && (
                              <p className="text-xs opacity-80 mt-1">{link.description}</p>
                            )}
                            {link.price && (
                              <p className="text-xs font-bold mt-1">{link.price}{link.currency}</p>
                            )}
                          </div>
                        </div>
                        {getLinkIcon(link.type)}
                      </div>
                    </Button>
                  </div>
                ))}
                </div>
              )}

              {/* Social Links - only show if there are actual social links */}
              {Object.keys(currentProfile.social_links).length > 0 && Object.values(currentProfile.social_links).some(url => url) && (
              <div className="flex justify-center gap-3 mb-6">
                {Object.entries(currentProfile.social_links).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <Button
                      key={platform}
                      size="sm"
                      variant="outline"
                      className="w-10 h-10 p-0 rounded-full bg-white/20 border-white/50 text-white hover:bg-white/30 backdrop-blur-sm"
                      onClick={() => window.open(url, '_blank')}
                    >
                      {getSocialIcon(platform)}
                    </Button>
                  );
                })}
              </div>
              )}
              
              {/* QR Code and Share buttons - only show if there are links or content */}
              {(currentLinks.length > 0 || currentProfile.bio) && (
                <>
                  {/* QR Code (if available) */}
                  {hasFeature(currentProfile.plan, 'qrCode') && (
                    <div className="text-center mb-4">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className={`${currentTemplate.textColor}/80 hover:${currentTemplate.textColor} text-xs bg-white/10 hover:bg-white/20 backdrop-blur-sm`}
                      >
                        <QrCode className="w-3 h-3 mr-1" />
                        Show QR Code
                      </Button>
                    </div>
                  )}
                  
                  {/* Share button */}
                  <div className="text-center mb-4">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className={`${currentTemplate.textColor}/80 hover:${currentTemplate.textColor} text-xs`}
                      onClick={handleShare}
                      disabled={isSharing}
                    >
                      <Share2 className="w-3 h-3 mr-1" />
                      Share Profile
                    </Button>
                  </div>
                </>
              )}
              
              {/* Droplink Badge for Free Plan */}
              {currentProfile.show_droplink_badge && (
                <div className="text-center">
                  <p className={`text-xs ${currentTemplate.textColor}/60 drop-shadow-sm`}>
                    Powered by Droplink
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block max-w-md mx-auto p-8">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* URL Bar */}
          <div className="bg-gray-100 px-6 py-3 border-b">
            <div className="bg-white rounded-lg px-4 py-2 flex items-center gap-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <span className="font-mono text-sm font-bold text-blue-600">
                {currentProfile.username}.pi
              </span>
            </div>
          </div>
          
          {/* Profile content */}
          <div 
            className="p-8"
            style={{ background: currentTemplate.background }}
          >
            {/* Profile header */}
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <Avatar className="w-24 h-24 border-4 border-white/30 shadow-lg">
                  <AvatarImage src={currentProfile.avatar_url} alt={currentProfile.display_name} />
                  <AvatarFallback className="bg-white/90 text-gray-800 text-2xl font-bold">
                    {currentProfile.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              
              <h1 className={`text-2xl font-bold mb-2 drop-shadow-md ${currentTemplate.textColor}`}>
                {currentProfile.display_name || currentProfile.username || 'User'}
              </h1>
              <p className={`${currentTemplate.textColor}/90 text-sm mb-3 drop-shadow-sm`}>
                @{currentProfile.username}
              </p>
              {currentProfile.bio && (
                <p className={`${currentTemplate.textColor}/90 text-sm leading-relaxed mb-6 drop-shadow-sm`}>
                  {currentProfile.bio}
                </p>
              )}
              
              {/* Plan Badge */}
              <div className="flex justify-center gap-2 mb-6">
                <Badge className={`text-sm text-white ${planConfig.color}`}>
                  {planConfig.icon}
                  <span className="ml-1">{planConfig.name}</span>
                </Badge>
              </div>
            </div>
            
            {/* Links - only show if there are actual links */}
            {currentLinks.length > 0 && (
              <div className="space-y-4 mb-8">
                {currentLinks.filter(link => link.is_active).map((link) => (
                <div key={link.id} className="relative">
                  <Button 
                    className={`w-full ${
                      link.type === 'tip' 
                        ? 'border-2 border-white/50 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                        : link.featured
                        ? 'bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm'
                        : 'border-2 border-white/50 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                    } rounded-xl py-4 h-auto text-sm shadow-lg`}
                    variant={link.featured ? 'default' : 'outline'}
                    onClick={() => handleLinkClick(link)}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-4">
                        {link.thumbnail && (
                          <div className="w-10 h-10 rounded-full overflow-hidden">
                            <img src={link.thumbnail} alt={link.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="text-left">
                          <span className="font-medium">{link.title}</span>
                          {link.description && (
                            <p className="text-xs opacity-80 mt-1">{link.description}</p>
                          )}
                          {link.price && (
                            <p className="text-xs font-bold mt-1">{link.price}{link.currency}</p>
                          )}
                        </div>
                      </div>
                      {getLinkIcon(link.type)}
                    </div>
                  </Button>
                </div>
              ))}
              </div>
            )}

            {/* Social Links - only show if there are actual social links */}
            {Object.keys(currentProfile.social_links).length > 0 && Object.values(currentProfile.social_links).some(url => url) && (
            <div className="flex justify-center gap-4 mb-8">
              {Object.entries(currentProfile.social_links).map(([platform, url]) => {
                if (!url) return null;
                return (
                  <Button
                    key={platform}
                    size="sm"
                    variant="outline"
                    className="w-12 h-12 p-0 rounded-full bg-white/20 border-white/50 text-white hover:bg-white/30 backdrop-blur-sm"
                    onClick={() => window.open(url, '_blank')}
                  >
                    {getSocialIcon(platform)}
                  </Button>
                );
              })}
            </div>
            )}
            
            {/* Action buttons - only show if there are links or content */}
            {(currentLinks.length > 0 || currentProfile.bio) && (
              <div className="flex justify-center gap-4">
                {hasFeature(currentProfile.plan, 'qrCode') && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`${currentTemplate.textColor}/80 hover:${currentTemplate.textColor} text-sm bg-white/10 hover:bg-white/20 backdrop-blur-sm`}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    QR Code
                  </Button>
                )}
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className={`${currentTemplate.textColor}/80 hover:${currentTemplate.textColor} text-sm`}
                  onClick={handleShare}
                  disabled={isSharing}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className={`${currentTemplate.textColor}/80 hover:${currentTemplate.textColor} text-sm`}
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Share Dialog */}
      <ShareDialog
        isOpen={showShareDialog}
        onClose={() => setShowShareDialog(false)}
        profileUrl={window.location.href}
        username={currentProfile.username}
        displayName={currentProfile.display_name}
      />
    </div>
  );
};

export default PublicProfile;
