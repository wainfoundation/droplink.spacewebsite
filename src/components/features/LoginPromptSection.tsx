
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Pi, Loader2 } from "lucide-react";
import { isRunningInPiBrowser } from "@/utils/pi-sdk";
import PiBrowserRedirect from "@/components/auth/PiBrowserRedirect";
import { usePiAuth } from "@/hooks/usePiAuth";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface LoginPromptSectionProps {
  onPiLogin: () => Promise<void>;
}

const LoginPromptSection = ({ onPiLogin }: LoginPromptSectionProps) => {
  const [isPiBrowser, setIsPiBrowser] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const { handlePiLogin, piAuthenticating } = usePiAuth();
  const { refreshUserData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const checkBrowser = () => {
      const inPiBrowser = isRunningInPiBrowser();
      setIsPiBrowser(inPiBrowser);
    };
    
    checkBrowser();
  }, []);

  const handleContinueAnyway = () => {
    setShowLogin(true);
  };

  const handlePiAuthentication = async () => {
    window.location.href = 'https://droplink.space/auth';
  };

  if (!isPiBrowser && !showLogin) {
    return (
      <div className="mt-8 max-w-md mx-auto">
        <PiBrowserRedirect 
          onContinue={handleContinueAnyway}
          showContinueOption={true}
        />
      </div>
    );
  }

  return (
    <div className="mt-8 p-4 bg-sky-50 border border-sky-200 rounded-lg max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-3">
        <Pi className="h-5 w-5 text-sky-600" />
        <h2 className="text-xl font-semibold text-sky-800">Sign in with Pi Network</h2>
      </div>
      <Button 
        onClick={handlePiAuthentication}
        className="bg-sky-500 hover:bg-sky-600 text-white w-full"
        disabled={isAuthenticating || piAuthenticating}
      >
        {(isAuthenticating || piAuthenticating) ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Pi className="w-4 h-4 mr-2" />
            Connect Pi Network Wallet
          </>
        )}
      </Button>
      <p className="text-sm text-gray-600 mt-3 text-center">
        Use your Pi Network wallet to access all Droplink features
      </p>
      {!isPiBrowser && (
        <p className="text-xs text-sky-600 mt-2 text-center">
          Note: Some features may be limited outside Pi Browser
        </p>
      )}
    </div>
  );
};

export default LoginPromptSection;
