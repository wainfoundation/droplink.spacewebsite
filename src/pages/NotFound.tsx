import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, Search, HelpCircle, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GoToTop from '@/components/GoToTop';
import { useUser } from "@/context/UserContext";

const NotFound = () => {
  const location = useLocation();
  const { isLoggedIn } = useUser();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const popularPages = [
    { name: "Home", path: "/", icon: Home },
    { name: "Features", path: "/features", icon: Search },
    { name: "Pricing", path: "/pricing", icon: Search },
    { name: "Templates", path: "/templates", icon: Search },
    { name: "Help", path: "/help", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <AlertTriangle className="h-24 w-24 text-orange-500" />
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                4
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track!
          </p>

          {/* Popular Pages */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Popular Pages
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
              {popularPages.map((page) => (
                <Button
                  key={page.path}
                  asChild
                  variant="outline"
                  className="h-auto py-3 px-4 flex flex-col items-center gap-2"
                >
                  <Link to={page.path}>
                    <page.icon className="h-4 w-4" />
                    <span className="text-sm">{page.name}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 max-w-md mx-auto">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-lg py-3">
              <Link to="/" className="flex items-center justify-center gap-2">
                <Home className="h-5 w-5" />
                Return to Home
              </Link>
            </Button>
            
            {isLoggedIn && (
              <Button asChild variant="outline" className="w-full text-lg py-3">
                <Link to="/dashboard" className="flex items-center justify-center gap-2">
                  <Search className="h-5 w-5" />
                  Go to Dashboard
                </Link>
              </Button>
            )}
            
            <Button 
              variant="ghost" 
              className="w-full text-lg py-3"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </Button>
          </div>

          {/* Error Details for Developers */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg max-w-md mx-auto">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Requested URL:</strong>
            </p>
            <code className="text-xs text-gray-700 bg-white px-2 py-1 rounded break-all">
              {location.pathname}
            </code>
          </div>
        </div>
      </main>
      <GoToTop />
      <Footer />
    </div>
  );
};

export default NotFound;
