import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Heart, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Calendar,
  Eye,
  Download,
  Settings,
  Lock,
  Check,
  X,
  Star,
  Gift,
  MessageCircle,
  Send,
  Bell,
  BellOff,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { hasFeature, type PlanType } from "@/services/planFeaturesService";

interface PiTip {
  id: string;
  amount: number;
  message: string;
  from: string;
  fromUsername: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  platform: 'mobile' | 'desktop' | 'tablet';
  location?: string;
}

interface PiTipsSystemProps {
  currentPlan: PlanType;
  onUpgrade?: (planId: string) => void;
}

const PiTipsSystem: React.FC<PiTipsSystemProps> = ({
  currentPlan,
  onUpgrade
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'analytics'>('overview');
  const [tipSettings, setTipSettings] = useState({
    enabled: true,
    minAmount: 1,
    maxAmount: 100,
    defaultAmount: 5,
    customMessage: true,
    showTipButton: true,
    notifications: true,
    autoThankYou: true,
    thankYouMessage: "Thank you for your generous tip! 🙏"
  });

  // Mock tips data
  const [tips, setTips] = useState<PiTip[]>([
    {
      id: '1',
      amount: 5.2,
      message: 'Great content! Keep it up!',
      from: 'user123',
      fromUsername: 'PiLover',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'completed',
      platform: 'mobile',
      location: 'United States'
    },
    {
      id: '2',
      amount: 10.0,
      message: 'Amazing work on the Pi development guide!',
      from: 'user456',
      fromUsername: 'CryptoEnthusiast',
      timestamp: '2024-01-19T14:15:00Z',
      status: 'completed',
      platform: 'desktop',
      location: 'Canada'
    },
    {
      id: '3',
      amount: 2.5,
      message: '',
      from: 'user789',
      fromUsername: 'Anonymous',
      timestamp: '2024-01-18T09:45:00Z',
      status: 'completed',
      platform: 'mobile',
      location: 'United Kingdom'
    }
  ]);

  const totalTips = tips.reduce((sum, tip) => sum + tip.amount, 0);
  const totalTipsCount = tips.length;
  const averageTip = totalTips / totalTipsCount || 0;
  const thisMonthTips = tips.filter(tip => {
    const tipDate = new Date(tip.timestamp);
    const now = new Date();
    return tipDate.getMonth() === now.getMonth() && tipDate.getFullYear() === now.getFullYear();
  });

  const canUsePiTips = hasFeature(currentPlan, 'showPiTips');

  const handleEnablePiTips = () => {
    if (!canUsePiTips) {
      toast({
        title: "Pi Tips Locked",
        description: "Pi Tips are available in Starter plan or higher",
        variant: "destructive"
      });
      if (onUpgrade) {
        onUpgrade('STARTER');
      }
      return;
    }

    setTipSettings({ ...tipSettings, enabled: !tipSettings.enabled });
    toast({
      title: tipSettings.enabled ? "Pi Tips Disabled" : "Pi Tips Enabled",
      description: tipSettings.enabled ? "Pi tips are now disabled" : "Pi tips are now enabled",
    });
  };

  const handleSaveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your Pi tips settings have been updated",
    });
  };

  const getStatusColor = (status: PiTip['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
    }
  };

  const getPlatformIcon = (platform: PiTip['platform']) => {
    switch (platform) {
      case 'mobile': return <Smartphone className="w-4 h-4" />;
      case 'desktop': return <Monitor className="w-4 h-4" />;
      case 'tablet': return <Tablet className="w-4 h-4" />;
    }
  };

  if (!canUsePiTips) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Pi Tips Not Available</h3>
          <p className="text-gray-600 mb-6">
            Pi Tips are available in Starter plan or higher. Upgrade to start receiving tips from your audience.
          </p>
          <Button onClick={() => onUpgrade?.('STARTER')}>
            <Star className="h-4 w-4 mr-2" />
            Upgrade to Starter
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Pi Tips</h2>
          <p className="text-gray-600">Manage your Pi tips and earnings</p>
        </div>
        <Button
          onClick={handleEnablePiTips}
          variant={tipSettings.enabled ? "default" : "outline"}
        >
          {tipSettings.enabled ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Enabled
            </>
          ) : (
            <>
              <X className="w-4 h-4 mr-2" />
              Disabled
            </>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Total Tips</p>
                <p className="text-2xl font-bold text-green-900">{totalTips.toFixed(1)}π</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  +12% this month
                </div>
              </div>
              <Heart className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Tips Count</p>
                <p className="text-2xl font-bold text-blue-900">{totalTipsCount}</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Users className="h-4 w-4" />
                  {thisMonthTips.length} this month
                </div>
              </div>
              <Gift className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Average Tip</p>
                <p className="text-2xl font-bold text-purple-900">{averageTip.toFixed(1)}π</p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <ArrowUpRight className="h-4 w-4" />
                  +8% this month
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">This Month</p>
                <p className="text-2xl font-bold text-orange-900">
                  {thisMonthTips.reduce((sum, tip) => sum + tip.amount, 0).toFixed(1)}π
                </p>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <Calendar className="h-4 w-4" />
                  {thisMonthTips.length} tips
                </div>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'outline'}
          onClick={() => setActiveTab('overview')}
        >
          <Eye className="w-4 h-4 mr-2" />
          Overview
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'outline'}
          onClick={() => setActiveTab('settings')}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        <Button
          variant={activeTab === 'analytics' ? 'default' : 'outline'}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tips.map((tip) => (
                  <div key={tip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {tip.fromUsername.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">@{tip.fromUsername}</h4>
                        <p className="text-sm text-gray-600">
                          {tip.message || 'No message'}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3" />
                          {new Date(tip.timestamp).toLocaleDateString()}
                          {tip.location && (
                            <>
                              <MapPin className="w-3 h-3" />
                              {tip.location}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{tip.amount}π</p>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(tip.status)}>
                          {tip.status}
                        </Badge>
                        {getPlatformIcon(tip.platform)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Card>
          <CardHeader>
            <CardTitle>Pi Tips Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="minAmount">Minimum Tip Amount (π)</Label>
                <Input
                  id="minAmount"
                  type="number"
                  value={tipSettings.minAmount}
                  onChange={(e) => setTipSettings({ ...tipSettings, minAmount: parseFloat(e.target.value) })}
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="maxAmount">Maximum Tip Amount (π)</Label>
                <Input
                  id="maxAmount"
                  type="number"
                  value={tipSettings.maxAmount}
                  onChange={(e) => setTipSettings({ ...tipSettings, maxAmount: parseFloat(e.target.value) })}
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <Label htmlFor="defaultAmount">Default Tip Amount (π)</Label>
                <Input
                  id="defaultAmount"
                  type="number"
                  value={tipSettings.defaultAmount}
                  onChange={(e) => setTipSettings({ ...tipSettings, defaultAmount: parseFloat(e.target.value) })}
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="customMessage"
                  checked={tipSettings.customMessage}
                  onChange={(e) => setTipSettings({ ...tipSettings, customMessage: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="customMessage">Allow custom messages</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="thankYouMessage">Thank You Message</Label>
              <Textarea
                id="thankYouMessage"
                value={tipSettings.thankYouMessage}
                onChange={(e) => setTipSettings({ ...tipSettings, thankYouMessage: e.target.value })}
                rows={3}
                placeholder="Thank you for your generous tip! 🙏"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="notifications"
                  checked={tipSettings.notifications}
                  onChange={(e) => setTipSettings({ ...tipSettings, notifications: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="notifications">Enable notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoThankYou"
                  checked={tipSettings.autoThankYou}
                  onChange={(e) => setTipSettings({ ...tipSettings, autoThankYou: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="autoThankYou">Auto thank you message</Label>
              </div>
            </div>

            <Button onClick={handleSaveSettings}>
              <Settings className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tips by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-blue-500" />
                      <span>Mobile</span>
                    </div>
                    <span className="font-semibold">65%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-green-500" />
                      <span>Desktop</span>
                    </div>
                    <span className="font-semibold">30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tablet className="w-4 h-4 text-purple-500" />
                      <span>Tablet</span>
                    </div>
                    <span className="font-semibold">5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span>United States</span>
                    </div>
                    <span className="font-semibold">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span>Canada</span>
                    </div>
                    <span className="font-semibold">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <span>United Kingdom</span>
                    </div>
                    <span className="font-semibold">15%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-orange-500" />
                      <span>Other</span>
                    </div>
                    <span className="font-semibold">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default PiTipsSystem;
