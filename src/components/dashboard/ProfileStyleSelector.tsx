import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ExternalLink, Smartphone, Monitor } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileStyle {
  id: string;
  name: string;
  description: string;
  preview: string;
  route: string;
  features: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

const ProfileStyleSelector: React.FC = () => {
  const { toast } = useToast();
  const [selectedStyle, setSelectedStyle] = useState<string>('linktree');

  const profileStyles: ProfileStyle[] = [
    {
      id: 'linktree',
      name: 'Linktree Style',
      description: 'Clean, modern design perfect for social media and mobile',
      preview: 'linktree-preview',
      route: '/link',
      features: ['Mobile-first design', 'Gradient backgrounds', 'Social stats', 'Like & Share buttons'],
      isPopular: true
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Business-focused layout with detailed information',
      preview: 'professional-preview',
      route: '/@',
      features: ['Business information', 'Contact details', 'Professional bio', 'Social links grid'],
      isNew: true
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Simple, clean design with focus on content',
      preview: 'minimal-preview',
      route: '/',
      features: ['Clean layout', 'Focus on links', 'Minimal distractions', 'Fast loading']
    }
  ];

  const handlePreview = (style: ProfileStyle) => {
    // In production, this would open a preview modal
    toast({
      title: "Preview Mode",
      description: `Previewing ${style.name} style...`,
    });
  };

  const handleSelectStyle = (style: ProfileStyle) => {
    setSelectedStyle(style.id);
    toast({
      title: "Style Selected",
      description: `Your profile will use the ${style.name} style`,
    });
  };

  const handleViewProfile = (style: ProfileStyle) => {
    // In production, this would open the user's profile in the selected style
    const username = 'demo'; // This would be the actual username
    window.open(`${style.route}/${username}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Style</h2>
        <p className="text-gray-600">
          Choose how your public profile will look to visitors
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {profileStyles.map((style) => (
          <Card 
            key={style.id} 
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedStyle === style.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => handleSelectStyle(style)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{style.name}</CardTitle>
                <div className="flex gap-1">
                  {style.isPopular && (
                    <Badge variant="default" className="text-xs">Popular</Badge>
                  )}
                  {style.isNew && (
                    <Badge variant="secondary" className="text-xs">New</Badge>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{style.description}</p>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Preview placeholder */}
              <div className="bg-gray-100 rounded-lg h-32 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Smartphone className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-xs">Preview</p>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-900">Features:</h4>
                <ul className="text-xs text-gray-600 space-y-1">
                  {style.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(style);
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProfile(style);
                  }}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Selection */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-blue-900">
                Selected: {profileStyles.find(s => s.id === selectedStyle)?.name}
              </h3>
              <p className="text-sm text-blue-700">
                Your profile will be accessible at: 
                <code className="ml-1 bg-blue-100 px-1 rounded text-xs">
                  {profileStyles.find(s => s.id === selectedStyle)?.route}/your-username
                </code>
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Style
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileStyleSelector;
