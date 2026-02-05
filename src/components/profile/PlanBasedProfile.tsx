import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Link as LinkIcon,
  BarChart3,
  Eye,
  TrendingUp,
  QrCode,
  Share2,
  Copy,
  Palette,
  Zap,
  Crown,
  Sparkles,
  Lock,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Code,
  DollarSign,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Shield,
  Users,
  FileText,
  ExternalLink,
  Star,
  Globe,
  Settings
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLinks } from "@/hooks/useLinks";
import { useToast } from "@/hooks/use-toast";
import { DOMAIN_CONFIG } from "@/config/domain";
import { AVAILABLE_PLANS } from "@/services/planService";

interface PlanBasedProfileProps {
  userPlan: string;
  username: string;
  onUpgrade: (planId: string) => void;
}

const PlanBasedProfile: React.FC<PlanBasedProfileProps> = ({ userPlan, username, onUpgrade }) => {
  const { user, profile } = useUser();
  const { toast } = useToast();
  const { links, isLoading } = useLinks(user?.id);
  
  const [showQRCode, setShowQRCode] = useState(false);

  // Get current plan details
  const currentPlan = AVAILABLE_PLANS.find(plan => plan.id === userPlan) || AVAILABLE_PLANS[0];
  const isFreePlan = userPlan === 'free';
  const isStarterPlan = userPlan === 'starter';
  const isProPlan = userPlan === 'pro';
  const isPremiumPlan = userPlan === 'premium';

  const profileUrl = DOMAIN_CONFIG.getProfileUrl(username);
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  const activeLinks = links.filter(link => link.is_active).length;

  const handleCopyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Link copied!",
        description: "Your profile URL has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the URL manually",
        variant: "destructive",
      });
    }
  };

  const handleShareProfile = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.display_name || username} on Droplink`,
        text: `Check out my profile on Droplink`,
        url: profileUrl,
      });
    } else {
      handleCopyProfileUrl();
    }
  };

  const renderPlanBadge = () => (
    <div className="flex items-center space-x-2">
      <Badge 
        variant={isFreePlan ? "secondary" : "default"} 
        className={`text-xs ${
          isStarterPlan ? 'bg-blue-100 text-blue-800' :
          isProPlan ? 'bg-purple-100 text-purple-800' :
          isPremiumPlan ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800' :
          'bg-gray-100 text-gray-800'
        }`}
      >
        {currentPlan.name}
      </Badge>
      <span className="text-xs text-gray-500">{currentPlan.price === 0 ? 'Free' : `${currentPlan.price}π`}</span>
    </div>
  );

  const renderPlanFeatures = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
      {/* Analytics */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <BarChart3 className="w-3 h-3" />
          <span className="font-medium">Analytics</span>
        </div>
        <div className="flex items-center justify-center">
          {isFreePlan ? 
            <XCircle className="w-3 h-3 text-red-500" /> : 
            <CheckCircle className="w-3 h-3 text-green-500" />
          }
        </div>
      </div>

      {/* QR Codes */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <QrCode className="w-3 h-3" />
          <span className="font-medium">QR Codes</span>
        </div>
        <div className="flex items-center justify-center">
          {isFreePlan ? 
            <XCircle className="w-3 h-3 text-red-500" /> : 
            <CheckCircle className="w-3 h-3 text-green-500" />
          }
        </div>
      </div>

      {/* Product Sales */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <ShoppingCart className="w-3 h-3" />
          <span className="font-medium">Product Sales</span>
        </div>
        <div className="flex items-center justify-center">
          {(isFreePlan || isStarterPlan) ? 
            <XCircle className="w-3 h-3 text-red-500" /> : 
            <CheckCircle className="w-3 h-3 text-green-500" />
          }
        </div>
      </div>

      {/* Custom CSS */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-1 mb-1">
          <Code className="w-3 h-3" />
          <span className="font-medium">Custom CSS</span>
        </div>
        <div className="flex items-center justify-center">
          {isPremiumPlan ? 
            <CheckCircle className="w-3 h-3 text-green-500" /> : 
            <XCircle className="w-3 h-3 text-red-500" />
          }
        </div>
      </div>
    </div>
  );

  const renderUpgradePrompt = () => {
    if (isPremiumPlan) return null;

    const nextPlan = AVAILABLE_PLANS.find(plan => {
      const planOrder = ['free', 'starter', 'pro', 'premium'];
      const currentIndex = planOrder.indexOf(userPlan);
      return planOrder.indexOf(plan.id) === currentIndex + 1;
    });

    if (!nextPlan) return null;

    return (
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Upgrade to {nextPlan.name}</h3>
              <p className="text-sm text-blue-700">
                Unlock {nextPlan.features.length - currentPlan.features.length} more features
              </p>
            </div>
            <Button 
              onClick={() => onUpgrade(nextPlan.id)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upgrade
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderPlanSpecificFeatures = () => {
    switch (userPlan) {
      case 'free':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-gray-500" />
                  Free Plan Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Only 1 link allowed
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Pi ads shown on your profile
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    No analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Basic templates only
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'starter':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  Starter Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Unlimited links
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    .pi domain access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Pi tips enabled
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    33+ templates
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'pro':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-500" />
                  Pro Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Digital product sales
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Advanced analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    SEO tools
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    66+ premium templates
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      case 'premium':
        return (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Premium Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Custom CSS
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    99+ exclusive templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    White-label option
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const renderAnalytics = () => {
    if (isFreePlan) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade to Starter plan or higher to access analytics
            </p>
            <Button onClick={() => onUpgrade('starter')}>
              Upgrade to Starter
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">{totalClicks}</p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Links</p>
                <p className="text-2xl font-bold">{activeLinks}</p>
              </div>
              <LinkIcon className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold">0</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderQRCode = () => {
    if (isFreePlan) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">QR Codes Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade to Starter plan or higher to generate QR codes
            </p>
            <Button onClick={() => onUpgrade('starter')}>
              Upgrade to Starter
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="bg-white p-4 rounded-lg inline-block">
            <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">Scan to visit your profile</p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {profile?.display_name || username}
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                @{username}
              </p>
            </div>
            {renderPlanBadge()}
          </div>
        </CardHeader>
        <CardContent>
          {renderPlanFeatures()}
        </CardContent>
      </Card>

      {/* Upgrade Prompt */}
      {renderUpgradePrompt()}

      {/* Plan-Specific Features */}
      {renderPlanSpecificFeatures()}

      {/* Profile URL */}
      <Card>
        <CardHeader>
          <CardTitle>Profile URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="flex-1 px-3 py-2 border rounded-md bg-gray-50"
            />
            <Button onClick={handleCopyProfileUrl} size="sm">
              <Copy className="w-4 h-4" />
            </Button>
            <Button onClick={handleShareProfile} size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button onClick={() => window.open(profileUrl, '_blank')} size="sm">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderAnalytics()}
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderQRCode()}
        </CardContent>
      </Card>

      {/* Links Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Links Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{activeLinks}</p>
              <p className="text-sm text-gray-600">Active Links</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{totalClicks}</p>
              <p className="text-sm text-gray-600">Total Clicks</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlanBasedProfile;
