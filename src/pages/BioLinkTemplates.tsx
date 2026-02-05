import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ExternalLink, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Eye,
  Download,
  Share2,
  Heart,
  Clock,
  Users,
  Zap,
  Palette,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';

interface BioLinkTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview: string;
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  isPremium: boolean;
  isNew: boolean;
  isPopular: boolean;
  colors: string[];
  features: string[];
  blocks: number;
  lastUpdated: string;
}

const templates: BioLinkTemplate[] = [
  {
    id: 'zeus-template-7',
    name: 'ZEUS Template 7',
    category: 'Business',
    description: 'Professional template for entrepreneurs and business leaders',
    preview: '/templates/zeus-template-7.jpg',
    author: 'ZEUS',
    rating: 4.9,
    downloads: 1250,
    tags: ['Business', 'Professional', 'Dark Theme', 'Luxury'],
    isPremium: true,
    isNew: false,
    isPopular: true,
    colors: ['#1a1a2e', '#16213e', '#0f3460'],
    features: ['Social Links', 'Contact Form', 'Image Gallery', 'Video Embed'],
    blocks: 8,
    lastUpdated: '2024-01-15'
  },
  {
    id: 'julien-guirado-template',
    name: 'Julien Guirado Template',
    category: 'Influencer',
    description: 'Perfect for influencers and content creators',
    preview: '/templates/julien-guirado.jpg',
    author: 'Julien Guirado',
    rating: 4.8,
    downloads: 980,
    tags: ['Influencer', 'Social Media', 'Light Theme', 'Modern'],
    isPremium: false,
    isNew: true,
    isPopular: false,
    colors: ['#f8fafc', '#e2e8f0', '#cbd5e1'],
    features: ['Social Links', 'Bio Text', 'Button Links', 'Image Gallery'],
    blocks: 6,
    lastUpdated: '2024-01-20'
  },
  {
    id: 'emma-watson-template',
    name: 'Emma Watson Template',
    category: 'Celebrity',
    description: 'Elegant template for public figures and celebrities',
    preview: '/templates/emma-watson.jpg',
    author: 'Emma Watson',
    rating: 4.9,
    downloads: 2100,
    tags: ['Celebrity', 'Elegant', 'Professional', 'Actress'],
    isPremium: true,
    isNew: false,
    isPopular: true,
    colors: ['#ffffff', '#f1f5f9', '#e2e8f0'],
    features: ['Bio Text', 'Social Links', 'Project Showcase', 'Contact Info'],
    blocks: 7,
    lastUpdated: '2024-01-10'
  },
  {
    id: 'gordon-ramsay-template',
    name: 'Gordon Ramsay Template',
    category: 'Food & Restaurant',
    description: 'Perfect for chefs, restaurants, and food businesses',
    preview: '/templates/gordon-ramsay.jpg',
    author: 'Gordon Ramsay',
    rating: 4.7,
    downloads: 750,
    tags: ['Food', 'Restaurant', 'Chef', 'Dark Theme'],
    isPremium: false,
    isNew: false,
    isPopular: false,
    colors: ['#1f2937', '#374151', '#4b5563'],
    features: ['Menu Display', 'Social Links', 'Video Content', 'Contact Form'],
    blocks: 9,
    lastUpdated: '2024-01-18'
  },
  {
    id: 'restaurant-template-3',
    name: 'Restaurant Template 3',
    category: 'Food & Restaurant',
    description: 'Modern restaurant template with menu showcase',
    preview: '/templates/restaurant-template-3.jpg',
    author: 'La Mafia',
    rating: 4.6,
    downloads: 650,
    tags: ['Restaurant', 'Menu', 'Food', 'Golden Theme'],
    isPremium: true,
    isNew: true,
    isPopular: false,
    colors: ['#fbbf24', '#f59e0b', '#d97706'],
    features: ['Menu Display', 'Image Gallery', 'Contact Info', 'Social Links'],
    blocks: 5,
    lastUpdated: '2024-01-22'
  },
  {
    id: 'creator-template',
    name: 'Creator Template',
    category: 'Creative',
    description: 'Artistic template for creators and artists',
    preview: '/templates/creator-template.jpg',
    author: 'Creator',
    rating: 4.5,
    downloads: 420,
    tags: ['Creative', 'Art', 'Portfolio', 'Colorful'],
    isPremium: false,
    isNew: false,
    isPopular: false,
    colors: ['#8b5cf6', '#a855f7', '#c084fc'],
    features: ['Portfolio Gallery', 'Social Links', 'Bio Text', 'Contact Form'],
    blocks: 6,
    lastUpdated: '2024-01-12'
  },
  {
    id: 'app-download-template',
    name: 'App Download Template',
    category: 'Technology',
    description: 'Perfect for app developers and tech companies',
    preview: '/templates/app-download.jpg',
    author: 'Tech Team',
    rating: 4.8,
    downloads: 890,
    tags: ['App', 'Technology', 'Download', 'Gradient'],
    isPremium: false,
    isNew: true,
    isPopular: true,
    colors: ['#ec4899', '#8b5cf6', '#06b6d4'],
    features: ['App Store Links', 'Social Links', 'Download Buttons', 'App Screenshots'],
    blocks: 4,
    lastUpdated: '2024-01-25'
  },
  {
    id: 'minimal-template',
    name: 'Minimal Template',
    category: 'Minimal',
    description: 'Clean and minimal design for professionals',
    preview: '/templates/minimal.jpg',
    author: 'Design Team',
    rating: 4.9,
    downloads: 1500,
    tags: ['Minimal', 'Clean', 'Professional', 'Simple'],
    isPremium: false,
    isNew: false,
    isPopular: true,
    colors: ['#ffffff', '#f8fafc', '#e2e8f0'],
    features: ['Bio Text', 'Social Links', 'Contact Info', 'Simple Layout'],
    blocks: 3,
    lastUpdated: '2024-01-08'
  },
  {
    id: 'dark-mode-template',
    name: 'Dark Mode Template',
    category: 'Dark Theme',
    description: 'Sleek dark theme for modern professionals',
    preview: '/templates/dark-mode.jpg',
    author: 'Dark Team',
    rating: 4.7,
    downloads: 1100,
    tags: ['Dark', 'Modern', 'Professional', 'Sleek'],
    isPremium: true,
    isNew: false,
    isPopular: false,
    colors: ['#0f172a', '#1e293b', '#334155'],
    features: ['Dark Theme', 'Social Links', 'Bio Text', 'Contact Form'],
    blocks: 5,
    lastUpdated: '2024-01-14'
  }
];

