// Real-time Test Page
// Demonstrates real-time updates between dashboard and public profile

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ExternalLink,
  Eye,
  EyeOff,
  Play,
  Pause
} from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

const RealtimeTest: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [testUsername, setTestUsername] = useState('testuser_demo');
  const [showPublicProfile, setShowPublicProfile] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);

  // Dashboard data with real-time updates
  const {
    isLoading,
    isConnected,
    isRealtimeConnected,
    lastUpdate,
    updateCount,
    dashboardData,
    updateProfile,
    createLink,
    updateLink,
    deleteLink,
    refreshData
  } = useDashboardData(user?.id);

  // Test functions
  const runRealtimeTest = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Please log in to run the test",
        variant: "destructive",
      });
      return;
    }

    setIsTestRunning(true);
    
    try {
      // Test 1: Update profile
      toast({
        title: "Test 1: Profile Update",
        description: "Updating profile bio...",
      });
      
      await updateProfile({
        bio: `Real-time test bio - ${new Date().toLocaleTimeString()}`,
        display_name: `Test User ${Math.floor(Math.random() * 1000)}`
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test 2: Add a link
      toast({
        title: "Test 2: Add Link",
        description: "Adding a new link...",
      });
      
      await createLink({
        title: `Test Link ${Math.floor(Math.random() * 1000)}`,
        url: 'https://example.com',
        description: 'Real-time test link',
        icon: '🔗',
        type: 'link'
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Test 3: Update a link
      if (dashboardData?.links?.length > 0) {
        toast({
          title: "Test 3: Update Link",
          description: "Updating existing link...",
        });
        
        const firstLink = dashboardData.links[0];
        await updateLink(firstLink.id, {
          title: `Updated ${firstLink.title} - ${new Date().toLocaleTimeString()}`
        });
      }

      toast({
        title: "Test Complete!",
        description: "Real-time test completed successfully. Check the public profile!",
      });

    } catch (error) {
      toast({
        title: "Test Failed",
        description: "Real-time test failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestRunning(false);
    }
  };

  const openPublicProfile = () => {
    const url = `/${testUsername}`;
    window.open(url, '_blank');
    setShowPublicProfile(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <Helmet>
        <title>Real-time Test - Droplink</title>
        <meta name="description" content="Test real-time updates in Droplink" />
      </Helmet>

      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔄 Real-time Updates Test
          </h1>
          <p className="text-gray-600">
            Test real-time synchronization between dashboard and public profile
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dashboard Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Dashboard Status</span>
                {isRealtimeConnected ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <Wifi className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Offline
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Connection Status</p>
                  <p className={`font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Real-time Updates</p>
                  <p className={`font-medium ${isRealtimeConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {isRealtimeConnected ? 'Active' : 'Inactive'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Update Count</p>
                  <p className="font-medium text-blue-600">{updateCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Update</p>
                  <p className="font-medium text-gray-900">
                    {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Current Data</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Profile:</strong> {dashboardData?.profile?.display_name || 'Loading...'}</p>
                  <p><strong>Bio:</strong> {dashboardData?.profile?.bio || 'No bio'}</p>
                  <p><strong>Links:</strong> {dashboardData?.links?.length || 0} links</p>
                  <p><strong>Analytics:</strong> {dashboardData?.analytics?.total_views || 0} views</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Test Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Test Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Username
                </label>
                <Input
                  value={testUsername}
                  onChange={(e) => setTestUsername(e.target.value)}
                  placeholder="Enter username for public profile"
                />
              </div>

              <div className="space-y-2">
                <Button
                  onClick={runRealtimeTest}
                  disabled={isTestRunning || !isConnected}
                  className="w-full"
                >
                  {isTestRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Running Test...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Real-time Test
                    </>
                  )}
                </Button>

                <Button
                  onClick={openPublicProfile}
                  variant="outline"
                  className="w-full"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Public Profile
                </Button>

                <Button
                  onClick={refreshData}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </Button>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Test Instructions</h4>
                <ol className="text-sm text-gray-600 space-y-1">
                  <li>1. Click "Run Real-time Test"</li>
                  <li>2. Open "Public Profile" in new tab</li>
                  <li>3. Watch changes appear instantly</li>
                  <li>4. Try editing in dashboard</li>
                  <li>5. See updates in real-time</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Real-time Updates Log */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>Real-time Updates Log</span>
              {updateCount > 0 && (
                <Badge variant="outline">{updateCount} updates</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
              {updateCount === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No real-time updates yet. Run the test to see updates here.
                </p>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span>Real-time connection active</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Last update: {lastUpdate?.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Total updates: {updateCount}</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>How Real-time Updates Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Dashboard Side</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Changes are saved to Supabase</li>
                  <li>• Real-time subscriptions listen for changes</li>
                  <li>• UI updates instantly without refresh</li>
                  <li>• Analytics are tracked in real-time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Public Profile Side</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Subscribes to profile and link changes</li>
                  <li>• Updates appear instantly for visitors</li>
                  <li>• No page refresh needed</li>
                  <li>• Works like Linktree/Beacons</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RealtimeTest;
