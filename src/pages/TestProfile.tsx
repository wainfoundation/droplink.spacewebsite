import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';

const TestProfile = () => {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    displayName: profile?.display_name || '',
    bio: profile?.bio || '',
    username: profile?.username || '',
    links: [
      { title: 'Instagram', url: 'https://instagram.com/test', icon: '📷', enabled: true },
      { title: 'YouTube', url: 'https://youtube.com/@test', icon: '🎥', enabled: true },
      { title: 'Website', url: 'https://example.com', icon: '🌐', enabled: false },
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in first",
        description: "You need to be logged in to create a profile",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Update profile
      await updateProfile({
        display_name: formData.displayName,
        bio: formData.bio,
        username: formData.username,
        onboarding_completed: true
      });

      // Save links
      const enabledLinks = formData.links.filter(link => link.enabled && link.url);
      
      if (enabledLinks.length > 0) {
        // Use real database
        const { supabase } = await import('@/integrations/supabase/client');
        
        const linksToInsert = enabledLinks.map((link, index) => ({
          user_id: user.id,
          title: link.title,
          url: link.url,
          icon: link.icon,
          position: index,
          is_active: true
        }));
        
        const { error: linksError } = await supabase
          .from('links')
          .insert(linksToInsert);
          
        if (linksError) {
          console.error('Error saving links:', linksError);
        }
      }

      toast({
        title: "Profile created successfully! 🎉",
        description: `Your profile is now live at droplink.space/@${formData.username}`,
      });

      // Navigate to the profile
      navigate(`/@${formData.username}`);
      
    } catch (error) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error creating profile",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, enabled: !link.enabled } : link
      )
    }));
  };

  const updateLinkUrl = (index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, url } : link
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Test Profile Creation</CardTitle>
            <p className="text-gray-600">Create a test profile to verify the fix</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Display Name *</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your name or brand"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="your-username"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Profile URL: droplink.space/@{formData.username || 'username'}
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell people about yourself..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label>Links</Label>
                <div className="space-y-3 mt-2">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleLink(index)}
                        className={`w-8 h-8 p-0 ${link.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
                      >
                        {link.enabled ? '✓' : link.icon}
                      </Button>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{link.icon}</span>
                          <span className="font-medium">{link.title}</span>
                        </div>
                        
                        {link.enabled && (
                          <Input
                            value={link.url}
                            onChange={(e) => updateLinkUrl(index, e.target.value)}
                            placeholder={`Your ${link.title} URL`}
                            className="mt-2"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !formData.displayName || !formData.bio || !formData.username}
                >
                  {isLoading ? 'Creating...' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestProfile; 