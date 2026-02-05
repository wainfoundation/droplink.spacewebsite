
import React from "react";
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
import GoToTop from "@/components/GoToTop";
import { getPiConfig, getEnvironmentBadge } from "@/utils/pi-config";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useUser();

  // Get Pi configuration
  const config = getPiConfig();
  const environmentBadge = getEnvironmentBadge();

  // Redirect if already logged in
  if (isLoggedIn) {
    navigate("/admin-dashboard");
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <Navbar />
        
        {/* Environment Warning Banner */}
        {config.isSandbox && (
          <div className="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Test mode - Pi Network sandbox authentication</span>
              <Badge variant="secondary" className="ml-2 text-xs bg-yellow-600">
                {environmentBadge.text}
              </Badge>
            </div>
          </div>
        )}
        
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <Card className="border-0 shadow-lg">
              <CardHeader className="text-center pb-6">
                {/* Droplink Logo */}
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center space-x-3">
                    <img 
                      src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png" 
                      alt="Droplink Logo" 
                      className="w-12 h-12 object-contain"
                    />
                    <div className="text-left">
                      <h1 className="text-2xl font-bold text-sky-500">Droplink</h1>
                      <p className="text-xs text-gray-500">Pi Network link-in-bio platform</p>
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Welcome back to Droplink
                </CardTitle>
                <p className="text-gray-600">
                  Sign in securely with your Pi Network account
                </p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center space-y-6">
                  {/* Pi Network Logo and Description */}
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-full">
                      <Pi className="w-6 h-6 text-orange-600" />
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
                  
                  {/* Pi Auth Button */}
                  <div className="pt-4">
                    <UnifiedPiAuthButton />
                  </div>
                  
                  {/* Environment Info */}
                  <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Badge variant="outline" className={`text-xs ${environmentBadge.color.replace('bg-', 'border-')}`}>
                      {environmentBadge.text}
                    </Badge>
                    <span>{environmentBadge.text === 'SANDBOX' ? 'Test Environment' : environmentBadge.text === 'PRODUCTION' ? 'Live Environment' : 'Development Environment'}</span>
                  </div>
                  
                  {/* Pi Browser Check */}
                  {!config.isPiBrowser && (
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Pi Browser Recommended:</strong> For the best experience, 
                        open this app in Pi Browser.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                
                <Separator />
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link 
                      to="/signup" 
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Sign up
                    </Link>
                  </p>
                  
                  <div className="space-y-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      className="w-full"
                    >
                      <Link to="/demo">
                        Try Demo <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
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

export default Login;
