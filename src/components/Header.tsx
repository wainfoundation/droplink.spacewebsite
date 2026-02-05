
import { Link } from "react-router-dom";
import { ArrowUp, User, LogOut, Settings, Sparkles, Snowflake, Menu, X } from "lucide-react";
import { getDashboardUrl } from "@/utils/dashboard-url";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { usePiAuthManager } from "@/hooks/usePiAuthManager";

interface HeaderProps {
  showGoToTop?: boolean;
}

const Header = ({ showGoToTop = false }: HeaderProps) => {
  const { isLoggedIn, user, profile, signOut } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const { 
    isAuthenticated: isPiAuthenticated, 
    user: piUser, 
    getUsername: getPiUsername, 
    getDisplayName: getPiDisplayName,
    authenticate: piAuthenticate,
    signOut: piSignOut,
    isRunningInPiBrowser 
  } = usePiAuthManager();
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await signOut();
  };

  // Get username from Pi Network auth or profile
  const getUsername = () => {
    // Debug logging
    console.log('Header - Pi User data:', piUser);
    console.log('Header - Pi Authenticated:', isPiAuthenticated);
    console.log('Header - User data:', user);
    console.log('Header - Profile data:', profile);
    
    // Check Pi Network authentication first (highest priority)
    if (isPiAuthenticated && piUser?.username) {
      console.log('Header - Using Pi Network username:', piUser.username);
      return piUser.username;
    }
    
    // Check Pi Network auth result from localStorage
    try {
      const piAuthData = localStorage.getItem('pi_auth_result');
      if (piAuthData) {
        const parsed = JSON.parse(piAuthData);
        if (parsed?.user?.username) {
          console.log('Header - Using localStorage pi_auth_result.username:', parsed.user.username);
          return parsed.user.username;
        }
      }
    } catch (error) {
      console.warn('Error parsing Pi auth data:', error);
    }
    
    // Check user metadata
    if (user?.user_metadata?.username) {
            {/* Logo removed */}
      return user.user_metadata.username;
    }
    if (user?.user_metadata?.pi_username) {
      console.log('Header - Using user_metadata.pi_username:', user.user_metadata.pi_username);
      return user.user_metadata.pi_username;
    }
    
    // Check profile data
    if (profile?.username) {
      console.log('Header - Using profile.username:', profile.username);
      return profile.username;
    }
    
    // Check email as fallback
    if (user?.email) {
      console.log('Header - Using email fallback:', user.email.split('@')[0]);
              {/* Christmas Theme Toggle Switch - Always Visible */}
    }
    
    console.log('Header - Using default "User"');
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

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Store", href: "/store" },
    { name: "Groups", href: "/groups" },
    { name: "Templates", href: "/templates" },
    { name: "Help", href: "/help" },
  ];

  return (
    <header
      className={`border-b border-gray-100 sticky top-0 z-50 shadow-sm transition-colors duration-300 ${scrolled ? 'bg-sky-400' : 'bg-white'}`}
      style={scrolled ? { backgroundColor: '#87ceeb' } : {}}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* App name only, no logo or logo box */}
          <span className="text-xl font-bold text-[#00BFFF] select-none">Droplink</span>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-600 hover:text-[#00BFFF] transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Beta badge removed */}
            {/* Christmas Theme Toggle Switch - Disabled */}

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-[#00BFFF]"
              title="Open menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {!isLoggedIn && !isPiAuthenticated ? (
              <>
                <Button variant="ghost" asChild className="text-gray-600 hover:text-[#00BFFF]">
                  <Link to="/auth">Sign In</Link>
                </Button>
                {isRunningInPiBrowser() ? (
                  <Button 
                    onClick={() => {
                      window.location.href = 'https://droplink.space/auth';
                    }}
                    className="bg-[#00BFFF] hover:bg-[#0099CC] text-white px-6"
                  >
                    Connect with Pi
                  </Button>
                ) : (
                  <Button asChild className="bg-[#00BFFF] hover:bg-[#0099CC] text-white px-6">
                    <Link to="/auth">Get Started</Link>
                  </Button>
                )}
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 px-4 rounded-full border border-gray-200 hover:border-[#00BFFF]">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={getAvatarUrl()}
                          alt={getDisplayName()}
                        />
                        <AvatarFallback className="bg-[#00BFFF] text-white text-xs">
                          {getDisplayName().charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start">
                        <span className="text-sm font-medium text-gray-900">{getDisplayName()}</span>
                        <span className="text-xs text-gray-500">@{getUsername()}</span>
                      </div>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={getAvatarUrl()}
                        alt={getDisplayName()}
                      />
                      <AvatarFallback className="bg-[#00BFFF] text-white">
                        {getDisplayName().charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{getDisplayName()}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        @{getUsername()}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href={getDashboardUrl()} className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to={`/@${getUsername()}`} className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/stickers" className="flex items-center">
                      <Sparkles className="mr-2 h-4 w-4" />
                      <span>Stickers</span>
                    </Link>
                  </DropdownMenuItem>
                  {/* Christmas Theme Toggle Switch - Disabled */}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Go to Top Button */}
            {showGoToTop && (
              <Button
                onClick={scrollToTop}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-[#00BFFF] text-[#00BFFF] hover:bg-[#00BFFF] hover:text-white transition-all duration-300 hover:shadow-md hover:scale-105"
                title="Scroll to top"
              >
                <ArrowUp className="h-4 w-4" />
                <span className="hidden sm:inline">Top</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 bg-white animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-1 px-2">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="px-4 py-3 text-gray-700 hover:text-[#00BFFF] hover:bg-blue-50 rounded-md transition-all font-medium text-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Theme Toggle - Disabled */}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
