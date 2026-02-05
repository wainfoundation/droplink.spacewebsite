import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Palette, 
  Sparkles, 
  Eye, 
  Check, 
  Star,
  Zap,
  Heart,
  Crown,
  Settings,
  Brush,
  Layers,
  Monitor,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  description: string;
  category: 'ready' | 'custom';
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  features: string[];
  isPremium?: boolean;
  isPopular?: boolean;
}

interface TemplateSelectorProps {
  currentTemplate?: string;
  onTemplateSelect: (templateId: string) => void;
  onCustomize: () => void;
  onPreview?: (templateId: string) => void;
}

const readyTemplates: Template[] = [
  {
    id: 'modern-dark',
    name: 'Modern Dark',
    description: 'Sleek dark theme with purple accents',
    category: 'ready',
    preview: 'modern-dark',
    colors: {
      primary: '#8B5CF6',
      secondary: '#EC4899',
      background: '#1F2937',
      text: '#FFFFFF'
    },
    features: ['Dark Mode', 'Gradient Buttons', 'Modern Icons'],
    isPopular: true
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Clean and minimal white theme',
    category: 'ready',
    preview: 'minimal-light',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    features: ['Light Mode', 'Clean Design', 'Simple Layout']
  },
  {
    id: 'vibrant-gradient',
    name: 'Vibrant Gradient',
    description: 'Bold gradients with vibrant colors',
    category: 'ready',
    preview: 'vibrant-gradient',
    colors: {
      primary: '#FF6B6B',
      secondary: '#4ECDC4',
      background: '#F8F9FA',
      text: '#2D3748'
    },
    features: ['Gradient Backgrounds', 'Bold Colors', 'Dynamic Effects'],
    isPremium: true
  },
  {
    id: 'professional-blue',
    name: 'Professional Blue',
    description: 'Corporate blue theme for professionals',
    category: 'ready',
    preview: 'professional-blue',
    colors: {
      primary: '#2563EB',
      secondary: '#1E40AF',
      background: '#F1F5F9',
      text: '#1E293B'
    },
    features: ['Professional Look', 'Blue Theme', 'Business Ready']
  },
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Warm orange and pink sunset theme',
    category: 'ready',
    preview: 'sunset-warm',
    colors: {
      primary: '#F97316',
      secondary: '#EC4899',
      background: '#FEF3C7',
      text: '#92400E'
    },
    features: ['Warm Colors', 'Sunset Theme', 'Cozy Feel']
  },
  {
    id: 'ocean-cool',
    name: 'Ocean Cool',
    description: 'Cool blue ocean-inspired theme',
    category: 'ready',
    preview: 'ocean-cool',
    colors: {
      primary: '#0EA5E9',
      secondary: '#06B6D4',
      background: '#F0F9FF',
      text: '#0C4A6E'
    },
    features: ['Cool Blues', 'Ocean Theme', 'Calm Design']
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  currentTemplate = 'modern-dark',
  onTemplateSelect,
  onCustomize,
  onPreview
}) => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(currentTemplate);
  const [activeCategory, setActiveCategory] = useState<'ready' | 'custom'>('ready');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    onTemplateSelect(templateId);
    toast({
      title: "Template Selected!",
      description: "Your profile template has been updated",
    });
  };

  const handleCustomize = () => {
    onCustomize();
    toast({
      title: "Custom Template",
      description: "Opening template customization options",
    });
  };

  const selectedTemplateData = readyTemplates.find(t => t.id === selectedTemplate);

  const renderTemplatePreview = (template: Template) => {
    const isSelected = selectedTemplate === template.id;
    
    return (
      <Card 
        key={template.id}
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={() => handleTemplateSelect(template.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{template.name}</CardTitle>
              {template.isPopular && (
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  <Star className="w-3 h-3 mr-1" />
                  Popular
                </Badge>
              )}
              {template.isPremium && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            {isSelected && (
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm text-gray-600">{template.description}</p>
        </CardHeader>
        <CardContent>
          {/* Template Preview */}
          <div className="mb-4">
            <div 
              className="w-full h-32 rounded-lg border-2 border-gray-200 relative overflow-hidden"
              style={{ backgroundColor: template.colors.background }}
            >
              {/* Mock Profile Preview */}
              <div className="absolute inset-0 p-3">
                <div className="flex flex-col items-center h-full">
                  <div 
                    className="w-8 h-8 rounded-full mb-2"
                    style={{ backgroundColor: template.colors.primary }}
                  ></div>
                  <div 
                    className="w-16 h-2 rounded mb-1"
                    style={{ backgroundColor: template.colors.text }}
                  ></div>
                  <div 
                    className="w-12 h-1 rounded mb-2"
                    style={{ backgroundColor: template.colors.text, opacity: 0.6 }}
                  ></div>
                  <div className="space-y-1 w-full">
                    <div 
                      className="w-full h-3 rounded"
                      style={{ backgroundColor: template.colors.primary }}
                    ></div>
                    <div 
                      className="w-3/4 h-3 rounded"
                      style={{ backgroundColor: template.colors.secondary }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Color Palette */}
          <div className="mb-3">
            <div className="flex gap-1">
              <div 
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: template.colors.primary }}
                title="Primary"
              ></div>
              <div 
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: template.colors.secondary }}
                title="Secondary"
              ></div>
              <div 
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: template.colors.background }}
                title="Background"
              ></div>
              <div 
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: template.colors.text }}
                title="Text"
              ></div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-1 mb-3">
            {template.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                {feature}
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPreview?.(template.id)}
              className="flex-1"
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={() => handleTemplateSelect(template.id)}
              className="flex-1"
            >
              {isSelected ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Selected
                </>
              ) : (
                'Select'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="h-6 w-6" />
            Choose Your Template
          </h2>
          <p className="text-gray-600 mt-1">
            Select a ready-made template or create your own custom design
          </p>
        </div>
        
        {/* Preview Mode Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={previewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('desktop')}
          >
            <Monitor className="h-4 w-4 mr-1" />
            Desktop
          </Button>
          <Button
            variant={previewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPreviewMode('mobile')}
          >
            <Smartphone className="h-4 w-4 mr-1" />
            Mobile
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveCategory('ready')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeCategory === 'ready'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-2 inline" />
          Ready Templates
        </button>
        <button
          onClick={() => setActiveCategory('custom')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeCategory === 'custom'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Brush className="w-4 h-4 mr-2 inline" />
          Custom Template
        </button>
      </div>

      {/* Content */}
      {activeCategory === 'ready' ? (
        <div className="space-y-6">
          {/* Selected Template Info */}
          {selectedTemplateData && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      Selected: {selectedTemplateData.name}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {selectedTemplateData.description}
                    </p>
                  </div>
                  <Button
                    onClick={() => onPreview?.(selectedTemplate)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ready Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {readyTemplates.map(renderTemplatePreview)}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Custom Template Options */}
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brush className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Create Custom Template
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Design your own unique template with custom colors, fonts, and layouts. 
                Perfect for brands and personal preferences.
              </p>
              <div className="space-y-3">
                <Button
                  onClick={handleCustomize}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Start Customizing
                </Button>
                <div className="text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-4">
                    <span className="flex items-center gap-1">
                      <Layers className="w-4 h-4" />
                      Custom Colors
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Advanced Layout
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      Save & Reuse
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Custom Template Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Palette className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Color Customization</h4>
                <p className="text-sm text-gray-600">
                  Choose any colors for your theme with our advanced color picker
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Layout Options</h4>
                <p className="text-sm text-gray-600">
                  Customize spacing, alignment, and component arrangements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Save & Share</h4>
                <p className="text-sm text-gray-600">
                  Save your custom templates and share them with others
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
