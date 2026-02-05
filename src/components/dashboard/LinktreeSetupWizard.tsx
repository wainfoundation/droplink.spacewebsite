import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useLinks } from '@/hooks/useLinks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  ArrowRight, 
  Link as LinkIcon, 
  Copy, 
  Share2, 
  Eye,
  Plus,
  Sparkles,
  Save,
  Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ProfileStorage, ProfileData, LinkData } from '@/utils/profileStorage';
import { supabase } from '@/integrations/supabase/client';
import { getLinkUrl } from '@/utils/url-helper';

interface DroplinkSetupWizardProps {
  onComplete: () => void;
}

const DroplinkSetupWizard: React.FC<DroplinkSetupWizardProps> = ({ onComplete }) => {
  const { user, profile } = useUser();
  const { addLink } = useLinks(user?.id);
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    displayName: profile?.display_name || user?.user_metadata?.displayName || user?.user_metadata?.username || 'User',
    bio: profile?.bio || `Hi, I'm ${user?.user_metadata?.username || 'User'}! I'm using Droplink to manage my Pi Network presence.`,
    avatar: profile?.avatar_url || user?.user_metadata?.avatar || `https://placehold.co/100x100/8B5CF6/FFFFFF?text=${(user?.user_metadata?.username || 'U').charAt(0).toUpperCase()}`
  });
  const [quickLinks, setQuickLinks] = useState([
    { title: 'My Website', url: 'https://example.com', icon: '🌐' },
    { title: 'Instagram', url: 'https://instagram.com/yourusername', icon: '📷' },
    { title: 'Contact Me', url: 'mailto:your@email.com', icon: '📧' }
  ]);

  const totalSteps = 3;

  const saveProfileToSupabase = async (profileData: any) => {
    if (!user?.id) {
      console.warn('No user ID available for profile save');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
          display_name: profileData.displayName,
          bio: profileData.bio,
          avatar_url: profileData.avatar,
          theme: 'gradient',
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving profile to Supabase:', error);
        throw error;
      }
      console.log('Profile saved to Supabase successfully');
    } catch (error) {
      console.error('Failed to save profile to Supabase:', error);
      throw error;
    }
  };

  const saveProfileToLocalStorage = (profileData: any) => {
    if (!user?.user_metadata?.username) {
      console.warn('No username available for localStorage save');
      return;
    }

    try {
      const username = user.user_metadata.username;
      const profileStorageData: ProfileData = {
        username: username,
        displayName: profileData.displayName,
        bio: profileData.bio,
        avatar: profileData.avatar,
        location: 'Global',
        isVerified: true,
        theme: 'gradient',
        customColors: {
          primary: '#8B5CF6',
          secondary: '#EC4899',
          background: '#F3F4F6'
        }
      };

      ProfileStorage.saveProfile(username, profileStorageData);
      console.log('Profile saved to localStorage successfully');
    } catch (error) {
      console.error('Failed to save profile to localStorage:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Save profile data to Supabase
      await saveProfileToSupabase(profileData);
      
      // Save profile data to localStorage
      saveProfileToLocalStorage(profileData);
      
      // Add quick links to Supabase
      const validLinks = quickLinks.filter(link => link.title && link.url);
      
      for (const link of validLinks) {
        await addLink({
          title: link.title,
          url: link.url,
          icon: link.icon,
          is_active: true
        });
      }
      
      // Save links to localStorage
      if (user?.user_metadata?.username) {
        const linksStorageData: LinkData[] = validLinks.map((link, index) => ({
          id: `link_${index + 1}`,
          title: link.title,
          url: link.url,
          icon: link.icon,
          is_active: true,
          clicks: 0,
          type: 'link'
        }));
        
        ProfileStorage.saveLinks(user.user_metadata.username, linksStorageData);
      }

      console.log('Profile setup completed with real data:', { profileData, validLinks });

      toast({
        title: "Setup Complete!",
        description: "Your Droplink profile is ready to share with real data.",
      });

      onComplete();
    } catch (error) {
      console.error('Error completing setup:', error);
      toast({
        title: "Setup Error",
        description: "Failed to complete setup. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateQuickLink = (index: number, field: string, value: string) => {
    const updated = [...quickLinks];
    updated[index] = { ...updated[index], [field]: value };
    setQuickLinks(updated);
  };

  const getProfileUrl = () => {
    const username = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'user';
    return getLinkUrl(username);
  };

  const copyProfileUrl = async () => {
    try {
      await navigator.clipboard.writeText(getProfileUrl());
      toast({
        title: "Link Copied!",
        description: "Your Droplink URL has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Droplink!</h2>
        <p className="text-gray-600">Let's set up your profile in just a few steps</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <Input
              value={profileData.displayName}
              onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
              placeholder="Your name or brand"
              className="text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be shown as your main name on your profile
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bio
            </label>
            <Textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              placeholder="Tell people about yourself..."
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              A short description that appears below your name
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover"
              />
              <div className="flex-1">
                <Input
                  value={profileData.avatar}
                  onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                  placeholder="Enter image URL"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter a URL to your profile picture
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Your Links</h2>
        <p className="text-gray-600">Add your most important links to get started</p>
      </div>

      <div className="space-y-4">
        {quickLinks.map((link, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl">{link.icon}</div>
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    value={link.title}
                    onChange={(e) => updateQuickLink(index, 'title', e.target.value)}
                    placeholder="Link title"
                  />
                  <Input
                    value={link.url}
                    onChange={(e) => updateQuickLink(index, 'url', e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Don't worry, you can add more links later!</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">You're All Set!</h2>
        <p className="text-gray-600">Your Droplink is ready to share with the world</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Droplink URL</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-gray-500" />
              <code className="flex-1 text-sm font-mono text-gray-700">
                {getProfileUrl()}
              </code>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={copyProfileUrl} className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl p-6 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl font-bold">
                {profileData.displayName.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">{profileData.displayName || 'Your Name'}</h3>
            <p className="text-sm opacity-90 mb-4">@{profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'username'}</p>
            <p className="text-sm opacity-80 mb-4">{profileData.bio || 'Your bio...'}</p>
            <div className="space-y-2">
              {quickLinks.filter(link => link.title && link.url).map((link, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
                  {link.icon} {link.title}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
          <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          Back
        </Button>
        <Button onClick={handleNext}>
          {currentStep === totalSteps ? 'Complete Setup' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DroplinkSetupWizard;
