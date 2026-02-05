
import { Link } from "react-router-dom";
import { User, LogOut, Settings, Sparkles } from "lucide-react";
import { getDashboardUrl } from "@/utils/dashboard-url";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePiAuthManager } from "@/hooks/usePiAuthManager";

const UserMenu = () => {
  const { user, profile, signOut } = useUser();
  const { 
    isAuthenticated: isPiAuthenticated, 
    user: piUser, 
    getUsername: getPiUsername, 
    getDisplayName: getPiDisplayName,
    signOut: piSignOut 
  } = usePiAuthManager();

  const handleLogout = async () => {
    // Sign out from both regular auth and Pi auth
    if (isPiAuthenticated) {
      await piSignOut();
    }
    await signOut();
  };

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

  if (!user) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="ghost" asChild>
          <Link to="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link to="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200 hover:border-gray-300"
        >
          {/* Pi Network User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {getDisplayName().charAt(0).toUpperCase()}
            </span>
          </div>
          
          {/* Username Display - Like TruthWeb format */}
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-start">
              <span className="font-semibold text-gray-900 text-sm">
                {getUsername()}
              </span>
              <span className="text-xs text-gray-500">Pi Network</span>
            </div>
            <svg 
              className="w-4 h-4 text-gray-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64" align="end" forceMount>
        {/* User Info Header */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-t-lg">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {getDisplayName().charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex flex-col">
            <p className="font-semibold text-gray-900">{getUsername()}</p>
            <p className="text-sm text-gray-500">Pi Network User</p>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Menu Items */}
        <DropdownMenuItem asChild>
          <a href={getDashboardUrl()} className="flex items-center px-4 py-3">
            <Settings className="mr-3 h-4 w-4" />
            <span>Dashboard</span>
          </a>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/pricing" className="flex items-center px-4 py-3">
            <Sparkles className="mr-3 h-4 w-4" />
            <span>Upgrade Plan</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link to="/settings" className="flex items-center px-4 py-3">
            <User className="mr-3 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Sign Out - Red styling like TruthWeb */}
        <DropdownMenuItem
          className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-3"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
