// Username Setup Page
// Allows users to choose and validate their username

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Globe,
  User,
  Link as LinkIcon
} from 'lucide-react';
import UsernameValidator from '@/components/profile/UsernameValidator';
import { usernameService } from '@/services/usernameService';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

const UsernameSetup: React.FC = () => {
  const { user, updateProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [username, setUsername] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleUsernameChange = (newUsername: string, isValidUsername: boolean) => {
    setUsername(newUsername);
    setIsValid(isValidUsername);
  };

  const handleUsernameSelect = (selectedUsername: string) => {
    setUsername(selectedUsername);
    setIsValid(true);
  };

  const handleSaveUsername = async () => {
    if (!user?.id || !username || !isValid) {
      toast({
        title: "Error",
        description: "Please select a valid username",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Update username in database
      await usernameService.updateUsername(user.id, username);
      
      // Update user profile
      await updateProfile({ username });
      
      toast({
        title: "Username Set!",
        description: `Your profile is now available at droplink.space/${username}`,
      });
      
      // Navigate to dashboard
      navigate('/dashboard-complete');
    } catch (error) {
      console.error('Username save failed:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : 'Failed to save username',
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const skipSetup = () => {
    navigate('/dashboard-complete');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center p-4">
      <Helmet>
        <title>Choose Your Username - Droplink</title>
        <meta name="description" content="Set up your Droplink username for your public profile" />
      </Helmet>

      <div className="w-full max-w-2xl">
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">
              Choose Your Username
            </CardTitle>
            <p className="text-white/80">
              This will be your public profile URL: <br />
              <span className="font-mono text-white">
                droplink.space/{username || 'username'}
              </span>
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <UsernameValidator
              onUsernameChange={handleUsernameChange}
              onUsernameSelect={handleUsernameSelect}
              excludeUserId={user?.id}
            />

            {/* Preview */}
            {username && (
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Globe className="w-4 h-4 text-white/60" />
                    <span className="text-sm font-medium text-white/80">Preview</span>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {user?.display_name || 'Your Name'}
                        </div>
                        <div className="text-white/60 text-sm">
                          @{username}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-white/60">
                      Your profile will be live at: <br />
                      <span className="font-mono text-white">
                        https://droplink.space/{username}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <LinkIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-white/80">Custom Links</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-white/80">Real-time Updates</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Globe className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm text-white/80">Public Profile</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleSaveUsername}
                disabled={!isValid || isSaving}
                className="flex-1 bg-white text-purple-600 hover:bg-white/90"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Set Username
                  </>
                )}
              </Button>
              
              <Button
                onClick={skipSetup}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Skip for now
              </Button>
            </div>

            {/* Status */}
            {isValid && (
              <div className="flex items-center justify-center space-x-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Username is available and ready to use!</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Help */}
        <div className="mt-6 text-center">
          <p className="text-white/60 text-sm">
            You can change your username later in your dashboard settings
          </p>
        </div>
      </div>
    </div>
  );
};

export default UsernameSetup;
