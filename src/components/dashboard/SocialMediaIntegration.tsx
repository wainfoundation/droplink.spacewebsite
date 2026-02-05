import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Music,
  Twitch,
  Discord,
  Spotify,
  Apple,
  Android,
  Globe,
  Link as LinkIcon,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  BarChart3,
  Users,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Calendar,
  Clock,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
  Zap,
  Star,
  Crown,
  Target,
  MousePointer,
  Eye,
  MapPin,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Activity,
  Layers,
  Palette,
  Sparkles,
  Rocket,
  Shield,
  Lock,
  Unlock,
  Key,
  Bell,
  Mail,
  Phone,
  MessageSquare,
  Video,
  Image,
  Music as MusicIcon,
  FileText,
  BookOpen,
  ShoppingBag,
  CreditCard,
  DollarSign,
  Gift,
  Award,
  Trophy,
  Medal,
  Flag,
  Globe2,
  Compass,
  Navigation,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  MoreHorizontal,
  Copy,
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

interface SocialPlatform {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  isConnected: boolean;
  username?: string;
  followers?: number;
  engagement?: number;
  lastPost?: string;
  isVerified?: boolean;
  isPremium?: boolean;
  features: string[];
  analytics?: {
    totalPosts: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    engagementRate: number;
    reach: number;
    impressions: number;
    topPosts: Array<{
      id: string;
      content: string;
      likes: number;
      comments: number;
      shares: number;
      date: string;
    }>;
  };
}

interface SocialMediaIntegrationProps {
  onConnect?: (platform: string) => void;
  onDisconnect?: (platform: string) => void;
  onAnalytics?: (platform: string) => void;
}

