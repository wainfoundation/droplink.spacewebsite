import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor, 
  Download,
  RefreshCw,
  Calendar,
  Clock,
  MapPin,
  Link as LinkIcon,
  Heart,
  Share2,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { useLinks } from '@/hooks/useLinks';

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  clickRate: number;
  uniqueVisitors: number;
  averageSessionDuration: number;
  topLinks: Array<{
    id: string;
    title: string;
    clicks: number;
    views: number;
    clickRate: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  deviceTypes: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  geographicData: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  hourlyData: Array<{
    hour: number;
    views: number;
    clicks: number;
  }>;
  dailyData: Array<{
    date: string;
    views: number;
    clicks: number;
    visitors: number;
  }>;
  socialEngagement: {
    likes: number;
    shares: number;
    comments: number;
  };
}

interface EnhancedAnalyticsProps {
  timeRange?: '24h' | '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: string) => void;
}

const EnhancedAnalytics: React.FC<EnhancedAnalyticsProps> = ({
  timeRange = '7d',
  onTimeRangeChange
}) => {
  const { user } = useUser();
  const { links } = useLinks(user?.id);
  const { toast } = useToast();
  
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRealTime, setIsRealTime] = useState(true);

  // Generate mock analytics data
  const generateMockData = (): AnalyticsData => {
    const baseViews = Math.floor(Math.random() * 10000) + 1000;
    const baseClicks = Math.floor(baseViews * (0.1 + Math.random() * 0.2));
    const clickRate = (baseClicks / baseViews) * 100;

    return {
      totalViews: baseViews,
      totalClicks: baseClicks,
      clickRate: parseFloat(clickRate.toFixed(2)),
      uniqueVisitors: Math.floor(baseViews * 0.7),
      averageSessionDuration: Math.floor(Math.random() * 300) + 60,
      topLinks: links?.slice(0, 5).map(link => ({
        id: link.id,
        title: link.title,
        clicks: Math.floor(Math.random() * 1000) + 100,
        views: Math.floor(Math.random() * 2000) + 200,
        clickRate: parseFloat((Math.random() * 20).toFixed(2))
      })) || [],
      trafficSources: [
        { source: 'Direct', visitors: Math.floor(baseViews * 0.4), percentage: 40 },
        { source: 'Social Media', visitors: Math.floor(baseViews * 0.3), percentage: 30 },
        { source: 'Search', visitors: Math.floor(baseViews * 0.2), percentage: 20 },
        { source: 'Referral', visitors: Math.floor(baseViews * 0.1), percentage: 10 }
      ],
      deviceTypes: [
        { device: 'Mobile', count: Math.floor(baseViews * 0.6), percentage: 60 },
        { device: 'Desktop', count: Math.floor(baseViews * 0.3), percentage: 30 },
        { device: 'Tablet', count: Math.floor(baseViews * 0.1), percentage: 10 }
      ],
      geographicData: [
        { country: 'United States', visitors: Math.floor(baseViews * 0.3), percentage: 30 },
        { country: 'United Kingdom', visitors: Math.floor(baseViews * 0.2), percentage: 20 },
        { country: 'Canada', visitors: Math.floor(baseViews * 0.15), percentage: 15 },
        { country: 'Australia', visitors: Math.floor(baseViews * 0.1), percentage: 10 },
        { country: 'Germany', visitors: Math.floor(baseViews * 0.1), percentage: 10 },
        { country: 'Other', visitors: Math.floor(baseViews * 0.15), percentage: 15 }
      ],
      hourlyData: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        views: Math.floor(Math.random() * 100) + 10,
        clicks: Math.floor(Math.random() * 20) + 2
      })),
      dailyData: Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 1000) + 100,
        clicks: Math.floor(Math.random() * 200) + 20,
        visitors: Math.floor(Math.random() * 800) + 80
      })),
      socialEngagement: {
        likes: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 20,
        comments: Math.floor(Math.random() * 100) + 10
      }
    };
  };

  // Load analytics data
  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        const data = generateMockData();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalytics();
  }, [timeRange, links, toast]);

  // Real-time updates
  useEffect(() => {
    if (isRealTime && analyticsData) {
      const interval = setInterval(() => {
        setAnalyticsData(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            totalViews: prev.totalViews + Math.floor(Math.random() * 5),
            totalClicks: prev.totalClicks + Math.floor(Math.random() * 2),
            clickRate: parseFloat(((prev.totalClicks / prev.totalViews) * 100).toFixed(2))
          };
        });
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [isRealTime, analyticsData]);

  const handleExport = async () => {
    try {
      if (!analyticsData) return;

      const csvData = [
        ['Metric', 'Value'],
        ['Total Views', analyticsData.totalViews.toString()],
        ['Total Clicks', analyticsData.totalClicks.toString()],
        ['Click Rate', `${analyticsData.clickRate}%`],
        ['Unique Visitors', analyticsData.uniqueVisitors.toString()],
        ['Average Session Duration', `${analyticsData.averageSessionDuration}s`]
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Analytics data exported to CSV",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "Failed to export analytics data",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const data = generateMockData();
      setAnalyticsData(data);
      toast({
        title: "Data refreshed",
        description: "Analytics data updated successfully",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Loading...
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Data</h3>
        <p className="text-gray-600">Start sharing your profile to see analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
          {isRealTime && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">Time Range:</span>
        <div className="flex space-x-1">
          {['24h', '7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeRangeChange?.(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalViews.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+12.5%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.totalClicks.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <MousePointer className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+8.2%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.clickRate}%
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+2.1%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.uniqueVisitors.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+15.3%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="links">Top Links</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Device Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Monitor className="w-5 h-5" />
                  <span>Device Types</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.deviceTypes.map((device, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {device.device === 'Mobile' ? (
                            <Smartphone className="w-4 h-4 text-gray-600" />
                          ) : device.device === 'Desktop' ? (
                            <Monitor className="w-4 h-4 text-gray-600" />
                          ) : (
                            <Smartphone className="w-4 h-4 text-gray-600" />
                          )}
                        </div>
                        <span className="font-medium">{device.device}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{device.count.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{device.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Geographic Data */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Top Countries</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analyticsData.geographicData.slice(0, 5).map((country, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{country.country}</span>
                      <div className="text-right">
                        <div className="font-semibold">{country.visitors.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">{country.percentage}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="w-5 h-5" />
                <span>Traffic Sources</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trafficSources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="font-medium">{source.source}</span>
                    <div className="text-right">
                      <div className="font-semibold">{source.visitors.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">{source.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LinkIcon className="w-5 h-5" />
                <span>Top Performing Links</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.topLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{link.title}</div>
                      <div className="text-sm text-gray-600">
                        {link.clicks} clicks • {link.clickRate}% CTR
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{link.views.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">views</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{analyticsData.socialEngagement.likes}</div>
                <div className="text-sm text-gray-600">Likes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Share2 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{analyticsData.socialEngagement.shares}</div>
                <div className="text-sm text-gray-600">Shares</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <MessageCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold">{analyticsData.socialEngagement.comments}</div>
                <div className="text-sm text-gray-600">Comments</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedAnalytics;
