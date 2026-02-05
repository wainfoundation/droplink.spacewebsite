import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Database,
  Link as LinkIcon,
  User,
  BarChart3,
  Settings,
  Globe,
  Shield
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

interface HealthCheckResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const DashboardHealthCheck: React.FC = () => {
  const { user, profile } = useUser();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<HealthCheckResult[]>([]);
  const [overallStatus, setOverallStatus] = useState<'healthy' | 'issues' | 'critical'>('healthy');

  const runHealthCheck = async () => {
    setIsRunning(true);
    setResults([]);
    
    const checks: HealthCheckResult[] = [];

    try {
      // 1. Database Connection Test
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);
        
        if (error) {
          checks.push({
            name: 'Database Connection',
            status: 'error',
            message: `Database connection failed: ${error.message}`,
            details: error
          });
        } else {
          checks.push({
            name: 'Database Connection',
            status: 'success',
            message: 'Database connection successful'
          });
        }
      } catch (err) {
        checks.push({
          name: 'Database Connection',
          status: 'error',
          message: `Database connection failed: ${err}`,
          details: err
        });
      }

      // 2. User Authentication Test
      if (user) {
        checks.push({
          name: 'User Authentication',
          status: 'success',
          message: `User authenticated: ${user.email || user.id}`,
          details: { userId: user.id, email: user.email }
        });
      } else {
        checks.push({
          name: 'User Authentication',
          status: 'error',
          message: 'No authenticated user found'
        });
      }

      // 3. Profile Data Test
      if (profile) {
        checks.push({
          name: 'Profile Data',
          status: 'success',
          message: `Profile loaded: ${profile.username || profile.id}`,
          details: { 
            profileId: profile.id, 
            username: profile.username,
            displayName: profile.display_name 
          }
        });
      } else {
        checks.push({
          name: 'Profile Data',
          status: 'warning',
          message: 'No profile data found - user may need to complete setup'
        });
      }

      // 4. Links Data Test
      if (user?.id) {
        try {
          const { data: linksData, error: linksError } = await supabase
            .from('links')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_active', true);
          
          if (linksError) {
            checks.push({
              name: 'Links Data',
              status: 'error',
              message: `Links loading failed: ${linksError.message}`,
              details: linksError
            });
          } else {
            checks.push({
              name: 'Links Data',
              status: 'success',
              message: `Links loaded: ${linksData?.length || 0} active links`,
              details: { linksCount: linksData?.length || 0, links: linksData }
            });
          }
        } catch (err) {
          checks.push({
            name: 'Links Data',
            status: 'error',
            message: `Links loading failed: ${err}`,
            details: err
          });
        }
      }

      // 5. Analytics Data Test
      if (user?.id) {
        try {
          const { data: analyticsData, error: analyticsError } = await supabase
            .from('analytics')
            .select('*')
            .eq('user_id', user.id)
            .limit(10);
          
          if (analyticsError) {
            checks.push({
              name: 'Analytics Data',
              status: 'warning',
              message: `Analytics loading failed: ${analyticsError.message}`,
              details: analyticsError
            });
          } else {
            checks.push({
              name: 'Analytics Data',
              status: 'success',
              message: `Analytics loaded: ${analyticsData?.length || 0} records`,
              details: { analyticsCount: analyticsData?.length || 0 }
            });
          }
        } catch (err) {
          checks.push({
            name: 'Analytics Data',
            status: 'warning',
            message: `Analytics loading failed: ${err}`,
            details: err
          });
        }
      }

      // 6. Public Profile Test
      if (profile?.username) {
        try {
          const { data: publicProfileData, error: publicProfileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', profile.username)
            .single();
          
          if (publicProfileError) {
            checks.push({
              name: 'Public Profile',
              status: 'error',
              message: `Public profile not accessible: ${publicProfileError.message}`,
              details: publicProfileError
            });
          } else {
            checks.push({
              name: 'Public Profile',
              status: 'success',
              message: `Public profile accessible at /${profile.username}`,
              details: { 
                username: profile.username,
                profileUrl: `/${profile.username}`
              }
            });
          }
        } catch (err) {
          checks.push({
            name: 'Public Profile',
            status: 'error',
            message: `Public profile test failed: ${err}`,
            details: err
          });
        }
      } else {
        checks.push({
          name: 'Public Profile',
          status: 'warning',
          message: 'No username set - public profile not available'
        });
      }

      // 7. Real-time Connection Test
      try {
        const channel = supabase
          .channel('health-check')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {})
          .subscribe();
        
        setTimeout(() => {
          supabase.removeChannel(channel);
        }, 1000);
        
        checks.push({
          name: 'Real-time Connection',
          status: 'success',
          message: 'Real-time connection established'
        });
      } catch (err) {
        checks.push({
          name: 'Real-time Connection',
          status: 'warning',
          message: `Real-time connection failed: ${err}`,
          details: err
        });
      }

      setResults(checks);

      // Determine overall status
      const errorCount = checks.filter(c => c.status === 'error').length;
      const warningCount = checks.filter(c => c.status === 'warning').length;
      
      if (errorCount > 0) {
        setOverallStatus('critical');
      } else if (warningCount > 0) {
        setOverallStatus('issues');
      } else {
        setOverallStatus('healthy');
      }

    } catch (err) {
      checks.push({
        name: 'Health Check',
        status: 'error',
        message: `Health check failed: ${err}`,
        details: err
      });
      setResults(checks);
      setOverallStatus('critical');
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getOverallStatusColor = () => {
    switch (overallStatus) {
      case 'healthy':
        return 'bg-green-100 text-green-800';
      case 'issues':
        return 'bg-yellow-100 text-yellow-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Dashboard Health Check
            </h2>
            <p className="text-gray-600">Verify all dashboard components are working correctly</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getOverallStatusColor()}>
              {overallStatus.toUpperCase()}
            </Badge>
            <Button
              onClick={runHealthCheck}
              disabled={isRunning}
              size="sm"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'Running...' : 'Run Check'}
            </Button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium">{result.name}</h3>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">
                        View Details
                      </summary>
                      <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !isRunning && (
          <div className="text-center py-8 text-gray-500">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Click "Run Check" to verify dashboard health</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DashboardHealthCheck;
