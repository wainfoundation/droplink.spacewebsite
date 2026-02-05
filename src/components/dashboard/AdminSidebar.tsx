import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Link as LinkIcon, 
  BarChart3, 
  Settings, 
  Palette, 
  Users, 
  ShoppingBag,
  Crown,
  Bell,
  HelpCircle,
  LogOut,
  Zap,
  Star,
  Shield,
  Globe,
  QrCode,
  Mail,
  Calendar,
  Target,
  Share2,
  Gift,
  Eye,
  Code,
  Key,
  Download,
  Instagram,
  MessageCircle,
  TrendingUp,
  PieChart,
  FileText,
  Award,
  Rocket,
  Lock,
  ChevronRight
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useUserPlan } from "@/hooks/use-user-plan";
import { useFeatureGate } from "@/hooks/useFeatureGate";

interface AdminSidebarProps {
  isCollapsed?: boolean;
}

const AdminSidebar = ({ isCollapsed = false }: AdminSidebarProps) => {
  const location = useLocation();
  const { user } = useUser();
  const { plan, limits } = useUserPlan();
  const { hasFeatureAccess } = useFeatureGate();

  const getCurrentSection = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('section') || 'overview';
  };

  const currentSection = getCurrentSection();

  // Organized navigation items by category
  const navigationSections = [
    {
      title: "Main",
      items: [
        {
          name: "Overview",
          href: "/dashboard",
          icon: Home,
          current: currentSection === "overview" || currentSection === "my-droplink",
          available: true
        },
        {
          name: "My Droplink",
          href: "/dashboard?section=my-droplink",
          icon: LinkIcon,
          current: currentSection === "my-droplink",
          available: true
        },
        {
          name: "Links",
          href: "/dashboard?section=links",
          icon: LinkIcon,
          current: currentSection === "links",
          available: true
        }
      ]
    },
    {
      title: "Analytics & Growth",
      items: [
        {
          name: "Analytics",
          href: "/dashboard?section=analytics",
          icon: BarChart3,
          current: currentSection === "analytics",
          available: hasFeatureAccess('analytics'),
          requiredPlan: "Starter"
        },
        {
          name: "Audience",
          href: "/dashboard?section=audience",
          icon: Users,
          current: currentSection === "audience",
          available: hasFeatureAccess('analytics'),
          requiredPlan: "Starter"
        },
        {
          name: "Pi Tips",
          href: "/dashboard?section=earn-pi-tips",
          icon: Gift,
          current: currentSection === "earn-pi-tips",
          available: hasFeatureAccess('pi_tips'),
          requiredPlan: "Starter"
        }
      ]
    },
    {
      title: "Customization",
      items: [
        {
          name: "Appearance",
          href: "/dashboard?section=appearance",
          icon: Palette,
          current: currentSection === "appearance",
          available: plan !== 'free',
          requiredPlan: "Starter"
        },
        {
          name: "Domain Settings",
          href: "/dashboard?section=domain-settings",
          icon: Globe,
          current: currentSection === "domain-settings",
          available: hasFeatureAccess('pi_domain'),
          requiredPlan: "Starter"
        }
      ]
    },
    {
      title: "Business Tools",
      items: [
        {
          name: "Store",
          href: "/dashboard?section=store",
          icon: ShoppingBag,
          current: currentSection === "store",
          available: hasFeatureAccess('product_sales'),
          requiredPlan: "Pro"
        },
        {
          name: "Tools",
          href: "/dashboard?section=tools",
          icon: Target,
          current: currentSection === "tools",
          available: hasFeatureAccess('seo_tools'),
          requiredPlan: "Pro"
        },
        {
          name: "Link Shortener",
          href: "/dashboard?section=link-shortener",
          icon: Share2,
          current: currentSection === "link-shortener",
          available: hasFeatureAccess('link_shortener'),
          requiredPlan: "Pro"
        }
      ]
    },
    {
      title: "Advanced Features",
      items: [
        {
          name: "Team Access",
          href: "/dashboard?section=team-access",
          icon: Users,
          current: currentSection === "team-access",
          available: hasFeatureAccess('team_access'),
          requiredPlan: "Premium"
        },
        {
          name: "Social Planner",
          href: "/dashboard?section=social-planner",
          icon: Calendar,
          current: currentSection === "social-planner",
          available: hasFeatureAccess('social_planner'),
          requiredPlan: "Premium"
        },
        {
          name: "Instagram Auto-Reply",
          href: "/dashboard?section=instagram-reply",
          icon: Instagram,
          current: currentSection === "instagram-reply",
          available: hasFeatureAccess('instagram_reply'),
          requiredPlan: "Premium"
        }
      ]
    },
    {
      title: "Resources",
      items: [
        {
          name: "Features",
          href: "/dashboard?section=features",
          icon: Rocket,
          current: currentSection === "features",
          available: true
        },
        {
          name: "Settings",
          href: "/dashboard?section=settings",
          icon: Settings,
          current: currentSection === "settings",
          available: true
        },
        {
          name: "Help",
          href: "/help",
          icon: HelpCircle,
          current: location.pathname.includes("help"),
          available: true
        }
      ]
    }
  ];

  const renderNavigationItem = (item: any) => {
    const Icon = item.icon;
    const isLocked = !item.available;
    
    return (
      <div key={item.name} className="relative">
        <Link to={isLocked ? "#" : item.href}>
          <Button
            variant={item.current ? "default" : "ghost"}
            className={`w-full justify-start ${
              item.current 
                ? "bg-black text-white hover:bg-gray-800" 
                : isLocked 
                  ? "text-gray-400 cursor-not-allowed" 
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
            disabled={isLocked}
          >
            <Icon className="h-5 w-5 mr-3" />
            {!isCollapsed && (
              <div className="flex items-center justify-between w-full">
                <span>{item.name}</span>
                {isLocked && (
                  <Badge variant="outline" className="text-xs ml-2">
                    {item.requiredPlan}
                  </Badge>
                )}
              </div>
            )}
          </Button>
        </Link>
        {isLocked && !isCollapsed && (
          <div className="absolute -top-1 -right-1">
            <Lock className="h-3 w-3 text-gray-400" />
          </div>
        )}
      </div>
    );
  };

  const getPlanIcon = () => {
    switch (plan) {
      case 'free':
        return <Star className="h-4 w-4 text-gray-500" />;
      case 'starter':
        return <Zap className="h-4 w-4 text-blue-500" />;
      case 'pro':
        return <Crown className="h-4 w-4 text-purple-500" />;
      case 'premium':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <Star className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPlanColor = () => {
    switch (plan) {
      case 'free':
        return 'text-gray-500';
      case 'starter':
        return 'text-blue-500';
      case 'pro':
        return 'text-purple-500';
      case 'premium':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 flex-shrink-0">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-[#0ea5e9]">Droplink</span>
            </div>
          )}
        </div>
      </div>

      {/* Plan Status */}
      {!isCollapsed && (
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            {getPlanIcon()}
            <span className={`text-sm font-medium capitalize ${getPlanColor()}`}>
              {plan} Plan
            </span>
          </div>
          {plan === 'free' && (
            <p className="text-xs text-gray-500 mt-1">
              Upgrade to unlock premium features
            </p>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {navigationSections.map((section, sectionIndex) => (
          <div key={section.title} className="space-y-2">
            {!isCollapsed && (
              <div className="flex items-center space-x-2 mb-3">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {section.items.map(renderNavigationItem)}
            </div>
          </div>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.display_name || user?.username || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          )}
          <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
