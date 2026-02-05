import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link as LinkIcon, 
  BarChart3, 
  Settings, 
  Crown, 
  Zap,
  Check,
  X
} from "lucide-react";
import LinksManager from "./LinksManager";
import Analytics from "./Analytics";
import ProfileSettings from "./ProfileSettings";

interface PlanBasedDashboardProps {
  userPlan: string;
  onUpgrade?: (planId: string) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const PlanBasedDashboard = ({ userPlan, onUpgrade, activeTab = "links", onTabChange }: PlanBasedDashboardProps) => {
  // Remove the internal activeTab state since we're now using props
  // const [activeTab, setActiveTab] = useState("links");

  const planFeatures = {
    free: {
      name: "Free Plan",
      price: "$0",
      features: {
        links: 1,
        analytics: false,
        customDomain: false,
        themes: 1,
        prioritySupport: false
      }
    },
    starter: {
      name: "Starter Plan",
      price: "$9.99/month",
      features: {
        links: 10,
        analytics: true,
        customDomain: true,
        themes: 6,
        prioritySupport: false
      }
    },
    pro: {
      name: "Pro Plan",
      price: "$19.99/month",
      features: {
        links: "∞",
        analytics: true,
        customDomain: true,
        themes: "∞",
        prioritySupport: true
      }
    }
  };

  const currentPlan = planFeatures[userPlan as keyof typeof planFeatures];

  const getFeatureStatus = (feature: string) => {
    const featureValue = currentPlan.features[feature as keyof typeof currentPlan.features];
    if (featureValue === true) return "enabled";
    if (featureValue === false) return "disabled";
    if (featureValue === "∞") return "unlimited";
    return "limited";
  };

  const renderFeatureIcon = (feature: string) => {
    const status = getFeatureStatus(feature);
    switch (status) {
      case "enabled":
      case "unlimited":
        return <Check className="w-4 h-4 text-green-500" />;
      case "disabled":
        return <X className="w-4 h-4 text-red-500" />;
      case "limited":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const renderFeatureText = (feature: string) => {
    const featureValue = currentPlan.features[feature as keyof typeof currentPlan.features];
    if (featureValue === true) return "Included";
    if (featureValue === false) return "Not included";
    if (featureValue === "∞") return "Unlimited";
    return `${featureValue} links`;
  };

  const handleTabChange = (tab: string) => {
    console.log('PlanBasedDashboard: Tab changing to', tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card className="border-2 border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{currentPlan.name}</h3>
                <p className="text-sm text-gray-600">{currentPlan.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Current Plan</p>
                <Badge variant="secondary">{currentPlan.name}</Badge>
              </div>
              {userPlan === 'free' && (
                <Button
                  onClick={() => onUpgrade?.('starter')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Upgrade Plan
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.entries(currentPlan.features).map(([feature, value]) => (
          <Card key={feature} className="text-center">
            <CardContent className="p-4">
              <div className="flex items-center justify-center mb-2">
                {renderFeatureIcon(feature)}
              </div>
              <h4 className="font-medium text-gray-900 capitalize mb-1">
                {feature.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-sm text-gray-600">
                {renderFeatureText(feature)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

              {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="links" className="flex items-center space-x-2">
            <LinkIcon className="w-4 h-4" />
            <span>Links</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-6">
          <LinksManager userPlan={userPlan} onUpgrade={onUpgrade} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {userPlan === 'free' ? (
            <Card className="text-center py-12">
              <CardContent>
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analytics Unavailable</h3>
                <p className="text-gray-600 mb-6">
                  Upgrade to Starter or Pro plan to access detailed analytics and insights
                </p>
                <Button
                  onClick={() => onUpgrade?.('starter')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Upgrade to Access Analytics
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Analytics />
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <ProfileSettings userPlan={userPlan} onUpgrade={onUpgrade} />
        </TabsContent>
      </Tabs>

      {/* Upgrade CTA for Free Users */}
      {userPlan === 'free' && (
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8 text-center">
            <Crown className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Unlock Premium Features</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Upgrade to Starter or Pro plan to get unlimited links, advanced analytics, 
              custom themes, priority support, and much more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => onUpgrade?.('starter')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Starter
              </Button>
              <Button
                onClick={() => onUpgrade?.('pro')}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PlanBasedDashboard;