const SocialMediaIntegration: React.FC<SocialMediaIntegrationProps> = ({
  onConnect,
  onDisconnect,
  onAnalytics
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isConnecting, setIsConnecting] = useState<string | null>(null);

  // Mock social media platforms data
  const platforms: SocialPlatform[] = [
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: '#E4405F',
      gradient: 'from-pink-500 to-purple-600',
      isConnected: true,
      username: '@myusername',
      followers: 12500,
      engagement: 4.2,
      lastPost: '2 hours ago',
      isVerified: true,
      isPremium: false,
      features: ['Stories', 'Reels', 'IGTV', 'Shopping', 'Live'],
      analytics: {
        totalPosts: 245,
        totalLikes: 125000,
        totalComments: 8500,
        totalShares: 1200,
        engagementRate: 4.2,
        reach: 45000,
        impressions: 125000,
        topPosts: [
          {
            id: '1',
            content: 'Beautiful sunset from my window',
            likes: 1250,
            comments: 45,
            shares: 12,
            date: '2024-01-15'
          }
        ]
      }
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: '#FF0000',
      gradient: 'from-red-500 to-red-600',
      isConnected: true,
      username: '@mychannel',
      followers: 8500,
      engagement: 3.8,
      lastPost: '1 day ago',
      isVerified: false,
      isPremium: true,
      features: ['Videos', 'Shorts', 'Live', 'Community', 'Membership'],
      analytics: {
        totalPosts: 89,
        totalLikes: 45000,
        totalComments: 3200,
        totalShares: 850,
        engagementRate: 3.8,
        reach: 25000,
        impressions: 85000,
        topPosts: [
          {
            id: '1',
            content: 'How to build a React app in 10 minutes',
            likes: 850,
            comments: 45,
            shares: 25,
            date: '2024-01-14'
          }
        ]
      }
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: '#1DA1F2',
      gradient: 'from-blue-400 to-blue-500',
      isConnected: true,
      username: '@myusername',
      followers: 3200,
      engagement: 2.1,
      lastPost: '3 hours ago',
      isVerified: false,
      isPremium: false,
      features: ['Tweets', 'Threads', 'Spaces', 'Fleets', 'Lists'],
      analytics: {
        totalPosts: 1250,
        totalLikes: 8500,
        totalComments: 1200,
        totalShares: 450,
        engagementRate: 2.1,
        reach: 15000,
        impressions: 32000,
        topPosts: [
          {
            id: '1',
            content: 'Just shipped a new feature! 🚀',
            likes: 45,
            comments: 8,
            shares: 12,
            date: '2024-01-15'
          }
        ]
      }
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: Music,
      color: '#000000',
      gradient: 'from-gray-800 to-gray-900',
      isConnected: false,
      features: ['Videos', 'Live', 'Effects', 'Sounds', 'Trends'],
      analytics: {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        engagementRate: 0,
        reach: 0,
        impressions: 0,
        topPosts: []
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: '#0077B5',
      gradient: 'from-blue-600 to-blue-700',
      isConnected: false,
      features: ['Posts', 'Articles', 'Live', 'Events', 'Networking'],
      analytics: {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        engagementRate: 0,
        reach: 0,
        impressions: 0,
        topPosts: []
      }
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: '#1877F2',
      gradient: 'from-blue-600 to-blue-700',
      isConnected: false,
      features: ['Posts', 'Stories', 'Live', 'Events', 'Groups'],
      analytics: {
        totalPosts: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        engagementRate: 0,
        reach: 0,
        impressions: 0,
        topPosts: []
      }
    }
  ];

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Connected!",
        description: `Successfully connected to ${platforms.find(p => p.id === platformId)?.name}`,
      });
      
      onConnect?.(platformId);
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect to the platform. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Disconnected",
        description: `Successfully disconnected from ${platforms.find(p => p.id === platformId)?.name}`,
      });
      
      onDisconnect?.(platformId);
    } catch (error) {
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect from the platform. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAnalytics = (platformId: string) => {
    setSelectedPlatform(platformId);
    setShowAnalytics(true);
    onAnalytics?.(platformId);
  };

  const connectedPlatforms = platforms.filter(p => p.isConnected);
  const disconnectedPlatforms = platforms.filter(p => !p.isConnected);

  const totalStats = {
    totalFollowers: connectedPlatforms.reduce((sum, p) => sum + (p.followers || 0), 0),
    totalEngagement: connectedPlatforms.reduce((sum, p) => sum + (p.engagement || 0), 0) / connectedPlatforms.length,
    totalPosts: connectedPlatforms.reduce((sum, p) => sum + (p.analytics?.totalPosts || 0), 0),
    totalLikes: connectedPlatforms.reduce((sum, p) => sum + (p.analytics?.totalLikes || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Social Media Integration</h2>
          <p className="text-gray-600">Connect and manage your social media accounts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveTab('analytics')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button
            onClick={() => setActiveTab('connect')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Connect Platform
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalFollowers.toLocaleString()}</p>
              </div>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalEngagement.toFixed(1)}%</p>
              </div>
              <Heart className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalPosts.toLocaleString()}</p>
              </div>
              <MessageCircle className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Likes</p>
                <p className="text-2xl font-bold text-gray-900">{totalStats.totalLikes.toLocaleString()}</p>
              </div>
              <Heart className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="connected">Connected ({connectedPlatforms.length})</TabsTrigger>
          <TabsTrigger value="available">Available ({disconnectedPlatforms.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Card key={platform.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${platform.gradient} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                          <p className="text-sm text-gray-600">{platform.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {platform.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                        {platform.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Followers</p>
                        <p className="text-lg font-semibold">{platform.followers?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Engagement</p>
                        <p className="text-lg font-semibold">{platform.engagement}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAnalytics(platform.id)}
                        className="flex items-center space-x-1"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Analytics</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="connected" className="space-y-4">
          {connectedPlatforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <Card key={platform.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${platform.gradient} rounded-lg flex items-center justify-center`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                          {platform.isVerified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                          {platform.isPremium && <Crown className="w-4 h-4 text-yellow-500" />}
                        </div>
                        <p className="text-sm text-gray-600">{platform.username}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Users className="w-4 h-4" />
                            <span>{platform.followers?.toLocaleString()} followers</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Heart className="w-4 h-4" />
                            <span>{platform.engagement}% engagement</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAnalytics(platform.id)}
                        className="flex items-center space-x-1"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Analytics</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Disconnect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>

        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {disconnectedPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Card key={platform.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${platform.gradient} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                          <p className="text-sm text-gray-600">Not connected</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Available features:</p>
                      <div className="flex flex-wrap gap-1">
                        {platform.features.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isConnecting === platform.id}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isConnecting === platform.id ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="text-center py-8">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Social Media Analytics</h3>
            <p className="text-gray-600 mb-4">Connect your social media accounts to view detailed analytics</p>
            <Button onClick={() => setActiveTab('available')}>
              <Plus className="w-4 h-4 mr-2" />
              Connect Platforms
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Analytics Modal */}
      {showAnalytics && selectedPlatform && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  Analytics: {platforms.find(p => p.id === selectedPlatform)?.name}
                </h2>
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
                        <p className="text-sm text-gray-600">Total Posts</p>
                        <p className="text-2xl font-bold">
                          {platforms.find(p => p.id === selectedPlatform)?.analytics?.totalPosts.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Likes</p>
                        <p className="text-2xl font-bold">
                          {platforms.find(p => p.id === selectedPlatform)?.analytics?.totalLikes.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Comments</p>
                        <p className="text-2xl font-bold">
                          {platforms.find(p => p.id === selectedPlatform)?.analytics?.totalComments.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Shares</p>
                        <p className="text-2xl font-bold">
                          {platforms.find(p => p.id === selectedPlatform)?.analytics?.totalShares.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Engagement Rate</p>
                        <p className="text-2xl font-bold">
                          {platforms.find(p => p.id === selectedPlatform)?.analytics?.engagementRate.toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Reach</p>
                        <p className="text-2xl font-bold">
                          {platforms.find(p => p.id === selectedPlatform)?.analytics?.reach.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Impressions</p>
                        <p className="text-2xl font-bold">
                          {platforms.find(p => p.id === selectedPlatform)?.analytics?.impressions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Followers</p>
                        <p className="text-2xl font-bold">
                          {platforms.find(p => p.id === selectedPlatform)?.followers?.toLocaleString()}
                        </p>
                      </div>
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

export default SocialMediaIntegration;
