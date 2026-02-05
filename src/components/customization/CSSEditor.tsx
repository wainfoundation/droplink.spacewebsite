import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Code, 
  Eye, 
  Palette, 
  Save, 
  RotateCcw, 
  Download,
  Upload,
  Copy,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Layers,
  Monitor,
  Smartphone
} from 'lucide-react';
import Editor from '@monaco-editor/react';

interface CSSTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'minimal' | 'colorful' | 'professional' | 'creative';
  css: string;
  preview: string;
}

interface CSSEditorProps {
  profileId: string;
  currentCSS: string;
  onSave: (css: string) => void;
  onPreview: (css: string) => void;
}

const CSSEditor: React.FC<CSSEditorProps> = ({ 
  profileId, 
  currentCSS, 
  onSave, 
  onPreview 
}) => {
  const { toast } = useToast();
  const [customCSS, setCustomCSS] = useState(currentCSS);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'vs-light'>('vs-dark');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // CSS Templates
  const cssTemplates: CSSTemplate[] = [
    {
      id: 'modern-gradient',
      name: 'Modern Gradient',
      description: 'Clean gradient design with modern typography',
      category: 'modern',
      css: `
/* Modern Gradient Theme */
.profile-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 2rem;
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  margin: 0 auto 1rem;
  object-fit: cover;
}

.profile-name {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.profile-bio {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.links-container {
  max-width: 600px;
  margin: 0 auto;
}

.link-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.link-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.link-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.25rem;
}

.link-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.social-link {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}
      `,
      preview: 'modern-gradient-preview.png'
    },
    {
      id: 'minimal-clean',
      name: 'Minimal Clean',
      description: 'Simple and clean design with focus on content',
      category: 'minimal',
      css: `
/* Minimal Clean Theme */
.profile-container {
  background: #ffffff;
  min-height: 100vh;
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.profile-header {
  text-align: center;
  margin-bottom: 4rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  object-fit: cover;
  border: 3px solid #f3f4f6;
}

.profile-name {
  font-size: 2rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.profile-bio {
  font-size: 1rem;
  color: #6b7280;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.links-container {
  max-width: 500px;
  margin: 0 auto;
}

.link-item {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.link-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.link-title {
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.link-description {
  font-size: 0.875rem;
  color: #6b7280;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.social-link:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}
      `,
      preview: 'minimal-clean-preview.png'
    },
    {
      id: 'colorful-vibrant',
      name: 'Colorful Vibrant',
      description: 'Bright and energetic design with bold colors',
      category: 'colorful',
      css: `
/* Colorful Vibrant Theme */
.profile-container {
  background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
  background-size: 400% 400%;
  animation: gradientShift 15s ease infinite;
  min-height: 100vh;
  padding: 2rem;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.profile-avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 6px solid rgba(255, 255, 255, 0.8);
  margin: 0 auto 1.5rem;
  object-fit: cover;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.profile-name {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  letter-spacing: -0.02em;
}

.profile-bio {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.95);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  font-weight: 500;
}

.links-container {
  max-width: 600px;
  margin: 0 auto;
}

.link-item {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 1.25rem 1.75rem;
  margin-bottom: 1rem;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.link-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.link-item:hover::before {
  left: 100%;
}

.link-item:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.link-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
}

.link-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 2.5rem;
}

.social-link {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}
      `,
      preview: 'colorful-vibrant-preview.png'
    },
    {
      id: 'professional-dark',
      name: 'Professional Dark',
      description: 'Sophisticated dark theme for business profiles',
      category: 'professional',
      css: `
/* Professional Dark Theme */
.profile-container {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  min-height: 100vh;
  padding: 2rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.profile-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.profile-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  border: 3px solid #3b82f6;
  margin: 0 auto 1.5rem;
  object-fit: cover;
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3);
}

.profile-name {
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 0.75rem;
  letter-spacing: -0.025em;
}

.profile-bio {
  font-size: 1.1rem;
  color: #9ca3af;
  max-width: 550px;
  margin: 0 auto;
  line-height: 1.7;
  font-weight: 400;
}

.links-container {
  max-width: 550px;
  margin: 0 auto;
}

.link-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.link-item::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 10px 10px 0 0;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.link-item:hover::after {
  opacity: 1;
}

.link-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.link-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 0.5rem;
}

.link-description {
  font-size: 0.95rem;
  color: #9ca3af;
  line-height: 1.5;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2.5rem;
}

.social-link {
  width: 45px;
  height: 45px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
  transform: translateY(-2px);
}
      `,
      preview: 'professional-dark-preview.png'
    }
  ];

  const handleTemplateSelect = (templateId: string) => {
    const template = cssTemplates.find(t => t.id === templateId);
    if (template) {
      setCustomCSS(template.css);
      setSelectedTemplate(templateId);
      toast({
        title: "Template Applied",
        description: `${template.name} template has been applied.`,
      });
    }
  };

  const handleSave = async () => {
    try {
      onSave(customCSS);
      toast({
        title: "CSS Saved",
        description: "Your custom CSS has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save CSS. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReset = () => {
    setCustomCSS(currentCSS);
    setSelectedTemplate(null);
    toast({
      title: "CSS Reset",
      description: "CSS has been reset to original state.",
    });
  };

  const handleCopyCSS = () => {
    navigator.clipboard.writeText(customCSS);
    toast({
      title: "CSS Copied",
      description: "CSS code copied to clipboard.",
    });
  };

  const validateCSS = (css: string) => {
    // Basic CSS validation
    const errors: string[] = [];
    
    if (css.includes('{') && !css.includes('}')) {
      errors.push('Missing closing brace');
    }
    
    if (css.includes('}') && !css.includes('{')) {
      errors.push('Missing opening brace');
    }
    
    return errors;
  };

  const cssErrors = validateCSS(customCSS);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom CSS Editor</h2>
          <p className="text-gray-600">Customize your profile appearance with CSS</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {isPreviewMode ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save CSS
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSS Editor */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  CSS Editor
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditorTheme(editorTheme === 'vs-dark' ? 'vs-light' : 'vs-dark')}
                  >
                    <Palette className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCopyCSS}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 border rounded-lg overflow-hidden">
                <Editor
                  height="100%"
                  defaultLanguage="css"
                  value={customCSS}
                  onChange={(value) => setCustomCSS(value || '')}
                  theme={editorTheme}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
              
              {/* CSS Validation */}
              {cssErrors.length > 0 && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-sm font-medium text-red-800">CSS Validation Errors:</span>
                  </div>
                  <ul className="mt-2 text-sm text-red-700">
                    {cssErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        {isPreviewMode && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Live Preview
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === 'desktop' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode('desktop')}
                    >
                      <Monitor className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'mobile' ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode('mobile')}
                    >
                      <Smartphone className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`border rounded-lg overflow-hidden ${
                  viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
                }`}>
                  <div className="bg-gray-100 p-2 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 ml-2">
                        {viewMode === 'mobile' ? 'Mobile Preview' : 'Desktop Preview'}
                      </span>
                    </div>
                  </div>
                  <div 
                    className="preview-container"
                    style={{ 
                      minHeight: '400px',
                      transform: viewMode === 'mobile' ? 'scale(0.8)' : 'scale(1)',
                      transformOrigin: 'top center'
                    }}
                  >
                    <style>{customCSS}</style>
                    <div className="profile-container">
                      <div className="profile-header">
                        <img 
                          src="https://via.placeholder.com/100x100/3b82f6/ffffff?text=JD" 
                          alt="Profile" 
                          className="profile-avatar"
                        />
                        <h1 className="profile-name">John Doe</h1>
                        <p className="profile-bio">
                          Digital creator and entrepreneur. Sharing insights about business, technology, and lifestyle.
                        </p>
                      </div>
                      
                      <div className="links-container">
                        <div className="link-item">
                          <div className="link-title">Instagram</div>
                          <div className="link-description">Follow me for daily updates</div>
                        </div>
                        <div className="link-item">
                          <div className="link-title">YouTube</div>
                          <div className="link-description">Watch my latest videos</div>
                        </div>
                        <div className="link-item">
                          <div className="link-title">Website</div>
                          <div className="link-description">Visit my official website</div>
                        </div>
                      </div>
                      
                      <div className="social-links">
                        <div className="social-link">📱</div>
                        <div className="social-link">📧</div>
                        <div className="social-link">💼</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* CSS Templates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            CSS Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="modern" className="space-y-4">
            <TabsList>
              <TabsTrigger value="modern">Modern</TabsTrigger>
              <TabsTrigger value="minimal">Minimal</TabsTrigger>
              <TabsTrigger value="colorful">Colorful</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
            </TabsList>

            {['modern', 'minimal', 'colorful', 'professional'].map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cssTemplates
                    .filter(template => template.category === category)
                    .map((template) => (
                      <Card 
                        key={template.id} 
                        className={`cursor-pointer transition-all ${
                          selectedTemplate === template.id 
                            ? 'ring-2 ring-blue-500 border-blue-500' 
                            : 'hover:shadow-lg'
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold">{template.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                            </div>
                            {selectedTemplate === template.id && (
                              <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                            )}
                          </div>
                          <div className="mt-3 h-24 bg-gray-100 rounded border flex items-center justify-center">
                            <span className="text-xs text-gray-500">Template Preview</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default CSSEditor;
