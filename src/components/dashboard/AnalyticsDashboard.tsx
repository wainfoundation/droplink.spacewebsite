import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Globe, 
  Calendar,
  Download,
  Share2,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  totalClicks: number;
  profileViews: number;
  uniqueVisitors: number;
  conversionRate: number;
  geographicData: GeoData[];
  referrerData: ReferrerData[];
  timeSeriesData: TimeSeriesData[];
  linkPerformance: LinkPerformance[];
}

interface GeoData {
  country: string;
  clicks: number;
  percentage: number;
}

interface ReferrerData {
  source: string;
  clicks: number;
  percentage: number;
}

interface TimeSeriesData {
  date: string;
  clicks: number;
  views: number;
}

interface LinkPerformance {
  title: string;
  clicks: number;
  conversionRate: number;
}

interface AnalyticsDashboardProps {
  userId: string;
  profileId: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ 
  userId, 
  profileId, 
  timeRange = '30d' 
}) => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);

  // Mock data for demonstration
  const mockAnalyticsData: AnalyticsData = {
    totalClicks: 2847,
    profileViews: 12543,
    uniqueVisitors: 8921,
    conversionRate: 22.7,
    geographicData: [
      { country: 'United States', clicks: 1240, percentage: 43.6 },
      { country: 'United Kingdom', clicks: 456, percentage: 16.0 },
      { country: 'Canada', clicks: 234, percentage: 8.2 },
      { country: 'Australia', clicks: 189, percentage: 6.6 },
      { country: 'Germany', clicks: 156, percentage: 5.5 },
      { country: 'Others', clicks: 572, percentage: 20.1 },
    ],
    referrerData: [
      { source: 'Instagram', clicks: 1240, percentage: 43.6 },
      { source: 'Direct', clicks: 856, percentage: 30.1 },
      { source: 'Twitter', clicks: 456, percentage: 16.0 },
      { source: 'Facebook', clicks: 234, percentage: 8.2 },
      { source: 'Others', clicks: 61, percentage: 2.1 },
    ],
    timeSeriesData: [
      { date: '2024-01-01', clicks: 45, views: 234 },
      { date: '2024-01-02', clicks: 67, views: 345 },
      { date: '2024-01-03', clicks: 89, views: 456 },
      { date: '2024-01-04', clicks: 123, views: 567 },
      { date: '2024-01-05', clicks: 156, views: 678 },
      { date: '2024-01-06', clicks: 189, views: 789 },
      { date: '2024-01-07', clicks: 234, views: 890 },
    ],
    linkPerformance: [
      { title: 'Instagram', clicks: 1240, conversionRate: 85.2 },
      { title: 'YouTube', clicks: 856, conversionRate: 72.1 },
      { title: 'Website', clicks: 432, conversionRate: 68.5 },
      { title: 'Contact', clicks: 298, conversionRate: 45.3 },
    ],
  };

  useEffect(() => {
    // Simulate API call
    const fetchAnalytics = async () => {
      setIsLoading(true);
      // In real implementation, fetch from API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData(mockAnalyticsData);
      setIsLoading(false);
    };

    fetchAnalytics();
  }, [userId, profileId, selectedTimeRange]);

  const timeRangeOptions = [
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
    { value: '1y', label: 'Last year' },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const lineChartData = {
    labels: analyticsData?.timeSeriesData.map(d => d.date) || [],
    datasets: [
      {
        label: 'Clicks',
        data: analyticsData?.timeSeriesData.map(d => d.clicks) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Profile Views',
        data: analyticsData?.timeSeriesData.map(d => d.views) || [],
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const geographicChartData = {
    labels: analyticsData?.geographicData.map(d => d.country) || [],
    datasets: [
      {
        data: analyticsData?.geographicData.map(d => d.clicks) || [],
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#F59E0B',
          '#EF4444',
          '#8B5CF6',
          '#6B7280',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const referrerChartData = {
    labels: analyticsData?.referrerData.map(d => d.source) || [],
    datasets: [
      {
        data: analyticsData?.referrerData.map(d => d.clicks) || [],
        backgroundColor: [
          '#E91E63',
          '#9C27B0',
          '#3F51B5',
          '#2196F3',
          '#00BCD4',
        ],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading analytics...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
            <p className="text-gray-600">
              Start sharing your profile to see analytics data
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with time range selector */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Track your profile performance and visitor insights</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button size="sm" variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold">{analyticsData.totalClicks.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12.5% from last period
                </p>
              </div>
              <MousePointer className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold">{analyticsData.profileViews.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8.3% from last period
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15.2% from last period
                </p>
              </div>
              <Globe className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{analyticsData.conversionRate}%</p>
                <p className="text-sm text-green-600 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +2.1% from last period
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
          <TabsTrigger value="links">Link Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={lineChartData} options={chartOptions} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Doughnut data={geographicChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.geographicData.slice(0, 5).map((country, index) => (
                    <div key={country.country} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{country.country}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{country.clicks.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{country.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="referrers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <Pie data={referrerChartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Referrers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.referrerData.map((referrer, index) => (
                    <div key={referrer.source} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{index + 1}</Badge>
                        <span className="font-medium">{referrer.source}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{referrer.clicks.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">{referrer.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.linkPerformance.map((link, index) => (
                  <div key={link.title} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{link.title}</p>
                        <p className="text-sm text-gray-600">{link.clicks.toLocaleString()} clicks</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{link.conversionRate}%</p>
                      <p className="text-sm text-gray-600">conversion rate</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
