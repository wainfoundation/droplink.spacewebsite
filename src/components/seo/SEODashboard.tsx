import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Eye, 
  Share2, 
  Target, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Copy,
  RefreshCw,
  Globe,
  Hash,
  FileText,
  Smartphone,
  Monitor,
  Save
} from 'lucide-react';

interface SEOTools {
  metaTags: MetaTag[];
  socialPreviews: SocialPreview[];
  keywordAnalysis: KeywordData[];
  performanceScore: number;
  suggestions: SEOSuggestion[];
}

interface MetaTag {
  name: string;
  content: string;
  type: 'title' | 'description' | 'keywords' | 'og:title' | 'og:description' | 'og:image' | 'twitter:card' | 'twitter:title' | 'twitter:description';
}

interface SocialPreview {
  platform: 'facebook' | 'twitter' | 'linkedin';
  title: string;
  description: string;
  image: string;
  url: string;
}

interface KeywordData {
  keyword: string;
  difficulty: number;
  searchVolume: number;
  relevance: number;
}

interface SEOSuggestion {
  type: 'error' | 'warning' | 'info';
  message: string;
  action?: string;
}

interface SEODashboardProps {
  profileId: string;
  profileData: {
    username: string;
    displayName: string;
    bio: string;
    avatarUrl?: string;
  };
}

