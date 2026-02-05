import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Copy, ExternalLink, Eye, Share2, Link as LinkIcon } from 'lucide-react';
import DroplinkPreview from '@/components/preview/DroplinkPreview';

const LocalhostTest: React.FC = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState({
    username: 'testuser',
    displayName: 'Test User',
    bio: 'This is a test bio for localhost testing',
    avatar: ''
  });
  
  const [links, setLinks] = useState([
    { id: '1', title: 'My Website', url: 'https://example.com', platform: 'website' },
    { id: '2', title: 'Twitter', url: 'https://twitter.com/testuser', platform: 'twitter' },
    { id: '3', title: 'Instagram', url: 'https://instagram.com/testuser', platform: 'instagram' }
  ]);
  
  const [newLink, setNewLink] = useState({ title: '', url: '', platform: 'website' });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDroplinkPreviewOpen, setIsDroplinkPreviewOpen] = useState(false);

  const profileUrl = `${window.location.origin}/@${profile.username}`;
  const previewUrl = `${window.location.origin}/profile/${profile.username}`;

  const handleAddLink = () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Error",
        description: "Please fill in both title and URL",
        variant: "destructive"
      });
      return;
    }
    
    const link = {
      id: Date.now().toString(),
      ...newLink
    };
    
    setLinks([...links, link]);
    setNewLink({ title: '', url: '', platform: 'website' });
    
    toast({
      title: "Link Added",
      description: "New link added to your profile"
    });
  };

  const handleRemoveLink = (id: string) => {
    setLinks(links.filter(link => link.id !== id));
    toast({
      title: "Link Removed",
      description: "Link removed from your profile"
    });
  };

  const copyProfileUrl = () => {
    navigator.clipboard.writeText(profileUrl).then(() => {
      toast({
        title: "Link Copied!",
        description: "Profile URL copied to clipboard"
      });
    });
  };

  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  const openDroplinkPreview = () => {
    setIsDroplinkPreviewOpen(true);
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.displayName}'s Profile`,
          text: `Check out ${profile.displayName}'s profile`,
          url: profileUrl,
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      copyProfileUrl();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Localhost Test - Profile & Links</h1>
          <p className="text-gray-600">Test profile creation and link management functionality</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Profile Editor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  placeholder="Enter display name"
                />
              </div>
              
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Tell people about yourself"
                  rows={3}
                />
              </div>

              {/* Profile URL Preview */}
              {profile.username && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Your profile URL:</div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 bg-white px-2 py-1 rounded border text-blue-600 text-sm">
                      {profileUrl}
                    </code>
                    <Button onClick={copyProfileUrl} variant="outline" size="sm">
                      <Copy className="w-3 h-3 mr-1" />
                      Copy
                    </Button>
                    <Button onClick={openPreview} variant="outline" size="sm">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Links Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LinkIcon className="w-5 h-5" />
                Links Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Link */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="linkTitle">Link Title</Label>
                  <Input
                    id="linkTitle"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    placeholder="Enter link title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="linkUrl">URL</Label>
                  <Input
                    id="linkUrl"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="linkPlatform">Platform</Label>
                  <select
                    id="linkPlatform"
                    value={newLink.platform}
                    onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="website">Website</option>
                    <option value="twitter">Twitter</option>
                    <option value="instagram">Instagram</option>
                    <option value="youtube">YouTube</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="github">GitHub</option>
                  </select>
                </div>
                
                <Button onClick={handleAddLink} className="w-full">
                  Add Link
                </Button>
              </div>

              {/* Current Links */}
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">Current Links ({links.length})</h3>
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{link.title}</div>
                      <div className="text-xs text-gray-500 truncate">{link.url}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {link.platform}
                      </Badge>
                      <Button
                        onClick={() => handleRemoveLink(link.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          <Button onClick={openDroplinkPreview} className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Droplink Preview
          </Button>
          
          <Button onClick={openPreview} variant="outline" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Basic Preview
          </Button>
          
          <Button onClick={shareProfile} variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
          
          <Button onClick={copyProfileUrl} variant="outline" className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy Profile URL
          </Button>
        </div>

        {/* Profile Preview Modal */}
        {isPreviewOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="text-lg font-semibold">Profile Preview</h3>
                <Button
                  onClick={() => setIsPreviewOpen(false)}
                  variant="outline"
                  size="sm"
                >
                  Close
                </Button>
              </div>
              
              <div className="p-4">
                {/* Profile Header */}
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{profile.displayName}</h2>
                  <p className="text-gray-600">@{profile.username}</p>
                  <p className="text-gray-700 mt-2">{profile.bio}</p>
                </div>

                {/* Links */}
                <div className="space-y-3">
                  {links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-gray-900">{link.title}</div>
                          <div className="text-sm text-gray-500">{link.url}</div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Droplink Preview Modal */}
        <DroplinkPreview
          isOpen={isDroplinkPreviewOpen}
          onClose={() => setIsDroplinkPreviewOpen(false)}
          profile={{
            username: profile.username,
            displayName: profile.displayName,
            bio: profile.bio,
            avatar: profile.avatar,
            isVerified: false
          }}
          links={links}
          profileUrl={profileUrl}
        />
      </div>
    </div>
  );
};

export default LocalhostTest;
