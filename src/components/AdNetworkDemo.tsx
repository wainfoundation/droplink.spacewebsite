/**
 * Ad Network Demo Component
 * Demonstrates Pi Network ad network functionality with testing features
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { 
  Play, 
  Eye, 
  Settings, 
  BarChart3, 
  TestTube, 
  Shield, 
  Clock,
  RefreshCw,
  SkipForward
} from 'lucide-react';
import { useAdNetworkAccess } from '@/hooks/useAdNetworkAccess';
import AdNetworkModal from './AdNetworkModal';
import { usePiAuth } from '@/hooks/usePiAuth';

export default function AdNetworkDemo() {
  const { currentUser, isAuthenticated } = usePiAuth();
  const [showTestModal, setShowTestModal] = useState(false);
  const [testConfig, setTestConfig] = useState({
    enabled: true,
    frequency: 'session' as const,
    adType: 'interstitial' as const,
    skipEnabled: true,
    skipAfterSeconds: 5,
    protectedRoutes: ['/dashboard', '/home', '/profile', '/tools']
  });

  const {
    showAdModal,
    handleAdComplete,
    resetSessionAdState,
    forceShowAd,
    skipAdRequirement,
    adStats,
    config,
    isProtectedRoute
  } = useAdNetworkAccess(testConfig);

  const [currentTestRoute, setCurrentTestRoute] = useState('/dashboard');

  // Test route access
  const testRouteAccess = async (route: string) => {
    setCurrentTestRoute(route);
    const isProtected = isProtectedRoute(route);
    console.log(`Route ${route} is protected:`, isProtected);
  };

  // Handle test ad completion
  const handleTestAdComplete = async (success: boolean) => {
    await handleAdComplete(success);
    setShowTestModal(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pi Network Ad Network Demo</h1>
        <p className="text-muted-foreground">
          Test and configure Pi Network ad network integration
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="testing">Testing</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Ad Network Status
              </CardTitle>
              <CardDescription>
                Current ad network configuration and status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{adStats.totalAdsWatched}</div>
                  <div className="text-sm text-blue-800">Total Ads Watched</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {adStats.sessionAdWatched ? 'Yes' : 'No'}
                  </div>
                  <div className="text-sm text-green-800">Session Ad Watched</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {adStats.daysSinceLastAd || 'N/A'}
                  </div>
                  <div className="text-sm text-purple-800">Days Since Last Ad</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-semibold">Current Configuration</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Enabled:</span>
                    <Badge variant={config.enabled ? "default" : "secondary"} className="ml-2">
                      {config.enabled ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Frequency:</span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {config.frequency}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Ad Type:</span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {config.adType}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Skip Enabled:</span>
                    <Badge variant={config.skipEnabled ? "default" : "secondary"} className="ml-2">
                      {config.skipEnabled ? "Yes" : "No"}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testing Tab */}
        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5" />
                Ad Network Testing
              </CardTitle>
              <CardDescription>
                Test ad network functionality and route protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Authentication Status */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-2">Authentication Status</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={isAuthenticated ? "default" : "destructive"}>
                    {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                  {currentUser && (
                    <span className="text-sm text-gray-600">
                      as {currentUser.username || currentUser.uid}
                    </span>
                  )}
                </div>
              </div>

              {/* Route Testing */}
              <div className="space-y-3">
                <h4 className="font-semibold">Route Testing</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['/dashboard', '/home', '/profile', '/tools', '/public', '/about'].map(route => (
                    <Button
                      key={route}
                      variant="outline"
                      size="sm"
                      onClick={() => testRouteAccess(route)}
                      className="justify-start"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {route}
                      {isProtectedRoute(route) && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          Protected
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  Current test route: <code className="bg-gray-100 px-1 rounded">{currentTestRoute}</code>
                </div>
              </div>

              <Separator />

              {/* Ad Testing */}
              <div className="space-y-3">
                <h4 className="font-semibold">Ad Testing</h4>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    onClick={() => setShowTestModal(true)}
                    className="flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Show Test Ad Modal
                  </Button>
                  <Button
                    onClick={forceShowAd}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Force Show Ad
                  </Button>
                  <Button
                    onClick={resetSessionAdState}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset Session
                  </Button>
                  <Button
                    onClick={skipAdRequirement}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip Ad Requirement
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Ad Network Configuration
              </CardTitle>
              <CardDescription>
                Configure ad network settings and behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Enable/Disable */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Ad Network</Label>
                  <div className="text-sm text-muted-foreground">
                    Enable or disable ad network functionality
                  </div>
                </div>
                <Switch
                  checked={testConfig.enabled}
                  onCheckedChange={(checked) => 
                    setTestConfig(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>

              <Separator />

              {/* Frequency */}
              <div className="space-y-2">
                <Label>Ad Frequency</Label>
                <Select
                  value={testConfig.frequency}
                  onValueChange={(value: any) => 
                    setTestConfig(prev => ({ ...prev, frequency: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="session">Per Session</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  How often users need to watch ads
                </div>
              </div>

              {/* Ad Type */}
              <div className="space-y-2">
                <Label>Ad Type</Label>
                <Select
                  value={testConfig.adType}
                  onValueChange={(value: any) => 
                    setTestConfig(prev => ({ ...prev, adType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="interstitial">Interstitial</SelectItem>
                    <SelectItem value="rewarded">Rewarded</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-muted-foreground">
                  Type of ad to display
                </div>
              </div>

              <Separator />

              {/* Skip Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Skip</Label>
                    <div className="text-sm text-muted-foreground">
                      Allow users to skip ads after a delay
                    </div>
                  </div>
                  <Switch
                    checked={testConfig.skipEnabled}
                    onCheckedChange={(checked) => 
                      setTestConfig(prev => ({ ...prev, skipEnabled: checked }))
                    }
                  />
                </div>

                {testConfig.skipEnabled && (
                  <div className="space-y-2">
                    <Label>Skip After (seconds)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="60"
                      value={testConfig.skipAfterSeconds}
                      onChange={(e) => 
                        setTestConfig(prev => ({ 
                          ...prev, 
                          skipAfterSeconds: parseInt(e.target.value) || 0 
                        }))
                      }
                    />
                    <div className="text-sm text-muted-foreground">
                      Number of seconds before skip becomes available
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Protected Routes */}
              <div className="space-y-2">
                <Label>Protected Routes</Label>
                <div className="text-sm text-muted-foreground mb-2">
                  Routes that require ad viewing to access
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {['/dashboard', '/home', '/profile', '/tools'].map(route => (
                    <div key={route} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={route}
                        checked={testConfig.protectedRoutes.includes(route)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setTestConfig(prev => ({
                              ...prev,
                              protectedRoutes: [...prev.protectedRoutes, route]
                            }));
                          } else {
                            setTestConfig(prev => ({
                              ...prev,
                              protectedRoutes: prev.protectedRoutes.filter(r => r !== route)
                            }));
                          }
                        }}
                      />
                      <label htmlFor={route} className="text-sm">{route}</label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Ad Network Statistics
              </CardTitle>
              <CardDescription>
                Detailed statistics about ad network usage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-900">Total Ads Watched</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">{adStats.totalAdsWatched}</div>
                  <div className="text-sm text-blue-700">Lifetime total</div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-green-600" />
                    <span className="font-semibold text-green-900">Last Ad Watched</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {adStats.lastAdWatched ? 
                      adStats.lastAdWatched.toLocaleDateString() : 
                      'Never'
                    }
                  </div>
                  <div className="text-sm text-green-700">
                    {adStats.daysSinceLastAd !== null ? 
                      `${adStats.daysSinceLastAd} days ago` : 
                      'No previous ads'
                    }
                  </div>
                </div>
              </div>

              <Separator />

              {/* Session Status */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-2">Current Session</h4>
                <div className="flex items-center gap-2">
                  <Badge variant={adStats.sessionAdWatched ? "default" : "secondary"}>
                    {adStats.sessionAdWatched ? "Ad Watched" : "Ad Required"}
                  </Badge>
                  <span className="text-sm text-purple-700">
                    {adStats.sessionAdWatched ? 
                      "You can access protected content" : 
                      "Watch an ad to access protected content"
                    }
                  </span>
                </div>
              </div>

              {/* Configuration Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Current Configuration</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Frequency:</span>
                    <span className="ml-2 capitalize">{config.frequency}</span>
                  </div>
                  <div>
                    <span className="font-medium">Ad Type:</span>
                    <span className="ml-2 capitalize">{config.adType}</span>
                  </div>
                  <div>
                    <span className="font-medium">Skip Enabled:</span>
                    <span className="ml-2">{config.skipEnabled ? "Yes" : "No"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Skip After:</span>
                    <span className="ml-2">{config.skipAfterSeconds}s</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Test Ad Modal */}
      <AdNetworkModal
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
        onAdComplete={handleTestAdComplete}
        title="Test Ad Network Modal"
        description="This is a test ad modal for demonstration purposes"
        adType={testConfig.adType}
        skipEnabled={testConfig.skipEnabled}
        skipAfterSeconds={testConfig.skipAfterSeconds}
      />
    </div>
  );
}
