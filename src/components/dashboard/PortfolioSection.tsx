import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Image, 
  Video, 
  FileText, 
  ExternalLink,
  Eye,
  Download,
  Upload,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Copy,
  Check,
  X,
  Save,
  Camera,
  Music,
  BookOpen,
  Code,
  Palette,
  Briefcase,
  Award,
  Target,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Globe,
  Link as LinkIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'project' | 'article' | 'certification';
  url?: string;
  imageUrl?: string;
  tags: string[];
  featured: boolean;
  views: number;
  likes: number;
  createdAt: string;
}

const PortfolioSection = () => {
  const { toast } = useToast();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock portfolio data
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: '1',
      title: 'E-commerce Website Design',
      description: 'Modern e-commerce platform with clean UI/UX design',
      type: 'project',
      url: 'https://example.com/project1',
      imageUrl: '/api/placeholder/400/300',
      tags: ['UI/UX', 'React', 'E-commerce'],
      featured: true,
      views: 1250,
      likes: 89,
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Mobile App Prototype',
      description: 'Fitness tracking app with intuitive user interface',
      type: 'project',
      url: 'https://example.com/project2',
      imageUrl: '/api/placeholder/400/300',
      tags: ['Mobile', 'Figma', 'Prototype'],
      featured: false,
      views: 890,
      likes: 67,
      createdAt: '2024-01-10'
    },
    {
      id: '3',
      title: 'Brand Identity Design',
      description: 'Complete brand identity for a tech startup',
      type: 'project',
      imageUrl: '/api/placeholder/400/300',
      tags: ['Branding', 'Logo', 'Identity'],
      featured: true,
      views: 2100,
      likes: 156,
      createdAt: '2024-01-05'
    }
  ]);

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    type: 'project' as PortfolioItem['type'],
    url: '',
    tags: [] as string[],
    featured: false
  });

  const handleAddItem = () => {
    if (!newItem.title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title for your portfolio item",
        variant: "destructive"
      });
      return;
    }

    const item: PortfolioItem = {
      id: Date.now().toString(),
      ...newItem,
      views: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    };

    setPortfolioItems([item, ...portfolioItems]);
    setNewItem({
      title: '',
      description: '',
      type: 'project',
      url: '',
      tags: [],
      featured: false
    });
    setIsAddingItem(false);

    toast({
      title: "Portfolio Item Added",
      description: "Your portfolio item has been added successfully"
    });
  };

  const handleDeleteItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    toast({
      title: "Item Deleted",
      description: "Portfolio item has been removed"
    });
  };

  const handleToggleFeatured = (id: string) => {
    setPortfolioItems(portfolioItems.map(item => 
      item.id === id ? { ...item, featured: !item.featured } : item
    ));
  };

  const getTypeIcon = (type: PortfolioItem['type']) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'project': return <Code className="h-4 w-4" />;
      case 'article': return <FileText className="h-4 w-4" />;
      case 'certification': return <Award className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const filteredItems = portfolioItems.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
          <p className="text-gray-600">Showcase your work and achievements</p>
        </div>
        <Button
          onClick={() => setIsAddingItem(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Portfolio Item
        </Button>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search portfolio items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="project">Projects</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
                <option value="article">Articles</option>
                <option value="certification">Certifications</option>
              </select>
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add New Item Form */}
      {isAddingItem && (
        <Card>
          <CardHeader>
            <CardTitle>Add Portfolio Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="Project title"
                />
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <select
                  id="type"
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as PortfolioItem['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="project">Project</option>
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                  <option value="certification">Certification</option>
                </select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe your work..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="url">URL (Optional)</Label>
              <Input
                id="url"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={handleAddItem}>
                <Save className="h-4 w-4 mr-2" />
                Add Item
              </Button>
              <Button variant="outline" onClick={() => setIsAddingItem(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Items */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Image className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No portfolio items yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your portfolio by adding your first work sample.
            </p>
            <Button onClick={() => setIsAddingItem(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Item
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
                    {item.imageUrl ? (
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="text-gray-400">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                  </div>
                  
                  {item.featured && (
                    <Badge className="absolute top-2 left-2 bg-yellow-500">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button size="sm" variant="secondary">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="secondary">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {getTypeIcon(item.type)}
                    <span className="text-sm text-gray-500 capitalize">{item.type}</span>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        {item.likes}
                      </span>
                    </div>
                    {item.url && (
                      <Button size="sm" variant="ghost" asChild>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioSection;
