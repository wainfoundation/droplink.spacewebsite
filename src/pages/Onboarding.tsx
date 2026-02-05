import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Link as LinkIcon, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Globe,
  Camera,
  Sparkles
} from "lucide-react";
import { playSound, sounds } from '@/utils/sounds';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useUser();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Profile data - Initialize with Pi username if available
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");

  // Initialize with Pi username immediately
  useEffect(() => {
    const piAuthResult = localStorage.getItem('pi_auth_result');
    if (piAuthResult) {
      try {
        const piAuth = JSON.parse(piAuthResult);
        if (piAuth.user && piAuth.user.username) {
          console.log('Onboarding: Initializing with Pi username:', piAuth.user.username);
          setUsername(piAuth.user.username);
          setDisplayName(piAuth.user.username);
        }
      } catch (error) {
        console.error('Error parsing Pi auth result on initialization:', error);
      }
    }
  }, []);
  
  // Links data
  const [links, setLinks] = useState([
    { id: 1, title: "Instagram", url: "", icon: "📷", enabled: true },
    { id: 2, title: "YouTube", url: "", icon: "🎥", enabled: false },
    { id: 3, title: "Website", url: "", icon: "🌐", enabled: false },
    { id: 4, title: "Contact", url: "", icon: "📧", enabled: false },
  ]);

  const steps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Set Up Your Profile",
      description: "Add your name, bio, and profile picture",
      icon: <User className="w-5 h-5" />,
      completed: !!(displayName && bio)
    },
    {
      id: "links",
      title: "Add Your Links",
      description: "Connect your social media and websites",
      icon: <LinkIcon className="w-5 h-5" />,
      completed: links.some(link => link.enabled && link.url)
    },
    {
      id: "preview",
      title: "Preview & Publish",
      description: "See how your profile looks and go live",
      icon: <Globe className="w-5 h-5" />,
      completed: false
    }
  ];

  const progress = (steps.filter(step => step.completed).length / steps.length) * 100;

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Always check for Pi username first for security
    const piAuthResult = localStorage.getItem('pi_auth_result');
    console.log('Onboarding: Checking for Pi auth result:', piAuthResult);
    if (piAuthResult) {
      try {
        const piAuth = JSON.parse(piAuthResult);
        console.log('Onboarding: Parsed Pi auth data:', piAuth);
        if (piAuth.user && piAuth.user.username) {
          console.log('Onboarding: Found Pi username (security enforced):', piAuth.user.username);
          setUsername(piAuth.user.username);
          setDisplayName(piAuth.user.username);
          return; // Exit early to use Pi username
        } else {
          console.log('Onboarding: No Pi username found in auth data');
        }
      } catch (error) {
        console.error('Error parsing Pi auth result in onboarding:', error);
      }
    } else {
      console.log('Onboarding: No Pi auth result found in localStorage');
    }

    // Fallback to profile data only if no Pi username found
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setUsername(profile.username || "");
    }
  }, [user, profile, navigate]);

  const handleNext = async () => {
    if (currentStep === 0) {
      // Save profile data
      if (!displayName.trim() || !bio.trim()) {
        toast({
          title: "Please fill in all fields",
          description: "Name and bio are required",
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);
      try {
        // Always use Pi username for security - it cannot be changed
        let finalUsername = '';
        const piAuthResult = localStorage.getItem('pi_auth_result');
        if (piAuthResult) {
          try {
            const piAuth = JSON.parse(piAuthResult);
            if (piAuth.user && piAuth.user.username) {
              finalUsername = piAuth.user.username;
              console.log('Onboarding: Using Pi username as final username (security enforced):', finalUsername);
            }
          } catch (error) {
            console.error('Error parsing Pi auth result:', error);
          }
        }
        
        // If no Pi username found, this is an error - user should re-authenticate
        if (!finalUsername) {
          console.error('Onboarding: No Pi username found - user should re-authenticate');
          toast({
            title: "Authentication Error",
            description: "Pi username not found. Please re-authenticate with Pi Network.",
            variant: "destructive",
          });
          return;
        }

        await updateProfile({
          display_name: displayName.trim(),
          bio: bio.trim(),
          username: finalUsername,
          onboarding_completed: false
        });
        
        playSound(sounds.setupComplete, 0.3);
        toast({
          title: "Profile Updated!",
          description: "Great! Now let's add your links.",
        });
        
        setCurrentStep(1);
      } catch (error) {
        toast({
          title: "Error saving profile",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (currentStep === 1) {
      // Validate links
      const enabledLinks = links.filter(link => link.enabled);
      if (enabledLinks.length === 0) {
        toast({
          title: "Add at least one link",
          description: "You need at least one link to continue",
          variant: "destructive",
        });
        return;
      }

      const invalidLinks = enabledLinks.filter(link => !link.url.trim());
      if (invalidLinks.length > 0) {
        toast({
          title: "Complete your links",
          description: "Please fill in all enabled link URLs",
          variant: "destructive",
        });
        return;
      }

      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Complete onboarding and save links
      setIsLoading(true);
      try {
        // First, update the profile to mark onboarding as complete
        await updateProfile({
          onboarding_completed: true
        });
        
        // Then, save the enabled links to the database
        const enabledLinks = links.filter(link => link.enabled && link.url.trim());
        
        if (enabledLinks.length > 0 && user?.id) {
          // Use real database
          const { supabase } = await import('@/integrations/supabase/client');
          
          // Create links in the database
          const linksToInsert = enabledLinks.map((link, index) => ({
            user_id: user.id,
            title: link.title,
            url: link.url.trim(),
            icon: link.icon,
            position: index,
            is_active: true
          }));
          
          const { error: linksError } = await supabase
            .from('links')
            .insert(linksToInsert);
              
          if (linksError) {
            console.error('Error saving links:', linksError);
            // Don't fail the onboarding if links fail to save
            toast({
              title: "Profile created successfully!",
              description: "Your profile is live, but there was an issue saving your links. You can add them manually from your dashboard.",
            });
          }
        }
        
        playSound(sounds.setupComplete, 0.5);
        toast({
          title: "Welcome to Droplink! 🎉",
          description: "Your profile is now live and ready to share.",
        });
        
        navigate('/dashboard');
      } catch (error) {
        console.error('Error completing onboarding:', error);
        toast({
          title: "Error completing setup",
          description: "Please try again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleLink = (id: number) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, enabled: !link.enabled } : link
    ));
  };

  const updateLinkUrl = (id: number, url: string) => {
    setLinks(prev => prev.map(link => 
      link.id === id ? { ...link, url } : link
    ));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Set Up Your Profile</h2>
              <p className="text-gray-600">Tell people who you are and what you do</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name *</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name or brand"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell people about yourself, your work, or your brand..."
                  className="mt-1"
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {bio.length}/200 characters
                </p>
              </div>

              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="your-username"
                  className="mt-1 bg-gray-50 cursor-not-allowed"
                  readOnly
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your profile will be available at droplinkspace/@{username || 'your-username'}
                </p>
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  🔒 Username is secured by Pi Network authentication and cannot be changed
                </p>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Your Links</h2>
              <p className="text-gray-600">Connect your social media and websites</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800 flex items-center justify-center">
                  💡 <strong>Tip:</strong> You can skip this step and add your links later in the dashboard
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {links.map((link) => (
                <Card key={link.id} className={`transition-all ${link.enabled ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLink(link.id)}
                        className={`w-8 h-8 p-0 ${link.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      >
                        {link.enabled ? <CheckCircle className="w-4 h-4" /> : <span className="text-lg">{link.icon}</span>}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{link.icon}</span>
                          <span className="font-medium">{link.title}</span>
                          {link.enabled && (
                            <Badge variant="secondary" className="text-xs">Active</Badge>
                          )}
                        </div>
                        
                        {link.enabled && (
                          <Input
                            value={link.url}
                            onChange={(e) => updateLinkUrl(link.id, e.target.value)}
                            placeholder={`Your ${link.title} URL`}
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Pro Tip</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Start with your most important link (like Instagram or YouTube). 
                    You can always add more later from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Preview Your Profile</h2>
              <p className="text-gray-600">See how your profile will look to visitors</p>
            </div>

            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">{displayName || "Your Name"}</h3>
                    <p className="text-gray-600 text-sm">{bio || "Your bio will appear here"}</p>
                  </div>

                  <div className="space-y-2">
                    {links.filter(link => link.enabled && link.url).map((link) => (
                      <div key={link.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-lg">{link.icon}</span>
                        <span className="font-medium">{link.title}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-gray-500">
                    droplinkspace/@{username || 'your-username'}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Ready to Go Live!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Your profile looks great! Click "Complete Setup" to publish your profile and start sharing it with the world.
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Sharing Guide */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <h4 className="font-semibold text-blue-900 mb-3">How to Share Your Profile</h4>
                <div className="space-y-3 text-sm text-blue-800">
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">1.</span>
                    <span>Your profile will be available at: <code className="bg-blue-100 px-2 py-1 rounded">droplinkspace/@{username || 'your-username'}</code></span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">2.</span>
                    <span>Add this link to your social media bios (Instagram, Twitter, TikTok, etc.)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">3.</span>
                    <span>Share it in your stories, posts, and messages</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="font-medium">4.</span>
                    <span>Use the QR code feature for in-person sharing</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img 
                src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png" 
                alt="Droplink Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-900">Droplink</h1>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Droplink!</h2>
            <p className="text-gray-600">Let's set up your profile in just a few steps</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800 flex items-center justify-center">
                🔒 Your username is secured by Pi Network authentication and cannot be changed
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Setup Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            
            <div className="flex justify-between mt-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index === currentStep 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                  </div>
                  <span className="text-xs text-gray-500 text-center max-w-20">{step.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step Content */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {renderStepContent()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={isLoading}
              className="flex items-center space-x-2"
            >
              <span>
                {currentStep === steps.length - 1 ? 'Complete Setup' : 'Next'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;