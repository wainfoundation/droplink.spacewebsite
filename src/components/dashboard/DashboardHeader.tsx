
import { User, Crown, Shield, Settings, Bell, Design, Share2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useUserPlan } from "@/hooks/use-user-plan";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { usePiAuthManager } from "@/hooks/usePiAuthManager";

const DashboardHeader = () => {
  const { user, profile, isAdmin } = useUser();
  const { plan } = useUserPlan();
  const { 
    isAuthenticated: isPiAuthenticated, 
    user: piUser, 
    getUsername: getPiUsername, 
    getDisplayName: getPiDisplayName 
  } = usePiAuthManager();
  
  // Get username from Pi Network auth or profile
  const getUsername = () => {
    // Check Pi Network authentication first (highest priority)
    if (isPiAuthenticated && piUser?.username) {
      return piUser.username;
    }
    
    // Check Pi Network auth result from localStorage
    try {
      const piAuthData = localStorage.getItem('pi_auth_result');
      if (piAuthData) {
        const parsed = JSON.parse(piAuthData);
        if (parsed?.user?.username) return parsed.user.username;
      }
    } catch (error) {
      console.warn('Error parsing Pi auth data:', error);
    }
    
    // Check user metadata
    if (user?.user_metadata?.username) return user.user_metadata.username;
    if (user?.user_metadata?.pi_username) return user.user_metadata.pi_username;
    
    // Check profile data
    if (profile?.username) return profile.username;
    
    // Check email as fallback
    if (user?.email) return user.email.split('@')[0];
    
    return 'User';
  };

  // Get display name
  const getDisplayName = () => {
    // Check Pi Network authentication first (highest priority)
    if (isPiAuthenticated && piUser?.displayName) {
      return piUser.displayName;
    }
    if (isPiAuthenticated && piUser?.username) {
      return piUser.username;
    }
    
    // Check user metadata
    if (user?.user_metadata?.display_name) return user.user_metadata.display_name;
    if (user?.user_metadata?.pi_display_name) return user.user_metadata.pi_display_name;
    
    // Check profile data
    if (profile?.display_name) return profile.display_name;
    
    // Use username as display name
    return getUsername();
  };

  // Get avatar URL
  const getAvatarUrl = () => {
    // Check Pi Network auth data first
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.pi_avatar_url) return user.user_metadata.pi_avatar_url;
    
    // Check profile data
    if (profile?.avatar_url) return profile.avatar_url;
    
    return null;
  };
  
  const username = getDisplayName();
  const avatarUrl = getAvatarUrl();
  
  const getPlanIcon = () => {
    if (isAdmin) return <Shield className="h-4 w-4 text-yellow-500" />;
    if (plan === 'premium') return <Crown className="h-4 w-4 text-purple-500" />;
    if (plan === 'pro') return <Crown className="h-4 w-4 text-blue-500" />;
    if (plan === 'basic') return <User className="h-4 w-4 text-green-500" />;
    return <User className="h-4 w-4 text-gray-500" />;
  };

  const getPlanLabel = () => {
    if (isAdmin) return "Admin";
    return plan ? plan.charAt(0).toUpperCase() + plan.slice(1) : "Free";
  };

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Clean Blue Droplet Icon */}
            <svg 
              className="w-6 h-6"
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>
              <path 
                d="M16 28C20 28 24 24 24 20C24 16 20 12 16 8C12 12 8 16 8 20C8 24 12 28 16 28Z" 
                fill="url(#dropletGradient)"
              />
              <path 
                d="M20 24C22 24 24 22 24 20C24 18 22 16 20 18C18 16 16 18 16 20C16 22 18 24 20 24Z" 
                fill="rgba(255,255,255,0.3)"
              />
            </svg>
            <span className="text-sm font-medium">Droplink</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">Try Pro for free — our most popular plan for content creators and businesses.</span>
            <Button size="sm" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
              <Crown className="h-4 w-4 mr-1" />
              Upgrade
            </Button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2">
              {/* New Droplink Logo */}
              <img 
                src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png" 
                alt="Droplink Logo" 
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // Fallback to SVG if image fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              {/* Fallback SVG Logo */}
              <svg 
                className="w-8 h-8 hidden"
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                </defs>
                <path 
                  d="M16 28C20 28 24 24 24 20C24 16 20 12 16 8C12 12 8 16 8 20C8 24 12 28 16 28Z" 
                  fill="url(#dropletGradient)"
                />
                <path 
                  d="M20 24C22 24 24 22 24 20C24 18 22 16 20 18C18 16 16 18 16 20C16 22 18 24 20 24Z" 
                  fill="rgba(255,255,255,0.3)"
                />
              </svg>
              <span className="text-xl font-bold text-gray-900">Droplink</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Design className="h-4 w-4" />
              Design
            </Button>
            
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
