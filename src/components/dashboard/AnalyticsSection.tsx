
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MousePointer, 
  Users, 
  Calendar,
  Download,
  Share2,
  Filter
} from "lucide-react";

const AnalyticsSection = () => {
  const analyticsData = {
    profileViews: {
      total: 1234,
      change: 12.5,
      trend: "up"
    },
    linkClicks: {
      total: 5678,
      change: 8.2,
      trend: "up"
    },
    followers: {
      total: 892,
      change: -2.1,
      trend: "down"
    },
    conversionRate: {
      total: 4.6,
      change: 1.2,
      trend: "up"
    }
  };

  const topLinks = [
    {
      name: "My Website",
      url: "https://example.com",
      clicks: 1240,
      change: 15.3
    },
    {
      name: "Instagram",
      url: "@myinstagram",
      clicks: 856,
      change: 8.7
    },
    {
      name: "YouTube Channel",
      url: "youtube.com/@mychannel",
      clicks: 432,
      change: -3.2
    },
    {
      name: "Twitter",
      url: "@mytwitter",
      clicks: 298,
      change: 12.1
    }
  ];

  const recentActivity = [
    {
      type: "view",
      message: "Profile viewed by @user123",
      time: "2 minutes ago"
    },
    {
      type: "click",
      message: "Link clicked: My Website",
      time: "5 minutes ago"
    },
    {
      type: "follow",
      message: "New follower: @newuser456",
      time: "12 minutes ago"
    },
    {
      type: "view",
      message: "Profile viewed by @user789",
      time: "18 minutes ago"
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="w-4 h-4 text-blue-600" />;
      case "click":
        return <MousePointer className="w-4 h-4 text-green-600" />;
      case "follow":
        return <Users className="w-4 h-4 text-purple-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Track your profile performance and link engagement</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Profile Views</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.profileViews.total.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analyticsData.profileViews.trend)}
                  <span className={`text-xs ml-1 ${
                    analyticsData.profileViews.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {analyticsData.profileViews.change}% from last week
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Link Clicks</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.linkClicks.total.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analyticsData.linkClicks.trend)}
                  <span className={`text-xs ml-1 ${
                    analyticsData.linkClicks.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {analyticsData.linkClicks.change}% from last week
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MousePointer className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Followers</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.followers.total.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analyticsData.followers.trend)}
                  <span className={`text-xs ml-1 ${
                    analyticsData.followers.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {analyticsData.followers.change}% from last week
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{analyticsData.conversionRate.total}%</p>
                <div className="flex items-center mt-1">
                  {getTrendIcon(analyticsData.conversionRate.trend)}
                  <span className={`text-xs ml-1 ${
                    analyticsData.conversionRate.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {analyticsData.conversionRate.change}% from last week
                  </span>
                </div>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Links */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Top Performing Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-500">#{index + 1}</div>
                  <div>
                    <h4 className="font-medium text-gray-900">{link.name}</h4>
                    <p className="text-sm text-gray-500">{link.url}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{link.clicks.toLocaleString()} clicks</div>
                    <div className="flex items-center text-sm">
                      {link.change > 0 ? (
                        <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
                      )}
                      <span className={link.change > 0 ? "text-green-600" : "text-red-600"}>
                        {Math.abs(link.change)}%
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsSection;
