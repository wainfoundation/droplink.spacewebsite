// Enhanced Profile Editor Component
// Includes username auto-check, bio editing, and link management

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Copy,
  ExternalLink,
  Eye,
  TrendingUp,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileEditorProps {
  profile: any;
  onProfileUpdate: (profileData: any) => Promise<boolean>;
  className?: string;
}

const ProfileEditor: React.FC<ProfileEditorProps> = ({
  profile,
  onProfileUpdate,
  className
}) => {
  const { toast } = useToast();
  const [editedProfile, setEditedProfile] = useState(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [usernameCheck, setUsernameCheck] = useState<{
    status: 'idle' | 'checking' | 'available' | 'taken' | 'invalid';
    message?: string;
  }>({ status: 'idle' });
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  // Update local state when profile prop changes
  useEffect(() => {
    setEditedProfile(profile);
  }, [profile]);

  // Username availability check with debouncing
  const checkUsernameAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameCheck({ status: 'idle' });
      return;
    }

    setUsernameCheck({ status: 'checking' });

    try {
      const response = await fetch(`/api/check-username?username=${encodeURIComponent(username)}`);
      const data = await response.json();

      if (data.available) {
        setUsernameCheck({ 
          status: 'available', 
          message: 'Username is available' 
        });
      } else {
        setUsernameCheck({ 
          status: 'taken', 
          message: data.error || 'Username is already taken' 
        });
      }
    } catch (error) {
      console.error('Username check failed:', error);
      setUsernameCheck({ 
        status: 'invalid', 
        message: 'Failed to check username availability' 
      });
    }
  }, []);

  // Handle username input with debouncing
  const handleUsernameChange = (value: string) => {
    setEditedProfile(prev => ({ ...prev, username: value }));

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer for debounced check
    const timer = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);

    setDebounceTimer(timer);
  };

  // Handle profile save
  const handleSave = async () => {
    if (usernameCheck.status === 'taken' || usernameCheck.status === 'invalid') {
      toast({
        title: "Invalid Username",
        description: "Please choose a different username",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const success = await onProfileUpdate(editedProfile);
      if (success) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      }
    } catch (error) {
      console.error('Profile update failed:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Copy profile URL
  const copyProfileUrl = () => {
    const url = `${window.location.origin}/@${editedProfile.username}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({
        title: "Link Copied!",
        description: "Profile URL copied to clipboard",
      });
    });
  };

  // Open profile in new tab
  const openProfile = () => {
    const url = `/${editedProfile.username}`;
    window.open(url, '_blank');
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Username */}
          <div>
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <Input
                id="username"
                value={editedProfile.username || ''}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="Choose your username"
                className={`pr-10 ${
                  usernameCheck.status === 'available'
                    ? 'border-green-500 focus:border-green-500'
                    : usernameCheck.status === 'taken' || usernameCheck.status === 'invalid'
                    ? 'border-red-500 focus:border-red-500'
                    : ''
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {usernameCheck.status === 'checking' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                ) : usernameCheck.status === 'available' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : usernameCheck.status === 'taken' || usernameCheck.status === 'invalid' ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : null}
              </div>
            </div>
            
            {/* Username status message */}
            {usernameCheck.message && (
              <p className={`text-sm mt-1 ${
                usernameCheck.status === 'available' ? 'text-green-600' : 'text-red-600'
              }`}>
                {usernameCheck.message}
              </p>
            )}

            {/* Profile URL preview */}
            {editedProfile.username && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Your profile URL:</div>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-white px-2 py-1 rounded border text-blue-600">
                    {window.location.origin}/@{editedProfile.username}
                  </code>
                  <Button
                    onClick={copyProfileUrl}
                    variant="outline"
                    size="sm"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button
                    onClick={openProfile}
                    variant="outline"
                    size="sm"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Display Name */}
          <div>
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              value={editedProfile.display_name || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, display_name: e.target.value }))}
              placeholder="Your display name"
            />
          </div>

          {/* Bio */}
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editedProfile.bio || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell people about yourself"
              rows={3}
            />
          </div>

          {/* Avatar URL */}
          <div>
            <Label htmlFor="avatar_url">Avatar URL</Label>
            <Input
              id="avatar_url"
              value={editedProfile.avatar_url || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, avatar_url: e.target.value }))}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          {/* Website */}
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={editedProfile.website || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, website: e.target.value }))}
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={editedProfile.location || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Your location"
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Profile Preview</span>
            <Badge variant="outline">Live Preview</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg p-6 text-white">
            <div className="text-center">
              <img
                src={editedProfile.avatar_url || '/default-avatar.png'}
                alt={editedProfile.display_name || editedProfile.username}
                className="w-16 h-16 rounded-full border-2 border-white/20 mx-auto mb-4"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
              <h2 className="text-xl font-bold">
                {editedProfile.display_name || editedProfile.username || 'Your Name'}
              </h2>
              <p className="text-white/80 mb-2">
                @{editedProfile.username || 'username'}
              </p>
              {editedProfile.bio && (
                <p className="text-white/90 text-sm mb-4">
                  {editedProfile.bio}
                </p>
              )}
              <div className="flex justify-center space-x-4 text-sm text-white/70">
                {editedProfile.website && (
                  <a href={editedProfile.website} className="hover:text-white">
                    Website
                  </a>
                )}
                {editedProfile.location && (
                  <span>{editedProfile.location}</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end space-x-2">
        <Button
          onClick={handleSave}
          disabled={isSaving || usernameCheck.status === 'taken' || usernameCheck.status === 'invalid'}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileEditor;
