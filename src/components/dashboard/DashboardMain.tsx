import React, { useState } from "react";
import MyDroplinkSection from "@/components/dashboard/MyDroplinkSection";
import ShopSection from "@/components/dashboard/ShopSection";
import PiTipsSection from "@/components/dashboard/PiTipsSection";
import AudienceSection from "@/components/dashboard/AudienceSection";
import ToolsSection from "@/components/dashboard/ToolsSection";
import LockedFeatureCard from "@/components/dashboard/LockedFeatureCard";
import TeamAccessSection from "@/components/dashboard/TeamAccessSection";
import SocialPlannerSection from "@/components/dashboard/SocialPlannerSection";
import InstagramReplySection from "@/components/dashboard/InstagramReplySection";
import LinkShortenerSection from "@/components/dashboard/LinkShortenerSection";
import DomainSettingsSection from "./DomainSettingsSection";
import AnalyticsSection from "@/components/dashboard/AnalyticsSection";
import SubscriptionManagement from "@/components/dashboard/SubscriptionManagement";
import PlanUpgradeModal from "@/components/dashboard/PlanUpgradeModal";
import { useUser } from "@/context/UserContext";
import { useUserPlan } from "@/hooks/use-user-plan";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Crown, 
  Zap, 
  Star, 
  Shield, 
  CheckCircle, 
  Lock, 
  TrendingUp, 
  Users, 
  Link as LinkIcon, 
  BarChart3, 
  Settings, 
  Palette,
  Globe,
  QrCode,
  Mail,
  Calendar,
  ShoppingCart,
  MessageCircle,
  Instagram,
  Share2,
  Users as TeamIcon,
  Zap as AutomationIcon,
  Eye,
  Target,
  PieChart,
  Download,
  Upload,
  Code,
  Key,
  Languages,
  FileText,
  Bell,
  Gift,
  Award,
  Rocket
} from "lucide-react";

interface DashboardMainProps {
  activeSection: string;
  hasFeatureAccess: (feature: string) => boolean;
  onFeatureClick: (feature: string) => void;
}

