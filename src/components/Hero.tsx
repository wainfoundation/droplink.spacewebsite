
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Globe, Zap, DollarSign, Play, AlertTriangle } from "lucide-react";
import { useUser } from "@/context/UserContext";

const Hero = () => {
  const { isLoggedIn, profile } = useUser();
  const [iframeError, setIframeError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if iframe is blocked by CSP
    const checkIframeSupport = () => {
      try {
        const testIframe = document.createElement('iframe');
        testIframe.src = 'about:blank';
        testIframe.style.display = 'none';
        document.body.appendChild(testIframe);
        document.body.removeChild(testIframe);
        return true;
      } catch (error) {
        console.warn('Iframe support check failed:', error);
        return false;
      }
    };

    if (!checkIframeSupport()) {
      setIframeError(true);
    }

    // Set a timeout to show error if video doesn't load within 10 seconds
    const timeout = setTimeout(() => {
      if (isLoading) {
        setIframeError(true);
        setIsLoading(false);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [isLoading]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIframeError(true);
    setIsLoading(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Enhanced professional background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/30 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-100/30 via-transparent to-transparent" />
      
      {/* Subtle animated elements */}
      <div className="absolute -top-40 -right-40 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-br from-indigo-400/10 to-blue-400/10 rounded-full blur-3xl animate-pulse" />
      
      {/* Professional grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center max-w-5xl mx-auto space-y-6 md:space-y-8">
          {/* Enhanced professional heading */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-sky-400 via-sky-500 to-sky-600 bg-clip-text text-transparent animate-fade-in">
                Drive Mass Adoption
              </span>
              <br />
              <span className="text-slate-800 animate-fade-in-delay">with Droplink</span>
            </h1>
            
            {/* Professional subtitle */}
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 animate-fade-in-delay-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
              Now on Mainnet - Join the Pi Network Revolution
            </div>
          </div>
          
          {/* Enhanced professional description */}
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed font-light animate-fade-in-delay-3">
            The complete link-in-bio platform for Pi Network creators. From custom profiles to Pi payments, 
            analytics to templates - everything you need to monetize your audience and drive Pi Network adoption.
          </p>
          
          {/* Enhanced professional feature highlights with Sky Blue theme */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto my-12 md:my-16">
            <div className="group text-center p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200/50 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-delay-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-sky-400 to-sky-600 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Users className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-800 mb-1">Custom Profiles</h3>
              <p className="text-xs text-slate-600 hidden md:block">Professional branding</p>
            </div>
            
            <div className="group text-center p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200/50 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-delay-5">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-sky-500 to-sky-700 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-800 mb-1">Pi Payments</h3>
              <p className="text-xs text-slate-600 hidden md:block">Secure transactions</p>
            </div>
            
            <div className="group text-center p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200/50 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-delay-6">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-sky-300 to-sky-500 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Globe className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-800 mb-1">Pi Domains</h3>
              <p className="text-xs text-slate-600 hidden md:block">Custom .pi domains</p>
            </div>
            
            <div className="group text-center p-4 md:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-sky-200/50 shadow-sm hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-delay-7">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-sky-600 to-sky-800 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Zap className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <h3 className="text-sm md:text-base font-semibold text-slate-800 mb-1">100+ Templates</h3>
              <p className="text-xs text-slate-600 hidden md:block">Ready to use</p>
            </div>
          </div>

          {/* Enhanced Professional Demo Section with Sky Blue Video Player */}
          <div className="my-16 md:my-20 animate-fade-in-delay-8">
            <div className="max-w-5xl mx-auto">
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden border border-sky-200/50">
                {/* Sky Blue Header */}
                <div className="bg-gradient-to-r from-sky-400 to-sky-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Play className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-semibold">Droplink Demo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                      <span className="text-white/80 text-sm">Live</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-8 p-8 md:p-12">
                  <div className="space-y-4">
                    <div className="w-24 h-24 mx-auto flex items-center justify-center">
                      <img 
                        src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png" 
                        alt="Droplink Logo" 
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      {/* Fallback SVG Logo - Clean Blue Droplet */}
                      <svg 
                        className="w-16 h-16 hidden"
                        viewBox="0 0 32 32" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <defs>
                          <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#0284c7" />
                          </linearGradient>
                        </defs>
                        <path 
                          d="M16 28C20 28 24 24 24 20C24 16 20 12 16 8C12 12 8 16 8 20C8 24 12 28 16 28Z" 
                          fill="url(#dropletGradient)"
                        />
                        <path 
                          d="M20 24C22 24 24 22 24 20C24 18 22 16 20 18C18 16 16 18 16 20C16 22 18 24 20 24Z" 
                          fill="rgba(255,255,255,0.3)"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                        See Droplink in Action
                      </h3>
                      <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        Watch how easy it is to create your professional link-in-bio page with Pi payments integration
                      </p>
                    </div>
                  </div>
                  
                  {/* Clean Professional Video Player - No Text Overlays */}
                  <div className="relative w-full max-w-4xl mx-auto">
                    <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300">
                      {iframeError ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                          <div className="text-center p-8 max-w-md">
                            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2 text-gray-800">Video Unavailable</h3>
                            <p className="text-gray-600 mb-6">
                              The video cannot be displayed due to browser security settings or network restrictions.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-20">
                              <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-500 mx-auto mb-4"></div>
                                <p className="text-sm text-gray-600">Loading video...</p>
                              </div>
                            </div>
                          )}
                          <iframe
                            className="absolute inset-0 w-full h-full"
                            src="https://www.youtube.com/embed/Oin7Ka7lXsg"
                            title="Droplink Demo - YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            onLoad={handleIframeLoad}
                            onError={handleIframeError}
                            loading="lazy"
                          />
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <Button asChild size="lg" className="bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg px-8 py-4">
                      <Link to="/demo" className="flex items-center gap-2">
                        Try Demo Now <ArrowRight size={20} />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced professional CTA buttons with Sky Blue theme */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 md:pt-12 animate-fade-in-delay-9">
            {isLoggedIn && profile ? (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transform transition hover:scale-105 duration-200 text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                  <Link to="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard <ArrowRight size={20} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-2 border-sky-300 hover:border-sky-500 hover:bg-sky-50 transition-all duration-200 text-lg px-8 py-4 text-sky-700">
                  <Link to={`/@${profile.username}`}>View Your Profile</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-2 border-sky-300 hover:border-sky-500 hover:bg-sky-50 transition-all duration-200 text-lg px-8 py-4 text-sky-700">
                  <Link to="/pi-domain-details" className="flex items-center gap-2">
                    <Globe size={20} /> Learn About .pi Domains
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 transform transition hover:scale-105 duration-200 text-lg px-8 py-4 shadow-lg hover:shadow-xl">
                  <Link to="/auth" className="flex items-center gap-2">
                    Start Building Free <ArrowRight size={20} />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-2 border-sky-300 hover:border-sky-500 hover:bg-sky-50 transition-all duration-200 text-lg px-8 py-4 text-sky-700">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-2 border-sky-300 hover:border-sky-500 hover:bg-sky-50 transition-all duration-200 text-lg px-8 py-4 text-sky-700">
                  <Link to="/pi-domain-details" className="flex items-center gap-2">
                    <Globe size={20} /> Learn About .pi Domains
                  </Link>
                </Button>
              </>
            )}
          </div>
          
          {/* Enhanced professional social proof with Sky Blue theme */}
          <div className="pt-12 md:pt-16 animate-fade-in-delay-10">
            <p className="text-sm md:text-base text-slate-500 mb-6 md:mb-8 font-medium">
              Trusted by Pi Network creators worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
              <div className="text-xs md:text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full border border-sky-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-sky-600 font-bold">10,000+</span> Users
              </div>
              <div className="text-xs md:text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full border border-sky-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-sky-500 font-bold">50,000+</span> Links Created
              </div>
              <div className="text-xs md:text-sm font-semibold text-slate-700 bg-white/80 backdrop-blur-sm px-4 md:px-6 py-3 rounded-full border border-sky-200/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                <span className="text-sky-700 font-bold">100π+</span> Processed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
