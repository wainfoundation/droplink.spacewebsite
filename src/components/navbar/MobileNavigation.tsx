
import React from "react";
import { Link } from "react-router-dom";
import { getDashboardUrl } from "@/utils/dashboard-url";
import { Menu, Home, File, DollarSign, HelpCircle, Users, MessageSquare, BarChart3, Globe, LogOut, CreditCard } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/context/UserContext";
import LanguageSelector from "@/components/LanguageSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MobileNavigation = () => {
  const [open, setOpen] = React.useState(false);
  const { user, profile, subscription, signOut } = useUser();

  const handleLogout = async () => {
    await signOut();
    setOpen(false);
  };

  // Get username from Pi Network auth or profile
  const getUsername = () => {
    // Check Pi Network auth data first
    if (user?.user_metadata?.username) return user.user_metadata.username;
    if (user?.user_metadata?.pi_username) return user.user_metadata.pi_username;
    
    // Check profile data
    if (profile?.username) return profile.username;
    
    // Check email as fallback
    if (user?.email) return user.email.split('@')[0];
    
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
    
    return 'User';
  };

  // Get display name
  const getDisplayName = () => {
    // Check Pi Network auth data first
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

  // Get plan name
  const getPlanName = () => {
    if (subscription?.plan) return subscription.plan;
    if (profile?.plan) return profile.plan;
    return 'Free';
  };

  const navigationItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Templates", path: "/templates", icon: File },
    { name: "Dropstore", path: "/dropstore", icon: File },
    { name: "DropPay", path: "/droppay", icon: CreditCard },
    // Removed Learn Dropstore, now all info is on /dropstore
    { name: "Pricing", path: "/pricing", icon: DollarSign },
    { name: "Help", path: "/help", icon: HelpCircle },
    { name: "Community", path: "/community", icon: Users },
    { name: "Forums", path: "/forums", icon: MessageSquare },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden ml-auto">
        <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Navigation Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col h-full">
          {/* Navigation Items */}
          <div className="flex-1 py-4">
            <nav className="space-y-1 px-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>

            <Separator className="my-4 mx-4" />

            {/* Language Selector */}
            <div className="px-4 py-2">
              <div className="flex items-center gap-3 px-3 py-2">
                <Globe className="h-5 w-5" />
                <span className="text-sm font-medium">Language</span>
              </div>
              <div className="px-3">
                <LanguageSelector variant="default" />
              </div>
            </div>

            <Separator className="my-4 mx-4" />

            {/* Dashboard Link */}
            <nav className="space-y-1 px-4">
              <a
                href={getDashboardUrl()}
                className="flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground"
                onClick={() => setOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </a>
            </nav>
          </div>

          {/* User Section */}
          <div className="border-t p-4">
            <div className="space-y-4">
              {user ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={getAvatarUrl()}
                        alt={getDisplayName()}
                      />
                      <AvatarFallback className="bg-[#00BFFF] text-white">
                        {getDisplayName().charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{getDisplayName()}</p>
                      <p className="text-xs text-muted-foreground">@{getUsername()}</p>
                      <p className="text-xs text-muted-foreground capitalize">{getPlanName()} Plan</p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  {/* Sign In and Sign Up Buttons for Non-Authenticated Users */}
                  <Button 
                    asChild 
                    variant="outline"
                    className="w-full"
                  >
                    <Link to="/login" onClick={() => setOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button 
                    asChild 
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    <Link to="/signup" onClick={() => setOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavigation;
