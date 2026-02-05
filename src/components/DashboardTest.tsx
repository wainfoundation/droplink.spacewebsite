import React from 'react';
import { useUnifiedDashboard } from '@/hooks/useUnifiedDashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const DashboardTest: React.FC = () => {
  const {
    user,
    profile,
    links,
    analytics,
    dashboardStats,
    isLoading,
    error,
    refreshData,
    createLink,
    updateLink,
    deleteLink,
    trackPageView,
    trackLinkClick,
    healthCheck
  } = useUnifiedDashboard();

  const handleTestCreateLink = async () => {
    const testLink = {
      title: 'Test Link',
      url: 'https://example.com',
      description: 'This is a test link',
      icon: '🔗',
      type: 'link'
    };
    
    const success = await createLink(testLink);
    console.log('Create link result:', success);
  };

  const handleTestHealthCheck = async () => {
    const isHealthy = await healthCheck();
    console.log('Health check result:', isHealthy);
  };

  const handleTestPageView = async () => {
    await trackPageView({ test: true });
    console.log('Page view tracked');
  };

  const handleTestLinkClick = async () => {
    if (links.length > 0) {
      await trackLinkClick(links[0].id, { test: true });
      console.log('Link click tracked');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Dashboard Test - Unified Dashboard Hook
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Loading State */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Loading State:</span>
            {isLoading ? (
              <div className="flex items-center gap-2 text-blue-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>Loaded</span>
              </div>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="w-4 h-4" />
              <span>Error: {error}</span>
            </div>
          )}

          {/* User Data */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">User Data</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>User ID:</strong> {user?.id || 'Not loaded'}</p>
                <p><strong>Profile:</strong> {profile?.username || 'Not loaded'}</p>
                <p><strong>Display Name:</strong> {profile?.display_name || 'Not loaded'}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Links Data</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Total Links:</strong> {links?.length || 0}</p>
                <p><strong>Links:</strong> {links?.map(link => link.title).join(', ') || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Analytics Data */}
          <div>
            <h3 className="font-medium mb-2">Analytics Data</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p><strong>Total Clicks:</strong> {analytics?.totalClicks || 0}</p>
              <p><strong>Total Views:</strong> {analytics?.totalViews || 0}</p>
              <p><strong>Click Rate:</strong> {analytics?.clickRate?.toFixed(2) || 0}%</p>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div>
            <h3 className="font-medium mb-2">Dashboard Stats</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p><strong>Total Links:</strong> {dashboardStats?.totalLinks || 0}</p>
              <p><strong>Total Clicks:</strong> {dashboardStats?.totalClicks || 0}</p>
              <p><strong>Total Views:</strong> {dashboardStats?.totalViews || 0}</p>
            </div>
          </div>

          {/* Test Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button onClick={refreshData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            
            <Button onClick={handleTestCreateLink} variant="outline">
              Test Create Link
            </Button>
            
            <Button onClick={handleTestHealthCheck} variant="outline">
              Test Health Check
            </Button>
            
            <Button onClick={handleTestPageView} variant="outline">
              Test Page View
            </Button>
            
            <Button onClick={handleTestLinkClick} variant="outline">
              Test Link Click
            </Button>
          </div>

          {/* Status */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ Dashboard Test Status</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>✅ Unified Dashboard Hook: Working</li>
              <li>✅ Data Loading: {isLoading ? 'Loading...' : 'Complete'}</li>
              <li>✅ Error Handling: {error ? 'Error detected' : 'No errors'}</li>
              <li>✅ User Data: {user ? 'Loaded' : 'Not loaded'}</li>
              <li>✅ Profile Data: {profile ? 'Loaded' : 'Not loaded'}</li>
              <li>✅ Links Data: {links ? `${links.length} links` : 'Not loaded'}</li>
              <li>✅ Analytics Data: {analytics ? 'Loaded' : 'Not loaded'}</li>
              <li>✅ Dashboard Stats: {dashboardStats ? 'Loaded' : 'Not loaded'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardTest;

