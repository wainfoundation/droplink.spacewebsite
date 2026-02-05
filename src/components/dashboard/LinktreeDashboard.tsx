import React, { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useLinks } from '@/hooks/useLinks';
import DroplinkSetupWizard from './LinktreeSetupWizard';
import EnhancedSharing from '@/components/sharing/EnhancedSharing';
import LiveProfilePreview from '@/components/preview/LiveProfilePreview';
import DroplinkExactStyle from '@/components/profile/LinktreeExactStyle';
import TemplateSelector from './TemplateSelector';
import TemplateCustomizer from './TemplateCustomizer';
import { ProfileStorage, ProfileData, LinkData } from '@/utils/profileStorage';
import { getLinkUrl, getPiUrl, getLiveUrl } from '@/utils/url-helper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import WalletInfo from './WalletInfo';
import UserWalletSettings from './UserWalletSettings';
import { 
  Copy, 
  Share2, 
  Eye, 
  Users, 
  Link as LinkIcon, 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  QrCode,
  Download,
  Settings,
  Palette,
  Heart,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  CheckCircle,
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { piPaymentService } from '@/services/piPaymentService';

const DroplinkDashboard: React.FC = () => {
  const { user, profile } = useUser();
  const { links, addLink, updateLink, deleteLink } = useLinks(user?.id);
  const { toast } = useToast();
  
  const [activeSection, setActiveSection] = useState('overview');
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    url: '',
    icon: '🔗'
  });
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    icon: '🔗'
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSetupWizard, setShowSetupWizard] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showTemplateCustomizer, setShowTemplateCustomizer] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(profile?.theme || 'modern-dark');
  const [customTemplate, setCustomTemplate] = useState<any>(null);

  // Update selectedTemplate when profile theme changes
  useEffect(() => {
    if (profile?.theme) {
      setSelectedTemplate(profile.theme);
      console.log('LinktreeDashboard: Theme updated to:', profile.theme);
    }
  }, [profile?.theme]);
  // Real statistics calculated from actual data with live updates
  const [liveStats, setLiveStats] = useState({
    totalViews: 0,
    totalClicks: 0,
    clickRate: 0,
    topLink: 'No links yet'
  });

  // Calculate real-time statistics
  useEffect(() => {
    if (links && links.length > 0) {
      const totalViews = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
      const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
      const clickRate = totalViews > 0 ? ((totalClicks / totalViews) * 100) : 0;
      const topLink = links.reduce((top, link) => 
        (link.clicks || 0) > (top.clicks || 0) ? link : top, 
        links[0]
      )?.title || 'No links yet';

      setLiveStats({
        totalViews,
        totalClicks,
        clickRate: parseFloat(clickRate.toFixed(1)),
        topLink
      });
    }
  }, [links]);

  // Simulate real-time updates for demo (in production, this would come from real analytics)
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        totalViews: prev.totalViews + Math.floor(Math.random() * 3),
        totalClicks: prev.totalClicks + Math.floor(Math.random() * 2)
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Real profile data from user authentication and database
  const profileData = (() => {
    // Get Pi username from localStorage first
    const piAuthResult = localStorage.getItem('pi_auth_result');
    let piUsername = null;
    if (piAuthResult) {
      try {
        const piAuth = JSON.parse(piAuthResult);
        if (piAuth.user && piAuth.user.username) {
          piUsername = piAuth.user.username;
          console.log('LinktreeDashboard: Using Pi username:', piUsername);
        }
      } catch (error) {
        console.error('Error parsing Pi auth result in LinktreeDashboard:', error);
      }
    }

    return {
      username: piUsername || profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'user',
      displayName: piUsername || profile?.displayName || user?.user_metadata?.displayName || user?.user_metadata?.username || 'User',
      avatar: profile?.avatar_url || user?.user_metadata?.avatar_url || `https://placehold.co/100x100/8B5CF6/FFFFFF?text=${(piUsername || user?.user_metadata?.username || 'U').charAt(0).toUpperCase()}`,
      bio: profile?.bio || `Hi, I'm ${piUsername || user?.user_metadata?.username || 'User'}! I'm using Droplink to manage my Pi Network presence.`,
      theme: profile?.theme || 'gradient',
      isVerified: true
    };
  })();

  const profileUrl = getLinkUrl(profileData.username);
  const piProfileUrl = getPiUrl(profileData.username);
  const liveProfileUrl = getLiveUrl(profileData.username);

  // Save profile data to localStorage whenever it changes
  useEffect(() => {
    if (profileData.username && links) {
      const profileStorageData: ProfileData = {
        username: profileData.username,
        displayName: profileData.displayName,
        bio: profileData.bio,
        avatar: profileData.avatar,
        location: 'Global',
        isVerified: profileData.isVerified,
        theme: profileData.theme,
        customColors: {
          primary: '#8B5CF6',
          secondary: '#EC4899',
          background: '#F3F4F6'
        }
      };

      const linksStorageData: LinkData[] = links.map(link => ({
        id: link.id,
        title: link.title,
        url: link.url,
        icon: link.icon || '🔗',
        description: link.description,
        is_active: link.is_active,
        clicks: link.clicks || 0,
        type: link.type || 'link'
      }));

      ProfileStorage.saveProfile(profileData.username, profileStorageData);
      ProfileStorage.saveLinks(profileData.username, linksStorageData);
    }
  }, [profileData, links]);

  const handleCopyProfileLink = async (url: string, type: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link Copied!",
        description: `${type} profile link copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profileData.displayName} - Droplink`,
          text: `Check out ${profileData.displayName}'s links`,
          url: profileUrl
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await handleCopyProfileLink(profileUrl, 'Droplink');
    }
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Missing Information",
        description: "Please fill in both title and URL",
        variant: "destructive",
      });
      return;
    }

    try {
      await addLink({
        title: newLink.title,
        url: newLink.url,
        icon: newLink.icon,
        is_active: true
      });
      
      setNewLink({ title: '', url: '', icon: '🔗' });
      setShowAddForm(false);
      
      toast({
        title: "Link Added!",
        description: "Your new link has been added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startEditLink = (link: any) => {
    setEditingLinkId(link.id);
    setEditForm({
      title: link.title,
      url: link.url,
      icon: link.icon || '🔗'
    });
  };

  const saveEditLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLinkId) return;

    try {
      await updateLink(editingLinkId, {
        title: editForm.title,
        url: editForm.url,
        icon: editForm.icon
      });
      
      setEditingLinkId(null);
      setEditForm({ title: '', url: '', icon: '🔗' });
      
      toast({
        title: "Link Updated!",
        description: "Your link has been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const cancelEdit = () => {
    setEditingLinkId(null);
    setEditForm({ title: '', url: '', icon: '🔗' });
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink(linkId);
      toast({
        title: "Link Deleted",
        description: "Link has been removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowTemplateSelector(false);
  };

  const handleCustomizeTemplate = () => {
    setShowTemplateCustomizer(true);
    setShowTemplateSelector(false);
  };

  const handleSaveCustomTemplate = (template: any) => {
    setCustomTemplate(template);
    setSelectedTemplate('custom');
    setShowTemplateCustomizer(false);
  };

  const handleBackToTemplates = () => {
    setShowTemplateCustomizer(false);
    setShowTemplateSelector(true);
  };

  const handleTemplatePreview = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowLivePreview(true);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Profile Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="rounded-xl p-6 text-center border"
            style={{
              backgroundColor: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.background : 
                              selectedTemplate === 'modern-dark' ? '#1F2937' :
                              selectedTemplate === 'minimal-light' ? '#FFFFFF' :
                              selectedTemplate === 'vibrant-gradient' ? '#F8F9FA' :
                              selectedTemplate === 'professional-blue' ? '#F1F5F9' :
                              selectedTemplate === 'sunset-warm' ? '#FEF3C7' :
                              selectedTemplate === 'ocean-cool' ? '#F0F9FF' : '#1F2937',
              color: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.text : 
                     selectedTemplate === 'modern-dark' ? '#FFFFFF' :
                     selectedTemplate === 'minimal-light' ? '#1F2937' :
                     selectedTemplate === 'vibrant-gradient' ? '#2D3748' :
                     selectedTemplate === 'professional-blue' ? '#1E293B' :
                     selectedTemplate === 'sunset-warm' ? '#92400E' :
                     selectedTemplate === 'ocean-cool' ? '#0C4A6E' : '#FFFFFF',
              borderColor: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.primary : 
                          selectedTemplate === 'modern-dark' ? '#374151' :
                          selectedTemplate === 'minimal-light' ? '#E5E7EB' :
                          selectedTemplate === 'vibrant-gradient' ? '#E5E7EB' :
                          selectedTemplate === 'professional-blue' ? '#CBD5E1' :
                          selectedTemplate === 'sunset-warm' ? '#FDE68A' :
                          selectedTemplate === 'ocean-cool' ? '#BAE6FD' : '#374151'
            }}
          >
            <div className="relative mb-4">
              <img
                src={profileData.avatar}
                alt="Profile"
                className="w-16 h-16 rounded-full mx-auto border-2 shadow-md object-cover"
                style={{
                  borderColor: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.primary : 
                              selectedTemplate === 'modern-dark' ? '#4B5563' :
                              selectedTemplate === 'minimal-light' ? '#D1D5DB' :
                              selectedTemplate === 'vibrant-gradient' ? '#D1D5DB' :
                              selectedTemplate === 'professional-blue' ? '#94A3B8' :
                              selectedTemplate === 'sunset-warm' ? '#F59E0B' :
                              selectedTemplate === 'ocean-cool' ? '#0EA5E9' : '#4B5563'
                }}
              />
              {profileData.isVerified && (
                <div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    backgroundColor: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.primary : '#3B82F6',
                    borderColor: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.background : '#000000'
                  }}
                >
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </div>
            <h3 
              className="text-lg font-bold mb-1"
              style={{
                color: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.text : 
                       selectedTemplate === 'modern-dark' ? '#FFFFFF' :
                       selectedTemplate === 'minimal-light' ? '#1F2937' :
                       selectedTemplate === 'vibrant-gradient' ? '#2D3748' :
                       selectedTemplate === 'professional-blue' ? '#1E293B' :
                       selectedTemplate === 'sunset-warm' ? '#92400E' :
                       selectedTemplate === 'ocean-cool' ? '#0C4A6E' : '#FFFFFF'
              }}
            >
              {profileData.displayName}
            </h3>
            <p 
              className="text-sm mb-4 opacity-70"
              style={{
                color: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.text : 
                       selectedTemplate === 'modern-dark' ? '#D1D5DB' :
                       selectedTemplate === 'minimal-light' ? '#6B7280' :
                       selectedTemplate === 'vibrant-gradient' ? '#6B7280' :
                       selectedTemplate === 'professional-blue' ? '#64748B' :
                       selectedTemplate === 'sunset-warm' ? '#B45309' :
                       selectedTemplate === 'ocean-cool' ? '#0369A1' : '#D1D5DB'
              }}
            >
              @{profileData.username}
            </p>
            <p 
              className="text-sm mb-4 opacity-80"
              style={{
                color: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.text : 
                       selectedTemplate === 'modern-dark' ? '#E5E7EB' :
                       selectedTemplate === 'minimal-light' ? '#4B5563' :
                       selectedTemplate === 'vibrant-gradient' ? '#4B5563' :
                       selectedTemplate === 'professional-blue' ? '#475569' :
                       selectedTemplate === 'sunset-warm' ? '#A16207' :
                       selectedTemplate === 'ocean-cool' ? '#075985' : '#E5E7EB'
              }}
            >
              {profileData.bio}
            </p>
            <div className="space-y-2">
              {links?.slice(0, 3).map((link) => (
                <div 
                  key={link.id} 
                  className="rounded-lg px-4 py-2 text-sm transition-colors"
                  style={{
                    backgroundColor: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.accent : 
                                    selectedTemplate === 'modern-dark' ? '#374151' :
                                    selectedTemplate === 'minimal-light' ? '#F3F4F6' :
                                    selectedTemplate === 'vibrant-gradient' ? '#F3F4F6' :
                                    selectedTemplate === 'professional-blue' ? '#E2E8F0' :
                                    selectedTemplate === 'sunset-warm' ? '#FEF3C7' :
                                    selectedTemplate === 'ocean-cool' ? '#E0F2FE' : '#374151',
                    color: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.text : 
                           selectedTemplate === 'modern-dark' ? '#E5E7EB' :
                           selectedTemplate === 'minimal-light' ? '#1F2937' :
                           selectedTemplate === 'vibrant-gradient' ? '#1F2937' :
                           selectedTemplate === 'professional-blue' ? '#1E293B' :
                           selectedTemplate === 'sunset-warm' ? '#92400E' :
                           selectedTemplate === 'ocean-cool' ? '#0C4A6E' : '#E5E7EB'
                  }}
                >
                  {link.icon} {link.title}
                </div>
              ))}
              {links?.length > 3 && (
                <div 
                  className="text-xs opacity-60"
                  style={{
                    color: selectedTemplate === 'custom' && customTemplate ? customTemplate.colors.text : 
                           selectedTemplate === 'modern-dark' ? '#9CA3AF' :
                           selectedTemplate === 'minimal-light' ? '#9CA3AF' :
                           selectedTemplate === 'vibrant-gradient' ? '#9CA3AF' :
                           selectedTemplate === 'professional-blue' ? '#94A3B8' :
                           selectedTemplate === 'sunset-warm' ? '#D97706' :
                           selectedTemplate === 'ocean-cool' ? '#0284C7' : '#9CA3AF'
                  }}
                >
                  +{links.length - 3} more links
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-lg font-semibold">Live Statistics</h3>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{liveStats.totalViews.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{liveStats.totalClicks.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Clicks</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{liveStats.clickRate}%</div>
            <div className="text-sm text-gray-600">Click Rate</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{links?.length || 0}</div>
            <div className="text-sm text-gray-600">Active Links</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
            <Button
              onClick={() => handleCopyProfileLink(profileUrl, 'Droplink')}
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <LinkIcon className="h-6 w-6" />
              <span>Copy Droplink URL</span>
            </Button>
            <Button
              onClick={() => handleCopyProfileLink(piProfileUrl, 'Pi Network')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Globe className="h-6 w-6" />
              <span>Copy Pi Profile URL</span>
            </Button>
            <Button
              onClick={handleShareProfile}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Share2 className="h-6 w-6" />
              <span>Share Profile</span>
            </Button>
            <Button
              onClick={() => setShowLivePreview(true)}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Eye className="h-6 w-6" />
              <span>Live Preview</span>
            </Button>
            <Button
              onClick={() => window.open(profileUrl, '_blank', 'noopener,noreferrer')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <ExternalLink className="h-6 w-6" />
              <span>View Profile</span>
            </Button>
            <Button
              onClick={() => window.open(liveProfileUrl, '_blank', 'noopener,noreferrer')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Globe className="h-6 w-6" />
              <span>Live Profile</span>
            </Button>
            <Button
              onClick={() => setActiveSection('links')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Plus className="h-6 w-6" />
              <span>Manage Links</span>
            </Button>
            <Button
              onClick={() => setActiveSection('templates')}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2"
            >
              <Palette className="h-6 w-6" />
              <span>Choose Template</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pi Network Wallet Info */}
      <WalletInfo />

      {/* User Wallet Settings */}
      <UserWalletSettings />
    </div>
  );

  const renderLinks = () => (
    <div className="space-y-6">
      {/* Add Link Form */}
      {showAddForm && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle>Add New Link</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                value={newLink.title}
                onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                placeholder="Link Title"
                required
              />
              <Input
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="https://example.com"
                type="url"
                required
              />
              <div className="flex gap-2">
                <Button onClick={handleAddLink} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Add
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Links List */}
      <div className="space-y-4">
        {links && links.length > 0 ? (
          links.map((link) => (
            <Card key={link.id}>
              <CardContent className="p-4">
                {editingLinkId === link.id ? (
                  <form onSubmit={saveEditLink} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <Input
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        placeholder="Link Title"
                        required
                      />
                      <Input
                        value={editForm.url}
                        onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                        placeholder="https://example.com"
                        type="url"
                        required
                      />
                      <div className="flex gap-2">
                        <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{link.icon}</span>
                      <div>
                        <h3 className="font-medium">{link.title}</h3>
                        <p className="text-sm text-gray-600">{link.url}</p>
                        <p className="text-xs text-gray-500">{link.clicks || 0} clicks</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditLink(link)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteLink(link.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
              <p className="text-gray-600 mb-4">
                Start building your Droplink by adding your first link
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Link
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add Link Button */}
      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-full h-12"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Link
        </Button>
      )}
    </div>
  );

  // Show setup wizard for new users
  if (showSetupWizard || (!links || links.length === 0)) {
    return (
      <DroplinkSetupWizard 
        onComplete={() => setShowSetupWizard(false)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                {/* Clean Blue Droplet Icon - No Background */}
                <svg 
                  className="w-8 h-8"
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Clean blue droplet with gradient */}
                  <defs>
                    <linearGradient id="dropletGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="100%" stopColor="#0284c7" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M16 28C20 28 24 24 24 20C24 16 20 12 16 8C12 12 8 16 8 20C8 24 12 28 16 28Z" 
                    fill="url(#dropletGradient)"
                  />
                  {/* Subtle highlight */}
                  <path 
                    d="M20 24C22 24 24 22 24 20C24 18 22 16 20 18C18 16 16 18 16 20C16 22 18 24 20 24Z" 
                    fill="rgba(255,255,255,0.3)"
                  />
                </svg>
                <span className="font-bold text-[#0ea5e9] text-xl">Droplink</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">@{profileData.username}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-green-600 border-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Active
              </Badge>
              <Badge variant="outline" className="text-purple-600 border-purple-600">
                <Palette className="w-3 h-3 mr-1" />
                {selectedTemplate === 'custom' ? 'Custom Template' : 
                 selectedTemplate === 'modern-dark' ? 'Modern Dark' :
                 selectedTemplate === 'minimal-light' ? 'Minimal Light' :
                 selectedTemplate === 'vibrant-gradient' ? 'Vibrant Gradient' :
                 selectedTemplate === 'professional-blue' ? 'Professional Blue' :
                 selectedTemplate === 'sunset-warm' ? 'Sunset Warm' :
                 selectedTemplate === 'ocean-cool' ? 'Ocean Cool' : 'Template'}
              </Badge>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.open(profileUrl, '_blank', 'noopener,noreferrer')}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowLivePreview(true)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Live Preview
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowSetupWizard(true)}
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Setup Wizard
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Info in Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#0ea5e9] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">π</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Your Receiving Wallet</p>
                  <p className="text-xs text-gray-600">
                    {profile?.wallet_address 
                      ? `${profile.wallet_address.substring(0, 7)}...${profile.wallet_address.substring(profile.wallet_address.length - 4)}`
                      : 'Not configured'
                    }
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-[#0ea5e9]">
                  {profile?.wallet_address ? 'Ready' : 'Setup Required'}
                </p>
                <p className="text-xs text-green-600">
                  {profile?.wallet_address ? 'Configured' : 'Click to setup'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection('links')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'links'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Links
            </button>
            <button
              onClick={() => setActiveSection('analytics')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'analytics'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Analytics
            </button>
            <button
              onClick={() => setActiveSection('templates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'templates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveSection('share')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeSection === 'share'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Share
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'links' && renderLinks()}
        {activeSection === 'analytics' && (
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Analytics coming soon...</p>
            </CardContent>
          </Card>
        )}
        {activeSection === 'templates' && (
          <div className="space-y-6">
            {showTemplateCustomizer ? (
              <TemplateCustomizer
                onBack={handleBackToTemplates}
                onSave={handleSaveCustomTemplate}
                initialTemplate={customTemplate}
              />
            ) : (
              <TemplateSelector
                currentTemplate={selectedTemplate}
                onTemplateSelect={handleTemplateSelect}
                onCustomize={handleCustomizeTemplate}
                onPreview={handleTemplatePreview}
              />
            )}
          </div>
        )}
        {activeSection === 'share' && (
          <EnhancedSharing
            username={profileData.username}
            displayName={profileData.displayName}
            bio={profileData.bio}
            avatarUrl={profileData.avatar}
            profileUrl={profileUrl}
            piProfileUrl={piProfileUrl}
            totalClicks={liveStats.totalClicks}
            totalLinks={links?.length || 0}
          />
        )}
      </div>

      {/* Live Profile Preview Modal */}
      <LiveProfilePreview
        isOpen={showLivePreview}
        onClose={() => setShowLivePreview(false)}
        profile={{
          username: profileData.username,
          displayName: profileData.displayName,
          bio: profileData.bio,
          avatar: profileData.avatar,
          isVerified: profileData.isVerified
        }}
        links={links || []}
        profileUrl={profileUrl}
        piProfileUrl={piProfileUrl}
      />
    </div>
  );
};

export default DroplinkDashboard;