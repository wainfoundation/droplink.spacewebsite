import React, { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Settings, 
  LogOut, 
  Link as LinkIcon,
  BarChart3,
  Eye,
  Share2,
  Menu,
  X,
  Home,
  Plus,
  Globe,
  Heart,
  DollarSign
} from "lucide-react";
import ProfileSharing from "@/components/profile/ProfileSharing";
import DroplinkDashboard from "@/components/dashboard/LinktreeDashboard";
import FullDashboard from "@/components/dashboard/FullDashboard";
import TemplateSelector from "@/components/dashboard/TemplateSelector";
import TemplateCustomizer from "@/components/dashboard/TemplateCustomizer";
import ProfilePreviewSystem from "@/components/dashboard/ProfilePreviewSystem";
import EnhancedAnalytics from "@/components/dashboard/EnhancedAnalytics";
import RealTimeTracking from "@/components/dashboard/RealTimeTracking";
import ProfileSharingModal from "@/components/dashboard/ProfileSharing";
import LinksSection from "@/components/dashboard/LinksSection";
import SocialMediaIntegration from "@/components/dashboard/SocialMediaIntegration";
import SEOTools from "@/components/dashboard/SEOTools";
import PaymentIntegration from "@/components/dashboard/PaymentIntegration";
import LinkrMeStyleDashboard from "@/components/dashboard/LinkrMeStyleDashboard";
import PiTipsWallet from "@/components/dashboard/PiTipsWallet";
import SetupWizard from "@/components/dashboard/SetupWizard";
import PiNetworkTest from "@/components/dashboard/PiNetworkTest";
import TestnetPaymentTest from "@/components/dashboard/TestnetPaymentTest";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/ui/Logo";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import DashboardSetupCheck from "@/components/dashboard/DashboardSetupCheck";
import SettingsSection from "@/components/dashboard/SettingsSection";
import { getPiUsername, getDisplayName, getUsername, getAvatarInitial, getAvatarUrl } from "@/utils/pi-username-helper";

