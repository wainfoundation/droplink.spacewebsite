import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Link as LinkIcon, 
  Globe, 
  Share2, 
  Eye, 
  MousePointer,
  ArrowRight,
  CheckCircle,
  Play,
  ExternalLink,
  Copy,
  QrCode
} from "lucide-react";
import { DOMAIN_CONFIG } from "@/config/domain";

const WorkflowDemo = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [demoUsername] = useState("demo_user");
  const [demoProfile] = useState({
    displayName: "Demo User",
    bio: "Digital creator & Pi pioneer. Building the future of social media.",
    links: [
      { title: "Instagram", url: "https://instagram.com/demouser", icon: "📷", clicks: 1240 },
      { title: "YouTube", url: "https://youtube.com/@demouser", icon: "🎥", clicks: 856 },
      { title: "Website", url: "https://demouser.com", icon: "🌐", clicks: 432 },
      { title: "Contact", url: "mailto:hello@demouser.com", icon: "📧", clicks: 298 }
    ]
  });

  const steps = [
    {
      id: "signup",
      title: "User Registration",
      description: "User signs up and gets authenticated",
      icon: <User className="w-5 h-5" />,
      details: [
        "User visits droplink.space",
        "Clicks 'Sign Up' or 'Get Started'",
        "Completes registration form",
        "Gets authenticated and redirected to onboarding"
      ]
    },
    {
      id: "onboarding",
      title: "Profile Setup",
      description: "3-step onboarding process",
      icon: <LinkIcon className="w-5 h-5" />,
      details: [
        "Step 1: Set display name, bio, and username",
        "Step 2: Add social media links and websites",
        "Step 3: Preview and publish profile",
        "Profile data saved to database"
      ]
    },
    {
      id: "dashboard",
      title: "Dashboard Management",
      description: "Manage profile and view analytics",
      icon: <Eye className="w-5 h-5" />,
      details: [
        "View real-time analytics (clicks, views)",
        "Add, edit, or delete links",
        "Customize profile appearance",
        "See mobile preview in real-time"
      ]
    },
    {
      id: "sharing",
      title: "Public Sharing",
      description: "Share profile with the world",
      icon: <Share2 className="w-5 h-5" />,
      details: [
        "Get public URL: droplink.space/@username",
        "Add to social media bios",
        "Share in stories, posts, messages",
        "Use QR code for in-person sharing"
      ]
    },
    {
      id: "visitors",
      title: "Visitor Experience",
      description: "How visitors interact with profile",
      icon: <Globe className="w-5 h-5" />,
      details: [
        "Visit public profile URL",
        "View profile info and bio",
        "Click on links (tracked in analytics)",
        "Send tips in Pi cryptocurrency"
      ]
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTryDemo = () => {
    navigate('/signup');
  };

  const handleViewDemoProfile = () => {
    window.open(DOMAIN_CONFIG.getProfileUrl(demoUsername), '_blank');
  };

  const handleCopyProfileUrl = async () => {
    const profileUrl = DOMAIN_CONFIG.getProfileUrl(demoUsername);
    try {
      await navigator.clipboard.writeText(profileUrl);
      // You can add a toast notification here
    } catch (error) {
      console.error('Failed to copy URL:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Droplink Workflow
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              From user creation to public sharing - see how Droplink works end-to-end
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button onClick={handleTryDemo} className="flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Try It Yourself</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={handleViewDemoProfile}
                className="flex items-center space-x-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View Demo Profile</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Workflow Steps */}
            <div className="lg:col-span-2">
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Workflow Steps</span>
                    <Badge variant="secondary">{currentStep + 1} of {steps.length}</Badge>
                  </CardTitle>
                  <Progress value={progress} className="h-2" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          index === currentStep
                            ? 'border-blue-500 bg-blue-50'
                            : index < currentStep
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === currentStep
                              ? 'bg-blue-500 text-white'
                              : index < currentStep
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {index < currentStep ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              step.icon
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {step.title}
                            </h3>
                            <p className="text-gray-600 mb-3">{step.description}</p>
                            {index === currentStep && (
                              <div className="space-y-2">
                                {step.details.map((detail, detailIndex) => (
                                  <div key={detailIndex} className="flex items-start space-x-2">
                                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                    <span className="text-sm text-gray-700">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={currentStep === steps.length - 1}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Right: Live Demo */}
            <div className="space-y-6">
              {/* Demo Profile Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Demo Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                      <span className="text-white font-bold text-xl">
                        {demoProfile.displayName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{demoProfile.displayName}</h3>
                      <p className="text-sm text-gray-500">@{demoUsername}</p>
                      <p className="text-sm text-gray-600 mt-2">{demoProfile.bio}</p>
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MousePointer className="w-4 h-4" />
                        <span>1,826 clicks</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>4 links</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {demoProfile.links.slice(0, 3).map((link, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <span className="text-lg">{link.icon}</span>
                          <span className="flex-1 text-left">{link.title}</span>
                          <span className="text-gray-500">{link.clicks}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleViewDemoProfile}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleCopyProfileUrl}
                        className="flex-1"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy URL
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={handleTryDemo} 
                    className="w-full"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Create Your Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/demo')}
                    className="w-full"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    View Demo
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/features')}
                    className="w-full"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    See Features
                  </Button>
                </CardContent>
              </Card>

              {/* URL Structure */}
              <Card>
                <CardHeader>
                  <CardTitle>URL Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Public Profile:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        droplink.space/@username
                      </code>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Dashboard:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        droplink.space/dashboard
                      </code>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Onboarding:</p>
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                        droplink.space/onboarding
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowDemo; 