
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import { useLinks } from "@/hooks/useLinks";
import { 
  Copy, 
  Lock, 
  Instagram, 
  Twitter, 
  Youtube, 
  Mail, 
  Globe,
  ExternalLink,
  Heart,
  MessageCircle,
  Share2,
  Sparkles,
  Eye,
  MousePointer
} from "lucide-react";
import { getProfileUrl } from '@/utils/url-helper';
import { getPlanConfig, type PlanType } from '@/services/planFeaturesService';
import DroplinkWaterdrop from '@/components/ui/DroplinkWaterdrop';

const MobilePreview = () => {
  const { user, profile } = useUser();
  const { links } = useLinks(user?.id);
  
  const username = profile?.username || user?.email?.split('@')[0] || 'username';
  const displayName = profile?.display_name || profile?.username || 'Your Name';
  const bio = profile?.bio || 'Add a bio to tell people about yourself';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

  // Use real links data, filter only active links
  const displayLinks = links.filter(link => link.is_active);

  // Calculate total clicks
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  // Plan configuration
  const userPlan = profile?.plan || 'FREE';
  const planConfig = getPlanConfig(userPlan as PlanType);

  const copyProfileUrl = () => {
    const profileUrl = getProfileUrl(username);
    navigator.clipboard.writeText(profileUrl);
    // You can add a toast notification here
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-6">
        {/* Enhanced Mobile Phone Mockup - no tilt animation */}
        <div className="bg-black rounded-[2rem] lg:rounded-[3rem] p-1 lg:p-2 mx-auto w-64 lg:w-72 h-[500px] lg:h-[600px] shadow-2xl">
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-[2rem] lg:rounded-[3rem] blur-xl animate-pulse-glow"></div>
          
          <div className="relative bg-white rounded-[1.5rem] lg:rounded-[2.5rem] w-full h-full overflow-hidden animate-fade-in">
            {/* Status Bar */}
            <div className="bg-black text-white text-xs px-4 lg:px-6 py-1 flex justify-between items-center">
              <span>9:41</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-1 lg:w-4 lg:h-2 bg-white rounded-sm"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Profile Content with enhanced animations */}
            {/* Droplink Waterdrop Watermark */}
            <DroplinkWaterdrop 
              size="xl" 
              isWatermark={true} 
              opacity={0.08}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
            />
            <div className="p-4 lg:p-6 space-y-4 lg:space-y-6 animate-slide-up">
              {/* Profile Header with floating effects */}
              <div className="text-center space-y-3 lg:space-y-4">
                <div className="relative animate-scale-breathe">
                  <Avatar className="h-12 w-12 lg:h-20 lg:w-20 mx-auto animate-pulse-glow">
                    <AvatarImage src={avatarUrl} alt={displayName} />
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg lg:text-2xl">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Floating sparkles effect */}
                  <div className="absolute -top-2 -right-2">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
                
                <div className="animate-slide-in" style={{ animationDelay: '0.1s' }}>
                  <h2 className="text-lg lg:text-xl font-bold text-gray-900">
                    {displayName}
                  </h2>
                  <p className="text-xs lg:text-sm text-gray-500">
                    @{username}
                  </p>
                  {bio ? (
                    <p className="text-xs lg:text-sm text-gray-600 mt-2">{bio}</p>
                  ) : (
                    <p className="text-xs lg:text-sm text-gray-400 mt-2 italic">Add a bio to tell people about yourself</p>
                  )}
                </div>

                {/* Analytics Badge */}
                {totalClicks > 0 && (
                  <div className="animate-slide-in" style={{ animationDelay: '0.15s' }}>
                    <Badge variant="secondary" className="text-xs">
                      <MousePointer className="w-3 h-3 mr-1" />
                      {totalClicks.toLocaleString()} total clicks
                    </Badge>
                  </div>
                )}

                {/* Plan Badge - Show Droplink badge for FREE plan */}
                {planConfig.features.showDroplinkBadge && (
                  <div className="animate-slide-in" style={{ animationDelay: '0.2s' }}>
                    <Badge className={`text-xs text-white ${planConfig.color} bg-opacity-90`}>
                      {planConfig.icon}
                      <span className="ml-1">Droplink</span>
                    </Badge>
                  </div>
                )}

                {/* Enhanced Social Icons with floating animations */}
                <div className="flex justify-center space-x-2 lg:space-x-3 animate-slide-in" style={{ animationDelay: '0.3s' }}>
                  {[
                    { icon: Instagram, delay: 0 },
                    { icon: Twitter, delay: 0.1 },
                    { icon: Youtube, delay: 0.2 },
                    { icon: Mail, delay: 0.3 }
                  ].map(({ icon: Icon, delay }, index) => (
                    <div 
                      key={index}
                      className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-100 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      style={{ animationDelay: `${0.4 + delay}s` }}
                    >
                      <Icon className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Links with staggered animations */}
              <div className="space-y-2 lg:space-y-3">
                {displayLinks.map((link, index) => {
                  return (
                    <div
                      key={link.id || index}
                      className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg lg:rounded-xl p-3 lg:p-4 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in border border-gray-200"
                      style={{ animationDelay: `${0.4 + index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 lg:space-x-3">
                          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/80 rounded-lg flex items-center justify-center animate-pulse-glow">
                            <span className="text-lg lg:text-xl">{link.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm lg:text-base">{link.title}</h3>
                            <p className="text-xs text-gray-600 truncate max-w-[120px] lg:max-w-[150px]">{link.url}</p>
                            {link.clicks > 0 && (
                              <p className="text-xs text-gray-500">
                                {link.clicks} clicks
                              </p>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400 animate-bounce-gentle" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Empty State with floating animation */}
              {displayLinks.length === 0 && (
                <div className="text-center py-6 lg:py-8 text-gray-400 animate-slide-in" style={{ animationDelay: '0.6s' }}>
                  <div className="w-8 h-8 lg:w-12 lg:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2 lg:mb-3">
                    <Globe className="w-4 h-4 lg:w-6 lg:h-6 text-gray-400" />
                  </div>
                  <p className="text-xs lg:text-sm">No links yet</p>
                  <p className="text-xs">Add your first link to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Preview Controls with animations */}
        <div className="mt-4 lg:mt-6 space-y-3 lg:space-y-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          {/* Live Status with glow effect */}
          <Card className="border-0 shadow-sm bg-blue-50 animate-pulse-glow">
            <CardContent className="p-3 lg:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 lg:gap-0">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce-gentle"></div>
                  <span className="text-xs lg:text-sm font-medium text-blue-900">Your Droplink is live</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs hover:scale-105 transition-transform"
                  onClick={copyProfileUrl}
                >
                  <Copy className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                  Copy URL
                </Button>
              </div>
              <p className="text-xs text-blue-700 mt-2 lg:mt-1">
                {getProfileUrl(username)}
              </p>
            </CardContent>
          </Card>

          {/* Analytics Summary */}
          {totalClicks > 0 && (
            <Card className="border-0 shadow-sm bg-green-50">
              <CardContent className="p-3 lg:p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="text-xs lg:text-sm font-medium text-green-900">Analytics</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {totalClicks.toLocaleString()} clicks
                  </Badge>
                </div>
                <p className="text-xs text-green-700 mt-1">
                  {displayLinks.length} active {displayLinks.length === 1 ? 'link' : 'links'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Hide Logo Option with subtle animation */}
          <div className="flex items-center justify-between text-xs lg:text-sm animate-slide-in" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 lg:w-4 lg:h-4 text-gray-400" />
              <span className="text-gray-600">Hide Droplink logo</span>
            </div>
            <Badge variant="secondary" className="text-xs animate-pulse-glow">Pro</Badge>
          </div>

          {/* Enhanced Preview Actions with hover effects */}
          <div className="flex space-x-2 animate-slide-in" style={{ animationDelay: '1s' }}>
            {[
              { icon: Heart, label: 'Like' },
              { icon: MessageCircle, label: 'Comment' },
              { icon: Share2, label: 'Share' }
            ].map(({ icon: Icon, label }, index) => (
              <Button 
                key={label}
                variant="outline" 
                size="sm" 
                className="flex-1 text-xs hover:scale-105 transition-transform"
                style={{ animationDelay: `${1.1 + index * 0.1}s` }}
              >
                <Icon className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePreview;
