import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Settings, 
  User, 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Shield, 
  Key, 
  Wallet,
  Bell,
  Palette,
  Globe,
  Save,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';

interface SettingsSectionProps {
  user: any;
  profile: any;
  onProfileUpdate: (updates: any) => Promise<void>;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ 
  user, 
  profile, 
  onProfileUpdate 
}) => {
  const { toast } = useToast();
  const { signOut } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [resetConfirmText, setResetConfirmText] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || user?.user_metadata?.username || '',
    username: profile?.username || user?.user_metadata?.username || '',
    bio: profile?.bio || '',
    website: profile?.website || '',
    twitter: profile?.twitter || '',
    instagram: profile?.instagram || '',
    youtube: profile?.youtube || '',
    tiktok: profile?.tiktok || '',
    walletAddress: profile?.wallet_address || '',
    email: user?.email || '',
    notifications: true,
    theme: profile?.theme || 'modern-dark'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      await onProfileUpdate({
        display_name: formData.displayName,
        username: formData.username,
        bio: formData.bio,
        website: formData.website,
        twitter: formData.twitter,
        instagram: formData.instagram,
        youtube: formData.youtube,
        tiktok: formData.tiktok,
        wallet_address: formData.walletAddress,
        theme: formData.theme
      });

      toast({
        title: "Settings Saved",
        description: "Your settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAccount = async () => {
    if (resetConfirmText !== 'RESET') {
      toast({
        title: "Invalid Confirmation",
        description: "Please type 'RESET' to confirm account reset.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Reset profile data
      await onProfileUpdate({
        display_name: '',
        username: '',
        bio: '',
        website: '',
        twitter: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        wallet_address: '',
        theme: 'modern-dark',
        setup_completed: false
      });

      // Clear local storage
      localStorage.clear();

      toast({
        title: "Account Reset",
        description: "Your account has been reset. You'll need to complete setup again.",
      });

      setShowResetDialog(false);
      setResetConfirmText('');
      
      // Redirect to setup
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      toast({
        title: "Invalid Confirmation",
        description: "Please type 'DELETE' to confirm account deletion.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Clear all data
      await onProfileUpdate({
        display_name: '',
        username: '',
        bio: '',
        website: '',
        twitter: '',
        instagram: '',
        youtube: '',
        tiktok: '',
        wallet_address: '',
        theme: 'modern-dark',
        setup_completed: false
      });

      // Clear local storage
      localStorage.clear();

      // Sign out user
      await signOut();

      toast({
        title: "Account Deleted",
        description: "Your account has been deleted. You'll need to create a new account and select a plan.",
      });

      setShowDeleteDialog(false);
      setDeleteConfirmText('');
      
      // Redirect to home
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Your display name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="Your username"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about yourself"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-gray-500">Email cannot be changed</p>
          </div>
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                placeholder="@yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                placeholder="@yourusername"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={formData.youtube}
                onChange={(e) => handleInputChange('youtube', e.target.value)}
                placeholder="https://youtube.com/@yourchannel"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Wallet Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Pi Wallet Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="walletAddress">Pi Wallet Address</Label>
            <Input
              id="walletAddress"
              value={formData.walletAddress}
              onChange={(e) => handleInputChange('walletAddress', e.target.value)}
              placeholder="Enter your Pi Network wallet address"
              className="font-mono"
            />
            <p className="text-sm text-gray-500">
              Your Pi wallet address for receiving payments and donations
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <select
              id="theme"
              value={formData.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="modern-dark">Modern Dark</option>
              <option value="modern-light">Modern Light</option>
              <option value="gradient">Gradient</option>
              <option value="minimal">Minimal</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>

      {/* Account Actions */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Account Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Warning:</strong> These actions cannot be undone. Please proceed with caution.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4">
            {/* Reset Account */}
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will reset your account to its initial state. All your profile data, links, and settings will be cleared. 
                    You'll need to complete the setup process again.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resetConfirm">Type "RESET" to confirm:</Label>
                    <Input
                      id="resetConfirm"
                      value={resetConfirmText}
                      onChange={(e) => setResetConfirmText(e.target.value)}
                      placeholder="RESET"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetAccount}
                    disabled={isLoading || resetConfirmText !== 'RESET'}
                    className="bg-orange-600 hover:bg-orange-700"
                  >
                    {isLoading ? 'Resetting...' : 'Reset Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Delete Account */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Account</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account and all associated data. 
                    <strong>You will need to create a new account and select a new plan.</strong>
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      <strong>Important:</strong> After deletion, you'll need to:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Create a new account</li>
                        <li>Select a new plan (Free, Starter, or Pro)</li>
                        <li>Complete the setup process again</li>
                        <li>Reconfigure all your links and settings</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <Label htmlFor="deleteConfirm">Type "DELETE" to confirm:</Label>
                    <Input
                      id="deleteConfirm"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDeleteAccount}
                    disabled={isLoading || deleteConfirmText !== 'DELETE'}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    {isLoading ? 'Deleting...' : 'Delete Account'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSection;
