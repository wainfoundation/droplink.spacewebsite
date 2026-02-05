import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { piAuthService } from '@/services/piAuthService';
import { User, LogOut, Loader2 } from 'lucide-react';

interface PiAuthButtonProps {
  onAuthSuccess?: (authResult: any) => void;
  onAuthError?: (error: any) => void;
  className?: string;
}

const PiAuthButton: React.FC<PiAuthButtonProps> = ({
  onAuthSuccess,
  onAuthError,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already authenticated
    if (piAuthService.isUserAuthenticated()) {
      setIsAuthenticated(true);
      setUser(piAuthService.getCurrentUser());
    }
  }, []);

  const handleAuthenticate = async () => {
    if (isAuthenticated) {
      // Sign out
      piAuthService.signOut();
      setIsAuthenticated(false);
      setUser(null);
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Authenticate with Pi Network
      const authResult = await piAuthService.authenticate(['payments']);
      
      setIsAuthenticated(true);
      setUser(authResult.user);
      
      toast({
        title: "Authentication Successful",
        description: `Welcome, ${authResult.user.username}! (Sandbox Mode)`,
      });

      if (onAuthSuccess) {
        onAuthSuccess(authResult);
      }
    } catch (error) {
      console.error('Pi authentication failed:', error);
      
      toast({
        title: "Authentication Failed",
        description: "Failed to authenticate with Pi Network. Please try again.",
        variant: "destructive",
      });

      if (onAuthError) {
        onAuthError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isPiBrowser = piAuthService.isRunningInPiBrowser();

  if (!isPiBrowser) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-sm text-gray-600 mb-2">
          Pi Network features are only available in the Pi Browser
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open('https://minepi.com', '_blank')}
        >
          Download Pi Browser
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm font-medium">{user?.username}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAuthenticate}
            disabled={isLoading}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => {
            window.location.href = 'https://droplink.space/auth';
          }}
          disabled={isLoading}
          className="bg-[#00BFFF] hover:bg-[#0099CC] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Authenticating...
            </>
          ) : (
            <>
              <User className="w-4 h-4 mr-2" />
              Connect with Pi (Sandbox)
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default PiAuthButton;