const DashboardNew = () => {
  const { user, profile, signOut, updateProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to correct domain if not on it
  useEffect(() => {
    const targetDomain = 'droplink-space.lovable.app';
    const currentDomain = window.location.hostname;
    
    // Check if we're not on the correct domain
    if (currentDomain !== targetDomain && !currentDomain.includes('localhost')) {
      const targetUrl = `https://${targetDomain}/dashboard`;
      window.location.href = targetUrl;
      return;
    }
  }, []);
  
  const [activeTab, setActiveTab] = useState("links");
  const [userPlan, setUserPlan] = useState('free'); // Default to free plan
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dashboardStyle, setDashboardStyle] = useState('droplink'); // Only Droplink style
  const [selectedTemplate, setSelectedTemplate] = useState('modern-dark');
  const [customTemplate, setCustomTemplate] = useState<any>(null);
  const [showTemplateCustomizer, setShowTemplateCustomizer] = useState(false);
  const [showProfileSharing, setShowProfileSharing] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showRealTimeTracking, setShowRealTimeTracking] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showPiTips, setShowPiTips] = useState(false);
  const [showPiTest, setShowPiTest] = useState(false);
  const [showPaymentTest, setShowPaymentTest] = useState(false);

  // Template data
  const templates = {
    'modern-dark': {
      name: 'Modern Dark',
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        background: '#1F2937',
        text: '#FFFFFF',
        accent: '#374151'
      }
    },
    'minimal-light': {
      name: 'Minimal Light',
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
        background: '#FFFFFF',
        text: '#1F2937',
        accent: '#F3F4F6'
      }
    },
    'vibrant-gradient': {
      name: 'Vibrant Gradient',
      colors: {
        primary: '#FF6B6B',
        secondary: '#4ECDC4',
        background: '#F8F9FA',
        text: '#2D3748',
        accent: '#E5E7EB'
      }
    },
    'professional-blue': {
      name: 'Professional Blue',
      colors: {
        primary: '#2563EB',
        secondary: '#1E40AF',
        background: '#F1F5F9',
        text: '#1E293B',
        accent: '#E2E8F0'
      }
    },
    'sunset-warm': {
      name: 'Sunset Warm',
      colors: {
        primary: '#F97316',
        secondary: '#EC4899',
        background: '#FEF3C7',
        text: '#92400E',
        accent: '#FDE68A'
      }
    },
    'ocean-cool': {
      name: 'Ocean Cool',
      colors: {
        primary: '#0EA5E9',
        secondary: '#06B6D4',
        background: '#F0F9FF',
        text: '#0C4A6E',
        accent: '#BAE6FD'
      }
    }
  };

  // Get current template colors
  const getCurrentTemplate = () => {
    if (selectedTemplate === 'custom' && customTemplate) {
      return customTemplate;
    }
    return templates[selectedTemplate as keyof typeof templates] || templates['modern-dark'];
  };

  const currentTemplate = getCurrentTemplate();

  // Template handlers
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Selected!",
      description: `Applied ${templates[templateId as keyof typeof templates]?.name || 'Custom'} template`,
    });
  };

  const handleCustomizeTemplate = () => {
    setShowTemplateCustomizer(true);
  };

  const handleSaveCustomTemplate = (template: any) => {
    setCustomTemplate(template);
    setSelectedTemplate('custom');
    setShowTemplateCustomizer(false);
    toast({
      title: "Custom Template Saved!",
      description: "Your custom template has been applied",
    });
  };

  const handleBackToTemplates = () => {
    setShowTemplateCustomizer(false);
  };

  const handleTemplatePreview = (templateId: string) => {
    // Temporarily apply template for preview
    const originalTemplate = selectedTemplate;
    setSelectedTemplate(templateId);
    
    // Show preview for 3 seconds then revert
    setTimeout(() => {
      setSelectedTemplate(originalTemplate);
    }, 3000);
    
    toast({
      title: "Template Preview",
      description: `Previewing ${templates[templateId as keyof typeof templates]?.name || 'Custom'} template for 3 seconds`,
    });
  };

  useEffect(() => {
    console.log('DashboardNew: useEffect triggered');
    console.log('DashboardNew: user state:', user);
    console.log('DashboardNew: profile state:', profile);
    console.log('DashboardNew: localStorage user_plan:', localStorage.getItem('user_plan'));
    console.log('DashboardNew: localStorage pi_auth_result:', localStorage.getItem('pi_auth_result'));
    
    // Check for Pi auth data in localStorage if no user
    if (!user) {
      const piAuthData = localStorage.getItem('pi_auth_result');
      if (piAuthData) {
        console.log('DashboardNew: Found Pi auth data, waiting for user context to update');
        // Don't redirect immediately, let UserContext handle the authentication
        return;
      }
      
      console.log('DashboardNew: No user found, redirecting to login');
      toast({
        title: "Authentication Required",
        description: "Please sign in to access your dashboard",
        variant: "destructive",
      });
      navigate('/login');
    } else {
      console.log('DashboardNew: User found, staying on dashboard');
      
      // Check for stored plan and update userPlan state
      const storedPlan = localStorage.getItem('user_plan');
      if (storedPlan) {
        try {
          const planData = JSON.parse(storedPlan);
          const isExpired = new Date(planData.expiresAt) < new Date();
          
          if (!isExpired && planData.userId === user.id) {
            console.log('DashboardNew: Setting userPlan from stored plan:', planData.planId);
            setUserPlan(planData.planId);
            toast({
              title: "Welcome Back!",
              description: `You're using the ${planData.planId} plan`,
            });
          } else {
            console.log('DashboardNew: Stored plan expired or invalid, setting to free');
            setUserPlan('free');
            toast({
              title: "Plan Expired",
              description: "Your plan has expired. You're now on the free plan.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error('Error parsing stored plan:', error);
          setUserPlan('free');
        }
      } else {
        console.log('DashboardNew: No stored plan found, setting to free');
        setUserPlan('free');
      }
    }
  }, [user, navigate, toast]);

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };


  const handleTabChange = (tab: string) => {
    console.log('DashboardNew: Tab changing from', activeTab, 'to', tab);
    setActiveTab(tab);
    setIsMobileMenuOpen(false); // Close mobile menu when tab changes
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'starter': return 'bg-blue-100 text-blue-800';
      case 'pro': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free': return 'Free Plan';
      case 'starter': return 'Starter Plan';
      case 'pro': return 'Pro Plan';
      default: return 'Free Plan';
    }
  };

  // Navigation items
  const navItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "links", label: "Links", icon: LinkIcon },
    { id: "social", label: "Social Media", icon: Heart },
    { id: "seo", label: "SEO Tools", icon: BarChart3 },
    { id: "payments", label: "Payments", icon: DollarSign },
    { id: "pi-tips", label: "Pi Tips", icon: Heart },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "templates", label: "Templates", icon: Settings },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "share", label: "Share Profile", icon: Share2 },
  ];

  // Mobile Navigation Component
  const MobileNavigation = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetContent side="left" className="w-72 sm:w-80 p-0">
        <div className="h-full flex flex-col">
          {/* Header with Logo */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-blue-600">Droplink</span>
          </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                {getAvatarUrl(profile, user) ? (
                  <img 
                    src={getAvatarUrl(profile, user)!} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-base sm:text-lg">
                    {getAvatarInitial(profile, user)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate text-sm sm:text-base">
                  {getDisplayName(profile, user)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 truncate">
                  @{getUsername(profile, user)}
                </p>
              </div>
            </div>
            
            {/* Plan Badge */}
            <div className="flex items-center space-x-2">
              <Badge className="bg-gray-100 text-gray-800 text-xs">
                Free Plan
              </Badge>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === item.id 
                      ? "bg-blue-50 text-blue-700 border border-blue-200" 
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Sign Out */}
          <div className="p-3 sm:p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 sm:px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">Sign Out</span>
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <div className="hidden lg:block w-64 bg-white shadow-lg min-h-screen">
      <div className="h-full flex flex-col">
        {/* Header with Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold text-blue-600">Droplink</span>
          </div>
        </div>
        
        {/* User Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
              {getAvatarUrl(profile, user) ? (
                <img 
                  src={getAvatarUrl(profile, user)!} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-bold text-lg">
                  {getAvatarInitial(profile, user)}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">
                {getDisplayName(profile, user)}
              </p>
              <p className="text-sm text-gray-500 truncate">
                @{getUsername(profile, user)}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-gray-100 text-gray-800 text-xs">
              Free Plan
            </Badge>
            {getPiUsername() && (
              <Badge className="bg-blue-100 text-blue-800 text-xs">
                Pi Network
              </Badge>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id 
                    ? "bg-blue-50 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  // Mobile Header Component
  const MobileHeader = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-blue-600">Droplink</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-gray-100 text-gray-800 text-xs">
            Free Plan
          </Badge>
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {(profile?.display_name || user?.user_metadata?.username || 'B').charAt(0).toUpperCase()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Tab Navigation
  const MobileTabNav = () => (
    <div className="lg:hidden bg-white border-b border-gray-200 sticky top-16 z-30">
      <div className="flex overflow-x-auto scrollbar-hide px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors min-w-fit ${
                activeTab === item.id 
                  ? "border-blue-500 text-blue-600" 
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <DashboardSetupCheck>
      <Helmet>
        <title>Dashboard - Droplink</title>
        <meta name="description" content="Manage your Droplink profile and links" />
      </Helmet>
      <LinkrMeStyleDashboard user={user} profile={profile} />
    </DashboardSetupCheck>
  );
};

export default DashboardNew;
