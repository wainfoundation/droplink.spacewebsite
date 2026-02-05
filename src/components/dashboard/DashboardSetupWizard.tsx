import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Link as LinkIcon, 
  Palette, 
  Upload, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  Camera,
  Globe,
  MessageCircle,
  Heart,
  Share2,
  Settings,
  Image,
  X,
  Wallet,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';

interface DashboardSetupWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}

const DashboardSetupWizard: React.FC<DashboardSetupWizardProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarType, setAvatarType] = useState<'upload' | 'icon' | 'url'>('upload');
  const [selectedIcon, setSelectedIcon] = useState<string>('');
  const { toast } = useToast();
  const { user, profile, updateProfile } = useUser();

  // Form data
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    avatar: '',
    theme: 'modern-dark',
    walletAddress: '',
    links: [],
    socialLinks: {
      website: '',
      twitter: '',
      instagram: '',
      youtube: '',
      tiktok: '',
      github: '',
      email: '',
      whatsapp: ''
    }
  });

  // Initialize with Pi username if available
  useEffect(() => {
    if (!formData.username && !formData.displayName) {
      const piAuthResult = localStorage.getItem('pi_auth_result');
      if (piAuthResult) {
        try {
          const piAuth = JSON.parse(piAuthResult);
          if (piAuth.user && piAuth.user.username) {
            console.log('DashboardSetupWizard: Found Pi username:', piAuth.user.username);
            setFormData(prev => ({
              ...prev,
              username: piAuth.user.username,
              displayName: piAuth.user.username
            }));
          }
        } catch (error) {
          console.error('Error parsing Pi auth result in DashboardSetupWizard:', error);
        }
      }
    }
  }, []);

  const totalSteps = 6;

  // Ready-made avatar icons
  const avatarIcons = [
    { id: 'user-1', emoji: '👤', name: 'User 1' },
    { id: 'user-2', emoji: '👨', name: 'User 2' },
    { id: 'user-3', emoji: '👩', name: 'User 3' },
    { id: 'user-4', emoji: '🧑', name: 'User 4' },
    { id: 'user-5', emoji: '👨‍💼', name: 'Business' },
    { id: 'user-6', emoji: '👩‍💼', name: 'Business Woman' },
    { id: 'user-7', emoji: '👨‍🎨', name: 'Artist' },
    { id: 'user-8', emoji: '👩‍🎨', name: 'Artist Woman' },
    { id: 'user-9', emoji: '👨‍💻', name: 'Developer' },
    { id: 'user-10', emoji: '👩‍💻', name: 'Developer Woman' },
    { id: 'user-11', emoji: '👨‍🎓', name: 'Student' },
    { id: 'user-12', emoji: '👩‍🎓', name: 'Student Woman' },
    { id: 'user-13', emoji: '🤵', name: 'Formal' },
    { id: 'user-14', emoji: '👰', name: 'Formal Woman' },
    { id: 'user-15', emoji: '🧑‍🚀', name: 'Astronaut' },
    { id: 'user-16', emoji: '🧑‍🎤', name: 'Singer' }
  ];

  useEffect(() => {
    // Load existing profile data
    if (profile) {
      setFormData({
        displayName: profile.display_name || user?.user_metadata?.display_name || '',
        username: profile.username || user?.user_metadata?.username || '',
        bio: profile.bio || '',
        avatar: profile.avatar_url || user?.user_metadata?.avatar_url || '',
        theme: profile.theme || 'modern-dark',
        walletAddress: profile.wallet_address || user?.user_metadata?.wallet_address || '',
        links: profile.links || [],
        socialLinks: {
          website: profile.website || '',
          twitter: profile.twitter || '',
          instagram: profile.instagram || '',
          youtube: profile.youtube || '',
          tiktok: profile.tiktok || '',
          github: profile.github || '',
          email: profile.email || '',
          whatsapp: profile.whatsapp || ''
        }
      });
    }
  }, [profile, user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, GIF)",
          variant: "destructive",
        });
        return;
      }

      // Create object URL for preview
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        avatar: imageUrl
      }));
      setAvatarType('upload');
    }
  };

  const handleIconSelect = (iconId: string) => {
    setSelectedIcon(iconId);
    setFormData(prev => ({
      ...prev,
      avatar: iconId
    }));
    setAvatarType('icon');
  };

  const validateWalletAddress = (address: string): boolean => {
    // Pi Network wallet address validation (starts with G and is 56 characters)
    return address.startsWith('G') && address.length === 56;
  };

  const copyWalletAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard",
    });
  };

  const openInExplorer = (address: string) => {
    const explorerUrl = `https://api.sandbox.minepi.com/accounts/${address}`;
    window.open(explorerUrl, '_blank');
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
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
      console.log('Starting profile update with data:', {
        display_name: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        avatar_url: formData.avatar,
        theme: formData.theme,
        template: formData.theme // Use theme as template
      });

      // Try to save to database first
      try {
        await updateProfile({
          display_name: formData.displayName,
          username: formData.username,
          bio: formData.bio,
          avatar_url: formData.avatar,
          theme: formData.theme,
          template: formData.theme, // Map theme to template field
          wallet_address: formData.walletAddress,
          website: formData.socialLinks.website,
          twitter: formData.socialLinks.twitter,
          instagram: formData.socialLinks.instagram,
          youtube: formData.socialLinks.youtube,
          tiktok: formData.socialLinks.tiktok,
          github: formData.socialLinks.github,
          email: formData.socialLinks.email,
          whatsapp: formData.socialLinks.whatsapp,
          setup_completed: true
        });
        console.log('Profile update successful');
      } catch (dbError) {
        console.warn('Database save failed, using localStorage fallback:', dbError);
        // Fallback to localStorage if database fails
        const profileData = {
          display_name: formData.displayName,
          username: formData.username,
          bio: formData.bio,
          avatar_url: formData.avatar,
          theme: formData.theme,
          template: formData.theme,
          wallet_address: formData.walletAddress,
          website: formData.socialLinks.website,
          twitter: formData.socialLinks.twitter,
          instagram: formData.socialLinks.instagram,
          youtube: formData.socialLinks.youtube,
          tiktok: formData.socialLinks.tiktok,
          github: formData.socialLinks.github,
          email: formData.socialLinks.email,
          whatsapp: formData.socialLinks.whatsapp,
          setup_completed: true
        };
        localStorage.setItem('userProfile', JSON.stringify(profileData));
        console.log('Profile saved to localStorage as fallback');
      }

      // Also save to localStorage for backward compatibility
      if (formData.walletAddress) {
        localStorage.setItem('userWalletAddress', formData.walletAddress);
        console.log('Wallet address saved to localStorage:', formData.walletAddress);
      }

      localStorage.setItem('userSocialLinks', JSON.stringify(formData.socialLinks));
      console.log('Social links saved to localStorage:', formData.socialLinks);

      toast({
        title: "Setup Complete!",
        description: "Your Droplink profile has been configured successfully.",
      });

      onComplete();
    } catch (error) {
      console.error('Failed to save profile:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        // Handle Supabase errors
        if ('message' in error) {
          errorMessage = String(error.message);
        } else if ('error' in error && typeof error.error === 'object' && error.error !== null && 'message' in error.error) {
          errorMessage = String(error.error.message);
        }
      }
      
      console.error('Detailed error:', error);
      
      toast({
        title: "Setup Failed",
        description: `Failed to save profile: ${errorMessage}. Please try again or contact support.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome to Droplink!</h3>
              <p className="text-gray-600">Let's set up your profile to get started</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Enter your display name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter your username"
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                />
                <p className="text-sm text-gray-500">This will be your unique Droplink URL</p>
                <p className="text-xs text-blue-600 flex items-center">
                  🔒 Username is secured by Pi Network authentication and cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Your Links</h3>
              <p className="text-gray-600">Connect your social media and important links</p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                <p className="text-sm text-blue-800 flex items-center justify-center">
                  💡 <strong>Tip:</strong> You can skip this step and add your links later in the dashboard
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.socialLinks.website}
                  onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socialLinks.twitter}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="@yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socialLinks.instagram}
                  onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                  placeholder="@yourusername"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  value={formData.socialLinks.youtube}
                  onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Theme</h3>
              <p className="text-gray-600">Select a theme that matches your style</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'modern-dark', name: 'Modern Dark', preview: 'bg-gray-900 text-white' },
                { id: 'modern-light', name: 'Modern Light', preview: 'bg-white text-gray-900 border' },
                { id: 'minimal', name: 'Minimal', preview: 'bg-gray-50 text-gray-900' },
                { id: 'colorful', name: 'Colorful', preview: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' }
              ].map((theme) => (
                <div
                  key={theme.id}
                  className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${
                    formData.theme === theme.id 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleInputChange('theme', theme.id)}
                >
                  <div className={`w-full h-20 rounded ${theme.preview} flex items-center justify-center mb-2`}>
                    <span className="text-sm font-medium">Preview</span>
                  </div>
                  <p className="text-sm font-medium text-center">{theme.name}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Avatar</h3>
              <p className="text-gray-600">Add a profile picture to personalize your page</p>
            </div>

            {/* Avatar Preview */}
            <div className="flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                {formData.avatar ? (
                  avatarType === 'icon' ? (
                    <span className="text-4xl">
                      {avatarIcons.find(icon => icon.id === formData.avatar)?.emoji}
                    </span>
                  ) : (
                    <img 
                      src={formData.avatar} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  )
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
            </div>

            {/* Avatar Type Selection */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={avatarType === 'upload' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAvatarType('upload')}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  variant={avatarType === 'icon' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAvatarType('icon')}
                  className="flex-1"
                >
                  <User className="w-4 h-4 mr-2" />
                  Choose Icon
                </Button>
                <Button
                  variant={avatarType === 'url' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setAvatarType('url')}
                  className="flex-1"
                >
                  <Image className="w-4 h-4 mr-2" />
                  Enter URL
                </Button>
              </div>

              {/* Upload Image */}
              {avatarType === 'upload' && (
                <div className="space-y-2">
                  <Label htmlFor="file-upload">Upload Image</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </label>
                  </div>
                </div>
              )}

              {/* Choose Icon */}
              {avatarType === 'icon' && (
                <div className="space-y-2">
                  <Label>Choose an Avatar Icon</Label>
                  <div className="grid grid-cols-4 gap-3 max-h-48 overflow-y-auto">
                    {avatarIcons.map((icon) => (
                      <div
                        key={icon.id}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedIcon === icon.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleIconSelect(icon.id)}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-1">{icon.emoji}</div>
                          <p className="text-xs text-gray-600">{icon.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enter URL */}
              {avatarType === 'url' && (
                <div className="space-y-2">
                  <Label htmlFor="avatar-url">Avatar URL</Label>
                  <Input
                    id="avatar-url"
                    value={formData.avatar}
                    onChange={(e) => {
                      handleInputChange('avatar', e.target.value);
                      setAvatarType('url');
                    }}
                    placeholder="https://example.com/your-avatar.jpg"
                  />
                  <p className="text-sm text-gray-500">Enter a URL to your profile picture</p>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Set Your Pi Wallet</h3>
              <p className="text-gray-600">Add your Pi wallet address to receive donations and payments</p>
            </div>

            <div className="space-y-4">
              {/* Info Box */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Receive Pi Payments</p>
                    <p>Your wallet address will be used to receive:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Donations from supporters</li>
                      <li>Payments from digital product sales</li>
                      <li>Tips from your content</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Wallet Address Input */}
              <div className="space-y-2">
                <Label htmlFor="wallet-address">Pi Wallet Address</Label>
                <Input
                  id="wallet-address"
                  value={formData.walletAddress}
                  onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                  placeholder="Enter your Pi Network wallet address (starts with G)"
                  className={`font-mono text-sm ${
                    formData.walletAddress && !validateWalletAddress(formData.walletAddress)
                      ? 'border-red-300 focus:border-red-500'
                      : formData.walletAddress && validateWalletAddress(formData.walletAddress)
                      ? 'border-green-300 focus:border-green-500'
                      : ''
                  }`}
                />
                <div className="flex items-center gap-2">
                  {formData.walletAddress && (
                    <>
                      {validateWalletAddress(formData.walletAddress) ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Valid Pi Network address</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600">
                          <X className="w-4 h-4" />
                          <span className="text-sm">Invalid wallet address</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Your Pi wallet address starts with 'G' and is 56 characters long
                </p>
              </div>

              {/* Wallet Address Display */}
              {formData.walletAddress && validateWalletAddress(formData.walletAddress) && (
                <div className="space-y-2">
                  <Label>Your Wallet Address</Label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <code className="flex-1 text-sm font-mono text-gray-800">
                      {formData.walletAddress.length > 20 
                        ? `${formData.walletAddress.slice(0, 10)}...${formData.walletAddress.slice(-10)}`
                        : formData.walletAddress
                      }
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyWalletAddress(formData.walletAddress)}
                      className="h-8 w-8 p-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openInExplorer(formData.walletAddress)}
                      className="h-8 w-8 p-0"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Optional Note */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Note:</strong> You can skip this step and add your wallet address later in the dashboard settings.
                </p>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">You're All Set!</h3>
              <p className="text-gray-600">Review your profile and complete the setup</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  {formData.avatar ? (
                    avatarType === 'icon' ? (
                      <span className="text-xl">
                        {avatarIcons.find(icon => icon.id === formData.avatar)?.emoji}
                      </span>
                    ) : (
                      <img 
                        src={formData.avatar} 
                        alt="Avatar" 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )
                  ) : (
                    <User className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <div>
                  <h4 className="font-semibold">{formData.displayName || 'Your Name'}</h4>
                  <p className="text-sm text-gray-600">@{formData.username || 'username'}</p>
                </div>
              </div>

              {formData.bio && (
                <p className="text-sm text-gray-700">{formData.bio}</p>
              )}

              {/* Wallet Address */}
              {formData.walletAddress && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <Wallet className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Pi Wallet: {formData.walletAddress.length > 20 
                      ? `${formData.walletAddress.slice(0, 10)}...${formData.walletAddress.slice(-10)}`
                      : formData.walletAddress
                    }
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {Object.entries(formData.socialLinks).map(([platform, url]) => (
                  url && (
                    <Badge key={platform} variant="outline" className="text-xs">
                      {platform}: {url}
                    </Badge>
                  )
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#0ea5e9]">Droplink Setup</CardTitle>
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  i + 1 <= currentStep
                    ? 'bg-[#0ea5e9] text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Step {currentStep} of {totalSteps}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={currentStep === 1 ? onSkip : handlePrevious}
              disabled={isLoading}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {currentStep === 1 ? 'Skip Setup' : 'Previous'}
            </Button>

            {currentStep < totalSteps ? (
              <Button onClick={handleNext} disabled={isLoading}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={isLoading}>
                {isLoading ? 'Completing...' : 'Complete Setup'}
                <CheckCircle className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSetupWizard;
