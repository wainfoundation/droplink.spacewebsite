import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Share2, 
  MessageCircle, 
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  User,
  Heart,
  Star,
  Download,
  Play,
  Pause,
  Volume2,
  Image as ImageIcon,
  FileText,
  Link as LinkIcon,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Linkedin,
  Github,
  Globe,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { apiService } from '@/services/apiService';

interface BioLinkBlock {
  id: string;
  type: string;
  title: string;
  content: any;
  order: number;
  visible: boolean;
}

interface BioLinkTheme {
  id: string;
  name: string;
  background: string;
  buttonStyle: string;
  socialIcons: string;
  preview: string;
}

const PublicBioLink: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [bioLinkData, setBioLinkData] = useState<any>(null);
  const [blocks, setBlocks] = useState<BioLinkBlock[]>([]);
  const [theme, setTheme] = useState<BioLinkTheme>({
    id: 'default',
    name: 'Default',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
    socialIcons: 'text-white',
    preview: 'bg-gradient-to-br from-indigo-500 to-purple-600'
  });

  // Update theme based on user's theme setting
  useEffect(() => {
    if (bioLinkData?.theme) {
      const themes = {
        'modern-dark': {
          id: 'modern-dark',
          name: 'Modern Dark',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
          socialIcons: 'text-white',
          preview: 'bg-gradient-to-br from-gray-900 to-blue-900'
        },
        'modern-light': {
          id: 'modern-light',
          name: 'Modern Light',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
          buttonStyle: 'rounded-lg bg-gray-800 text-white px-4 py-2 shadow-md',
          socialIcons: 'text-gray-800',
          preview: 'bg-gradient-to-br from-gray-100 to-gray-300'
        },
        'minimal': {
          id: 'minimal',
          name: 'Minimal',
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
          buttonStyle: 'rounded-lg bg-gray-800 text-white px-4 py-2 shadow-md',
          socialIcons: 'text-gray-700',
          preview: 'bg-gradient-to-br from-gray-50 to-gray-200'
        },
        'colorful': {
          id: 'colorful',
          name: 'Colorful',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
          socialIcons: 'text-white',
          preview: 'bg-gradient-to-br from-blue-500 to-purple-600'
        }
      };
      
      const selectedTheme = themes[bioLinkData.theme as keyof typeof themes] || themes['default'];
      setTheme(selectedTheme);
    }
  }, [bioLinkData?.theme]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);

  // Fetch real bio link data
  useEffect(() => {
    const fetchBioLinkData = async () => {
      try {
        setLoading(true);
        
        // Fetch user profile data
        const userResponse = await apiService.getUser();
        if (userResponse.success && userResponse.data) {
          const userData = userResponse.data;
          
          // Extract user information from the API response
          const userInfo = userData.billing || {} as any;
          const displayName = userInfo.name || userData.email?.split('@')[0] || username || 'User';
          const userBio = userInfo.bio || 'Welcome to my bio link! Connect with me and explore my content.';
          
          setBioLinkData({
            username: username || userData.email?.split('@')[0] || 'user',
            title: displayName,
            description: userBio,
            avatar: userInfo.avatar_url || null,
            theme: userInfo.theme || 'default'
          });

          // Create blocks based on available data
          const userBlocks: BioLinkBlock[] = [];
          
          // Add bio text if available
          if (userBio && userBio.trim() && userBio !== 'Welcome to my bio link! Connect with me and explore my content.') {
            userBlocks.push({
              id: 'bio',
              type: 'text',
              title: 'About Me',
              content: {
                text: userBio
              },
              order: 0,
              visible: true
            });
          }

          // Add some default social links for demonstration
          const socialLinks = [
            { 
              platform: 'twitter', 
              url: 'https://twitter.com', 
              label: 'Twitter' 
            },
            { 
              platform: 'instagram', 
              url: 'https://instagram.com', 
              label: 'Instagram' 
            },
            { 
              platform: 'youtube', 
              url: 'https://youtube.com', 
              label: 'YouTube' 
            }
          ];

          userBlocks.push({
            id: 'social-links',
            type: 'social-links',
            title: 'Social Links',
            content: { links: socialLinks },
            order: userBlocks.length,
            visible: true
          });

          // Add a sample website link
          userBlocks.push({
            id: 'website',
            type: 'link',
            title: 'My Website',
            content: {
              url: 'https://example.com',
              title: 'Visit My Website',
              description: 'Check out my personal website'
            },
            order: userBlocks.length,
            visible: true
          });

          setBlocks(userBlocks);
        }

        // Simulate view count (in a real app, this would come from analytics API)
        setViewCount(Math.floor(Math.random() * 1000) + 100);
        setShareCount(Math.floor(Math.random() * 50) + 10);

      } catch (error) {
        console.error('Failed to fetch bio link data:', error);
        setError('Failed to load bio link data');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchBioLinkData();
    }
  }, [username]);

  // Track page view
  useEffect(() => {
    // Track page view
    const trackView = async () => {
      try {
        // In a real app, you would call an API to track the view
        console.log('Page view tracked for:', username);
      } catch (error) {
        console.error('Failed to track view:', error);
      }
    };

    if (bioLinkData) {
      trackView();
    }
  }, [bioLinkData, username]);

  const handleShare = async () => {
    const shareData = {
      title: `${bioLinkData?.title} - Bio Link`,
      text: `Check out ${bioLinkData?.title}'s bio link`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        // Track share
        setShareCount(prev => prev + 1);
        console.log('Share tracked');
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Track share
        setShareCount(prev => prev + 1);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        alert('Failed to copy link');
      }
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out ${bioLinkData?.title}'s bio link`);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShareCount(prev => prev + 1);
  };

  const renderBlock = (block: BioLinkBlock) => {
    switch (block.type) {
      case 'link':
        return (
          <a
            key={block.id}
            href={block.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-3 hover:bg-opacity-30 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                  {block.content.title}
                </h3>
                <p className="text-white text-opacity-80 text-xs sm:text-sm truncate">
                  {block.content.description}
                </p>
              </div>
            </div>
          </a>
        );

      case 'social-links':
        return (
          <div key={block.id} className="w-full mb-3">
            <div className="flex justify-center space-x-4">
              {block.content.links.map((link: any, index: number) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
                  title={link.label}
                >
                  {link.platform === 'twitter' && <Twitter className="w-5 h-5 text-white" />}
                  {link.platform === 'instagram' && <Instagram className="w-5 h-5 text-white" />}
                  {link.platform === 'youtube' && <Youtube className="w-5 h-5 text-white" />}
                  {link.platform === 'facebook' && <Facebook className="w-5 h-5 text-white" />}
                  {link.platform === 'linkedin' && <Linkedin className="w-5 h-5 text-white" />}
                  {link.platform === 'github' && <Github className="w-5 h-5 text-white" />}
                  {!['twitter', 'instagram', 'youtube', 'facebook', 'linkedin', 'github'].includes(link.platform) && 
                    <Globe className="w-5 h-5 text-white" />
                  }
                </a>
              ))}
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={block.id} className="w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-3">
            <p className="text-white text-sm sm:text-base leading-relaxed">
              {block.content.text}
            </p>
          </div>
        );

      case 'image':
        return (
          <div key={block.id} className="w-full mb-3">
            <img
              src={block.content.url}
              alt={block.content.alt || 'Bio link image'}
              className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-lg"
            />
          </div>
        );

      case 'video':
        return (
          <div key={block.id} className="w-full mb-3">
            <video
              src={block.content.url}
              controls
              className="w-full h-48 sm:h-64 object-cover rounded-xl shadow-lg"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'audio':
        return (
          <div key={block.id} className="w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Volume2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-sm sm:text-base">
                  {block.content.title}
                </h3>
                <audio controls className="w-full mt-2">
                  <source src={block.content.url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        );

      case 'file':
        return (
          <a
            key={block.id}
            href={block.content.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 mb-3 hover:bg-opacity-30 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm sm:text-base truncate">
                  {block.content.title}
                </h3>
                <p className="text-white text-opacity-80 text-xs sm:text-sm truncate">
                  {block.content.description}
                </p>
              </div>
            </div>
          </a>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.background }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-opacity-80">Loading bio link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: theme.background }}>
        <div className="text-center">
          <p className="text-white text-opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{ background: theme.background }}
    >
      {/* Share Button */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={handleShare}
          className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
          title="Share this bio link"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
        
        {/* View Link Button */}
        <button
          onClick={() => {
            const linkUrl = window.location.href;
            navigator.clipboard.writeText(linkUrl);
            alert('Bio link URL copied to clipboard!');
          }}
          className="mt-2 w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
          title="Copy bio link URL"
        >
          <ExternalLink className="w-5 h-5 text-white" />
        </button>
        
        {/* Social Share Options */}
        <div className="mt-2 flex flex-col space-y-1">
          <button
            onClick={() => handleSocialShare('twitter')}
            className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
            title="Share on Twitter"
          >
            <Twitter className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleSocialShare('facebook')}
            className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
            title="Share on Facebook"
          >
            <Facebook className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleSocialShare('linkedin')}
            className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
            title="Share on LinkedIn"
          >
            <Linkedin className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => handleSocialShare('whatsapp')}
            className="w-8 h-8 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation"
            title="Share on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Avatar */}
        {bioLinkData?.avatar ? (
          <img
            src={bioLinkData.avatar}
            alt={bioLinkData.title}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white border-opacity-30 mb-6 shadow-lg"
          />
        ) : (
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white bg-opacity-20 backdrop-blur-sm rounded-full border-4 border-white border-opacity-30 mb-6 shadow-lg flex items-center justify-center">
            <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 text-center">
          {bioLinkData?.title}
        </h1>

        {/* Description */}
        {bioLinkData?.description && (
          <p className="text-white text-opacity-90 text-sm sm:text-base text-center mb-8 max-w-md">
            {bioLinkData.description}
          </p>
        )}

        {/* Blocks */}
        <div className="w-full max-w-sm sm:max-w-md space-y-3">
          {blocks
            .filter(block => block.visible)
            .sort((a, b) => a.order - b.order)
            .map(renderBlock)}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <LinkIcon className="w-3 h-3 text-white" />
            </div>
            <span className="text-white text-sm font-medium">Droplink</span>
          </div>
          
          {/* View and Share Stats */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-white text-opacity-70 text-xs">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{viewCount.toLocaleString()} views</span>
            </div>
            <div className="flex items-center space-x-1">
              <Share2 className="w-3 h-3" />
              <span>{shareCount} shares</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button */}
      <button className="fixed bottom-4 left-4 z-10 w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all duration-200 hover:scale-110 active:scale-95 touch-manipulation">
        <MessageCircle className="w-5 h-5 text-white" />
      </button>

      {/* Bio Link URL Display */}
      <div className="fixed bottom-4 right-4 z-10">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-3 py-2 max-w-xs">
          <div className="text-white text-xs opacity-80 mb-1">Your bio link:</div>
          <div className="text-white text-sm font-medium truncate">
            {window.location.href}
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Bio link URL copied to clipboard!');
            }}
            className="mt-1 text-white text-xs opacity-70 hover:opacity-100 transition-opacity"
          >
            Click to copy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicBioLink;
