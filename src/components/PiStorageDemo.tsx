/**
 * Pi Storage Demo Component
 * Demonstrates Pi storage functionality with various operations
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  usePiStorageKey, 
  useUserProfile, 
  useUserPreferences, 
  useAuthToken, 
  usePaymentHistory,
  useAppSettings,
  useCacheData,
  useTempData,
  useStorageManagement,
  usePiStorageUtils
} from '@/hooks/usePiStorage';
import { PiStorageUtils } from '@/utils/pi-storage';

export default function PiStorageDemo() {
  const [customKey, setCustomKey] = useState('demo_key');
  const [customValue, setCustomValue] = useState('demo_value');
  const [cacheKey, setCacheKey] = useState('demo_cache');
  const [cacheValue, setCacheValue] = useState('cached_data');
  const [tempKey, setTempKey] = useState('demo_temp');
  const [tempValue, setTempValue] = useState('temp_data');

  // Storage hooks
  const customStorage = usePiStorageKey(customKey);
  const userProfile = useUserProfile();
  const userPreferences = useUserPreferences();
  const authToken = useAuthToken();
  const paymentHistory = usePaymentHistory();
  const appSettings = useAppSettings();
  const cacheData = useCacheData(cacheKey);
  const tempData = useTempData(tempKey);
  const storageManagement = useStorageManagement();
  const storageUtils = usePiStorageUtils();

  // Sample data
  const sampleProfile = {
    username: 'demo_user',
    email: 'demo@example.com',
    avatar: 'https://via.placeholder.com/150',
    bio: 'Demo user for Pi storage testing',
    createdAt: new Date().toISOString(),
  };

  const samplePreferences = {
    theme: 'dark',
    language: 'en',
    notifications: true,
    autoSave: true,
    privacy: 'public',
  };

  const samplePaymentHistory = [
    { id: '1', amount: 10, currency: 'PI', status: 'completed', date: new Date().toISOString() },
    { id: '2', amount: 5, currency: 'PI', status: 'pending', date: new Date().toISOString() },
  ];

  const sampleAppSettings = {
    version: '1.0.0',
    environment: 'production',
    features: ['storage', 'payments', 'auth'],
    config: { maxStorageSize: '10MB', encryption: true },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Pi Storage Demo</h1>
        <p className="text-muted-foreground">
          Demonstrating Pi Network storage capabilities with secure data persistence
        </p>
      </div>

      {/* Storage Management Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Management</CardTitle>
          <CardDescription>
            Current storage status and management operations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{storageManagement.size}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{storageManagement.keys.length}</div>
              <div className="text-sm text-muted-foreground">Storage Keys</div>
            </div>
            <div className="text-center">
              <Badge variant={storageManagement.loading ? 'secondary' : 'default'}>
                {storageManagement.loading ? 'Loading...' : 'Ready'}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={storageManagement.refreshStorageInfo}
              disabled={storageManagement.loading}
              variant="outline"
            >
              Refresh
            </Button>
            <Button 
              onClick={storageManagement.cleanup}
              disabled={storageManagement.loading}
              variant="destructive"
            >
              Cleanup Expired
            </Button>
          </div>

          {storageManagement.keys.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Storage Keys:</h4>
              <div className="flex flex-wrap gap-2">
                {storageManagement.keys.map(key => (
                  <Badge key={key} variant="outline">{key}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Storage</CardTitle>
          <CardDescription>
            Store and retrieve custom data with any key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Storage Key</label>
              <Input
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                placeholder="Enter storage key"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Value</label>
              <Input
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                placeholder="Enter value"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => customStorage.setData(customValue)}
              disabled={customStorage.loading}
            >
              Store Data
            </Button>
            <Button 
              onClick={customStorage.refresh}
              disabled={customStorage.loading}
              variant="outline"
            >
              Load Data
            </Button>
            <Button 
              onClick={customStorage.removeData}
              disabled={customStorage.loading}
              variant="destructive"
            >
              Remove
            </Button>
          </div>

          {customStorage.data && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Stored Data:</h4>
              <pre className="text-sm">{JSON.stringify(customStorage.data, null, 2)}</pre>
            </div>
          )}

          {customStorage.error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              Error: {customStorage.error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Profile Storage */}
      <Card>
        <CardHeader>
          <CardTitle>User Profile Storage</CardTitle>
          <CardDescription>
            Secure storage for user profile data with encryption
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => userProfile.setData(sampleProfile, { encrypted: true })}
              disabled={userProfile.loading}
            >
              Store Sample Profile
            </Button>
            <Button 
              onClick={userProfile.refresh}
              disabled={userProfile.loading}
              variant="outline"
            >
              Load Profile
            </Button>
            <Button 
              onClick={userProfile.removeData}
              disabled={userProfile.loading}
              variant="destructive"
            >
              Clear Profile
            </Button>
          </div>

          {userProfile.data && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">User Profile:</h4>
              <pre className="text-sm">{JSON.stringify(userProfile.data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Preferences Storage */}
      <Card>
        <CardHeader>
          <CardTitle>User Preferences</CardTitle>
          <CardDescription>
            Store user preferences with auto-sync across devices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => userPreferences.setData(samplePreferences, { sync: true })}
              disabled={userPreferences.loading}
            >
              Store Preferences
            </Button>
            <Button 
              onClick={userPreferences.refresh}
              disabled={userPreferences.loading}
              variant="outline"
            >
              Load Preferences
            </Button>
            <Button 
              onClick={userPreferences.removeData}
              disabled={userPreferences.loading}
              variant="destructive"
            >
              Clear Preferences
            </Button>
          </div>

          {userPreferences.data && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">User Preferences:</h4>
              <pre className="text-sm">{JSON.stringify(userPreferences.data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Auth Token Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Auth Token Storage</CardTitle>
          <CardDescription>
            Secure storage for authentication tokens with TTL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => authToken.setData('sample_auth_token_12345', { 
                encrypted: true, 
                ttl: 24 * 60 * 60 * 1000 // 24 hours
              })}
              disabled={authToken.loading}
            >
              Store Auth Token
            </Button>
            <Button 
              onClick={authToken.refresh}
              disabled={authToken.loading}
              variant="outline"
            >
              Load Token
            </Button>
            <Button 
              onClick={authToken.removeData}
              disabled={authToken.loading}
              variant="destructive"
            >
              Clear Token
            </Button>
          </div>

          {authToken.data && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Auth Token:</h4>
              <code className="text-sm bg-background p-2 rounded">{authToken.data}</code>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment History Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>
            Store payment history with encryption and sync
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => paymentHistory.setData(samplePaymentHistory, { 
                encrypted: true, 
                sync: true 
              })}
              disabled={paymentHistory.loading}
            >
              Store Payment History
            </Button>
            <Button 
              onClick={paymentHistory.refresh}
              disabled={paymentHistory.loading}
              variant="outline"
            >
              Load History
            </Button>
            <Button 
              onClick={paymentHistory.removeData}
              disabled={paymentHistory.loading}
              variant="destructive"
            >
              Clear History
            </Button>
          </div>

          {paymentHistory.data && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Payment History:</h4>
              <pre className="text-sm">{JSON.stringify(paymentHistory.data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* App Settings Storage */}
      <Card>
        <CardHeader>
          <CardTitle>App Settings</CardTitle>
          <CardDescription>
            Store application settings and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              onClick={() => appSettings.setData(sampleAppSettings, { sync: true })}
              disabled={appSettings.loading}
            >
              Store App Settings
            </Button>
            <Button 
              onClick={appSettings.refresh}
              disabled={appSettings.loading}
              variant="outline"
            >
              Load Settings
            </Button>
            <Button 
              onClick={appSettings.removeData}
              disabled={appSettings.loading}
              variant="destructive"
            >
              Clear Settings
            </Button>
          </div>

          {appSettings.data && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">App Settings:</h4>
              <pre className="text-sm">{JSON.stringify(appSettings.data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cache Data Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Data Storage</CardTitle>
          <CardDescription>
            Store cache data with automatic expiration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Cache Key</label>
              <Input
                value={cacheKey}
                onChange={(e) => setCacheKey(e.target.value)}
                placeholder="Enter cache key"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cache Value</label>
              <Input
                value={cacheValue}
                onChange={(e) => setCacheValue(e.target.value)}
                placeholder="Enter cache value"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => cacheData.setData(cacheValue, { ttl: 5 * 60 * 1000 })}
              disabled={cacheData.loading}
            >
              Store Cache (5min TTL)
            </Button>
            <Button 
              onClick={cacheData.refresh}
              disabled={cacheData.loading}
              variant="outline"
            >
              Load Cache
            </Button>
            <Button 
              onClick={cacheData.removeData}
              disabled={cacheData.loading}
              variant="destructive"
            >
              Clear Cache
            </Button>
          </div>

          {cacheData.data && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Cache Data:</h4>
              <pre className="text-sm">{JSON.stringify(cacheData.data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Temporary Data Storage */}
      <Card>
        <CardHeader>
          <CardTitle>Temporary Data Storage</CardTitle>
          <CardDescription>
            Store temporary data with short TTL (1 hour)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Temp Key</label>
              <Input
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Enter temp key"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Temp Value</label>
              <Input
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder="Enter temp value"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => tempData.setData(tempValue, { ttl: 60 * 60 * 1000 })}
              disabled={tempData.loading}
            >
              Store Temp Data (1hr TTL)
            </Button>
            <Button 
              onClick={tempData.refresh}
              disabled={tempData.loading}
              variant="outline"
            >
              Load Temp Data
            </Button>
            <Button 
              onClick={tempData.removeData}
              disabled={tempData.loading}
              variant="destructive"
            >
              Clear Temp Data
            </Button>
          </div>

          {tempData.data && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Temporary Data:</h4>
              <pre className="text-sm">{JSON.stringify(tempData.data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Storage Utilities */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Utilities</CardTitle>
          <CardDescription>
            Advanced storage operations and utilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={async () => {
                const result = await storageUtils.storeUserProfile(sampleProfile);
                console.log('Store user profile result:', result);
              }}
              variant="outline"
            >
              Store User Profile (Utils)
            </Button>
            <Button 
              onClick={async () => {
                const result = await storageUtils.getUserProfile();
                console.log('Get user profile result:', result);
              }}
              variant="outline"
            >
              Get User Profile (Utils)
            </Button>
            <Button 
              onClick={async () => {
                const result = await storageUtils.clearUserData();
                console.log('Clear user data result:', result);
              }}
              variant="destructive"
            >
              Clear All User Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {(userProfile.error || userPreferences.error || authToken.error || 
        paymentHistory.error || appSettings.error || cacheData.error || 
        tempData.error || storageManagement.error) && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Storage Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userProfile.error && <div className="text-sm text-destructive">User Profile: {userProfile.error}</div>}
              {userPreferences.error && <div className="text-sm text-destructive">User Preferences: {userPreferences.error}</div>}
              {authToken.error && <div className="text-sm text-destructive">Auth Token: {authToken.error}</div>}
              {paymentHistory.error && <div className="text-sm text-destructive">Payment History: {paymentHistory.error}</div>}
              {appSettings.error && <div className="text-sm text-destructive">App Settings: {appSettings.error}</div>}
              {cacheData.error && <div className="text-sm text-destructive">Cache Data: {cacheData.error}</div>}
              {tempData.error && <div className="text-sm text-destructive">Temp Data: {tempData.error}</div>}
              {storageManagement.error && <div className="text-sm text-destructive">Storage Management: {storageManagement.error}</div>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
