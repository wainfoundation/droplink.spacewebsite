
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pi, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { usePiAuth } from "@/hooks/usePiAuth";

interface LoginPromptProps {
  handlePiLogin: () => Promise<void>;
}

const LoginPrompt = ({ handlePiLogin }: LoginPromptProps) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { refreshUserData, profile } = useUser();
  const navigate = useNavigate();
  const { handlePiLogin: piAuthHandler, piAuthenticating } = usePiAuth();
  
  const handlePiAuthentication = async () => {
    try {
      setIsAuthenticating(true);
      
      const result = await piAuthHandler();
      
      if (result) {
        await refreshUserData();
        
        // Check if user has completed onboarding
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
    } catch (error: any) {
      console.error("Pi authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: error?.message || "Failed to authenticate with Pi Network",
        variant: "destructive",
      });
    } finally {
      setIsAuthenticating(false);
    }
  };

  return (
    <div className="text-center py-16 bg-white rounded-2xl shadow-lg p-8 mx-4">
      <div className="flex justify-center mb-6">
        <div className="p-4 bg-gradient-to-r from-sky-100 to-sky-200 rounded-full">
          <Pi className="h-12 w-12 text-sky-600" />
        </div>
      </div>
      
      <div className="space-y-4 mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Connect with Pi Network
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
          Sign in securely with your Pi Network account to access your Droplink dashboard and manage your digital presence
        </p>
      </div>
      
      <div className="space-y-6">
        <Button 
          onClick={() => {
            window.location.href = 'https://droplink.space/auth';
          }} 
          className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          disabled={isAuthenticating || piAuthenticating}
          size="lg"
        >
          {(isAuthenticating || piAuthenticating) ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting to Pi Network...
            </>
          ) : (
            <>
              <Pi className="w-4 h-4 mr-2" />
              Continue with Pi Network
            </>
          )}
        </Button>
        
        <p className="text-sm text-gray-500 leading-relaxed">
          Join the Pi Network community and start monetizing your content with Pi payments
        </p>
      </div>
    </div>
  );
};

export default LoginPrompt;