const SEODashboard: React.FC<SEODashboardProps> = ({ profileId, profileData }) => {
  const { toast } = useToast();
  const [seoData, setSeoData] = useState<SEOTools | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [metaTags, setMetaTags] = useState<MetaTag[]>([
    {
      name: 'title',
      content: `${profileData.displayName} - Droplink Profile`,
      type: 'title'
    },
    {
      name: 'description',
      content: profileData.bio || `Check out ${profileData.displayName}'s links and content on Droplink`,
      type: 'description'
    },
    {
      name: 'keywords',
      content: 'droplink, links, profile, social media',
      type: 'keywords'
    },
    {
      name: 'og:title',
      content: `${profileData.displayName} - Droplink Profile`,
      type: 'og:title'
    },
    {
      name: 'og:description',
      content: profileData.bio || `Check out ${profileData.displayName}'s links and content on Droplink`,
      type: 'og:description'
    },
    {
      name: 'og:image',
      content: profileData.avatarUrl || 'https://droplink.space/default-og-image.png',
      type: 'og:image'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
      type: 'twitter:card'
    },
    {
      name: 'twitter:title',
      content: `${profileData.displayName} - Droplink Profile`,
      type: 'twitter:title'
    },
    {
      name: 'twitter:description',
      content: profileData.bio || `Check out ${profileData.displayName}'s links and content on Droplink`,
      type: 'twitter:description'
    }
  ]);

  // Mock SEO data
  const mockSEOData: SEOTools = {
    metaTags: metaTags,
    socialPreviews: [
      {
        platform: 'facebook',
        title: `${profileData.displayName} - Droplink Profile`,
        description: profileData.bio || `Check out ${profileData.displayName}'s links and content on Droplink`,
        image: profileData.avatarUrl || 'https://droplink.space/default-og-image.png',
        url: `https://droplink.space/@${profileData.username}`
      },
      {
        platform: 'twitter',
        title: `${profileData.displayName} - Droplink Profile`,
        description: profileData.bio || `Check out ${profileData.displayName}'s links and content on Droplink`,
        image: profileData.avatarUrl || 'https://droplink.space/default-og-image.png',
        url: `https://droplink.space/@${profileData.username}`
      },
      {
        platform: 'linkedin',
        title: `${profileData.displayName} - Droplink Profile`,
        description: profileData.bio || `Check out ${profileData.displayName}'s links and content on Droplink`,
        image: profileData.avatarUrl || 'https://droplink.space/default-og-image.png',
        url: `https://droplink.space/@${profileData.username}`
      }
    ],
    keywordAnalysis: [
      { keyword: 'droplink', difficulty: 45, searchVolume: 1200, relevance: 95 },
      { keyword: 'link in bio', difficulty: 65, searchVolume: 8900, relevance: 85 },
      { keyword: 'social media links', difficulty: 55, searchVolume: 3400, relevance: 80 },
      { keyword: 'profile links', difficulty: 40, searchVolume: 2100, relevance: 75 }
    ],
    performanceScore: 78,
    suggestions: [
      {
        type: 'warning',
        message: 'Meta description is too short. Aim for 150-160 characters.',
        action: 'Edit description'
      },
      {
        type: 'info',
        message: 'Add more relevant keywords to improve search visibility.',
        action: 'Add keywords'
      },
      {
        type: 'error',
        message: 'Missing Open Graph image. Add an image for better social sharing.',
        action: 'Upload image'
      }
    ]
  };

  useEffect(() => {
    const fetchSEOData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSeoData(mockSEOData);
      setIsLoading(false);
    };

    fetchSEOData();
  }, [profileId]);

  const handleMetaTagUpdate = (index: number, field: 'name' | 'content', value: string) => {
    const updatedTags = [...metaTags];
    updatedTags[index] = { ...updatedTags[index], [field]: value };
    setMetaTags(updatedTags);
  };

  const handleSaveSEO = async () => {
    try {
      // Save SEO data to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "SEO Updated",
        description: "Your SEO settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save SEO settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading SEO data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!seoData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No SEO Data</h3>
            <p className="text-gray-600">
              Start optimizing your profile for better search visibility
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">SEO Dashboard</h2>
          <p className="text-gray-600">Optimize your profile for search engines and social media</p>
        </div>
        <Button onClick={handleSaveSEO}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            SEO Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Score</span>
                <span className={`text-lg font-bold ${getPerformanceColor(seoData.performanceScore)}`}>
                  {seoData.performanceScore}/100
                </span>
              </div>
              <Progress value={seoData.performanceScore} className="w-full" />
              <p className="text-sm text-gray-600 mt-1">
                {getPerformanceLabel(seoData.performanceScore)} - {seoData.suggestions.length} suggestions available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="meta" className="space-y-4">
        <TabsList>
          <TabsTrigger value="meta">Meta Tags</TabsTrigger>
          <TabsTrigger value="social">Social Previews</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="meta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Meta Tags Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {metaTags.map((tag, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm font-medium">{tag.name}</label>
                  <div className="flex space-x-2">
                    <Input
                      value={tag.content}
                      onChange={(e) => handleMetaTagUpdate(index, 'content', e.target.value)}
                      placeholder={`Enter ${tag.name} content`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(tag.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{tag.content.length} characters</span>
                    {tag.type === 'description' && (
                      <span className={tag.content.length < 150 ? 'text-red-500' : 'text-green-500'}>
                        {tag.content.length < 150 ? 'Too short' : 'Optimal length'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {seoData.socialPreviews.map((preview, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {preview.platform === 'facebook' && <Globe className="w-5 h-5 mr-2 text-blue-600" />}
                    {preview.platform === 'twitter' && <Hash className="w-5 h-5 mr-2 text-blue-400" />}
                    {preview.platform === 'linkedin' && <FileText className="w-5 h-5 mr-2 text-blue-700" />}
                    {preview.platform.charAt(0).toUpperCase() + preview.platform.slice(1)} Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-3 bg-gray-50">
                    <div className="space-y-2">
                      <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                        <img 
                          src={preview.image} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm line-clamp-2">{preview.title}</h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{preview.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{preview.url}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoData.keywordAnalysis.map((keyword, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{keyword.keyword}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Difficulty: {keyword.difficulty}/100</span>
                        <span>Volume: {keyword.searchVolume.toLocaleString()}</span>
                        <span>Relevance: {keyword.relevance}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={keyword.relevance >= 80 ? "default" : "secondary"}>
                        {keyword.relevance >= 80 ? 'High' : 'Medium'} Relevance
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SEO Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {seoData.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {suggestion.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                      {suggestion.type === 'warning' && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                      {suggestion.type === 'info' && <CheckCircle className="w-5 h-5 text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{suggestion.message}</p>
                      {suggestion.action && (
                        <Button variant="outline" size="sm" className="mt-2">
                          {suggestion.action}
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEODashboard;