const categories = [
  'All',
  'Business',
  'Influencer',
  'Celebrity',
  'Food & Restaurant',
  'Creative',
  'Technology',
  'Minimal',
  'Dark Theme'
];

const BioLinkTemplates: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<BioLinkTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const templatesPerPage = 9;
  
  // Filter templates based on category and search
  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });
  
  const totalPages = Math.ceil(filteredTemplates.length / templatesPerPage);
  const startIndex = (currentPage - 1) * templatesPerPage;
  const endIndex = startIndex + templatesPerPage;
  const currentTemplates = filteredTemplates.slice(startIndex, endIndex);
  
  const handleTemplateSelect = (template: BioLinkTemplate) => {
    setSelectedTemplate(template);
    // Here you would typically apply the template to the user's bio link
    console.log('Template selected:', template);
  };
  
  const handlePreview = (template: BioLinkTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Biolink Templates</h1>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                {filteredTemplates.length} templates
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Category Filters */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Templates Grid */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        }>
          {currentTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-0">
                {/* Template Preview */}
                <div className="relative">
                  <div className="aspect-[9/16] bg-gray-100 rounded-t-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 text-sm">Template Preview</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Template Badges */}
                  <div className="absolute top-3 left-3 flex flex-col space-y-2">
                    {template.isNew && (
                      <Badge className="bg-green-500 text-white">New</Badge>
                    )}
                    {template.isPopular && (
                      <Badge className="bg-orange-500 text-white">Popular</Badge>
                    )}
                    {template.isPremium && (
                      <Badge className="bg-purple-500 text-white">Premium</Badge>
                    )}
                  </div>
                  
                  {/* Template Stats */}
                  <div className="absolute top-3 right-3 flex items-center space-x-2 text-white">
                    <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded px-2 py-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs">{template.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-black bg-opacity-50 rounded px-2 py-1">
                      <Download className="w-3 h-3" />
                      <span className="text-xs">{template.downloads}</span>
                    </div>
                  </div>
                </div>
                
                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-500">by {template.author}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  
                  {/* Template Features */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {template.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Template Stats */}
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Zap className="w-3 h-3" />
                        <span>{template.blocks} blocks</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{template.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{template.downloads} downloads</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePreview(template)}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Choose
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredTemplates.length)} of {filteredTemplates.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="text-gray-500">...</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Template Preview Modal */}
      {showPreview && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold">{selectedTemplate.name}</h3>
                <p className="text-gray-500">by {selectedTemplate.author}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Template Preview */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Template Preview</h4>
                  <div className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <Smartphone className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">Full Template Preview</p>
                        <p className="text-gray-400 text-sm">Mobile & Desktop Views</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Template Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Template Details</h4>
                    <p className="text-gray-600 mb-4">{selectedTemplate.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Category</p>
                        <p className="text-sm text-gray-600">{selectedTemplate.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Blocks</p>
                        <p className="text-sm text-gray-600">{selectedTemplate.blocks} blocks</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Rating</p>
                        <p className="text-sm text-gray-600">{selectedTemplate.rating}/5.0</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Downloads</p>
                        <p className="text-sm text-gray-600">{selectedTemplate.downloads}</p>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Features</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedTemplate.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Color Palette</p>
                      <div className="flex space-x-2">
                        {selectedTemplate.colors.map((color, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(false)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                    <Button
                      onClick={() => {
                        handleTemplateSelect(selectedTemplate);
                        setShowPreview(false);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Use This Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BioLinkTemplates;