const DashboardMain = ({ 
  activeSection, 
  hasFeatureAccess, 
  onFeatureClick 
}: DashboardMainProps) => {
  const { profile } = useUser();
  const { plan, limits } = useUserPlan();
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const handleFeatureClick = (feature: string) => {
    if (!hasFeatureAccess(feature)) {
      setSelectedFeature(feature);
      setUpgradeModalOpen(true);
    } else {
      onFeatureClick(feature);
    }
  };

  const renderFeatureCard = (title: string, description: string, icon: any, feature: string, requiredPlan: string, isAvailable: boolean = false) => {
    const Icon = icon;
    const hasAccess = isAvailable || hasFeatureAccess(feature);
    
    return (
      <Card className={`transition-all duration-300 hover:shadow-lg ${hasAccess ? 'border-green-200 bg-green-50/30' : 'border-gray-200'}`}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${hasAccess ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasAccess ? (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Available
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  {requiredPlan}
                </Badge>
              )}
            </div>
          </div>
          {!hasAccess && (
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-3 w-full"
              onClick={() => handleFeatureClick(feature)}
            >
              <Lock className="w-3 h-3 mr-2" />
              Upgrade to {requiredPlan}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSection = () => {
    switch (activeSection) {
      case "my-droplink":
      case "overview":
        return <MyDroplinkSection />;
      
      case "analytics":
        return hasFeatureAccess('analytics') ? (
          <AnalyticsSection />
        ) : (
          <LockedFeatureCard 
            title="Analytics"
            description="Track clicks, views, and performance metrics"
            requiredPlan="Starter"
            onUpgrade={() => handleFeatureClick('analytics')}
          />
        );
      
      case "links":
        return <MyDroplinkSection />;
      
      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Appearance & Customization</h2>
              <p className="text-gray-600">Customize your profile's look and feel</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderFeatureCard(
                "Custom Themes",
                "Choose from 100+ beautiful themes",
                Palette,
                "custom_themes",
                "Starter",
                plan !== 'free'
              )}
              
              {renderFeatureCard(
                "Custom CSS",
                "Full CSS customization for complete control",
                Code,
                "custom_css",
                "Premium"
              )}
              
              {renderFeatureCard(
                "Branding Removal",
                "Remove Droplink branding from your profile",
                Shield,
                "branding_removal",
                "Pro"
              )}
              
              {renderFeatureCard(
                "Custom Colors",
                "Set your own color scheme",
                Palette,
                "custom_colors",
                "Starter",
                plan !== 'free'
              )}
              
              {renderFeatureCard(
                "Custom Fonts",
                "Choose from 50+ font options",
                FileText,
                "custom_fonts",
                "Starter",
                plan !== 'free'
              )}
              
              {renderFeatureCard(
                "Animation Effects",
                "Add smooth animations to your links",
                Zap,
                "link_animations",
                "Starter",
                plan !== 'free'
              )}
            </div>
          </div>
        );
      
      case "team":
        return hasFeatureAccess('team_access') ? (
          <TeamAccessSection />
        ) : (
          <LockedFeatureCard 
            title="Team Access"
            description="Collaborate with your team on your Droplink"
            requiredPlan="Premium"
            onUpgrade={() => handleFeatureClick('team_access')}
          />
        );
      
      case "store":
        return hasFeatureAccess('product_sales') ? (
          <ShopSection />
        ) : (
          <LockedFeatureCard 
            title="Store"
            description="Sell digital products and earn Pi"
            requiredPlan="Pro"
            onUpgrade={() => handleFeatureClick('product_sales')}
          />
        );
      
      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Display Name</label>
                        <input 
                          type="text" 
                          className="w-full mt-1 p-2 border rounded-md"
                          defaultValue={profile?.display_name || ''}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Username</label>
                        <input 
                          type="text" 
                          className="w-full mt-1 p-2 border rounded-md"
                          defaultValue={profile?.username || ''}
                        />
                      </div>
                    </div>
                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderFeatureCard(
                    "Two-Factor Authentication",
                    "Add an extra layer of security",
                    Key,
                    "multi_factor_auth",
                    "Pro"
                  )}
                  
                  {renderFeatureCard(
                    "Password Protection",
                    "Protect your profile with a password",
                    Lock,
                    "password_protection",
                    "Pro"
                  )}
                  
                  {renderFeatureCard(
                    "Session Management",
                    "Manage active sessions",
                    Users,
                    "session_management",
                    "Starter",
                    plan !== 'free'
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="notifications" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-gray-600">Receive updates via email</p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Pi Tips Notifications</h4>
                        <p className="text-sm text-gray-600">Get notified when you receive tips</p>
                      </div>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="billing" className="space-y-4">
                <SubscriptionManagement 
                  subscription={{ plan, is_active: true }}
                  handleSubscribe={() => {}}
                  processingPayment={false}
                  setConfirmCancelOpen={() => {}}
                />
              </TabsContent>
            </Tabs>
          </div>
        );
      
      case "my-shop":
        return hasFeatureAccess('product_sales') ? (
          <ShopSection />
        ) : (
          <LockedFeatureCard 
            title="My Shop"
            description="Sell digital products and earn Pi"
            requiredPlan="Pro"
            onUpgrade={() => handleFeatureClick('product_sales')}
          />
        );
      
      case "earn-pi-tips":
        return hasFeatureAccess('pi_tips') ? (
          <PiTipsSection />
        ) : (
          <LockedFeatureCard 
            title="Pi Tips"
            description="Earn Pi through tips from your audience"
            requiredPlan="Starter"
            onUpgrade={() => handleFeatureClick('pi_tips')}
          />
        );
      
      case "audience":
        return hasFeatureAccess('analytics') ? (
          <AudienceSection />
        ) : (
          <LockedFeatureCard 
            title="Audience"
            description="Understand your audience with detailed insights"
            requiredPlan="Starter"
            onUpgrade={() => handleFeatureClick('analytics')}
          />
        );
      
      case "tools":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Advanced Tools</h2>
              <p className="text-gray-600">Powerful tools to grow your audience</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderFeatureCard(
                "SEO Tools",
                "Optimize your profile for search engines",
                Target,
                "seo_tools",
                "Pro"
              )}
              
              {renderFeatureCard(
                "Link Scheduling",
                "Schedule your links to go live at specific times",
                Calendar,
                "scheduling",
                "Pro"
              )}
              
              {renderFeatureCard(
                "Link Shortener",
                "Create branded short links with analytics",
                Share2,
                "link_shortener",
                "Pro"
              )}
              
              {renderFeatureCard(
                "Email Capture",
                "Collect email addresses from your visitors",
                Mail,
                "email_capture",
                "Pro"
              )}
              
              {renderFeatureCard(
                "Location Analytics",
                "See where your visitors are located",
                Globe,
                "location_analytics",
                "Pro"
              )}
              
              {renderFeatureCard(
                "QR Code Generator",
                "Generate QR codes for offline traffic",
                QrCode,
                "qr_codes",
                "Starter",
                plan !== 'free'
              )}
            </div>
          </div>
        );
      
      case "domain-settings":
        return <DomainSettingsSection 
          profile={profile} 
          hasFeatureAccess={hasFeatureAccess}
          onFeatureClick={onFeatureClick}
        />;
      
      case "social-planner":
        return hasFeatureAccess('social_planner') ? (
          <SocialPlannerSection />
        ) : (
          <LockedFeatureCard 
            title="Social Planner"
            description="Plan and schedule your social media content"
            requiredPlan="Premium"
            onUpgrade={() => handleFeatureClick('social_planner')}
          />
        );
      
      case "instagram-reply":
        return hasFeatureAccess('instagram_reply') ? (
          <InstagramReplySection />
        ) : (
          <LockedFeatureCard 
            title="Instagram Auto-Reply"
            description="Automated Instagram responses and engagement"
            requiredPlan="Premium"
            onUpgrade={() => handleFeatureClick('instagram_reply')}
          />
        );
      
      case "link-shortener":
        return hasFeatureAccess('link_shortener') ? (
          <LinkShortenerSection />
        ) : (
          <LockedFeatureCard 
            title="Link Shortener"
            description="Create branded short links with analytics"
            requiredPlan="Pro"
            onUpgrade={() => handleFeatureClick('link_shortener')}
          />
        );
      
      case "team-access":
        return hasFeatureAccess('team_access') ? (
          <TeamAccessSection />
        ) : (
          <LockedFeatureCard 
            title="Team Access"
            description="Collaborate with your team on your Droplink"
            requiredPlan="Premium"
            onUpgrade={() => handleFeatureClick('team_access')}
          />
        );
      
      case "features":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Features</h2>
              <p className="text-gray-600">Explore all available features for your plan</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Free Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-gray-500" />
                  Free Features
                </h3>
                {renderFeatureCard("1 Link", "Add one link to your profile", LinkIcon, "basic_link", "Free", true)}
                {renderFeatureCard("Pi Ads", "Display Pi Network ads", Eye, "pi_ads", "Free", true)}
                {renderFeatureCard("Basic Profile", "Create your profile", Users, "basic_profile", "Free", true)}
              </div>
              
              {/* Starter Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-blue-500" />
                  Starter Features
                </h3>
                {renderFeatureCard("Unlimited Links", "Add unlimited links", LinkIcon, "unlimited_links", "Starter", plan !== 'free')}
                {renderFeatureCard("Pi Tips", "Accept Pi tips", Gift, "pi_tips", "Starter", plan !== 'free')}
                {renderFeatureCard("QR Codes", "Generate QR codes", QrCode, "qr_codes", "Starter", plan !== 'free')}
                {renderFeatureCard(".pi Domain", "Custom .pi domain", Globe, "pi_domain", "Starter", plan !== 'free')}
                {renderFeatureCard("Basic Analytics", "View basic stats", BarChart3, "analytics", "Starter", plan !== 'free')}
              </div>
              
              {/* Pro Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Crown className="w-5 h-5 mr-2 text-purple-500" />
                  Pro Features
                </h3>
                {renderFeatureCard("Product Sales", "Sell digital products", ShoppingCart, "product_sales", "Pro")}
                {renderFeatureCard("Advanced Analytics", "Detailed insights", PieChart, "advanced_analytics", "Pro")}
                {renderFeatureCard("SEO Tools", "Search optimization", Target, "seo_tools", "Pro")}
                {renderFeatureCard("Link Scheduling", "Schedule your links", Calendar, "scheduling", "Pro")}
                {renderFeatureCard("Email Capture", "Collect emails", Mail, "email_capture", "Pro")}
                {renderFeatureCard("Branding Removal", "Remove Droplink badge", Shield, "branding_removal", "Pro")}
              </div>
              
              {/* Premium Features */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-yellow-500" />
                  Premium Features
                </h3>
                {renderFeatureCard("Custom CSS", "Full CSS control", Code, "custom_css", "Premium")}
                {renderFeatureCard("API Access", "Developer API", Key, "api_access", "Premium")}
                {renderFeatureCard("Team Access", "Collaborate with team", TeamIcon, "team_access", "Premium")}
                {renderFeatureCard("Social Planner", "Plan social content", Calendar, "social_planner", "Premium")}
                {renderFeatureCard("Instagram Auto-Reply", "Automated responses", Instagram, "instagram_reply", "Premium")}
                {renderFeatureCard("Priority Support", "4-hour response time", Bell, "priority_support", "Premium")}
                {renderFeatureCard("Data Export", "Export all your data", Download, "data_export", "Premium")}
                {renderFeatureCard("White Label", "Remove all branding", Shield, "whitelabel", "Premium")}
              </div>
            </div>
          </div>
        );
      
      default:
        return <MyDroplinkSection />;
    }
  };

  return (
    <div className="p-6">
      {renderSection()}
      
      {/* Plan Upgrade Modal */}
      <PlanUpgradeModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        feature={selectedFeature}
        currentPlan={plan}
      />
    </div>
  );
};

export default DashboardMain;
