import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Eye, 
  MousePointer, 
  Users, 
  Globe, 
  Smartphone, 
  Monitor, 
  MapPin,
  Clock,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Visitor {
  id: string;
  timestamp: number;
  country: string;
  city: string;
  device: 'mobile' | 'desktop' | 'tablet';
  browser: string;
  os: string;
  referrer: string;
  page: string;
  duration: number;
  isActive: boolean;
}

interface RealTimeTrackingProps {
  isEnabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const RealTimeTracking: React.FC<RealTimeTrackingProps> = ({
  isEnabled = true,
  onToggle
}) => {
  const { toast } = useToast();
  
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [stats, setStats] = useState({
    totalVisitors: 0,
    activeVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
    averageSessionDuration: 0
  });

  // Generate mock visitor data
  const generateMockVisitor = (): Visitor => {
    const countries = ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Japan', 'Brazil'];
    const cities = ['New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Paris', 'Tokyo', 'São Paulo'];
    const devices: ('mobile' | 'desktop' | 'tablet')[] = ['mobile', 'desktop', 'tablet'];
    const browsers = ['Chrome', 'Safari', 'Firefox', 'Edge', 'Opera'];
    const os = ['Windows', 'macOS', 'iOS', 'Android', 'Linux'];
    const referrers = ['Direct', 'Google', 'Facebook', 'Twitter', 'LinkedIn', 'Instagram', 'YouTube'];
    const pages = ['/', '/profile', '/links', '/about', '/contact'];

    const country = countries[Math.floor(Math.random() * countries.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const device = devices[Math.floor(Math.random() * devices.length)];
    const browser = browsers[Math.floor(Math.random() * browsers.length)];
    const operatingSystem = os[Math.floor(Math.random() * os.length)];
    const referrer = referrers[Math.floor(Math.random() * referrers.length)];
    const page = pages[Math.floor(Math.random() * pages.length)];

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      country,
      city,
      device,
      browser,
      os: operatingSystem,
      referrer,
      page,
      duration: Math.floor(Math.random() * 300) + 30,
      isActive: Math.random() > 0.3
    };
  };

  // Simulate real-time visitor tracking
  useEffect(() => {
    if (!isEnabled) return;

    const interval = setInterval(() => {
      // Simulate new visitors
      if (Math.random() > 0.7) {
        const newVisitor = generateMockVisitor();
        setVisitors(prev => {
          const updated = [newVisitor, ...prev].slice(0, 50); // Keep last 50 visitors
          return updated;
        });
      }

      // Simulate visitor activity updates
      setVisitors(prev => prev.map(visitor => ({
        ...visitor,
        duration: visitor.duration + Math.floor(Math.random() * 10),
        isActive: Math.random() > 0.1
      })));

      // Update stats
      setStats(prev => ({
        totalVisitors: prev.totalVisitors + (Math.random() > 0.8 ? 1 : 0),
        activeVisitors: Math.floor(Math.random() * 10) + 1,
        pageViews: prev.pageViews + (Math.random() > 0.6 ? 1 : 0),
        bounceRate: Math.floor(Math.random() * 30) + 20,
        averageSessionDuration: Math.floor(Math.random() * 300) + 120
      }));

      setLastUpdate(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [isEnabled]);

  // Connection status simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.05); // 95% uptime
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setLastUpdate(new Date());
    toast({
      title: "Data refreshed",
      description: "Real-time tracking data updated",
    });
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      case 'tablet':
        return <Smartphone className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceColor = (device: string) => {
    switch (device) {
      case 'mobile':
        return 'text-blue-500';
      case 'desktop':
        return 'text-green-500';
      case 'tablet':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Activity className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Real-time Tracking</h3>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Wifi className="w-3 h-3 mr-1" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="text-red-600 border-red-600">
                <WifiOff className="w-3 h-3 mr-1" />
                Disconnected
              </Badge>
            )}
            {isEnabled && (
              <Badge variant="outline" className="text-blue-600 border-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </Button>
          <Button
            variant={isEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => onToggle?.(!isEnabled)}
            className="flex items-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>{isEnabled ? 'Disable' : 'Enable'}</span>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.totalVisitors}</div>
            <div className="text-sm text-gray-600">Total Visitors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.activeVisitors}</div>
            <div className="text-sm text-gray-600">Active Now</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Eye className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.pageViews}</div>
            <div className="text-sm text-gray-600">Page Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.bounceRate}%</div>
            <div className="text-sm text-gray-600">Bounce Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{formatDuration(stats.averageSessionDuration)}</div>
            <div className="text-sm text-gray-600">Avg. Session</div>
          </CardContent>
        </Card>
      </div>

      {/* Live Visitors */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Live Visitors</span>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {visitors.filter(v => v.isActive).length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {visitors.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No visitors yet</p>
              <p className="text-sm text-gray-500">Share your profile to start tracking visitors</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visitors.slice(0, 10).map((visitor) => (
                <div
                  key={visitor.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${getDeviceColor(visitor.device)} bg-opacity-10`}>
                      {getDeviceIcon(visitor.device)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {visitor.city}, {visitor.country}
                      </div>
                      <div className="text-sm text-gray-600">
                        {visitor.browser} on {visitor.os}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDuration(visitor.duration)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatTime(visitor.timestamp)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {visitor.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {visitor.referrer}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Geographic Distribution</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {visitors
              .reduce((acc, visitor) => {
                const existing = acc.find(item => item.country === visitor.country);
                if (existing) {
                  existing.count++;
                } else {
                  acc.push({ country: visitor.country, count: 1 });
                }
                return acc;
              }, [] as { country: string; count: number }[])
              .sort((a, b) => b.count - a.count)
              .slice(0, 5)
              .map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="font-medium">{item.country}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(item.count / Math.max(...visitors.reduce((acc, visitor) => {
                          const existing = acc.find(item => item.country === visitor.country);
                          if (existing) {
                            existing.count++;
                          } else {
                            acc.push({ country: visitor.country, count: 1 });
                          }
                          return acc;
                        }, [] as { country: string; count: number }[]).map(item => item.count))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{item.count}</span>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Last Update */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default RealTimeTracking;
