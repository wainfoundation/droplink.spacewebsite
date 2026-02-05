import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  ExternalLink,
  Instagram,
  Youtube,
  Mail,
  Globe,
  MessageCircle,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Heart,
  Eye,
  MousePointer,
  Calendar,
  Clock,
  BarChart3,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Copy,
  QrCode,
  Link as LinkIcon,
  Tag,
  Star,
  Pin,
  Archive,
  Settings,
  Download,
  Upload,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  Target,
  TrendingUp,
  Users,
  MapPin,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { useLinks } from '@/hooks/useLinks';

interface Link {
  id: string;
  title: string;
  url: string;
  platform?: string;
  clicks?: number;
  icon?: string;
  category?: string;
  tags?: string[];
  isPinned?: boolean;
  isArchived?: boolean;
  isScheduled?: boolean;
  scheduledDate?: string;
  isActive?: boolean;
  clickRate?: number;
  views?: number;
  lastClicked?: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  thumbnail?: string;
  customColor?: string;
  customIcon?: string;
  analytics?: {
    totalClicks: number;
    uniqueClicks: number;
    clickRate: number;
    topCountries: Array<{ country: string; clicks: number }>;
    deviceTypes: Array<{ device: string; clicks: number }>;
    referrers: Array<{ source: string; clicks: number }>;
    hourlyData: Array<{ hour: number; clicks: number }>;
  };
}

