import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search,
  TrendingUp,
  Target,
  Eye,
  Globe,
  Link as LinkIcon,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Star,
  Zap,
  BarChart3,
  Settings,
  RefreshCw,
  Download,
  Upload,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  Shield,
  Award,
  Trophy,
  Medal,
  Flag,
  Compass,
  Navigation,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  QrCode,
  Tag,
  Pin,
  Archive,
  Settings2,
  User,
  UserPlus,
  UserCheck,
  UserX,
  Users2,
  UserCircle,
  UserSquare,
  UserCheck2,
  UserX2,
  UserPlus2,
  UserMinus,
  UserEdit,
  UserCog,
  UserShield,
  UserLock,
  UserUnlock,
  UserKey,
  UserBell,
  UserMail,
  UserPhone,
  UserMessage,
  UserVideo,
  UserImage,
  UserMusic,
  UserFile,
  UserBook,
  UserShopping,
  UserCredit,
  UserDollar,
  UserGift,
  UserAward,
  UserTrophy,
  UserMedal,
  UserFlag,
  UserGlobe,
  UserCompass,
  UserNavigation,
  UserSearch,
  UserFilter,
  UserSort,
  UserMore,
  UserCopy,
  UserQr,
  UserTag,
  UserPin,
  UserArchive,
  UserSettings,
  UserCog2,
  UserShield2,
  UserLock2,
  UserUnlock2,
  UserKey2,
  UserBell2,
  UserMail2,
  UserPhone2,
  UserMessage2,
  UserVideo2,
  UserImage2,
  UserMusic2,
  UserFile2,
  UserBook2,
  UserShopping2,
  UserCredit2,
  UserDollar2,
  UserGift2,
  UserAward2,
  UserTrophy2,
  UserMedal2,
  UserFlag2,
  UserGlobe2,
  UserCompass2,
  UserNavigation2,
  UserSearch2,
  UserFilter2,
  UserSort2,
  UserMore2,
  UserCopy2,
  UserQr2,
  UserTag2,
  UserPin2,
  UserArchive2,
  UserSettings2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SEOAnalysis {
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    suggestion: string;
  }>;
  suggestions: Array<{
    category: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  metrics: {
    titleLength: number;
    descriptionLength: number;
    keywordDensity: number;
    readabilityScore: number;
    loadingSpeed: number;
    mobileFriendly: boolean;
  };
}

interface SEOToolsProps {
  profileUrl?: string;
  onOptimize?: (optimizations: any) => void;
}

const SEOTools: React.FC<SEOToolsProps> = ({
  profileUrl = 'https://droplink.app/username',
  onOptimize
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('analysis');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);

  const mockAnalysis: SEOAnalysis = {
    score: 78,
    issues: [
      {
        type: 'warning',
        message: 'Title is too short',
        suggestion: 'Add more descriptive keywords to your title'
      },
      {
        type: 'error',
        message: 'Missing meta description',
        suggestion: 'Add a compelling meta description'
      },
      {
        type: 'info',
        message: 'Good keyword density',
        suggestion: 'Keep up the good work!'
      }
    ],
    suggestions: [
      {
        category: 'Content',
        title: 'Add more descriptive content',
        description: 'Include more detailed information about yourself',
        priority: 'high'
      },
      {
        category: 'Keywords',
        title: 'Optimize for target keywords',
        description: 'Use relevant keywords throughout your profile',
        priority: 'medium'
      },
      {
        category: 'Images',
        title: 'Add alt text to images',
        description: 'Include descriptive alt text for better accessibility',
        priority: 'low'
      }
    ],
    metrics: {
      titleLength: 45,
      descriptionLength: 120,
      keywordDensity: 2.5,
      readabilityScore: 85,
      loadingSpeed: 1.2,
      mobileFriendly: true
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysis(mockAnalysis);
      toast({
        title: "Analysis Complete",
        description: "Your SEO analysis has been completed successfully",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SEO & Optimization Tools</h2>
          <p className="text-gray-600">Optimize your profile for better search visibility</p>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Analyze Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile URL */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile URL</p>
              <p className="text-lg font-semibold text-gray-900">{profileUrl}</p>
            </div>
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4 mr-2" />
              Copy URL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="analysis">SEO Analysis</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          {analysis ? (
            <>
              {/* SEO Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    SEO Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-4xl font-bold text-gray-900">{analysis.score}</p>
                      <p className="text-sm text-gray-600">Out of 100</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getScoreColor(analysis.score)}`}>
                        {analysis.score >= 80 ? 'Excellent' : analysis.score >= 60 ? 'Good' : 'Needs Improvement'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Issues */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Issues Found
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.issues.map((issue, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {issue.type === 'error' ? (
                            <XCircle className="w-5 h-5 text-red-500" />
                          ) : issue.type === 'warning' ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <CheckCircle className="w-5 h-5 text-blue-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{issue.message}</p>
                          <p className="text-sm text-gray-600">{issue.suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Suggestions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Optimization Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            {suggestion.priority}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{suggestion.title}</p>
                          <p className="text-sm text-gray-600">{suggestion.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{suggestion.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
                <p className="text-gray-600 mb-4">
                  Click the "Analyze Profile" button to get started with SEO optimization
                </p>
                <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Analyze Profile
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Keyword Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Keywords
                  </label>
                  <Input
                    placeholder="Enter keywords separated by commas"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keyword Density
                  </label>
                  <div className="text-sm text-gray-600">
                    Current: {analysis?.metrics.keywordDensity}% (Recommended: 1-3%)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title Length
                  </label>
                  <div className="text-sm text-gray-600">
                    Current: {analysis?.metrics.titleLength} characters (Recommended: 50-60)
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description Length
                  </label>
                  <div className="text-sm text-gray-600">
                    Current: {analysis?.metrics.descriptionLength} characters (Recommended: 150-160)
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Readability Score
                  </label>
                  <div className="text-sm text-gray-600">
                    Current: {analysis?.metrics.readabilityScore}% (Good: 70%+)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical SEO</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Loading Speed</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{analysis?.metrics.loadingSpeed}s</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Mobile Friendly</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {analysis?.metrics.mobileFriendly ? 'Yes' : 'No'}
                    </span>
                    {analysis?.metrics.mobileFriendly ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SEOTools;
