import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import ProfileImageUpload from "@/components/profile/ProfileImageUpload";
import { 
  User, 
  Link, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Rocket,
  Sparkles
} from "lucide-react";

interface QuickSetupWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const QuickSetupWizard: React.FC<QuickSetupWizardProps> = ({ onComplete, onSkip }) => {
  const { user, profile, updateProfile } = useUser();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || user?.user_metadata?.full_name || '',
    bio: profile?.bio || '',
    username: profile?.username || user?.email?.split('@')[0] || ''
  });

  const steps = [
    {
      id: 1,
      title: "Welcome to Droplink!",
      description: "Let's set up your profile in just a few steps",
      icon: <Rocket className="w-6 h-6" />
    },
    {
      id: 2,
      title: "Your Profile",
      description: "Tell people about yourself",
      icon: <User className="w-6 h-6" />
    },
    {
      id: 3,
      title: "Add Your First Link",
      description: "Share something important to you",
      icon: <Link className="w-6 h-6" />
    },
    {
      id: 4,
      title: "You're All Set!",
      description: "Your profile is ready to share",
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        display_name: formData.displayName,
        bio: formData.bio,
        username: formData.username
      });
      
      toast({
        title: "Profile Updated!",
        description: "Your profile has been saved successfully.",
      });
      
      handleNext();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                <Sparkles className="w-10 h-10" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to Droplink!</h2>
              <p className="text-gray-600 mb-6">
                Create your personalized link-in-bio page in just a few minutes. 
                Share all your important links in one beautiful place.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <User className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                  <h3 className="font-semibold mb-1">Customize Profile</h3>
                  <p className="text-gray-600">Add your photo, bio, and personal touch</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <Link className="w-6 h-6 mx-auto mb-2 text-green-600" />
                  <h3 className="font-semibold mb-1">Add Your Links</h3>
                  <p className="text-gray-600">Share social media, websites, and more</p>
                  <p className="text-xs text-blue-600 mt-1">💡 Can be set up later in dashboard</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <CheckCircle className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <h3 className="font-semibold mb-1">Share & Grow</h3>
                  <p className="text-gray-600">Get your unique link and start sharing</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Profile</h2>
              <p className="text-gray-600">Tell people about yourself</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Choose a unique username"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Your profile will be available at: localhost:5173/@{formData.username || 'username'}
                </p>
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell people about yourself..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Profile Photo</Label>
                <ProfileImageUpload />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Add Your First Link</h2>
              <p className="text-gray-600">Share something important to you</p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-4">Quick Link Ideas:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">I</span>
                  </div>
                  <div>
                    <p className="font-medium">Instagram</p>
                    <p className="text-sm text-gray-600">Share your photos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-semibold">Y</span>
                  </div>
                  <div>
                    <p className="font-medium">YouTube</p>
                    <p className="text-sm text-gray-600">Share your videos</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-semibold">T</span>
                  </div>
                  <div>
                    <p className="font-medium">Twitter</p>
                    <p className="text-sm text-gray-600">Share your thoughts</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">W</span>
                  </div>
                  <div>
                    <p className="font-medium">Website</p>
                    <p className="text-sm text-gray-600">Share your website</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button onClick={handleNext} className="w-full">
                  <Link className="w-4 h-4 mr-2" />
                  Add My First Link
                </Button>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white">
                <CheckCircle className="w-10 h-10" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">You're All Set!</h2>
              <p className="text-gray-600 mb-6">
                Your profile is ready to share. Start adding your links and grow your audience!
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">Your Profile URL:</h3>
                <p className="text-lg font-mono bg-white p-3 rounded border">
                  localhost:5173/@{formData.username || 'username'}
                </p>
              </div>
              
              <div className="space-y-3">
                <Button onClick={onComplete} className="w-full">
                  <Rocket className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={onSkip} className="w-full">
                  Skip for Now
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {steps[currentStep - 1].icon}
              {steps[currentStep - 1].title}
            </CardTitle>
            <Badge variant="secondary">
              Step {currentStep} of {steps.length}
            </Badge>
          </div>
          <p className="text-gray-600">{steps[currentStep - 1].description}</p>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
          
          {currentStep !== 1 && currentStep !== 4 && (
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              {currentStep === 2 ? (
                <Button onClick={handleSaveProfile}>
                  Save Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickSetupWizard; 