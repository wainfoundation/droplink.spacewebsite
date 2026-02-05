import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Users, 
  Globe,
  Calendar,
  Download,
  Share2,
  Link as LinkIcon
} from "lucide-react";
import { useUser } from "@/context/UserContext";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  topLinks: Array<{
    id: string;
    title: string;
    clicks: number;
    views: number;
    ctr: number;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    clicks: number;
  }>;
  referrers: Array<{
    source: string;
    visits: number;
    percentage: number;
  }>;
}

const Analytics = () => {
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    totalClicks: 0,
    uniqueVisitors: 0,
    topLinks: [],
    dailyStats: [],
    referrers: []
  });
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analytics data
    setTimeout(() => {
      const mockData: AnalyticsData = {
        totalViews: 1247,
        totalClicks: 892,
        uniqueVisitors: 456,
        topLinks: [
          { id: '1', title: 'My Website', clicks: 234, views: 456, ctr: 51.3 },
          { id: '2', title: 'Instagram', clicks: 189, views: 345, ctr: 54.8 },
          { id: '3', title: 'YouTube', clicks: 156, views: 298, ctr: 52.3 },
          { id: '4', title: 'LinkedIn', clicks: 98, views: 187, ctr: 52.4 },
          { id: '5', title: 'Portfolio', clicks: 67, views: 134, ctr: 50.0 }
        ],
        dailyStats: generateDailyStats(timeRange),
        referrers: [
          { source: 'Direct', visits: 234, percentage: 45.2 },
          { source: 'Instagram', visits: 156, percentage: 30.1 },
          { source: 'Twitter', visits: 89, percentage: 17.2 },
          { source: 'Google', visits: 39, percentage: 7.5 }
        ]
      };
      setAnalyticsData(mockData);
      setIsLoading(false);
    }, 1000);
  }, [timeRange]);

  const generateDailyStats = (range: string) => {
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const stats = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      stats.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 50) + 10,
        clicks: Math.floor(Math.random() * 30) + 5
      });
    }
    return stats;
  };

  const getCTR = () => {
    if (analyticsData.totalViews === 0) return 0;
    return ((analyticsData.totalClicks / analyticsData.totalViews) * 100).toFixed(1);
  };

  const exportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Views,Clicks\n"
      + analyticsData.dailyStats.map(stat => 
          `${stat.date},${stat.views},${stat.clicks}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `analytics-${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <div className="flex items-center space-x-2">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Track your profile performance and link engagement</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.totalClicks.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +8.3% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">{getCTR()}%</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +2.1% from last period
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.uniqueVisitors.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +15.7% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <LinkIcon className="w-5 h-5 mr-2" />
            Top Performing Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.topLinks.map((link, index) => (
              <div key={link.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{link.title}</h3>
                    <p className="text-sm text-gray-500">{link.views} views</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{link.clicks}</p>
                    <p className="text-sm text-gray-500">clicks</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{link.ctr}%</p>
                    <p className="text-sm text-gray-500">CTR</p>
                  </div>
                  <Badge variant="secondary">{link.ctr > 50 ? "High" : "Good"}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Traffic Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="w-5 h-5 mr-2" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.referrers.map((referrer) => (
                <div key={referrer.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-900">{referrer.source}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{referrer.visits} visits</span>
                    <span className="text-sm font-medium text-gray-900">{referrer.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Daily Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.dailyStats.slice(-7).map((stat) => (
                <div key={stat.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(stat.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </span>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{stat.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MousePointer className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{stat.clicks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share Analytics</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download Report</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Detailed Report</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
