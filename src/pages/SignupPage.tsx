
import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle, CheckCircle, Pi } from "lucide-react";
import UnifiedPiAuthButton from "@/components/UnifiedPiAuthButton";
import { useUser } from "@/context/UserContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoToTop from '@/components/GoToTop';
import { getPiConfig } from "@/utils/pi-config";
import Logo from "@/components/ui/Logo";

const SignupPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  // Get Pi configuration
  const config = getPiConfig();

  // Redirect if already logged in - using useEffect to avoid setState during render
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  // Don't render if already logged in
  if (isLoggedIn) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        

        
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                {/* Droplink Logo */}
                <div className="flex items-center justify-center mb-6">
                  <Logo size="lg" />
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Join Droplink with Pi Network
                </CardTitle>
                <p className="text-gray-600">
                  Create your account securely using Pi Network authentication
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center space-y-6">
                  {/* Pi Network Logo and Description */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
                      <Pi className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Pi Network Authentication</h3>
                      <p className="text-sm text-gray-600">Secure, decentralized, and seamless</p>
                    </div>
                  </div>
                  
                  {/* Benefits */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>No passwords to remember</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Enhanced security with blockchain</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Seamless Pi payments integration</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>Access to Pi Network ecosystem</span>
                    </div>
                  </div>
                  
                  {/* Pi Network Authentication Button */}
                  <div className="pt-4">
                    <UnifiedPiAuthButton />
                  </div>
                  
                  {/* Environment Info */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs border-green-600 text-green-600">
                      MAINNET
                    </Badge>
                    <span>Pi Network Mainnet Production</span>
                  </div>
                  
                  {/* Download Pi Browser Button */}
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                      onClick={() => window.open('https://minepi.com/Wain2020', '_blank')}
                    >
                      <Pi className="w-4 h-4 mr-2" />
                      Download Pi Browser
                    </Button>
                  </div>
                  
                  {/* Pi Browser Check */}
                  {!config.isPiBrowser && (
                    <Alert className="border-blue-200 bg-blue-50 mt-4">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Pi Browser Required:</strong> For the best experience with Pi Network authentication, 
                        please download and use Pi Browser.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Separator />
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign in
                    </Link>
                  </p>
                  

                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
        <GoToTop />
      </div>
    </>
  );
};

export default SignupPage;
