import React from "react";
import { 
  Link as LinkIcon, 
  BarChart3, 
  Users, 
  Settings, 
  ShoppingBag, 
  Palette,
  Crown,
  Sparkles,
  Calendar,
  Headphones,
  Code,
  Database,
  TrendingUp,
  Zap,
  Plus,
  ChevronDown,
  ChevronRight,
  QrCode,
  Heart,
  Clock,
  FileText,
  Image,
  MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/context/UserContext";
import { useUserPlan } from "@/hooks/use-user-plan";
import Logo from "@/components/ui/Logo";

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardSidebar = ({ activeTab, onTabChange }: DashboardSidebarProps) => {
  const { user, profile } = useUser();
  const { plan } = useUserPlan();

  const getUsername = () => {
    if (user?.user_metadata?.username) return user.user_metadata.username;
    if (user?.user_metadata?.pi_username) return user.user_metadata.pi_username;
    if (profile?.username) return profile.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getDisplayName = () => {
    if (user?.user_metadata?.display_name) return user.user_metadata.display_name;
    if (user?.user_metadata?.pi_display_name) return user.user_metadata.pi_display_name;
    if (profile?.display_name) return profile.display_name;
    return getUsername();
  };

  const getAvatarUrl = () => {
    if (user?.user_metadata?.avatar_url) return user.user_metadata.avatar_url;
    if (user?.user_metadata?.pi_avatar_url) return user.user_metadata.pi_avatar_url;
    if (profile?.avatar_url) return profile.avatar_url;
    return null;
  };

  const username = getDisplayName();
  const avatarUrl = getAvatarUrl();

  const navigationItems = [
    {
      id: "overview",
      label: "Overview",
      icon: BarChart3,
      active: activeTab === "overview"
    },
    {
      id: "links",
      label: "Links",
      icon: LinkIcon,
      active: activeTab === "links"
    },
    {
      id: "templates",
      label: "Templates",
      icon: Palette,
      active: activeTab === "templates"
    },
    {
      id: "pi-tips",
      label: "Pi Tips",
      icon: Heart,
      active: activeTab === "pi-tips"
    },
    {
      id: "qr-codes",
      label: "QR Codes",
      icon: QrCode,
      active: activeTab === "qr-codes"
    },
    {
      id: "scheduling",
      label: "Scheduling",
      icon: Clock,
      active: activeTab === "scheduling"
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: Image,
      active: activeTab === "portfolio"
    },
    {
      id: "storefront",
      label: "Storefront",
      icon: ShoppingBag,
      active: activeTab === "storefront"
    },
    {
      id: "contact-forms",
      label: "Contact Forms",
      icon: MessageCircle,
      active: activeTab === "contact-forms"
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      active: activeTab === "analytics"
    },
    {
      id: "profile",
      label: "Profile Settings",
      icon: Settings,
      active: activeTab === "profile"
    }
  ];

  const toolsItems = [
    { id: "social-planner", label: "Social planner", icon: Calendar },
    { id: "instagram-reply", label: "Instagram auto-reply", icon: Headphones },
    { id: "link-shortener", label: "Link shortener", icon: Code },
    { id: "post-ideas", label: "Post ideas", icon: Sparkles }
  ];

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto">
      {/* Droplink Logo Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <Logo size="md" showText={true} />
      </div>

      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm">
              {username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {getUsername()}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {navigationItems.map((item) => (
          <div key={item.id}>
            <Button
              variant={item.active ? "secondary" : "ghost"}
              className={`w-full justify-start h-10 ${
                item.active ? "bg-white shadow-sm" : "hover:bg-gray-100"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
            </Button>
            
          </div>
        ))}
      </div>

      {/* Tools Section */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Tools
        </h3>
        <div className="space-y-1">
          {toolsItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className="w-full justify-start h-8 text-sm hover:bg-gray-100"
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Growth Tools */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🌱</span>
            </div>
            <span className="text-sm font-medium text-gray-900">New growth tools</span>
          </div>
          <Button variant="ghost" size="sm" className="w-full h-8 text-sm">
            Get started →
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 mt-auto">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="text-gray-400">?</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <span className="text-red-400">🚩</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSidebar;
