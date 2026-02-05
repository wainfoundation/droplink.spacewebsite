import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Eye, 
  Share2, 
  Copy,
  RefreshCw,
  User,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const TestPublicProfile: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<any>({});

  // Test profile loading
  useEffect(() => {
    const testProfileLoading = async () => {
      if (!username) {
        setError('No username provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        setTestResults({});

        console.log('🔍 Testing profile loading for username:', username);

        // Test 1: Check if profile exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) {
          console.error('❌ Profile loading error:', profileError);
          setTestResults(prev => ({
            ...prev,
            profileExists: false,
            profileError: profileError.message
          }));
          
          if (profileError.code === 'PGRST116') {
            setError('Profile not found');
          } else {
            setError(`Profile loading failed: ${profileError.message}`);
          }
          setIsLoading(false);
          return;
        }

        console.log('✅ Profile found:', profileData);
        setProfile(profileData);
        setTestResults(prev => ({
          ...prev,
          profileExists: true,
          profileData: profileData
        }));

        // Test 2: Check if links exist
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', profileData.id)
          .eq('is_active', true)
          .order('position');

        if (linksError) {
          console.error('❌ Links loading error:', linksError);
          setTestResults(prev => ({
            ...prev,
            linksError: linksError.message
          }));
        } else {
          console.log('✅ Links found:', linksData);
          setLinks(linksData || []);
          setTestResults(prev => ({
            ...prev,
            linksCount: linksData?.length || 0,
            linksData: linksData
          }));
        }

        // Test 3: Check database connection
        const { data: connectionTest, error: connectionError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1);

        setTestResults(prev => ({
          ...prev,
          databaseConnected: !connectionError,
          connectionError: connectionError?.message
        }));

        console.log('✅ All tests completed');

      } catch (err) {
        console.error('❌ Test failed:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        setTestResults(prev => ({
          ...prev,
          generalError: errorMessage
        }));
      } finally {
        setIsLoading(false);
      }
    };

    testProfileLoading();
  }, [username]);

  const copyProfileUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied!",
        description: "Profile URL copied to clipboard.",
      });
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
        <div className="text-center text-white">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Testing profile loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Public Profile Test</h1>
          <p className="text-white/80">Testing profile: @{username}</p>
        </div>

        {/* Test Results */}
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Test Results
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {testResults.profileExists ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span>Profile Exists</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {testResults.databaseConnected ? (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span>Database Connected</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Links Count: {testResults.linksCount || 0}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {testResults.profileError && (
                  <div className="text-sm text-red-300">
                    <strong>Profile Error:</strong> {testResults.profileError}
                  </div>
                )}
                {testResults.linksError && (
                  <div className="text-sm text-red-300">
                    <strong>Links Error:</strong> {testResults.linksError}
                  </div>
                )}
                {testResults.connectionError && (
                  <div className="text-sm text-red-300">
                    <strong>Connection Error:</strong> {testResults.connectionError}
                  </div>
                )}
                {testResults.generalError && (
                  <div className="text-sm text-red-300">
                    <strong>General Error:</strong> {testResults.generalError}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Display */}
        {profile && (
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <User className="w-5 h-5 mr-2" />
                Profile Data
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.display_name || profile.username}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {(profile.display_name || profile.username || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        {profile.display_name || profile.username}
                      </h3>
                      <p className="text-white/80">@{profile.username}</p>
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-white/90 mb-4">{profile.bio}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div><strong>ID:</strong> {profile.id}</div>
                  <div><strong>Username:</strong> {profile.username}</div>
                  <div><strong>Display Name:</strong> {profile.display_name || 'Not set'}</div>
                  <div><strong>Bio:</strong> {profile.bio || 'Not set'}</div>
                  <div><strong>Avatar:</strong> {profile.avatar_url ? 'Set' : 'Not set'}</div>
                  <div><strong>Created:</strong> {new Date(profile.created_at).toLocaleDateString()}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Links Display */}
        {links.length > 0 && (
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <LinkIcon className="w-5 h-5 mr-2" />
                Links ({links.length})
              </h2>
              
              <div className="space-y-3">
                {links.map((link, index) => (
                  <div key={link.id} className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg">
                    <span className="text-2xl">{link.icon || '🔗'}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold">{link.title}</h3>
                      {link.description && (
                        <p className="text-sm text-white/70">{link.description}</p>
                      )}
                      <p className="text-xs text-white/60">{link.url}</p>
                    </div>
                    <Button
                      onClick={() => window.open(link.url, '_blank')}
                      size="sm"
                      className="bg-white/20 hover:bg-white/30"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Display */}
        {error && (
          <Card className="bg-red-500/20 border-red-500/30 backdrop-blur-sm mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center text-red-200">
                <XCircle className="w-5 h-5 mr-2" />
                Error
              </h2>
              <p className="text-red-200">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => window.location.reload()}
            className="bg-white/20 hover:bg-white/30"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Test
          </Button>
          <Button
            onClick={copyProfileUrl}
            className="bg-white/20 hover:bg-white/30"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy URL
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestPublicProfile;
