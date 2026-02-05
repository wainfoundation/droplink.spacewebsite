// Complete Dashboard Component with Full Backend Integration
// This component provides all dashboard functionality with backend integration

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Link as LinkIcon, 
  BarChart3, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Eye,
  Heart,
  DollarSign,
  Users,
  TrendingUp,
  Zap,
  Crown,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useDashboardBackend } from '@/hooks/useDashboardBackend';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

interface CompleteDashboardProps {
  className?: string;
}

const CompleteDashboard: React.FC<CompleteDashboardProps> = ({ className }) => {
  const { user } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showAddLink, setShowAddLink] = useState(false);
  const [editingLink, setEditingLink] = useState<string | null>(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    description: '',
    icon: '🔗'
  });

  // Backend integration
  const {
    isLoading,
    isInitialized,
    error,
    profile,
    updateProfile,
    links,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    analytics,
    trackPageView,
    trackLinkClick,
    refreshAnalytics,
    processPiPayment,
    createSubscription,
    healthCheck
  } = useDashboardBackend(user?.id);

  // Track page view on mount
  useEffect(() => {
    if (isInitialized && user?.id) {
      trackPageView({
        referrer: document.referrer,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
  }, [isInitialized, user?.id, trackPageView]);

  // Handle link creation
  const handleCreateLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const success = await createLink(newLink);
    if (success) {
      setNewLink({ title: '', url: '', description: '', icon: '🔗' });
      setShowAddLink(false);
    }
  };

  // Handle link update
  const handleUpdateLink = async (linkId: string, linkData: any) => {
    const success = await updateLink(linkId, linkData);
    if (success) {
      setEditingLink(null);
    }
  };

  // Handle link deletion
  const handleDeleteLink = async (linkId: string) => {
    const success = await deleteLink(linkId);
    if (success) {
      setEditingLink(null);
    }
  };

  // Handle link reordering
  const handleReorderLinks = async (newOrder: string[]) => {
    await reorderLinks(newOrder);
  };

  // Handle Pi payment
  const handlePiPayment = async (amount: number, memo: string) => {
    const success = await processPiPayment(amount, memo);
    if (success) {
      await refreshAnalytics();
    }
  };

  // Handle subscription creation
  const handleCreateSubscription = async (plan: string, amount: number) => {
    const success = await createSubscription(plan, amount);
    if (success) {
      await refreshAnalytics();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-500">Error: {error}</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Manage your profile and links</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isInitialized ? "default" : "destructive"}>
            {isInitialized ? "Connected" : "Disconnected"}
          </Badge>
          <Button onClick={healthCheck} variant="outline" size="sm">
            Health Check
          </Button>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="links" className="flex items-center space-x-2">
            <LinkIcon className="w-4 h-4" />
            <span>Links</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Payments</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.total_views || 0}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.total_clicks || 0}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.click_rate || 0}%</div>
                <p className="text-xs text-muted-foreground">Conversion rate</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Links</CardTitle>
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{links.length}</div>
                <p className="text-xs text-muted-foreground">Active links</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.recent_activity?.length ? (
                <div className="space-y-2">
                  {analytics.recent_activity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span>
                        {activity.page_view ? 'Page viewed' : 'Link clicked'} - 
                        {new Date(activity.created_at).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No recent activity</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Links Tab */}
        <TabsContent value="links" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Links</h2>
            <Button onClick={() => setShowAddLink(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Link
            </Button>
          </div>

          {/* Add Link Form */}
          {showAddLink && (
            <Card>
              <CardHeader>
                <CardTitle>Add New Link</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="Link title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newLink.description}
                    onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                    placeholder="Link description"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddLink(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLink}>
                    Create Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Links List */}
          <div className="space-y-4">
            {links.map((link, index) => (
              <Card key={link.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{link.icon}</span>
                        <div>
                          <h3 className="font-medium">{link.title}</h3>
                          <p className="text-sm text-gray-500">{link.url}</p>
                          {link.description && (
                            <p className="text-sm text-gray-400">{link.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">
                        {link.clicks || 0} clicks
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingLink(link.id || null)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteLink(link.id || '')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Analytics</h2>
            <Button onClick={refreshAnalytics} variant="outline">
              Refresh
            </Button>
          </div>

          {/* Top Links */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.top_links?.length ? (
                <div className="space-y-2">
                  {analytics.top_links.map((link, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.title}</span>
                      </div>
                      <Badge variant="outline">{link.clicks} clicks</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No data available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Payments & Subscriptions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Pi Network Payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handlePiPayment(10, 'Test payment')}
                  className="w-full"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Test Pi Payment (10 Pi)
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleCreateSubscription('pro', 19.99)}
                  className="w-full"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade to Pro ($19.99)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Settings</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profile.username || ''}
                      onChange={(e) => updateProfile({ ...profile, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="display_name">Display Name</Label>
                    <Input
                      id="display_name"
                      value={profile.display_name || ''}
                      onChange={(e) => updateProfile({ ...profile, display_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio || ''}
                      onChange={(e) => updateProfile({ ...profile, bio: e.target.value })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompleteDashboard;
