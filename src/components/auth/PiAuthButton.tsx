
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { Pi, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePiAuth } from "@/hooks/usePiAuth";

interface PiAuthButtonProps {
  onSuccess?: () => void;
  onError?: () => void;
  onLoading?: (loading: boolean) => void;
}

const PiAuthButton = ({ onSuccess, onError, onLoading }: PiAuthButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUserData, profile } = useUser();
  const { handlePiLogin, piAuthenticating, error } = usePiAuth();

  const handlePiAuthentication = async () => {
    try {
      onLoading?.(true);
      
      console.log('Starting Pi authentication...');
      console.log('Current environment:', {
        hostname: window.location.hostname,
        href: window.location.href,
        userAgent: navigator.userAgent,
        mainnet: true
      });
      
      // Mainnet mode - Pi Network authentication
      console.log('Mainnet mode: Using Pi Network authentication');

      // Use the handlePiLogin from usePiAuth hook which handles the authentication properly
      const result = await handlePiLogin();
      
      if (result && result.user) {
        console.log('Authentication successful, processing result...');
        
        // Force refresh user data multiple times to ensure it's updated
        await refreshUserData();
        await new Promise(resolve => setTimeout(resolve, 1000));
        await refreshUserData();
        
        console.log('PiAuthButton: User data refreshed, calling onSuccess');
        
        // Call success callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          // Default behavior for backward compatibility
          if (profile?.onboarding_completed) {
            toast({
              title: "Welcome back to Droplink!",
              description: `Successfully signed in as ${result.user?.username || 'Pi User'}`,
            });
            navigate('/admin-dashboard');
          } else {
            toast({
              title: "Welcome to Droplink!",
              description: "Let's set up your profile to get started.",
            });
            navigate('/onboarding');
          }
        }
      } else {
        console.error('PiAuthButton: handlePiLogin returned null/undefined', { result });
        throw new Error('Authentication completed but no user data received. Please try again.');
      }
    } catch (error: any) {
      console.error('Pi authentication error:', error);
      onError?.();
      
      // Provide more specific error messages
      let errorMessage = "Failed to authenticate with Pi Network";
      
      if (error?.message) {
        if (error.message.includes('Network Error')) {
          errorMessage = "Network connection failed. Please check your internet connection and try again.";
        } else if (error.message.includes('CSP')) {
          errorMessage = "Security policy error. Please try refreshing the page.";
        } else if (error.message.includes('timeout')) {
          errorMessage = "Authentication timed out. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Authentication Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      onLoading?.(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={() => {
          window.location.href = 'https://droplink.space/auth';
        }}
        disabled={piAuthenticating}
        className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        {piAuthenticating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting to Pi Network...
          </>
        ) : (
          <>
            <Pi className="w-4 h-4 mr-2" />
            Connect with Pi Network
          </>
        )}
      </Button>
    </div>
  );
};

export default PiAuthButton;
