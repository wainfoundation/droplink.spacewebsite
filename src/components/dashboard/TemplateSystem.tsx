import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Palette, 
  Lock, 
  Check, 
  Star, 
  Zap, 
  Crown, 
  Shield,
  Eye,
  Download,
  Upload,
  Settings,
  Code,
  Image,
  Sparkles,
  Heart,
  TrendingUp,
  Save
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPlanConfig, hasFeature, type PlanType } from "@/services/planFeaturesService";

interface Template {
  id: string;
  name: string;
  description: string;
  tier: PlanType;
  colors: string[];
  preview: string;
  category: 'free' | 'premium' | 'exclusive';
  isCustom?: boolean;
  customCSS?: string;
}

interface TemplateSystemProps {
  currentPlan: PlanType;
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onUpgrade?: (planId: string) => void;
}

const TemplateSystem: React.FC<TemplateSystemProps> = ({
  currentPlan,
  selectedTemplate,
  onTemplateSelect,
  onUpgrade
}) => {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<'all' | 'free' | 'premium' | 'exclusive' | 'custom'>('all');
  const [showCustomEditor, setShowCustomEditor] = useState(false);

  const templates: Template[] = [
    // Free Templates
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      description: 'Calming blue gradient perfect for professional profiles',
      tier: 'FREE',
      colors: ['#00aaff', '#00d4ff'],
      preview: 'linear-gradient(135deg, #00aaff, #00d4ff)',
      category: 'free'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm orange to pink gradient for creative profiles',
      tier: 'FREE',
      colors: ['#ff7e5f', '#feb47b'],
      preview: 'linear-gradient(135deg, #ff7e5f, #feb47b)',
      category: 'free'
    },
    {
      id: 'forest',
      name: 'Forest',
      description: 'Natural green gradient for eco-friendly brands',
      tier: 'FREE',
      colors: ['#11998e', '#38ef7d'],
      preview: 'linear-gradient(135deg, #11998e, #38ef7d)',
      category: 'free'
    },
    
    // Starter Templates
    {
      id: 'gradient-pro',
      name: 'Gradient Pro',
      description: 'Professional purple gradient for business profiles',
      tier: 'STARTER',
      colors: ['#667eea', '#764ba2'],
      preview: 'linear-gradient(135deg, #667eea, #764ba2)',
      category: 'premium'
    },
    {
      id: 'neon-lights',
      name: 'Neon Lights',
      description: 'Vibrant neon gradient for tech and gaming profiles',
      tier: 'STARTER',
      colors: ['#ff006e', '#00f5ff'],
      preview: 'linear-gradient(135deg, #ff006e, #00f5ff)',
      category: 'premium'
    },
    {
      id: 'royal-purple',
      name: 'Royal Purple',
      description: 'Elegant purple gradient for luxury brands',
      tier: 'PRO',
      colors: ['#8e2de2', '#4a00e0'],
      preview: 'linear-gradient(135deg, #8e2de2, #4a00e0)',
      category: 'premium'
    },
    {
      id: 'gold-rush',
      name: 'Gold Rush',
      description: 'Luxurious gold gradient for premium brands',
      tier: 'PRO',
      colors: ['#f7971e', '#ffd200'],
      preview: 'linear-gradient(135deg, #f7971e, #ffd200)',
      category: 'premium'
    },
    
    // Premium Templates
    {
      id: 'premium-dark',
      name: 'Premium Dark',
      description: 'Sophisticated dark theme for professional profiles',
      tier: 'PREMIUM',
      colors: ['#0f0f23', '#2d2d44'],
      preview: 'linear-gradient(135deg, #0f0f23, #2d2d44)',
      category: 'exclusive'
    },
    {
      id: 'diamond',
      name: 'Diamond',
      description: 'Multi-color diamond gradient for exclusive profiles',
      tier: 'PREMIUM',
      colors: ['#e8f5e8', '#b8e6b8', '#74c0fc'],
      preview: 'linear-gradient(135deg, #e8f5e8, #b8e6b8, #74c0fc)',
      category: 'exclusive'
    },
    {
      id: 'cosmic',
      name: 'Cosmic',
      description: 'Space-inspired gradient with multiple colors',
      tier: 'PREMIUM',
      colors: ['#667eea', '#764ba2', '#f093fb'],
      preview: 'linear-gradient(135deg, #667eea, #764ba2, #f093fb)',
      category: 'exclusive'
    }
  ];

  const getTierIcon = (tier: PlanType) => {
    switch (tier) {
      case 'FREE': return <Star className="w-4 h-4 text-gray-500" />;
      case 'STARTER': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'PRO': return <Crown className="w-4 h-4 text-purple-500" />;
      case 'PREMIUM': return <Shield className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getTierColor = (tier: PlanType) => {
    switch (tier) {
      case 'FREE': return 'bg-gray-100 text-gray-700';
      case 'STARTER': return 'bg-blue-100 text-blue-700';
      case 'PRO': return 'bg-purple-100 text-purple-700';
      case 'PREMIUM': return 'bg-yellow-100 text-yellow-700';
    }
  };

  const canUseTemplate = (template: Template): boolean => {
    const planOrder: PlanType[] = ['FREE', 'STARTER', 'PRO', 'PREMIUM'];
    const currentPlanIndex = planOrder.indexOf(currentPlan);
    const templatePlanIndex = planOrder.indexOf(template.tier);
    return currentPlanIndex >= templatePlanIndex;
  };

  const filteredTemplates = templates.filter(template => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'custom') return template.isCustom;
    return template.category === activeCategory;
  });

  const availableTemplates = filteredTemplates.filter(template => canUseTemplate(template));
  const lockedTemplates = filteredTemplates.filter(template => !canUseTemplate(template));

  const handleTemplateSelect = (template: Template) => {
    if (!canUseTemplate(template)) {
      toast({
        title: "Template Locked",
        description: `This template requires ${template.tier} plan or higher`,
        variant: "destructive"
      });
      if (onUpgrade) {
        onUpgrade(template.tier);
      }
      return;
    }

    onTemplateSelect(template.id);
    toast({
      title: "Template Selected",
      description: `Applied ${template.name} template`,
    });
  };

  const handleCustomCSS = () => {
    if (!hasFeature(currentPlan, 'customCSS')) {
      toast({
        title: "Custom CSS Locked",
        description: "Custom CSS is available in Premium plan only",
        variant: "destructive"
      });
      if (onUpgrade) {
        onUpgrade('premium');
      }
      return;
    }
    setShowCustomEditor(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
          <p className="text-gray-600">Choose from {getPlanConfig(currentPlan).features.templates}+ beautiful templates</p>
        </div>
        {hasFeature(currentPlan, 'customCSS') && (
          <Button onClick={handleCustomCSS} variant="outline">
            <Code className="w-4 h-4 mr-2" />
            Custom CSS
          </Button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto">
        {[
          { id: 'all', label: 'All', count: templates.length },
          { id: 'free', label: 'Free', count: templates.filter(t => t.category === 'free').length },
          { id: 'premium', label: 'Premium', count: templates.filter(t => t.category === 'premium').length },
          { id: 'exclusive', label: 'Exclusive', count: templates.filter(t => t.category === 'exclusive').length },
          ...(hasFeature(currentPlan, 'customCSS') ? [{ id: 'custom', label: 'Custom', count: 0 }] : [])
        ].map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(category.id as any)}
            className="whitespace-nowrap"
          >
            {category.label}
            <Badge variant="secondary" className="ml-2 text-xs">
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Available Templates */}
      {availableTemplates.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTemplates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedTemplate === template.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent className="p-0">
                  <div 
                    className="h-32 rounded-t-lg relative"
                    style={{ background: template.preview }}
                  >
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <Badge className={getTierColor(template.tier)}>
                        {getTierIcon(template.tier)}
                        <span className="ml-1 capitalize">{template.tier}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Locked Templates */}
      {lockedTemplates.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upgrade to Unlock</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedTemplates.map((template) => (
              <Card 
                key={template.id} 
                className="cursor-pointer transition-all hover:shadow-lg opacity-60"
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent className="p-0">
                  <div 
                    className="h-32 rounded-t-lg relative"
                    style={{ background: template.preview }}
                  >
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className={getTierColor(template.tier)}>
                        {getTierIcon(template.tier)}
                        <span className="ml-1 capitalize">{template.tier}</span>
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900">{template.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                    <p className="text-xs text-blue-600 mt-2 font-medium">
                      Upgrade to {template.tier} to unlock
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Custom CSS Editor */}
      {showCustomEditor && hasFeature(currentPlan, 'customCSS') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Custom CSS Editor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom CSS
                </label>
                <textarea
                  className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm"
                  placeholder="/* Add your custom CSS here */
.profile-container {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

.link-button {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}"
                />
              </div>
              <div className="flex gap-2">
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Apply CSS
                </Button>
                <Button variant="outline" onClick={() => setShowCustomEditor(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plan Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Palette className="w-5 h-5 text-blue-600" />
            <div>
              <h4 className="font-semibold text-blue-900">Template Access</h4>
              <p className="text-sm text-blue-700">
                {currentPlan === 'FREE' && 'Free plan includes 3 basic templates. Upgrade to Starter for 33+ templates.'}
                {currentPlan === 'STARTER' && 'Starter plan includes 33+ templates. Upgrade to Pro for 66+ premium templates.'}
                {currentPlan === 'PRO' && 'Pro plan includes 66+ premium templates. Upgrade to Premium for 99+ exclusive templates.'}
                {currentPlan === 'PREMIUM' && 'Premium plan includes all 99+ templates plus custom CSS editing.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TemplateSystem;
