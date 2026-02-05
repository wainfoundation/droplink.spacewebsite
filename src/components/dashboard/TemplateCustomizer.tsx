import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Palette, 
  Type, 
  Layout,
  Download,
  Upload,
  RotateCcw,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CustomTemplate {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
  };
  layout: {
    spacing: string;
    borderRadius: string;
    shadow: string;
  };
}

interface TemplateCustomizerProps {
  onBack: () => void;
  onSave: (template: CustomTemplate) => void;
  initialTemplate?: CustomTemplate;
}

const fontFamilies = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Nunito',
  'Source Sans Pro'
];

const TemplateCustomizer: React.FC<TemplateCustomizerProps> = ({
  onBack,
  onSave,
  initialTemplate
}) => {
  const { toast } = useToast();
  
  const [template, setTemplate] = useState<CustomTemplate>(
    initialTemplate || {
      name: 'My Custom Template',
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        background: '#FFFFFF',
        text: '#1F2937',
        accent: '#F3F4F6'
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: '400'
      },
      layout: {
        spacing: '16px',
        borderRadius: '12px',
        shadow: 'medium'
      }
    }
  );

  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout'>('colors');

  const handleColorChange = (colorType: keyof CustomTemplate['colors'], value: string) => {
    setTemplate(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorType]: value
      }
    }));
  };

  const handleTypographyChange = (property: keyof CustomTemplate['typography'], value: string) => {
    setTemplate(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [property]: value
      }
    }));
  };

  const handleLayoutChange = (property: keyof CustomTemplate['layout'], value: string) => {
    setTemplate(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [property]: value
      }
    }));
  };

  const handleSave = () => {
    onSave(template);
    toast({
      title: "Template Saved!",
      description: "Your custom template has been saved successfully",
    });
  };

  const handleReset = () => {
    setTemplate({
      name: 'My Custom Template',
      colors: {
        primary: '#8B5CF6',
        secondary: '#EC4899',
        background: '#FFFFFF',
        text: '#1F2937',
        accent: '#F3F4F6'
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: '400'
      },
      layout: {
        spacing: '16px',
        borderRadius: '12px',
        shadow: 'medium'
      }
    });
    toast({
      title: "Template Reset",
      description: "Template has been reset to default values",
    });
  };

  const renderColorCustomizer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="primary-color">Primary Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="primary-color"
                type="color"
                value={template.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={template.colors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                placeholder="#8B5CF6"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="secondary-color">Secondary Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="secondary-color"
                type="color"
                value={template.colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={template.colors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                placeholder="#EC4899"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="background-color">Background Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="background-color"
                type="color"
                value={template.colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={template.colors.background}
                onChange={(e) => handleColorChange('background', e.target.value)}
                placeholder="#FFFFFF"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="text-color">Text Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="text-color"
                type="color"
                value={template.colors.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={template.colors.text}
                onChange={(e) => handleColorChange('text', e.target.value)}
                placeholder="#1F2937"
                className="flex-1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="accent-color">Accent Color</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="accent-color"
                type="color"
                value={template.colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-16 h-10 p-1 border rounded"
              />
              <Input
                value={template.colors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                placeholder="#F3F4F6"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Color Preview */}
        <div>
          <Label>Color Preview</Label>
          <div 
            className="mt-2 p-6 rounded-lg border"
            style={{ backgroundColor: template.colors.background }}
          >
            <div className="space-y-4">
              <div className="text-center">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                  style={{ backgroundColor: template.colors.primary }}
                ></div>
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: template.colors.text }}
                >
                  Profile Name
                </h3>
                <p 
                  className="text-sm opacity-70"
                  style={{ color: template.colors.text }}
                >
                  @username
                </p>
              </div>
              <div className="space-y-2">
                <div 
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: template.colors.primary }}
                >
                  <span 
                    className="text-sm font-medium"
                    style={{ color: template.colors.background }}
                  >
                    Primary Button
                  </span>
                </div>
                <div 
                  className="p-3 rounded-lg border"
                  style={{ 
                    backgroundColor: template.colors.accent,
                    borderColor: template.colors.secondary
                  }}
                >
                  <span 
                    className="text-sm font-medium"
                    style={{ color: template.colors.text }}
                  >
                    Secondary Button
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTypographyCustomizer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="font-family">Font Family</Label>
            <select
              id="font-family"
              value={template.typography.fontFamily}
              onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            >
              {fontFamilies.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="font-size">Font Size</Label>
            <Input
              id="font-size"
              value={template.typography.fontSize}
              onChange={(e) => handleTypographyChange('fontSize', e.target.value)}
              placeholder="16px"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="font-weight">Font Weight</Label>
            <select
              id="font-weight"
              value={template.typography.fontWeight}
              onChange={(e) => handleTypographyChange('fontWeight', e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            >
              <option value="300">Light (300)</option>
              <option value="400">Normal (400)</option>
              <option value="500">Medium (500)</option>
              <option value="600">Semi Bold (600)</option>
              <option value="700">Bold (700)</option>
            </select>
          </div>
        </div>

        {/* Typography Preview */}
        <div>
          <Label>Typography Preview</Label>
          <div 
            className="mt-2 p-6 rounded-lg border"
            style={{ 
              backgroundColor: template.colors.background,
              fontFamily: template.typography.fontFamily,
              color: template.colors.text
            }}
          >
            <div className="space-y-4">
              <h1 
                className="text-2xl font-bold"
                style={{ 
                  fontSize: '1.5rem',
                  fontWeight: template.typography.fontWeight
                }}
              >
                Heading Text
              </h1>
              <h2 
                className="text-xl font-semibold"
                style={{ 
                  fontSize: '1.25rem',
                  fontWeight: template.typography.fontWeight
                }}
              >
                Subheading Text
              </h2>
              <p 
                className="text-base"
                style={{ 
                  fontSize: template.typography.fontSize,
                  fontWeight: template.typography.fontWeight
                }}
              >
                This is a sample paragraph text to show how your typography will look. 
                It includes regular text that users will read on your profile.
              </p>
              <div 
                className="text-sm opacity-70"
                style={{ 
                  fontSize: '0.875rem',
                  fontWeight: template.typography.fontWeight
                }}
              >
                Small text for captions and descriptions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLayoutCustomizer = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="spacing">Spacing</Label>
            <Input
              id="spacing"
              value={template.layout.spacing}
              onChange={(e) => handleLayoutChange('spacing', e.target.value)}
              placeholder="16px"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="border-radius">Border Radius</Label>
            <Input
              id="border-radius"
              value={template.layout.borderRadius}
              onChange={(e) => handleLayoutChange('borderRadius', e.target.value)}
              placeholder="12px"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="shadow">Shadow</Label>
            <select
              id="shadow"
              value={template.layout.shadow}
              onChange={(e) => handleLayoutChange('shadow', e.target.value)}
              className="w-full mt-2 p-2 border rounded-md"
            >
              <option value="none">None</option>
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
        </div>

        {/* Layout Preview */}
        <div>
          <Label>Layout Preview</Label>
          <div 
            className="mt-2 p-6 rounded-lg border"
            style={{ backgroundColor: template.colors.background }}
          >
            <div 
              className="space-y-4"
              style={{ gap: template.layout.spacing }}
            >
              <div 
                className="p-4 rounded-lg border"
                style={{ 
                  backgroundColor: template.colors.accent,
                  borderRadius: template.layout.borderRadius,
                  boxShadow: template.layout.shadow === 'none' ? 'none' : 
                             template.layout.shadow === 'small' ? '0 1px 3px rgba(0,0,0,0.1)' :
                             template.layout.shadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                             '0 10px 15px rgba(0,0,0,0.1)'
                }}
              >
                <div 
                  className="text-sm font-medium"
                  style={{ color: template.colors.text }}
                >
                  Card with custom spacing and border radius
                </div>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ 
                  backgroundColor: template.colors.primary,
                  borderRadius: template.layout.borderRadius,
                  boxShadow: template.layout.shadow === 'none' ? 'none' : 
                             template.layout.shadow === 'small' ? '0 1px 3px rgba(0,0,0,0.1)' :
                             template.layout.shadow === 'medium' ? '0 4px 6px rgba(0,0,0,0.1)' :
                             '0 10px 15px rgba(0,0,0,0.1)'
                }}
              >
                <div 
                  className="text-sm font-medium"
                  style={{ color: template.colors.background }}
                >
                  Primary button with shadow
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Palette className="h-6 w-6" />
              Customize Template
            </h2>
            <p className="text-gray-600 mt-1">
              Create your own unique template design
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      {/* Template Name */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label htmlFor="template-name" className="font-medium">Template Name:</Label>
            <Input
              id="template-name"
              value={template.name}
              onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
              placeholder="My Custom Template"
              className="flex-1 max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customization Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('colors')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'colors'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Palette className="w-4 h-4 mr-2 inline" />
          Colors
        </button>
        <button
          onClick={() => setActiveTab('typography')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'typography'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Type className="w-4 h-4 mr-2 inline" />
          Typography
        </button>
        <button
          onClick={() => setActiveTab('layout')}
          className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
            activeTab === 'layout'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layout className="w-4 h-4 mr-2 inline" />
          Layout
        </button>
      </div>

      {/* Tab Content */}
      <Card>
        <CardContent className="p-6">
          {activeTab === 'colors' && renderColorCustomizer()}
          {activeTab === 'typography' && renderTypographyCustomizer()}
          {activeTab === 'layout' && renderLayoutCustomizer()}
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateCustomizer;
