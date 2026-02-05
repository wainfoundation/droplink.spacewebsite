// Enhanced Analytics Dashboard Component
// Shows detailed click tracking and profile view analytics

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Users, 
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
  Clock,
  Target
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AnalyticsDashboardProps {
  userId: string;
  className?: string;
}

interface LinkAnalytics {
  link_id: string;
  title: string;
  url: string;
  total_clicks: number;
  unique_clicks: number;
  click_rate: number;
  last_clicked: string;
}

interface ProfileAnalytics {
  total_views: number;
  unique_views: number;
  view_rate: number;
  last_viewed: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  userId,
  className
}) => {
  const { toast } = useToast();
  const [linkAnalytics, setLinkAnalytics] = useState<LinkAnalytics[]>([]);
  const [profileAnalytics, setProfileAnalytics] = useState<ProfileAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Load analytics data
  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      // Get user's links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('id, title, url, click_count')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (linksError) {
        throw new Error(`Failed to load links: ${linksError.message}`);
      }

      // Get detailed click analytics for each link
      const linkAnalyticsData: LinkAnalytics[] = [];
      
      for (const link of links || []) {
        try {
          const { data: analyticsData, error: analyticsError } = await supabase
            .rpc('get_link_analytics', { link_uuid: link.id });

          if (!analyticsError && analyticsData && analyticsData.length > 0) {
            const analytics = analyticsData[0];
            linkAnalyticsData.push({
              link_id: link.id,
              title: link.title,
              url: link.url,
              total_clicks: parseInt(analytics.total_clicks) || 0,
              unique_clicks: parseInt(analytics.unique_clicks) || 0,
              click_rate: parseFloat(analytics.click_rate) || 0,
              last_clicked: analytics.last_clicked || 'Never'
            });
          } else {
            // Fallback to basic data
            linkAnalyticsData.push({
              link_id: link.id,
              title: link.title,
              url: link.url,
              total_clicks: link.click_count || 0,
              unique_clicks: link.click_count || 0,
              click_rate: 0,
              last_clicked: 'Never'
            });
          }
        } catch (error) {
          console.warn(`Failed to get analytics for link ${link.id}:`, error);
          // Add fallback data
          linkAnalyticsData.push({
            link_id: link.id,
            title: link.title,
            url: link.url,
            total_clicks: link.click_count || 0,
            unique_clicks: link.click_count || 0,
            click_rate: 0,
            last_clicked: 'Never'
          });
        }
      }

      setLinkAnalytics(linkAnalyticsData);

      // Get profile analytics
      try {
        const { data: profileData, error: profileError } = await supabase
          .rpc('get_profile_analytics', { profile_uuid: userId });

        if (!profileError && profileData && profileData.length > 0) {
          const analytics = profileData[0];
          setProfileAnalytics({
            total_views: parseInt(analytics.total_views) || 0,
            unique_views: parseInt(analytics.unique_views) || 0,
            view_rate: parseFloat(analytics.view_rate) || 0,
            last_viewed: analytics.last_viewed || 'Never'
          });
        }
      } catch (error) {
        console.warn('Failed to get profile analytics:', error);
        setProfileAnalytics({
          total_views: 0,
          unique_views: 0,
          view_rate: 0,
          last_viewed: 'Never'
        });
      }

    } catch (error) {
      console.error('Analytics loading failed:', error);
      toast({
        title: "Analytics Error",
        description: "Failed to load analytics data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load analytics on mount and when time range changes
  useEffect(() => {
    loadAnalytics();
  }, [userId, timeRange]);

  // Calculate totals
  const totalClicks = linkAnalytics.reduce((sum, link) => sum + link.total_clicks, 0);
  const totalUniqueClicks = linkAnalytics.reduce((sum, link) => sum + link.unique_clicks, 0);
  const averageClickRate = linkAnalytics.length > 0 
    ? linkAnalytics.reduce((sum, link) => sum + link.click_rate, 0) / linkAnalytics.length 
    : 0;

  // Sort links by clicks
  const sortedLinks = [...linkAnalytics].sort((a, b) => b.total_clicks - a.total_clicks);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your profile and link performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={loadAnalytics}
            variant="outline"
            size="sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profile Views */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profileAnalytics?.total_views || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {profileAnalytics?.unique_views || 0} unique visitors
            </p>
          </CardContent>
        </Card>

        {/* Total Clicks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              {totalUniqueClicks} unique clicks
            </p>
          </CardContent>
        </Card>

        {/* Average CTR */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Click Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageClickRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all links
            </p>
          </CardContent>
        </Card>

        {/* Active Links */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{linkAnalytics.length}</div>
            <p className="text-xs text-muted-foreground">
              Total links
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Link Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Link Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {linkAnalytics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No links to analyze yet</p>
              <p className="text-sm">Add some links to start tracking analytics</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedLinks.map((link, index) => (
                <div key={link.link_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium">{link.title}</h3>
                      <p className="text-sm text-gray-500 truncate max-w-xs">
                        {link.url}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-lg font-bold">{link.total_clicks}</div>
                      <div className="text-xs text-gray-500">Total Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{link.unique_clicks}</div>
                      <div className="text-xs text-gray-500">Unique</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{link.click_rate.toFixed(1)}%</div>
                      <div className="text-xs text-gray-500">CTR</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">
                        {link.last_clicked === 'Never' ? (
                          <span className="text-gray-400">Never</span>
                        ) : (
                          <span>{new Date(link.last_clicked).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">Last Click</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {profileAnalytics?.last_viewed && profileAnalytics.last_viewed !== 'Never' && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <Eye className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">Profile viewed</p>
                  <p className="text-xs text-gray-500">
                    {new Date(profileAnalytics.last_viewed).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            
            {sortedLinks.slice(0, 3).map((link) => (
              link.last_clicked !== 'Never' && (
                <div key={link.link_id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <MousePointer className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium">{link.title} clicked</p>
                    <p className="text-xs text-gray-500">
                      {new Date(link.last_clicked).toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
