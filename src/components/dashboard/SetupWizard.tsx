import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Wallet, 
  User, 
  Link as LinkIcon, 
  Palette,
  Share2,
  QrCode,
  Heart,
  Settings,
  Globe,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Mail,
  MessageCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { useLinks } from '@/hooks/useLinks';

interface SetupWizardProps {
  onComplete?: () => void;
}

const SetupWizard: React.FC<SetupWizardProps> = ({ onComplete }) => {
  const { user, profile, updateProfile } = useUser();
  const { addLink } = useLinks(user?.id);
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Step 1: Profile Setup
  const [profileData, setProfileData] = useState({
    displayName: profile?.display_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    avatar: profile?.avatar_url || ''
  });

  // Initialize with Pi username if available
  useEffect(() => {
    if (!profileData.username && !profileData.displayName) {
      const piAuthResult = localStorage.getItem('pi_auth_result');
      if (piAuthResult) {
        try {
          const piAuth = JSON.parse(piAuthResult);
          if (piAuth.user && piAuth.user.username) {
            console.log('SetupWizard: Found Pi username:', piAuth.user.username);
            setProfileData(prev => ({
              ...prev,
              username: piAuth.user.username,
              displayName: piAuth.user.username
            }));
          }
        } catch (error) {
          console.error('Error parsing Pi auth result in SetupWizard:', error);
        }
      }
    }
  }, []);

  // Step 2: Wallet Setup
  const [walletData, setWalletData] = useState({
    address: '',
    isConfigured: false
  });

  // Step 3: Social Links
  const [socialLinks, setSocialLinks] = useState({
    instagram: '',
    youtube: '',
    twitter: '',
    facebook: '',
    linkedin: '',
    github: '',
    email: '',
    whatsapp: ''
  });

  // Step 4: Template Selection
  const [selectedTemplate, setSelectedTemplate] = useState(profile?.theme || 'modern-dark');

  // Update selectedTemplate when profile theme changes
  useEffect(() => {
    if (profile?.theme) {
      setSelectedTemplate(profile.theme);
      console.log('SetupWizard: Theme updated to:', profile.theme);
    }
  }, [profile?.theme]);

  const steps = [
    { id: 1, title: 'Profile Setup', icon: User },
    { id: 2, title: 'Wallet Setup', icon: Wallet },
    { id: 3, title: 'Social Links', icon: LinkIcon },
    { id: 4, title: 'Template', icon: Palette },
    { id: 5, title: 'Complete', icon: CheckCircle }
  ];

  const templates = [
    {
      id: 'modern-dark',
      name: 'Modern Dark',
      colors: { primary: '#8B5CF6', secondary: '#EC4899', background: '#1F2937' },
      preview: 'bg-gray-900'
    },
    {
      id: 'minimal-light',
      name: 'Minimal Light',
      colors: { primary: '#3B82F6', secondary: '#10B981', background: '#FFFFFF' },
      preview: 'bg-white'
    },
    {
      id: 'vibrant-gradient',
      name: 'Vibrant Gradient',
      colors: { primary: '#FF6B6B', secondary: '#4ECDC4', background: '#F8F9FA' },
      preview: 'bg-gradient-to-br from-pink-100 to-blue-100'
    }
  ];

  const socialPlatforms = [
    { key: 'instagram', label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username' },
    { key: 'youtube', label: 'YouTube', icon: Youtube, placeholder: 'https://youtube.com/@username' },
    { key: 'twitter', label: 'Twitter', icon: Twitter, placeholder: 'https://twitter.com/username' },
    { key: 'facebook', label: 'Facebook', icon: Facebook, placeholder: 'https://facebook.com/username' },
    { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
    { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/username' },
    { key: 'email', label: 'Email', icon: Mail, placeholder: 'your@email.com' },
    { key: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, placeholder: 'https://wa.me/1234567890' }
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Update profile
      await updateProfile({
        display_name: profileData.displayName,
        username: profileData.username,
        bio: profileData.bio,
        website: profileData.website,
        avatar_url: profileData.avatar
      });

      // Add social links
      for (const [platform, url] of Object.entries(socialLinks)) {
        if (url.trim()) {
          await addLink({
            title: platform.charAt(0).toUpperCase() + platform.slice(1),
            url: url.trim(),
            platform: platform
          });
        }
      }

      toast({
        title: "Setup Complete!",
        description: "Your Droplink profile has been configured successfully",
      });

      onComplete?.();
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Error",
        description: "Failed to complete setup",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Set up your profile</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={profileData.username}
                    onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                    placeholder="your-username"
                    readOnly
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-blue-600 mt-1 flex items-center">
                    🔒 Username is secured by Pi Network authentication and cannot be changed
                  </p>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell people about yourself"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Set up your Pi Network wallet</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Wallet className="w-6 h-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Pi Network Wallet</h4>
                    <p className="text-sm text-blue-700">
                      Connect your Pi Network wallet to receive tips and payments
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="walletAddress">Pi Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    value={walletData.address}
                    onChange={(e) => setWalletData({ ...walletData, address: e.target.value })}
                    placeholder="Enter your Pi wallet address"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="walletConfigured"
                    checked={walletData.isConfigured}
                    onChange={(e) => setWalletData({ ...walletData, isConfigured: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="walletConfigured">I have configured my Pi Network wallet</Label>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add your social links</h3>
              <p className="text-gray-600 mb-6">Connect your social media profiles to your Droplink</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialPlatforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <div key={platform.key}>
                      <Label htmlFor={platform.key} className="flex items-center space-x-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{platform.label}</span>
                      </Label>
                      <Input
                        id={platform.key}
                        value={socialLinks[platform.key as keyof typeof socialLinks]}
                        onChange={(e) => setSocialLinks({ ...socialLinks, [platform.key]: e.target.value })}
                        placeholder={platform.placeholder}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose your template</h3>
              <p className="text-gray-600 mb-6">Select a design template for your profile</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className={`w-full h-24 rounded-lg ${template.preview} mb-3`}></div>
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600">Modern design with {template.name.toLowerCase()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Setup Complete!</h3>
              <p className="text-gray-600 mb-6">
                Your Droplink profile has been configured successfully. You can now share your profile and start receiving Pi tips!
              </p>
              <div className="flex justify-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(`/${profileData.username || 'username'}`, '_blank')}
                  className="flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>View Profile</span>
                </Button>
                <Button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{isLoading ? 'Completing...' : 'Share Profile'}</span>
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
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Wizard</h2>
        <p className="text-gray-600">Complete your Droplink profile setup in a few simple steps</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isActive 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          <span>{currentStep === 5 ? 'Complete Setup' : 'Next'}</span>
          {currentStep < 5 && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
};

export default SetupWizard;
