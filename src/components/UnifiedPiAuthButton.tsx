import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Loader2, Pi } from 'lucide-react';

interface UnifiedPiAuthButtonProps {
  onAuthSuccess?: (authResult: any) => void;
  onAuthError?: (error: any) => void;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showIcon?: boolean;
}

const UnifiedPiAuthButton: React.FC<UnifiedPiAuthButtonProps> = ({
  onAuthSuccess,
  onAuthError,
  className = '',
  variant = 'default',
  size = 'default',
  showIcon = true
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const { refreshUserData, profile } = useUser();
  const navigate = useNavigate();

  // Check if running in Pi Browser (mainnet mode)
  const isPiBrowser = () => {
    if (typeof window === 'undefined') return false;
    
    const userAgent = navigator.userAgent.toLowerCase();
    const hostname = window.location.hostname.toLowerCase();
    
    // Check for Pi Browser user agent
    const isPiUserAgent = userAgent.includes('pibrowser') || 
                         userAgent.includes('pi network') || 
                         userAgent.includes('pi-browser');
    
    // Check for Pi Network domains (mainnet only)
    const isPiDomain = hostname.includes('pinet.com') || 
                       hostname.includes('minepi.com');
    
    // Check for Pi SDK availability
    const hasPiSDK = typeof window.Pi !== 'undefined';
    
    console.log('Pi Browser Detection (Mainnet):', {
      userAgent: isPiUserAgent,
      domain: isPiDomain,
      sdk: hasPiSDK,
      hostname
    });
    
    return isPiUserAgent || isPiDomain || hasPiSDK;
  };

  const handleAuthenticate = async () => {
    if (isAuthenticated) {
      // Sign out
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem('pi_auth_result');
      localStorage.removeItem('pi_access_token');
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Starting unified Pi authentication...');
      console.log('Environment:', {
        hostname: window.location.hostname,
        mainnet: true
      });

      // Use real Pi Network authentication for mainnet
      if (!window.Pi || typeof window.Pi.authenticate !== 'function') {
        throw new Error('Pi SDK not available. Please use Pi Browser.');
      }

      console.log('Attempting Pi Network authentication for mainnet...');
      const authResult = await window.Pi.authenticate(['payments', 'username'], (payment: any) => {
        console.log('Incomplete payment found:', payment);
        return payment;
      });
      console.log('Pi authentication successful:', authResult);

      setIsAuthenticated(true);
      setUser(authResult.user);
      
      // Store auth result in localStorage for persistence
      localStorage.setItem('pi_auth_result', JSON.stringify(authResult));
      localStorage.setItem('pi_access_token', authResult.accessToken);

      // Force refresh user data multiple times to ensure it's updated
      await refreshUserData();
      await new Promise(resolve => setTimeout(resolve, 1000));
      await refreshUserData();

      // Set flag to show ad modal after authentication
      sessionStorage.setItem('pi_just_authenticated', 'true');

      toast({
        title: "Authentication Successful",
        description: `Welcome, ${authResult.user.username}!`,
      });

      if (onAuthSuccess) {
        onAuthSuccess(authResult);
      } else {
        // Default navigation behavior
        if (profile?.onboarding_completed) {
          navigate('/admin-dashboard');
        } else {
          navigate('/onboarding');
        }
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

  // Check if not in Pi Browser (mainnet requires Pi Browser)
  if (!isPiBrowser()) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-sm text-gray-600 mb-2">
          Pi Network features are only available in the Pi Browser
        </p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => window.open('https://minepi.com/download', '_blank')}
        >
          Download Pi Browser
        </Button>
        <p className="text-xs text-gray-500 mt-2">
          Please open this app in Pi Browser for mainnet authentication
        </p>
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
          variant={variant}
          size={size}
          className="bg-[#00BFFF] hover:bg-[#0099CC] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              {showIcon && <Pi className="w-4 h-4 mr-2" />}
              Connect with Pi Network
            </>
          )}
        </Button>
      )}
    </div>
  );
};

export default UnifiedPiAuthButton;
