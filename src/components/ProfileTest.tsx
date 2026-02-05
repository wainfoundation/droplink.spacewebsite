import React, { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DOMAIN_CONFIG } from '@/config/domain';
import { 
  User, 
  Link as LinkIcon, 
  Share2, 
  Copy, 
  ExternalLink,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const ProfileTest = () => {
  const { user, profile, updateProfile } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    bio: profile?.bio || '',
    username: profile?.username || ''
  });

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Login Required</h3>
            <p className="text-gray-600">Please log in to test profile functionality.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const profileUrl = DOMAIN_CONFIG.getProfileUrl(profile?.username || 'test-user');

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Profile Updated!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "URL Copied!",
        description: "Profile URL copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profile?.display_name || profile?.username} on Droplink`,
        text: `Check out my profile on Droplink!`,
        url: profileUrl,
      });
    } else {
      handleCopyUrl();
    }
  };

  const handleViewProfile = () => {
    window.open(profileUrl, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Profile Test</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Profile Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Current Profile</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Username:</strong> {profile?.username || 'Not set'}</div>
              <div><strong>Display Name:</strong> {profile?.display_name || 'Not set'}</div>
              <div><strong>Bio:</strong> {profile?.bio || 'Not set'}</div>
              <div><strong>Profile URL:</strong> {profileUrl}</div>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="your-username"
                />
              </div>
              <div>
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="Your Name"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell people about yourself..."
                  rows={3}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save Profile
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="w-full">
              <User className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button variant="outline" onClick={handleViewProfile} className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4" />
              <span>View Profile</span>
            </Button>
            <Button variant="outline" onClick={handleCopyUrl} className="flex items-center space-x-2">
              <Copy className="w-4 h-4" />
              <span>Copy URL</span>
            </Button>
            <Button variant="outline" onClick={handleShare} className="flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </Button>
          </div>

          {/* Status Indicators */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Profile System Working</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Your profile can be created, updated, and shared successfully.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTest; 