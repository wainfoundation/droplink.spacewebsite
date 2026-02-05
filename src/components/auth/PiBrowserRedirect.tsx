
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertTriangle } from "lucide-react";
import { isRunningInPiBrowser, redirectToPiBrowser } from "@/utils/pi-sdk";

interface PiBrowserRedirectProps {
  onContinue?: () => void;
  showContinueOption?: boolean;
}

const PiBrowserRedirect = ({ onContinue, showContinueOption = false }: PiBrowserRedirectProps) => {
  const [redirecting, setRedirecting] = useState(false);

  const handleRedirectToPiBrowser = () => {
    setRedirecting(true);
    try {
      redirectToPiBrowser();
    } catch (error) {
      console.error("Failed to redirect to Pi Browser:", error);
      setRedirecting(false);
    }
  };

  return (
    <Card className="border-sky-200 bg-sky-50">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-sky-600" />
        </div>
        <CardTitle className="text-sky-800">Pi Browser Required</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-sky-700">
          For security and full functionality, please use Pi Browser to sign in to Droplink.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={handleRedirectToPiBrowser}
            disabled={redirecting}
            className="w-full bg-sky-500 hover:bg-sky-600"
          >
            {redirecting ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Redirecting...
              </div>
            ) : (
              <>
                <ExternalLink className="w-4 h-4 mr-2" />
                Sign in using Pi account
              </>
            )}
          </Button>
          
          {showContinueOption && onContinue && (
            <Button 
              variant="outline" 
              onClick={onContinue}
              className="w-full border-sky-300 text-sky-700 hover:bg-sky-100"
            >
              Continue Anyway (Limited Features)
            </Button>
          )}
        </div>
        
        <p className="text-xs text-sky-600">
          Pi Browser provides enhanced security and access to all Pi Network features.
        </p>
      </CardContent>
    </Card>
  );
};

export default PiBrowserRedirect;