const LinksSection: React.FC = () => {
  const { user } = useUser();
  const { links, addLink, updateLink, deleteLink } = useLinks(user?.id);
  const { toast } = useToast();
  
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [selectedLink, setSelectedLink] = useState<Link | null>(null);
  const [newLink, setNewLink] = useState({
    title: '',
    url: '',
    platform: 'website',
    category: 'general',
    description: '',
    tags: [] as string[],
    isPinned: false,
    isScheduled: false,
    scheduledDate: '',
    customColor: '',
    customIcon: ''
  });
  const [editForm, setEditForm] = useState({
    title: '',
    url: '',
    platform: 'website',
    category: 'general',
    description: '',
    tags: [] as string[],
    isPinned: false,
    isScheduled: false,
    scheduledDate: '',
    customColor: '',
    customIcon: ''
  });

  // Mock data for demonstration - matches the design
  const mockLinks: Link[] = [
    {
      id: '1',
      title: 'Instagram',
      url: 'https://instagram.com/myprofile',
      platform: 'instagram',
      clicks: 1240,
      icon: '📷',
      category: 'social',
      tags: ['social', 'photos', 'lifestyle'],
      isPinned: true,
      isActive: true,
      clickRate: 12.5,
      views: 2500,
      lastClicked: '2024-01-15T10:30:00Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      description: 'Follow me on Instagram for daily updates',
      analytics: {
        totalClicks: 1240,
        uniqueClicks: 980,
        clickRate: 12.5,
        topCountries: [
          { country: 'United States', clicks: 450 },
          { country: 'United Kingdom', clicks: 320 },
          { country: 'Canada', clicks: 280 }
        ],
        deviceTypes: [
          { device: 'Mobile', clicks: 850 },
          { device: 'Desktop', clicks: 390 }
        ],
        referrers: [
          { source: 'Direct', clicks: 600 },
          { source: 'Social Media', clicks: 400 },
          { source: 'Search', clicks: 240 }
        ],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({ hour: i, clicks: Math.floor(Math.random() * 50) }))
      }
    },
    {
      id: '2',
      title: 'YouTube Channel',
      url: 'https://youtube.com/@mychannel',
      platform: 'youtube',
      clicks: 856,
      icon: '📺',
      category: 'content',
      tags: ['video', 'tutorials', 'education'],
      isPinned: false,
      isActive: true,
      clickRate: 8.2,
      views: 1800,
      lastClicked: '2024-01-14T15:45:00Z',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-14T15:45:00Z',
      description: 'Subscribe to my YouTube channel for tutorials and content',
      analytics: {
        totalClicks: 856,
        uniqueClicks: 720,
        clickRate: 8.2,
        topCountries: [
          { country: 'United States', clicks: 300 },
          { country: 'Australia', clicks: 200 },
          { country: 'Germany', clicks: 150 }
        ],
        deviceTypes: [
          { device: 'Mobile', clicks: 500 },
          { device: 'Desktop', clicks: 356 }
        ],
        referrers: [
          { source: 'Direct', clicks: 400 },
          { source: 'Social Media', clicks: 300 },
          { source: 'Search', clicks: 156 }
        ],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({ hour: i, clicks: Math.floor(Math.random() * 30) }))
      }
    },
    {
      id: '3',
      title: 'Contact Me',
      url: 'mailto:hello@example.com',
      platform: 'email',
      clicks: 298,
      icon: '✉️',
      category: 'contact',
      tags: ['contact', 'business', 'email'],
      isPinned: false,
      isActive: true,
      clickRate: 5.8,
      views: 1200,
      lastClicked: '2024-01-13T09:15:00Z',
      createdAt: '2024-01-03T00:00:00Z',
      updatedAt: '2024-01-13T09:15:00Z',
      description: 'Get in touch for business inquiries',
      analytics: {
        totalClicks: 298,
        uniqueClicks: 250,
        clickRate: 5.8,
        topCountries: [
          { country: 'United States', clicks: 120 },
          { country: 'United Kingdom', clicks: 80 },
          { country: 'Canada', clicks: 60 }
        ],
        deviceTypes: [
          { device: 'Mobile', clicks: 180 },
          { device: 'Desktop', clicks: 118 }
        ],
        referrers: [
          { source: 'Direct', clicks: 150 },
          { source: 'Social Media', clicks: 100 },
          { source: 'Search', clicks: 48 }
        ],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({ hour: i, clicks: Math.floor(Math.random() * 15) }))
      }
    },
    {
      id: '4',
      title: 'My Portfolio',
      url: 'https://myportfolio.com',
      platform: 'website',
      clicks: 450,
      icon: '🌐',
      category: 'portfolio',
      tags: ['portfolio', 'work', 'projects'],
      isPinned: true,
      isActive: true,
      clickRate: 15.2,
      views: 800,
      lastClicked: '2024-01-15T14:20:00Z',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      description: 'Check out my latest projects and work',
      analytics: {
        totalClicks: 450,
        uniqueClicks: 380,
        clickRate: 15.2,
        topCountries: [
          { country: 'United States', clicks: 200 },
          { country: 'United Kingdom', clicks: 120 },
          { country: 'Canada', clicks: 80 }
        ],
        deviceTypes: [
          { device: 'Desktop', clicks: 280 },
          { device: 'Mobile', clicks: 170 }
        ],
        referrers: [
          { source: 'Direct', clicks: 250 },
          { source: 'Social Media', clicks: 150 },
          { source: 'Search', clicks: 50 }
        ],
        hourlyData: Array.from({ length: 24 }, (_, i) => ({ hour: i, clicks: Math.floor(Math.random() * 20) }))
      }
    }
  ];

  // Use mock data for now, but integrate with real links later
  const displayLinks = mockLinks;

  // Filter and sort links
  const filteredLinks = displayLinks.filter(link => {
    const matchesSearch = link.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         link.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || link.category === filterCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'pinned' && link.isPinned) ||
                      (activeTab === 'archived' && link.isArchived) ||
                      (activeTab === 'scheduled' && link.isScheduled);
    
    return matchesSearch && matchesCategory && matchesTab;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'clicks':
        comparison = (a.clicks || 0) - (b.clicks || 0);
        break;
      case 'clickRate':
        comparison = (a.clickRate || 0) - (b.clickRate || 0);
        break;
      case 'createdAt':
        comparison = new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        break;
      case 'lastClicked':
        comparison = new Date(a.lastClicked || 0).getTime() - new Date(b.lastClicked || 0).getTime();
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Get unique categories
  const categories = ['all', ...new Set(displayLinks.map(link => link.category).filter(Boolean))];

  // Get total stats
  const totalStats = {
    totalLinks: displayLinks.length,
    totalClicks: displayLinks.reduce((sum, link) => sum + (link.clicks || 0), 0),
    totalViews: displayLinks.reduce((sum, link) => sum + (link.views || 0), 0),
    averageClickRate: displayLinks.reduce((sum, link) => sum + (link.clickRate || 0), 0) / displayLinks.length,
    pinnedLinks: displayLinks.filter(link => link.isPinned).length,
    activeLinks: displayLinks.filter(link => link.isActive).length
  };

  const getPlatformIcon = (platform: string) => {
    const icons = {
      instagram: Instagram,
      youtube: Youtube,
      email: Mail,
      website: Globe,
      twitter: Twitter,
      facebook: Facebook,
      linkedin: Linkedin,
      github: Github,
      whatsapp: MessageCircle
    };
    return icons[platform as keyof typeof icons] || Globe;
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      instagram: 'from-pink-500 to-purple-600',
      youtube: 'from-red-500 to-red-600',
      email: 'from-gray-500 to-gray-600',
      website: 'from-blue-500 to-blue-600',
      twitter: 'from-blue-400 to-blue-500',
      facebook: 'from-blue-600 to-blue-700',
      linkedin: 'from-blue-700 to-blue-800',
      github: 'from-gray-700 to-gray-800',
      whatsapp: 'from-green-500 to-green-600'
    };
    return colors[platform as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const handleAddLink = async () => {
    if (!newLink.title || !newLink.url) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await addLink({
        title: newLink.title,
        url: newLink.url,
        platform: newLink.platform
      });
      
      setNewLink({ title: '', url: '', platform: 'website' });
      setIsAddingLink(false);
      
      toast({
        title: "Link added!",
        description: "Your link has been added successfully",
      });
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Error",
        description: "Failed to add link",
        variant: "destructive",
      });
    }
  };

  const handleEditLink = async (linkId: string) => {
    if (!editForm.title || !editForm.url) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateLink(linkId, {
        title: editForm.title,
        url: editForm.url,
        platform: editForm.platform
      });
      
      setEditingLinkId(null);
      setEditForm({ title: '', url: '', platform: 'website' });
      
      toast({
        title: "Link updated!",
        description: "Your link has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteLink(linkId);
      
      toast({
        title: "Link deleted!",
        description: "Your link has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    }
  };

  const startEditing = (link: Link) => {
    setEditingLinkId(link.id);
    setEditForm({
      title: link.title,
      url: link.url,
      platform: link.platform || 'website'
    });
  };

  const cancelEditing = () => {
    setEditingLinkId(null);
    setEditForm({ title: '', url: '', platform: 'website' });
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Links Management</h2>
          <p className="text-gray-600">Manage and analyze your profile links</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowAnalytics(true)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button
            onClick={() => setIsAddingLink(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Link
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Links</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalLinks}</p>
              </div>
              <LinkIcon className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalClicks.toLocaleString()}</p>
              </div>
              <MousePointer className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg CTR</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.averageClickRate.toFixed(1)}%</p>
              </div>
              <Target className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pinned</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.pinnedLinks}</p>
              </div>
              <Pin className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.activeLinks}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
            
            {/* Sort */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Date Created</option>
                <option value="title">Title</option>
                <option value="clicks">Clicks</option>
                <option value="clickRate">Click Rate</option>
                <option value="lastClicked">Last Clicked</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Links ({filteredLinks.length})</TabsTrigger>
          <TabsTrigger value="pinned">Pinned ({displayLinks.filter(l => l.isPinned).length})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({displayLinks.filter(l => l.isScheduled).length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({displayLinks.filter(l => l.isArchived).length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredLinks.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <LinkIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No links found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery ? 'Try adjusting your search terms' : 'Get started by adding your first link'}
                </p>
                <Button onClick={() => setIsAddingLink(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Link
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredLinks.map((link) => {
              const IconComponent = getPlatformIcon(link.platform || 'website');
              const gradientClass = getPlatformColor(link.platform || 'website');
              
              return (
                <Card key={link.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    {editingLinkId === link.id ? (
                      // Edit Form
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Link Title
                            </label>
                            <Input
                              value={editForm.title}
                              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                              placeholder="Enter link title"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Platform
                            </label>
                            <select
                              value={editForm.platform}
                              onChange={(e) => setEditForm({ ...editForm, platform: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="website">Website</option>
                              <option value="instagram">Instagram</option>
                              <option value="youtube">YouTube</option>
                              <option value="twitter">Twitter</option>
                              <option value="facebook">Facebook</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="github">GitHub</option>
                              <option value="email">Email</option>
                              <option value="whatsapp">WhatsApp</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            URL
                          </label>
                          <Input
                            value={editForm.url}
                            onChange={(e) => setEditForm({ ...editForm, url: e.target.value })}
                            placeholder="Enter URL"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleEditLink(link.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={cancelEditing}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // Link Display
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="relative">
                            <div className={`w-12 h-12 bg-gradient-to-r ${gradientClass} rounded-lg flex items-center justify-center`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            {link.isPinned && (
                              <Pin className="absolute -top-1 -right-1 w-4 h-4 text-blue-500" />
                            )}
                            {link.isScheduled && (
                              <Clock className="absolute -bottom-1 -right-1 w-4 h-4 text-orange-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 truncate">{link.title}</h3>
                              {link.isActive ? (
                                <CheckCircle className="w-4 h-4 text-green-500" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 truncate max-w-md">{link.url}</p>
                            {link.description && (
                              <p className="text-xs text-gray-500 mt-1">{link.description}</p>
                            )}
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <MousePointer className="w-4 h-4" />
                                <span>{link.clicks?.toLocaleString() || 0} clicks</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Eye className="w-4 h-4" />
                                <span>{link.views?.toLocaleString() || 0} views</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Target className="w-4 h-4" />
                                <span>{link.clickRate?.toFixed(1) || 0}% CTR</span>
                              </div>
                            </div>
                            {link.tags && link.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {link.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(link.url, '_blank')}
                            className="flex items-center space-x-1"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Visit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedLink(link)}
                            className="flex items-center space-x-1"
                          >
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startEditing(link)}
                            className="flex items-center space-x-1"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLink(link.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      </Tabs>

      {/* Enhanced Add New Link Modal */}
      {isAddingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Add New Link</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddingLink(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Title *
                    </label>
                    <Input
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      placeholder="e.g., My Instagram"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <select
                      value={newLink.platform}
                      onChange={(e) => setNewLink({ ...newLink, platform: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="website">Website</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="twitter">Twitter</option>
                      <option value="facebook">Facebook</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="github">GitHub</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL *
                    </label>
                    <Input
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newLink.category}
                      onChange={(e) => setNewLink({ ...newLink, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="general">General</option>
                      <option value="social">Social Media</option>
                      <option value="content">Content</option>
                      <option value="contact">Contact</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="business">Business</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={newLink.description}
                      onChange={(e) => setNewLink({ ...newLink, description: e.target.value })}
                      placeholder="Brief description of this link"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <Input
                      value={newLink.tags.join(', ')}
                      onChange={(e) => setNewLink({ 
                        ...newLink, 
                        tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                      })}
                      placeholder="social, photos, lifestyle"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPinned"
                        checked={newLink.isPinned}
                        onChange={(e) => setNewLink({ ...newLink, isPinned: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="isPinned" className="text-sm font-medium text-gray-700">
                        Pin this link to the top
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isScheduled"
                        checked={newLink.isScheduled}
                        onChange={(e) => setNewLink({ ...newLink, isScheduled: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="isScheduled" className="text-sm font-medium text-gray-700">
                        Schedule this link
                      </label>
                    </div>

                    {newLink.isScheduled && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Schedule Date
                        </label>
                        <Input
                          type="datetime-local"
                          value={newLink.scheduledDate}
                          onChange={(e) => setNewLink({ ...newLink, scheduledDate: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingLink(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAddLink}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Add Link
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link Analytics Modal */}
      {showAnalytics && selectedLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Link Analytics: {selectedLink.title}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAnalytics(false)}
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Total Clicks</p>
                        <p className="text-2xl font-bold">{selectedLink.analytics?.totalClicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Unique Clicks</p>
                        <p className="text-2xl font-bold">{selectedLink.analytics?.uniqueClicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Click Rate</p>
                        <p className="text-2xl font-bold">{selectedLink.analytics?.clickRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold">{selectedLink.views?.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Top Countries */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Countries</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedLink.analytics?.topCountries.map((country, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{country.country}</span>
                          <div className="text-right">
                            <div className="font-semibold">{country.clicks.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">
                              {((country.clicks / (selectedLink.analytics?.totalClicks || 1)) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Device Types */}
                <Card>
                  <CardHeader>
                    <CardTitle>Device Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedLink.analytics?.deviceTypes.map((device, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {device.device === 'Mobile' ? (
                              <Smartphone className="w-4 h-4 text-gray-600" />
                            ) : device.device === 'Desktop' ? (
                              <Monitor className="w-4 h-4 text-gray-600" />
                            ) : (
                              <Tablet className="w-4 h-4 text-gray-600" />
                            )}
                            <span className="font-medium">{device.device}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{device.clicks.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">
                              {((device.clicks / (selectedLink.analytics?.totalClicks || 1)) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Traffic Sources */}
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedLink.analytics?.referrers.map((source, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="font-medium">{source.source}</span>
                          <div className="text-right">
                            <div className="font-semibold">{source.clicks.toLocaleString()}</div>
                            <div className="text-sm text-gray-600">
                              {((source.clicks / (selectedLink.analytics?.totalClicks || 1)) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinksSection;