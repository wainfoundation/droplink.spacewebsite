import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import DroplinkWaterdrop from '@/components/ui/DroplinkWaterdrop';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApiData } from '@/hooks/useApiData';
import { useRealData } from '@/hooks/useRealData';
import { useUnifiedDashboard } from '@/hooks/useUnifiedDashboard';
import { getPlanConfig, type PlanType } from '@/services/planFeaturesService';
import { 
  Grid3X3,
  Link as LinkIcon,
  FileText,
  CreditCard,
  Calendar,
  File,
  QrCode,
  Droplets,
  BarChart3,
  FolderOpen,
  Eye,
  Globe,
  Mail,
  Bell,
  CreditCard as PaymentIcon,
  Sparkles,
  User,
  Users,
  UserPlus,
  Settings,
  Plus,
  Download,
  MoreHorizontal,
  List,
  Search,
  Filter,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Share2,
  Heart,
  Star,
  Zap,
  Shield,
  Lock,
  Unlock,
  Key,
  Award,
  Trophy,
  Medal,
  Flag,
  Compass,
  Navigation,
  SortAsc,
  SortDesc,
  MoreVertical,
  ChevronDown,
  ChevronRight,
  X,
  Check,
  AlertCircle,
  Info,
  AlertTriangle,
  Info as InfoIcon,
  CheckCircle,
  XCircle,
  Clock,
  Calendar as CalendarIcon,
  Timer,
  Target,
  TrendingUp,
  TrendingDown,
  Activity,
  Layers,
  Palette,
  Menu,
  ChevronLeft,
  Moon,
  Hash,
  RefreshCw,
  Mic,
  Volume2,
  MessageCircle,
  Phone,
  Music,
  Video,
  ShoppingBag,
  Tag,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ListOrdered,
  Minus,
  Type,
  Folder,
  Pen,
  Database,
  Upload,
  Layout
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  count: number;
  description: string;
}

interface BioLinkBlock {
  id: string;
  type: string;
  title: string;
  content: any;
  order: number;
  visible: boolean;
}

interface BlockType {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  category: string;
  description: string;
  color: string;
}

interface LinkrMeStyleDashboardProps {
  user?: any;
  profile?: any;
}

const LinkrMeStyleDashboard: React.FC<LinkrMeStyleDashboardProps> = ({
  user,
  profile
}) => {
  const { toast } = useToast();
  const realData = useRealData();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const [selectedLinkType, setSelectedLinkType] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [statisticsParams, setStatisticsParams] = useState({
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    type: 'overview'
  });
  const [selectedLinkId, setSelectedLinkId] = useState<number | null>(null);
  const [showAddBlockModal, setShowAddBlockModal] = useState(false);
  const [activeBlockTab, setActiveBlockTab] = useState('standard');
  const [bioLinkBlocks, setBioLinkBlocks] = useState<any[]>([]);
  const [editingBlock, setEditingBlock] = useState<any>(null);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<string>('');
  const [blockModalData, setBlockModalData] = useState<any>({});
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>('default');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showCustomizationsModal, setShowCustomizationsModal] = useState(false);
  const [showVerifiedBadgeModal, setShowVerifiedBadgeModal] = useState(false);
  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const [showPixelsModal, setShowPixelsModal] = useState(false);
  const [showUTMModal, setShowUTMModal] = useState(false);
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  
  // Plan configuration
  const userPlan = profile?.plan || 'FREE';
  const planConfig = getPlanConfig(userPlan as PlanType);
  
  // Customization states
  const [customizations, setCustomizations] = useState({
    background: {
      type: 'gradient', // 'gradient', 'color', 'image'
      gradient: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      color: '#ffffff',
      image: null,
      attachment: 'scroll', // 'scroll', 'fixed'
      blur: 0,
      brightness: 100
    },
    font: {
      family: 'Impact',
      size: 16
    },
    layout: {
      width: 'medium', // 'small', 'medium', 'large', 'extra-large'
      blockSpacing: 'medium', // 'small', 'medium', 'large'
      hoverAnimation: 'smooth' // 'none', 'smooth', 'instant'
    },
    features: {
      verifiedBadge: false,
      branding: false,
      pixels: false,
      utmParameters: false,
      protection: false
    }
  });

  // Feature-specific states
  const [verifiedBadgeSettings, setVerifiedBadgeSettings] = useState({
    enabled: false,
    badgeType: 'blue', // 'blue', 'green', 'gold'
    position: 'top-right' // 'top-right', 'top-left', 'bottom-right', 'bottom-left'
  });

  const [brandingSettings, setBrandingSettings] = useState({
    enabled: false,
    displayBranding: false,
    brandingName: '',
    brandingUrl: '',
    textColor: '#000000',
    logo: null
  });

  const [pixelsSettings, setPixelsSettings] = useState({
    enabled: false,
    pixels: []
  });

  const [utmSettings, setUtmSettings] = useState({
    enabled: false,
    source: '',
    medium: '',
    campaign: '',
    term: '',
    content: ''
  });

  const [protectionSettings, setProtectionSettings] = useState({
    enabled: false,
    password: '',
    requirePassword: false,
    blockBots: false,
    allowSpecificDomains: false,
    allowedDomains: []
  });
  
  // Use unified dashboard hook
  const {
    user: apiUser,
    profile: apiProfile,
    links,
    analytics,
    dashboardStats,
    isLoading: loading,
    error: errorMessage,
    refreshData,
    createLink: apiCreateLink,
    updateLink: apiUpdateLink,
    deleteLink: apiDeleteLink,
    trackPageView,
    trackLinkClick
  } = useUnifiedDashboard();

  // Remove the conflicting useRealData hook
  // const realData = useRealData();

  // Backward-compatible errors object for legacy code that expects errors.dashboard, errors.projects, etc.
  const errors = {
    dashboard: errorMessage || null,
    links: errorMessage || null,
    profile: errorMessage || null,
    analytics: errorMessage || null,
    projects: null,
    payments: null,
    logs: null,
    teams: null,
    teamMembers: null,
    domains: null,
    data: null,
    qrCodes: null,
    statistics: null,
  } as const;

  // Backward-compatible loading object for legacy code
  const loadingState = {
    dashboard: loading,
    projects: false,
    payments: false,
    logs: false,
    teams: false,
    teamMembers: false,
    domains: false,
    data: false,
    qrCodes: false,
    statistics: false,
  } as const;

  // Missing data arrays - initialize as empty to prevent errors
  const projects: any[] = [];
  const payments: any[] = [];
  const logs: any[] = [];
  const teams: any[] = [];
  const teamMembers: any[] = [];
  const domains: any[] = [];
  const data: any[] = [];
  const qrCodes: any[] = [];
  const linkStatistics: any[] = [];

  const linkTypes: LinkType[] = [
    {
      id: 'biolink',
      name: 'Bio link',
      icon: LinkIcon,
      color: 'bg-green-500',
      count: 0,
      description: 'Create a bio link page'
    },
    {
      id: 'shortlink',
      name: 'Short link',
      icon: LinkIcon,
      color: 'bg-blue-500',
      count: 0,
      description: 'Create a short URL'
    },
    {
      id: 'filelink',
      name: 'File link',
      icon: FileText,
      color: 'bg-green-500',
      count: 0,
      description: 'Share files with a link'
    },
    {
      id: 'vcard',
      name: 'vCard link',
      icon: CreditCard,
      color: 'bg-purple-500',
      count: 0,
      description: 'Create a digital business card'
    },
    {
      id: 'event',
      name: 'Event link',
      icon: Calendar,
      color: 'bg-orange-500',
      count: 0,
      description: 'Create an event page'
    },
    {
      id: 'static',
      name: 'Static link',
      icon: File,
      color: 'bg-red-500',
      count: 0,
      description: 'Create a static page'
    },
    {
      id: 'qr',
      name: 'QR link',
      icon: QrCode,
      color: 'bg-yellow-500',
      count: 0,
      description: 'Generate QR codes'
    },
    {
      id: 'splash',
      name: 'Splash link',
      icon: Droplets,
      color: 'bg-orange-500',
      count: 0,
      description: 'Create a splash page'
    }
  ];

  // Block types for bio link
  const blockTypes: BlockType[] = [
    // Standard blocks
    { id: 'link', name: 'Link', icon: LinkIcon, category: 'standard', description: 'Add a clickable link', color: 'bg-blue-500' },
    { id: 'paragraph', name: 'Paragraph', icon: FileText, category: 'standard', description: 'Add text content', color: 'bg-gray-500' },
    { id: 'image', name: 'Image', icon: File, category: 'standard', description: 'Add an image', color: 'bg-green-500' },
    { id: 'heading', name: 'Heading', icon: Hash, category: 'standard', description: 'Add a heading', color: 'bg-purple-500' },
    { id: 'avatar', name: 'Avatar', icon: User, category: 'standard', description: 'Add profile picture', color: 'bg-pink-500' },
    { id: 'socials', name: 'Socials', icon: Share2, category: 'standard', description: 'Add social media links', color: 'bg-indigo-500' },
    { id: 'divider', name: 'Divider', icon: MoreHorizontal, category: 'standard', description: 'Add a visual separator', color: 'bg-gray-400' },
    { id: 'big-link', name: 'Big link', icon: ExternalLink, category: 'standard', description: 'Add a prominent link button', color: 'bg-blue-600' },
    { id: 'list', name: 'List', icon: List, category: 'standard', description: 'Add a bulleted list', color: 'bg-orange-500' },
    { id: 'audio', name: 'Audio', icon: Volume2, category: 'standard', description: 'Add audio content', color: 'bg-red-500' },
    { id: 'video', name: 'Video', icon: File, category: 'standard', description: 'Add video content', color: 'bg-purple-600' },
    { id: 'file', name: 'File', icon: FileText, category: 'standard', description: 'Add file download', color: 'bg-yellow-500' },
    { id: 'business-hours', name: 'Business hours', icon: Clock, category: 'standard', description: 'Add business hours', color: 'bg-green-600' },
    { id: 'image-grid', name: 'Image grid', icon: Grid3X3, category: 'standard', description: 'Add image gallery', color: 'bg-teal-500' },
    { id: 'modal-text', name: 'Modal text', icon: FileText, category: 'standard', description: 'Add expandable text', color: 'bg-gray-600' },
    { id: 'call-to-action', name: 'Call to action', icon: MessageCircle, category: 'standard', description: 'Add action button', color: 'bg-red-600' },
    
    // Advanced blocks
    { id: 'email-collector', name: 'Email collector', icon: Mail, category: 'advanced', description: 'Collect email addresses', color: 'bg-blue-500' },
    { id: 'phone-collector', name: 'Phone collector', icon: Phone, category: 'advanced', description: 'Collect phone numbers', color: 'bg-green-500' },
    { id: 'contact-form', name: 'Contact form', icon: FileText, category: 'advanced', description: 'Add contact form', color: 'bg-purple-500' },
    { id: 'header-section', name: 'Header section', icon: Hash, category: 'advanced', description: 'Add header content', color: 'bg-gray-500' },
    { id: 'rss-feed', name: 'RSS feed', icon: Activity, category: 'advanced', description: 'Add RSS feed', color: 'bg-orange-500' },
    { id: 'vcard', name: 'VCard', icon: CreditCard, category: 'advanced', description: 'Add contact card', color: 'bg-blue-600' },
    { id: 'alert', name: 'Alert', icon: Bell, category: 'advanced', description: 'Add alert message', color: 'bg-yellow-500' },
    { id: 'appointment-calendar', name: 'Appointment calendar', icon: Calendar, category: 'advanced', description: 'Add booking calendar', color: 'bg-green-600' },
    { id: 'faq', name: 'FAQ', icon: MessageCircle, category: 'advanced', description: 'Add FAQ section', color: 'bg-purple-600' },
    { id: 'countdown', name: 'Countdown', icon: Timer, category: 'advanced', description: 'Add countdown timer', color: 'bg-red-500' },
    { id: 'external-item', name: 'External item', icon: ExternalLink, category: 'advanced', description: 'Add external content', color: 'bg-indigo-500' },
    { id: 'share', name: 'Share', icon: Share2, category: 'advanced', description: 'Add share buttons', color: 'bg-teal-500' },
    { id: 'coupon', name: 'Coupon', icon: Award, category: 'advanced', description: 'Add coupon code', color: 'bg-yellow-600' },
    { id: 'youtube-feed', name: 'Youtube feed', icon: File, category: 'advanced', description: 'Add YouTube content', color: 'bg-red-600' },
    { id: 'timeline', name: 'Timeline', icon: List, category: 'advanced', description: 'Add timeline', color: 'bg-gray-600' },
    { id: 'review', name: 'Review', icon: Star, category: 'advanced', description: 'Add reviews', color: 'bg-yellow-500' },
    { id: 'image-slider', name: 'Image slider', icon: Grid3X3, category: 'advanced', description: 'Add image carousel', color: 'bg-blue-500' },
    { id: 'markdown', name: 'Markdown', icon: FileText, category: 'advanced', description: 'Add markdown content', color: 'bg-gray-500' },
    
    // Payment blocks
    { id: 'paypal', name: 'PayPal', icon: CreditCard, category: 'payments', description: 'Add PayPal payment', color: 'bg-blue-500' },
    { id: 'donation', name: 'Donation', icon: Heart, category: 'payments', description: 'Add donation button', color: 'bg-red-500' },
    { id: 'product', name: 'Product', icon: ShoppingBag, category: 'payments', description: 'Add product for sale', color: 'bg-green-500' },
    { id: 'service', name: 'Service', icon: MessageCircle, category: 'payments', description: 'Add service booking', color: 'bg-purple-500' },
    
    // Embed blocks
    { id: 'threads', name: 'Threads', icon: MessageCircle, category: 'embeds', description: 'Add Threads content', color: 'bg-black' },
    { id: 'soundcloud', name: 'SoundCloud', icon: Volume2, category: 'embeds', description: 'Add SoundCloud player', color: 'bg-orange-500' },
    { id: 'spotify', name: 'Spotify', icon: Music, category: 'embeds', description: 'Add Spotify player', color: 'bg-green-500' },
    { id: 'youtube', name: 'YouTube', icon: File, category: 'embeds', description: 'Add YouTube video', color: 'bg-red-500' },
    { id: 'twitch', name: 'Twitch', icon: Video, category: 'embeds', description: 'Add Twitch stream', color: 'bg-purple-500' },
    { id: 'vimeo', name: 'Vimeo', icon: Video, category: 'embeds', description: 'Add Vimeo video', color: 'bg-blue-500' },
    { id: 'tiktok', name: 'TikTok Video', icon: Video, category: 'embeds', description: 'Add TikTok video', color: 'bg-black' },
    { id: 'apple-music', name: 'Apple Music', icon: Music, category: 'embeds', description: 'Add Apple Music', color: 'bg-red-500' },
    { id: 'tidal', name: 'Tidal', icon: Music, category: 'embeds', description: 'Add Tidal music', color: 'bg-black' },
    { id: 'mixcloud', name: 'Mixcloud', icon: Volume2, category: 'embeds', description: 'Add Mixcloud content', color: 'bg-purple-500' }
  ];

  // Theme presets for bio links - Expanded Collection
  const themePresets = [
    // Classic Themes
    {
      id: 'default',
      name: 'Default',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-indigo-500 to-purple-600'
    },
    {
      id: 'ocean',
      name: 'Ocean',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonStyle: 'rounded-lg bg-blue-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-blue-400 to-blue-600'
    },
    {
      id: 'sunset',
      name: 'Sunset',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      buttonStyle: 'rounded-lg bg-pink-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-pink-400 to-red-500'
    },
    {
      id: 'forest',
      name: 'Forest',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      buttonStyle: 'rounded-lg bg-green-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-green-400 to-teal-500'
    },
    {
      id: 'dark',
      name: 'Dark',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      buttonStyle: 'rounded-lg bg-gray-800 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-gray-700 to-gray-900'
    },
    {
      id: 'aurora',
      name: 'Aurora',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      buttonStyle: 'rounded-lg bg-purple-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-gray-700',
      preview: 'bg-gradient-to-br from-cyan-300 to-pink-300'
    },

    // City Themes
    {
      id: 'zermatt',
      name: 'Zermatt',
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-blue-600 to-blue-800'
    },
    {
      id: 'seattle',
      name: 'Seattle',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      buttonStyle: 'rounded-lg bg-pink-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-gray-800',
      preview: 'bg-gradient-to-br from-pink-300 to-pink-500'
    },
    {
      id: 'kyoto',
      name: 'Kyoto',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      buttonStyle: 'rounded-lg bg-teal-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-gray-700',
      preview: 'bg-gradient-to-br from-teal-300 to-cyan-300'
    },
    {
      id: 'barcelona',
      name: 'Barcelona',
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
      buttonStyle: 'rounded-lg bg-orange-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-red-400 to-orange-500'
    },
    {
      id: 'paris',
      name: 'Paris',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonStyle: 'rounded-lg bg-purple-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-purple-400 to-indigo-500'
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      buttonStyle: 'rounded-lg bg-pink-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-pink-400 to-red-400'
    },
    {
      id: 'sydney',
      name: 'Sydney',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      buttonStyle: 'rounded-lg bg-cyan-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-cyan-400 to-blue-500'
    },
    {
      id: 'london',
      name: 'London',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      buttonStyle: 'rounded-lg bg-gray-700 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-gray-600 to-gray-800'
    },
    {
      id: 'antalya',
      name: 'Antalya',
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      buttonStyle: 'rounded-lg bg-orange-400 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-gray-800',
      preview: 'bg-gradient-to-br from-orange-300 to-yellow-400'
    },

    // Nature Themes
    {
      id: 'forest-green',
      name: 'Forest Green',
      background: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
      buttonStyle: 'rounded-lg bg-green-600 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-green-600 to-emerald-500'
    },
    {
      id: 'ocean-blue',
      name: 'Ocean Blue',
      background: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
      buttonStyle: 'rounded-lg bg-blue-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-blue-500 to-cyan-400'
    },
    {
      id: 'sunset-orange',
      name: 'Sunset Orange',
      background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
      buttonStyle: 'rounded-lg bg-orange-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-orange-400 to-red-400'
    },
    {
      id: 'lavender',
      name: 'Lavender',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonStyle: 'rounded-lg bg-purple-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-purple-400 to-indigo-500'
    },
    {
      id: 'rose-gold',
      name: 'Rose Gold',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      buttonStyle: 'rounded-lg bg-pink-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-pink-400 to-rose-400'
    },
    {
      id: 'mint-fresh',
      name: 'Mint Fresh',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      buttonStyle: 'rounded-lg bg-teal-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-teal-400 to-cyan-400'
    },

    // Modern Themes
    {
      id: 'modern-dark',
      name: 'Modern Dark',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-gray-900 to-blue-900'
    },
    {
      id: 'modern-light',
      name: 'Modern Light',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      buttonStyle: 'rounded-lg bg-gray-800 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-gray-800',
      preview: 'bg-gradient-to-br from-gray-100 to-gray-300'
    },
    {
      id: 'minimal',
      name: 'Minimal',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
      buttonStyle: 'rounded-lg bg-gray-800 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-gray-700',
      preview: 'bg-gradient-to-br from-gray-50 to-gray-200'
    },
    {
      id: 'colorful',
      name: 'Colorful',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-blue-500 to-purple-600'
    },

    // Vibrant Themes
    {
      id: 'neon-pink',
      name: 'Neon Pink',
      background: 'linear-gradient(135deg, #ff006e 0%, #8338ec 100%)',
      buttonStyle: 'rounded-lg bg-pink-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-pink-500 to-purple-600'
    },
    {
      id: 'electric-blue',
      name: 'Electric Blue',
      background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      buttonStyle: 'rounded-lg bg-blue-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-blue-400 to-blue-600'
    },
    {
      id: 'lime-green',
      name: 'Lime Green',
      background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
      buttonStyle: 'rounded-lg bg-green-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-green-400 to-lime-400'
    },
    {
      id: 'purple-haze',
      name: 'Purple Haze',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonStyle: 'rounded-lg bg-purple-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-purple-500 to-indigo-600'
    },
    {
      id: 'fire-orange',
      name: 'Fire Orange',
      background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
      buttonStyle: 'rounded-lg bg-orange-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-orange-500 to-red-500'
    },
    {
      id: 'ice-blue',
      name: 'Ice Blue',
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      buttonStyle: 'rounded-lg bg-blue-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-blue-300 to-blue-600'
    },

    // Professional Themes
    {
      id: 'corporate-blue',
      name: 'Corporate Blue',
      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-gray-700 to-blue-600'
    },
    {
      id: 'business-gray',
      name: 'Business Gray',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      buttonStyle: 'rounded-lg bg-gray-700 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-gray-600 to-gray-800'
    },
    {
      id: 'executive-green',
      name: 'Executive Green',
      background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
      buttonStyle: 'rounded-lg bg-green-600 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-green-600 to-emerald-500'
    },
    {
      id: 'premium-gold',
      name: 'Premium Gold',
      background: 'linear-gradient(135deg, #f39c12 0%, #f1c40f 100%)',
      buttonStyle: 'rounded-lg bg-yellow-500 text-gray-800 px-4 py-2 shadow-md',
      socialIcons: 'text-gray-800',
      preview: 'bg-gradient-to-br from-yellow-400 to-orange-400'
    },

    // Creative Themes
    {
      id: 'artistic-purple',
      name: 'Artistic Purple',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonStyle: 'rounded-lg bg-purple-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-purple-400 to-indigo-500'
    },
    {
      id: 'creative-pink',
      name: 'Creative Pink',
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      buttonStyle: 'rounded-lg bg-pink-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-pink-400 to-red-400'
    },
    {
      id: 'artistic-teal',
      name: 'Artistic Teal',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      buttonStyle: 'rounded-lg bg-teal-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-teal-400 to-cyan-400'
    },
    {
      id: 'vibrant-orange',
      name: 'Vibrant Orange',
      background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
      buttonStyle: 'rounded-lg bg-orange-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-orange-400 to-red-400'
    },

    // Seasonal Themes
    {
      id: 'spring-fresh',
      name: 'Spring Fresh',
      background: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
      buttonStyle: 'rounded-lg bg-green-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-green-300 to-lime-400'
    },
    {
      id: 'summer-vibes',
      name: 'Summer Vibes',
      background: 'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
      buttonStyle: 'rounded-lg bg-orange-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-orange-300 to-red-400'
    },
    {
      id: 'autumn-warmth',
      name: 'Autumn Warmth',
      background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)',
      buttonStyle: 'rounded-lg bg-orange-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-orange-400 to-yellow-500'
    },
    {
      id: 'winter-cool',
      name: 'Winter Cool',
      background: 'linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)',
      buttonStyle: 'rounded-lg bg-blue-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-blue-300 to-cyan-400'
    },

    // Special Effects
    {
      id: 'galaxy',
      name: 'Galaxy',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonStyle: 'rounded-lg bg-purple-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-purple-600 to-indigo-700'
    },
    {
      id: 'cosmic',
      name: 'Cosmic',
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      buttonStyle: 'rounded-lg bg-gray-700 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-gray-800 to-blue-900'
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
      buttonStyle: 'rounded-lg bg-pink-500 text-white px-4 py-2 shadow-md',
      socialIcons: 'text-gray-800',
      preview: 'bg-gradient-to-br from-pink-300 to-purple-300'
    },
    {
      id: 'custom',
      name: 'Custom',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonStyle: 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md',
      socialIcons: 'text-white',
      preview: 'bg-gradient-to-br from-indigo-500 to-purple-600'
    }
  ];

  // Data management functions using API
  const addLink = async (linkData: any) => {
    const success = await apiCreateLink({
      url: linkData.url,
      location_url: linkData.location_url || linkData.url,
      type: linkData.type || 'link',
      title: linkData.title,
      description: linkData.description,
    });
    
    if (success) {
      // Data will be automatically updated by the hook
      await refreshData();
    }
  };

  const updateLink = async (id: string, updates: any) => {
    const success = await apiUpdateLink(id, updates);
    
    if (success) {
      // Data will be automatically updated by the hook
      await refreshData();
    }
  };

  const deleteLink = async (id: string) => {
    const success = await apiDeleteLink(id);
    
    if (success) {
      // Data will be automatically updated by the hook
      await refreshData();
    }
  };

  // Placeholder functions for missing features
  const getLinkStatistics = async (linkId: number, params: any) => {
    // TODO: Implement link statistics fetching
  };

  const loadStatistics = async () => {
    if (selectedLinkId && statisticsParams.start_date && statisticsParams.end_date) {
      await getLinkStatistics(selectedLinkId, {
        start_date: statisticsParams.start_date,
        end_date: statisticsParams.end_date,
        type: statisticsParams.type
      });
    }
  };

  const apiCreateTeam = async (teamName: string) => {
    // TODO: Implement team creation
  };

  const apiCreateProject = async (projectData: any) => {
    // TODO: Implement project creation
  };

  const apiUpdateTeam = async (teamId: number, teamData: any) => {
    // TODO: Implement team update
  };

  const apiDeleteTeam = async (teamId: number) => {
    // TODO: Implement team deletion
  };

  const apiCreateTeamMember = async (teamId: number, memberData: any, permissions?: string[]) => {
    // TODO: Implement team member creation
  };

  const apiUpdateTeamMember = async (memberId: number, memberData: any) => {
    // TODO: Implement team member update
  };

  const apiDeleteTeamMember = async (memberId: number) => {
    // TODO: Implement team member deletion
  };

  const apiCreateDomain = async (host: string, customIndexUrl?: string, customNotFoundUrl?: string) => {
    // TODO: Implement domain creation
  };

  const apiUpdateDomain = async (domainId: number, domainData: any) => {
    // TODO: Implement domain update
  };

  const apiDeleteDomain = async (domainId: number) => {
    // TODO: Implement domain deletion
  };

  const apiDeleteDatum = async (datumId: number) => {
    // TODO: Implement datum deletion
  };

  const apiDeleteQRCode = async (qrCodeId: number) => {
    // TODO: Implement QR code deletion
  };

  const handleCreateLink = (type: string) => {
    setSelectedLinkType(type);
    setShowCreateModal(true);
  };

  const handleCreateBiolink = () => {
    toast({
      title: "Bio Link Created",
      description: "Your bio link has been created successfully",
    });
    setShowCreateModal(false);
  };

  // Bio link block management functions
  const addBioLinkBlock = (blockType: string) => {
    setSelectedBlockType(blockType);
    setBlockModalData({});
    setShowAddBlockModal(false);
    setShowBlockModal(true);
  };

  const createBioLinkBlock = (blockData: any) => {
    const newBlock: BioLinkBlock = {
      id: Date.now().toString(),
      type: selectedBlockType,
      title: blockData.name || blockTypes.find(bt => bt.id === selectedBlockType)?.name || 'New Block',
      content: blockData,
      order: bioLinkBlocks.length,
      visible: true
    };
    setBioLinkBlocks(prev => [...prev, newBlock]);
    setShowBlockModal(false);
    toast({
      title: "Block Added",
      description: `${newBlock.title} block has been added to your bio link`,
    });
  };

  const selectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    setShowThemeModal(false);
    toast({
      title: "Theme Selected",
      description: `Applied ${themePresets.find(t => t.id === themeId)?.name} theme to your bio link`,
    });
  };

  const updateBioLinkBlock = (blockId: string, updates: Partial<BioLinkBlock>) => {
    setBioLinkBlocks(prev => 
      prev.map(block => 
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  };

  const deleteBioLinkBlock = (blockId: string) => {
    setBioLinkBlocks(prev => prev.filter(block => block.id !== blockId));
    toast({
      title: "Block Deleted",
      description: "Block has been removed from your bio link",
    });
  };

  const reorderBioLinkBlocks = (fromIndex: number, toIndex: number) => {
    setBioLinkBlocks(prev => {
      const newBlocks = [...prev];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      return newBlocks.map((block, index) => ({ ...block, order: index }));
    });
  };

  const getBlocksByCategory = (category: string) => {
    return blockTypes.filter(block => block.category === category);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Welcome Banner */}
      {showWelcomeBanner && (
        <div className="bg-sky-500 px-4 py-3 flex items-center justify-between">
          <p className="text-white font-medium">
            Welcome to our platform, we are grateful to have you here.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowWelcomeBanner(false)}
            className="text-white hover:bg-sky-600"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Left Sidebar - Hidden on Mobile, Visible on Desktop */}
        <div className={`hidden lg:block ${sidebarOpen ? 'w-64' : 'w-16'} bg-gray-50 border-r border-gray-200 min-h-screen transition-all duration-300 ease-in-out relative`}>
          {/* Sidebar Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute top-4 right-4 z-10 bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
          >
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>

          <div className="p-4">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-8 h-8 flex items-center justify-center relative">
                <img 
                  src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png" 
                  alt="Droplink Logo" 
                  className="w-8 h-8 object-contain"
                  src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png"
                />
              </div>
              {sidebarOpen && <span className="text-xl font-bold text-sky-600">Droplink</span>}
            </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Button
              variant={activeSection === 'dashboard' ? 'default' : 'ghost'}
              className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} ${activeSection === 'dashboard' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
              onClick={() => setActiveSection('dashboard')}
              title="Dashboard"
            >
              <Grid3X3 className="w-4 h-4" />
              {sidebarOpen && <span className="ml-3">Dashboard</span>}
            </Button>

            {/* Link Types */}
            <div className="space-y-1">
              {linkTypes.map((linkType) => {
                const IconComponent = linkType.icon;
                return (
                  <Button
                    key={linkType.id}
                    variant={activeSection === linkType.id ? 'default' : 'ghost'}
                    className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} ${activeSection === linkType.id ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    onClick={() => setActiveSection(linkType.id)}
                    title={linkType.name}
                  >
                    {sidebarOpen ? (
                      <>
                        <div className={`w-2 h-2 rounded-full ${linkType.color}`} />
                        <IconComponent className="w-4 h-4 ml-2" />
                        <span className="ml-3">{linkType.name}</span>
                      </>
                    ) : (
                      <IconComponent className="w-4 h-4" />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Additional Features */}
            <div className="mt-6 space-y-1">
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('statistics')}
                title="Statistics"
              >
                <BarChart3 className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Statistics</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('projects')}
                title="Projects"
              >
                <FolderOpen className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Projects</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('trackingpixel')}
                title="Tracking pixel"
              >
                <Eye className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Tracking pixel</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('customdomain')}
                title="Custom domain"
              >
                <Globe className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Custom domain</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('emailsignature')}
                title="Email signature"
              >
                <Mail className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Email signature</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('notificationhandlers')}
                title="Notification handlers"
              >
                <Bell className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Notification handlers</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('paymentprocessors')}
                title="Payment processors"
              >
                <PaymentIcon className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Payment processors</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => window.open('/biolink-templates', '_blank')}
                title="Bio Link Templates"
              >
                <Layout className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Templates</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('aicreation')}
                title="AI creation"
              >
                <Sparkles className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">AI creation</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('tools')}
                title="Tools"
              >
                <Settings className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Tools</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('data')}
                title="Data"
              >
                <BarChart3 className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Data</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('qrcodes')}
                title="QR Codes"
              >
                <QrCode className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">QR Codes</span>}
              </Button>
              <Button
                variant="ghost"
                className={`w-full ${sidebarOpen ? 'justify-start' : 'justify-center'} text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                onClick={() => setActiveSection('customerpayments')}
                title="Customer payments"
              >
                <CreditCard className="w-4 h-4" />
                {sidebarOpen && <span className="ml-3">Customer payments</span>}
              </Button>
            </div>
          </nav>

          {/* User Profile */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className={`flex items-center ${sidebarOpen ? 'space-x-3' : 'justify-center'} p-3 bg-gray-50 rounded-lg border border-gray-200`}>
              <div className={`${sidebarOpen ? 'w-10 h-10' : 'w-8 h-8'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center`}>
                <Globe className={`${sidebarOpen ? 'w-5 h-5' : 'w-4 h-4'} text-white`} />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {apiProfile?.username || profile?.username || user?.user_metadata?.username || 'username'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
              )}
            </div>
          </div>
          </div>
        </div>

        {/* Main Content - Mobile Responsive */}
        <div className="flex-1 min-w-0">
          {/* Droplink Header - Mobile Responsive */}
          <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Mobile Menu Button - Only visible on mobile */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden text-gray-600 hover:bg-gray-100"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 flex items-center justify-center relative">
                <img 
                  src="/lovable-uploads/0d519e46-7a30-4f3d-a07a-17e763eeda19.png" 
                  alt="Droplink Logo" 
                  className="w-8 h-8 object-contain"
                />
              </div>
              <h1 className="text-xl font-semibold text-sky-600">Droplink</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  const bioLinkUrl = `${window.location.origin}/${user?.user_metadata?.username || 'username'}`;
                  window.open(bioLinkUrl, '_blank');
                }}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Link
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-gray-100">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Menu - Only visible on mobile */}
          {showMobileMenu && (
            <>
              {/* Backdrop */}
              <div 
                className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setShowMobileMenu(false)}
              />
              {/* Mobile Menu */}
              <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg relative z-50">
              <div className="px-4 py-2">
                {/* Mobile Navigation */}
                <nav className="space-y-1">
                  <Button
                    variant={activeSection === 'dashboard' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${activeSection === 'dashboard' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    onClick={() => {
                      setActiveSection('dashboard');
                      setShowMobileMenu(false);
                    }}
                  >
                    <Grid3X3 className="w-4 h-4 mr-3" />
                    Dashboard
                  </Button>

                  {/* Link Types */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Link Types</p>
                    <div className="space-y-1">
                      <Button
                        variant={activeSection === 'link' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'link' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('link');
                          setShowMobileMenu(false);
                        }}
                      >
                        <LinkIcon className="w-4 h-4 mr-3" />
                        Short link
                      </Button>
                      <Button
                        variant={activeSection === 'file' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'file' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('file');
                          setShowMobileMenu(false);
                        }}
                      >
                        <File className="w-4 h-4 mr-3" />
                        File link
                      </Button>
                      <Button
                        variant={activeSection === 'vcard' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'vcard' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('vcard');
                          setShowMobileMenu(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-3" />
                        vCard link
                      </Button>
                      <Button
                        variant={activeSection === 'event' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'event' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('event');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Calendar className="w-4 h-4 mr-3" />
                        Event link
                      </Button>
                      <Button
                        variant={activeSection === 'static' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'static' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('static');
                          setShowMobileMenu(false);
                        }}
                      >
                        <FileText className="w-4 h-4 mr-3" />
                        Static link
                      </Button>
                      <Button
                        variant={activeSection === 'qr' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'qr' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('qr');
                          setShowMobileMenu(false);
                        }}
                      >
                        <QrCode className="w-4 h-4 mr-3" />
                        QR link
                      </Button>
                      <Button
                        variant={activeSection === 'splash' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'splash' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('splash');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Droplets className="w-4 h-4 mr-3" />
                        Splash link
                      </Button>
                    </div>
                  </div>

                  {/* Statistics */}
                  <Button
                    variant={activeSection === 'statistics' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${activeSection === 'statistics' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    onClick={() => {
                      setActiveSection('statistics');
                      setShowMobileMenu(false);
                    }}
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    Statistics
                  </Button>

                  {/* Account Management */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account</p>
                    <div className="space-y-1">
                      <Button
                        variant={activeSection === 'projects' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'projects' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('projects');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Folder className="w-4 h-4 mr-3" />
                        Projects
                      </Button>
                      <Button
                        variant={activeSection === 'pixels' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'pixels' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('pixels');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-3" />
                        Tracking pixel
                      </Button>
                      <Button
                        variant={activeSection === 'domain' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'domain' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('domain');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Globe className="w-4 h-4 mr-3" />
                        Custom domain
                      </Button>
                      <Button
                        variant={activeSection === 'signature' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'signature' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('signature');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Pen className="w-4 h-4 mr-3" />
                        Email signature
                      </Button>
                      <Button
                        variant={activeSection === 'notifications' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'notifications' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('notifications');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Bell className="w-4 h-4 mr-3" />
                        Notification handlers
                      </Button>
                      <Button
                        variant={activeSection === 'payments' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'payments' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('payments');
                          setShowMobileMenu(false);
                        }}
                      >
                        <CreditCard className="w-4 h-4 mr-3" />
                        Payment processors
                      </Button>
                    </div>
                  </div>

                  {/* Bio Link */}
                  <Button
                    variant={activeSection === 'biolink' ? 'default' : 'ghost'}
                    className={`w-full justify-start ${activeSection === 'biolink' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                    onClick={() => {
                      setActiveSection('biolink');
                      setShowMobileMenu(false);
                    }}
                  >
                    <Layers className="w-4 h-4 mr-3" />
                    Bio Link
                  </Button>

                  {/* AI Tools */}
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">AI Tools</p>
                    <div className="space-y-1">
                      <Button
                        variant={activeSection === 'ai-creation' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'ai-creation' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('ai-creation');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Zap className="w-4 h-4 mr-3" />
                        AI creation
                      </Button>
                      <Button
                        variant={activeSection === 'tools' ? 'default' : 'ghost'}
                        className={`w-full justify-start ${activeSection === 'tools' ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}`}
                        onClick={() => {
                          setActiveSection('tools');
                          setShowMobileMenu(false);
                        }}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Tools
                      </Button>
                    </div>
                  </div>

                  {/* User Profile */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-3 p-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{apiProfile?.username || 'username'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
            </>
          )}

          <div className="p-4 sm:p-6">
            {/* Error Display */}
            {errors.dashboard && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-red-700">Failed to load dashboard data: {errors.dashboard}</p>
                </div>
              </div>
            )}
            
            {activeSection === 'dashboard' && (
              <div className="space-y-6">
              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Links</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading ? '...' : dashboardStats?.totalLinks || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <LinkIcon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Clicks</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading ? '...' : dashboardStats?.totalClicks || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading ? '...' : dashboardStats?.totalViews || 0}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Click Rate</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {loading ? '...' : `${dashboardStats?.clickRate || 0}%`}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Target className="w-6 h-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Information Section */}
              {apiUser && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="w-5 h-5" />
                      <span>Account Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-gray-900">{apiUser.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Account Type</label>
                          <p className="text-gray-900 capitalize">{apiUser.billing.type}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Plan</label>
                          <p className="text-gray-900">{apiUser.billing.plan_id}</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Language</label>
                          <p className="text-gray-900 capitalize">{apiUser.billing.language}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Timezone</label>
                          <p className="text-gray-900">{apiUser.billing.timezone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Total Logins</label>
                          <p className="text-gray-900">{apiUser.billing.total_logins}</p>
                        </div>
                      </div>
                    </div>
                    {apiUser.billing.plan_expiration_date && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">Plan Expires</span>
                        </div>
                        <p className="text-blue-700 mt-1">
                          {new Date(apiUser.billing.plan_expiration_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Analytics Chart Section */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5" />
                    <span>Analytics Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {dashboardStats && dashboardStats.totalLinks > 0 ? (
                    <div className="space-y-6">
                      {/* Simple Analytics Chart */}
                      <div className="h-64 bg-gray-50 rounded-lg p-4">
                        <div className="flex items-end justify-between h-full space-x-2">
                          {Array.from({ length: 7 }, (_, i) => (
                            <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ 
                              height: `${Math.random() * 80 + 20}%` 
                            }}></div>
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>Mon</span>
                          <span>Tue</span>
                          <span>Wed</span>
                          <span>Thu</span>
                          <span>Fri</span>
                          <span>Sat</span>
                          <span>Sun</span>
                        </div>
                      </div>
                      
                      {/* Top Link */}
                      {dashboardStats.topLink && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Top Performing Link</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{dashboardStats.topLink.url}</p>
                              <p className="text-sm text-gray-600">{dashboardStats.topLink.clicks} clicks</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600">Location URL</p>
                              <p className="font-semibold text-xs text-gray-500 truncate max-w-32">{dashboardStats.topLink.location_url}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No data available</h3>
                      <p className="text-gray-600 mb-4">Create your first link to start seeing analytics.</p>
                      <Button onClick={() => setActiveSection('biolink')} className="bg-sky-500 hover:bg-sky-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Link
                      </Button>
                  </div>
                  )}
                </CardContent>
              </Card>

              {/* Detailed Statistics Section */}
              {links.length > 0 && (
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Detailed Statistics</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {/* Statistics Controls */}
                      <div className="flex flex-wrap gap-4 items-center">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-600">Link:</label>
                          <select 
                            className="w-48 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            value={selectedLinkId || ''}
                            onChange={(e) => setSelectedLinkId(e.target.value ? parseInt(e.target.value) : null)}
                          >
                            <option value="">Select a link</option>
                            {links.map((link) => (
                              <option key={link.id} value={link.id}>
                                {link.url} - {link.location_url}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-600">Start Date:</label>
                          <Input 
                            type="date" 
                            className="w-40"
                            value={statisticsParams.start_date}
                            onChange={(e) => setStatisticsParams(prev => ({ ...prev, start_date: e.target.value }))}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-600">End Date:</label>
                          <Input 
                            type="date" 
                            className="w-40"
                            value={statisticsParams.end_date}
                            onChange={(e) => setStatisticsParams(prev => ({ ...prev, end_date: e.target.value }))}
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-gray-600">Type:</label>
                          <select 
                            className="w-40 px-3 py-2 border border-gray-300 rounded-md text-sm"
                            value={statisticsParams.type}
                            onChange={(e) => setStatisticsParams(prev => ({ ...prev, type: e.target.value }))}
                          >
                            <option value="overview">Overview</option>
                            <option value="referrer_host">Referrer Host</option>
                            <option value="referrer_path">Referrer Path</option>
                            <option value="continent_code">Continent</option>
                            <option value="country_code">Country</option>
                            <option value="city_name">City</option>
                            <option value="os_name">Operating System</option>
                            <option value="browser_name">Browser</option>
                            <option value="device_type">Device Type</option>
                            <option value="browser_language">Language</option>
                            <option value="utm_source">UTM Source</option>
                            <option value="utm_medium">UTM Medium</option>
                            <option value="utm_campaign">UTM Campaign</option>
                            <option value="hour">Hour</option>
                          </select>
                        </div>
                        <Button 
                          className="bg-sky-500 hover:bg-sky-600 text-white"
                          onClick={loadStatistics}
                          disabled={!selectedLinkId || loading}
                        >
                          {loading ? 'Loading...' : 'Load Statistics'}
                        </Button>
                      </div>

                      {/* Statistics Display */}
                      {linkStatistics.length > 0 ? (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">Statistics Data</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {linkStatistics.map((stat, index) => (
                              <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-gray-600">Date</span>
                                  <span className="text-sm text-gray-900">{stat.formatted_date}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm font-medium text-gray-600">Pageviews</span>
                                  <span className="text-sm font-semibold text-blue-600">{stat.pageviews}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-600">Visitors</span>
                                  <span className="text-sm font-semibold text-green-600">{stat.visitors}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                            <BarChart3 className="w-8 h-8 text-gray-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No statistics data</h3>
                          <p className="text-gray-600">Select date range and type to load statistics.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Projects Section */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FolderOpen className="w-5 h-5 text-gray-900" />
                      <h2 className="text-xl font-semibold text-gray-900">Projects</h2>
                    </div>
                    <Button 
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                      onClick={() => {
                        // TODO: Open create project modal
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Project
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                    </div>
                  ) : errors.projects ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{errors.projects}</p>
                    </div>
                  ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {projects.map((project) => (
                        <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: project.color }}
                              ></div>
                              <h3 className="font-semibold text-gray-900">{project.name}</h3>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // TODO: Open edit project modal
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  // TODO: Delete project
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Created: {new Date(project.datetime).toLocaleDateString()}</p>
                            {project.last_datetime && (
                              <p>Last Activity: {new Date(project.last_datetime).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
                      <p className="text-gray-600 mb-4">Create your first project to organize your links.</p>
                      <Button 
                        className="bg-sky-500 hover:bg-sky-600 text-white"
                        onClick={() => {
                          // This would open create project modal
                          console.log('Create project');
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Your First Project
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Account Payments Section */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-5 h-5 text-gray-900" />
                      <h2 className="text-xl font-semibold text-gray-900">Account Payments</h2>
                    </div>
                    <Button 
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                      onClick={() => {
                        // This would open payment history or billing
                        // TODO: View payment history
                      }}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Payment History
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                    </div>
                  ) : errors.payments ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{errors.payments}</p>
                    </div>
                  ) : payments.length > 0 ? (
                    <div className="space-y-4">
                      {payments.map((payment) => (
                        <div key={payment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${payment.status ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {payment.processor.charAt(0).toUpperCase() + payment.processor.slice(1)} Payment
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {payment.email} • {payment.type} • {payment.frequency}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">
                                {payment.currency} {payment.total_amount}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(payment.datetime).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600">Plan ID: {payment.plan_id}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {payment.status ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment history</h3>
                      <p className="text-gray-600 mb-4">Your payment history will appear here once you make a payment.</p>
                      <Button 
                        className="bg-sky-500 hover:bg-sky-600 text-white"
                        onClick={() => {
                          // This would open billing/payment setup
                          // TODO: Set up payment
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Set Up Payment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>


              {/* Account Logs Section */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="w-5 h-5 text-gray-900" />
                      <h2 className="text-xl font-semibold text-gray-900">Account Logs</h2>
                    </div>
                    <Button 
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                      onClick={() => {
                        // This would refresh logs or export
                        // TODO: Refresh logs
                      }}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh Logs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                    </div>
                  ) : errors.logs ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{errors.logs}</p>
                    </div>
                  ) : logs.length > 0 ? (
                    <div className="space-y-4">
                      {logs.map((log, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${
                                log.type.includes('success') ? 'bg-green-500' : 
                                log.type.includes('error') ? 'bg-red-500' : 
                                'bg-blue-500'
                              }`}></div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {log.type.replace('.', ' ').replace(/([A-Z])/g, ' $1').trim()}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {log.ip} • {log.device_type} • {log.city_name}, {log.country_code}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(log.datetime).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(log.datetime).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-gray-600">IP: {log.ip}</span>
                              <span className="text-sm text-gray-600">Device: {log.device_type}</span>
                              <span className="text-sm text-gray-600">Location: {log.continent_code}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity logs</h3>
                      <p className="text-gray-600 mb-4">Your account activity logs will appear here.</p>
                      <Button 
                        className="bg-sky-500 hover:bg-sky-600 text-white"
                        onClick={() => {
                          // This would refresh logs
                          // TODO: Refresh logs
                        }}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Logs
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Teams Section */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-gray-900" />
                      <h2 className="text-xl font-semibold text-gray-900">My Teams</h2>
                    </div>
                    <Button 
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                      onClick={() => {
                        const teamName = prompt('Enter team name:');
                        if (teamName) {
                          apiCreateTeam(teamName);
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Team
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                    </div>
                  ) : errors.teams ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{errors.teams}</p>
                    </div>
                  ) : teams.length > 0 ? (
                    <div className="space-y-4">
                      {teams.map((team) => (
                        <div key={team.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{team.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {team.team_members?.length || 0} members • Created {new Date(team.datetime).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {team.team_members?.length || 0} members
                              </p>
                              <p className="text-xs text-gray-500">
                                {team.last_datetime ? 'Recently active' : 'No recent activity'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Members:</span>
                                <div className="flex space-x-1">
                                  {team.team_members?.slice(0, 3).map((member, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {member.user_email.split('@')[0]}
                                    </Badge>
                                  ))}
                                  {team.team_members && team.team_members.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{team.team_members.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const newName = prompt('Enter new team name:', team.name);
                                  if (newName && newName !== team.name) {
                                    apiUpdateTeam(team.id, { name: newName });
                                  }
                                }}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this team?')) {
                                    apiDeleteTeam(team.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams created</h3>
                      <p className="text-gray-600 mb-4">Create your first team to start collaborating with others.</p>
                      <Button 
                        className="bg-sky-500 hover:bg-sky-600 text-white"
                        onClick={() => {
                          const teamName = prompt('Enter team name:');
                          if (teamName) {
                            apiCreateTeam(teamName);
                          }
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Team
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Team Members Section */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-gray-900" />
                      <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
                    </div>
                    <Button 
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                      onClick={() => {
                        const userEmail = prompt('Enter user email:');
                        if (userEmail) {
                          apiCreateTeamMember(1, userEmail, ['read.all', 'create.links', 'update.links']);
                        }
                      }}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingState.teamMembers ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div>
                    </div>
                  ) : errors.teamMembers ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{errors.teamMembers}</p>
                    </div>
                  ) : teamMembers.length > 0 ? (
                    <div className="space-y-4">
                      {teamMembers.map((member) => (
                        <div key={member.team_member_id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${member.status === 1 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{member.user_email}</h3>
                                <p className="text-sm text-gray-600">Team ID: {member.team_member_id}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {new Date(member.datetime).toLocaleDateString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {member.status === 1 ? 'Active' : 'Inactive'}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Access:</span>
                                <div className="flex space-x-1">
                                  {member.access.read && <Badge variant="secondary" className="text-xs">Read</Badge>}
                                  {member.access.create && <Badge variant="secondary" className="text-xs">Create</Badge>}
                                  {member.access.update && <Badge variant="secondary" className="text-xs">Update</Badge>}
                                  {member.access.delete && <Badge variant="secondary" className="text-xs">Delete</Badge>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  const newAccess = member.access.read ? ['read.all'] : ['read.all', 'create.links', 'update.links'];
                                  apiUpdateTeamMember(member.team_member_id, { access: newAccess });
                                }}
                              >
                                <Settings className="w-4 h-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to remove this team member?')) {
                                    apiDeleteTeamMember(member.team_member_id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No team members</h3>
                      <p className="text-gray-600 mb-4">Your team members will appear here once you add them.</p>
                      <Button 
                        className="bg-sky-500 hover:bg-sky-600 text-white"
                        onClick={() => {
                          const userEmail = prompt('Enter user email:');
                          if (userEmail) {
                            apiCreateTeamMember(1, userEmail, ['read.all', 'create.links', 'update.links']);
                          }
                        }}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Team Member
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Link Type Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {linkTypes.map((linkType) => {
                  const IconComponent = linkType.icon;
                  const count = linkType.id === 'biolink' ? 1 : 0; // Show 1 for bio link like in the image
                  return (
                    <Card key={linkType.id} className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${linkType.color} rounded-lg flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <span className="text-2xl font-bold text-gray-900">{count}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{linkType.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{linkType.description}</p>
                        <Button
                          onClick={() => handleCreateLink(linkType.id)}
                          className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create {linkType.name}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Links Section */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <LinkIcon className="w-5 h-5 text-gray-900" />
                      <h2 className="text-xl font-semibold text-gray-900">Links</h2>
                      <InfoIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create link
                      </Button>
                      <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Statistics
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Existing Link Entry */}
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">#</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{apiProfile?.username || 'username'}</h3>
                          <p className="text-sm text-gray-600">{window.location.origin}/@{apiProfile?.username || 'username'}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">#{dashboardStats?.totalViews || 0}</span>
                        <span className="text-sm text-gray-500">{dashboardStats?.totalLinks || 0}</span>
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div className="w-8 h-4 bg-green-500 rounded-full flex items-center justify-end pr-1">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {/* Create First Link Button */}
                  <div className="text-center py-8">
                    <Button
                      onClick={() => handleCreateLink('biolink')}
                      className="bg-sky-500 hover:bg-sky-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create your first link
                    </Button>
                  </div>
                </CardContent>
              </Card>
              </div>
            )}

            {/* Bio Link Settings */}
            {activeSection === 'biolink' && (
            <div className="space-y-6">
              {/* Breadcrumbs */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Links</span>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">Biolink Settings</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{apiProfile?.display_name || apiProfile?.username || 'Your Name'}</h1>
                  <p className="text-gray-600 mt-1">
                    Your link is {window.location.origin}/@{apiProfile?.username || 'username'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => setShowAddBlockModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add block
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                    onClick={() => window.open('/biolink-templates', '_blank')}
                  >
                    <Layout className="w-4 h-4 mr-2" />
                    Templates
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistics
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Bio Link Configuration - Mobile First Responsive */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Settings Panel */}
                <div className="xl:col-span-2 space-y-4 sm:space-y-6">
                  {/* Configuration Tabs - Mobile Responsive */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-1 bg-gray-100 p-1 rounded-lg">
                    <Button 
                      variant="ghost" 
                      className={`w-full sm:w-auto ${activeBlockTab === 'settings' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setActiveBlockTab('settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                    <Button 
                      variant="ghost" 
                      className={`w-full sm:w-auto ${activeBlockTab === 'blocks' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                      onClick={() => setActiveBlockTab('blocks')}
                    >
                      <Layers className="w-4 h-4 mr-2" />
                      Blocks
                    </Button>
                  </div>

                  {/* Settings Content */}
                  {activeBlockTab === 'settings' && (
                    <Card className="bg-white border-gray-200">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Settings className="w-5 h-5" />
                          <span>Bio Link Settings</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Short URL - Mobile Responsive */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Short URL
                          </label>
                          <div className="flex flex-col sm:flex-row">
                            <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-t-md sm:rounded-l-md sm:rounded-t-none border border-gray-300 text-center sm:text-left text-sm">
                              {window.location.origin}/@
                            </span>
                            <Input
                              placeholder="mrwain"
                              className="rounded-b-md sm:rounded-l-none sm:rounded-b-none border-t-0 sm:border-t border-l-0 sm:border-l"
                              defaultValue="mrwain"
                            />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Leave empty for a randomly generated one.
                          </p>
                        </div>

                        {/* Description - Mobile Responsive */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none sm:resize-y"
                            rows={3}
                            placeholder="Add a description"
                          />
                        </div>

                        {/* Advanced Settings - Mobile Responsive */}
                        <div className="space-y-3 sm:space-y-4">
                          <div 
                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                            onClick={() => setShowThemeModal(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <Palette className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm sm:text-base">Preset themes</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>

                          <div 
                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                            onClick={() => setShowCustomizationsModal(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <Pen className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm sm:text-base">Customizations</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>

                          <div 
                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                            onClick={() => setShowVerifiedBadgeModal(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm sm:text-base">Verified badge</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>

                          <div 
                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                            onClick={() => setShowBrandingModal(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <Award className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm sm:text-base">Branding</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>

                          <div 
                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                            onClick={() => setShowPixelsModal(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <Target className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm sm:text-base">Pixels</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>

                          <div 
                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                            onClick={() => setShowUTMModal(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <BarChart3 className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm sm:text-base">UTM Parameters</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>

                          <div 
                            className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors touch-manipulation"
                            onClick={() => setShowProtectionModal(true)}
                          >
                            <div className="flex items-center space-x-3">
                              <Lock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <span className="font-medium text-gray-900 text-sm sm:text-base">Protection</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Blocks Content */}
                  {activeBlockTab === 'blocks' && (
                    <Card className="bg-white border-gray-200">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Layers className="w-5 h-5" />
                          <span>Bio Link Blocks</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {bioLinkBlocks.length > 0 ? (
                          <div className="space-y-4">
                            {bioLinkBlocks.map((block, index) => {
                              const blockType = blockTypes.find(bt => bt.id === block.type);
                              const IconComponent = blockType?.icon || FileText;
                              return (
                                <div key={block.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                      <div className={`w-8 h-8 ${blockType?.color || 'bg-gray-500'} rounded-lg flex items-center justify-center`}>
                                        <IconComponent className="w-4 h-4 text-white" />
                                      </div>
                                      <div>
                                        <h3 className="font-semibold text-gray-900">{block.title}</h3>
                                        <p className="text-sm text-gray-600">{blockType?.description}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setEditingBlock(block)}
                                      >
                                        <Edit className="w-4 h-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => deleteBioLinkBlock(block.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                              <Layers className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No blocks added yet</h3>
                            <p className="text-gray-600 mb-4">Add your first block to start building your bio link.</p>
                            <Button 
                              className="bg-sky-500 hover:bg-sky-600 text-white"
                              onClick={() => setShowAddBlockModal(true)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Your First Block
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Mobile Preview - Responsive */}
                <div className="xl:col-span-1 order-first xl:order-last">
                  <Card className="bg-white border-gray-200">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium text-gray-900">Mobile Preview</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                            <Moon className="w-4 h-4" />
                          </Button>
                          <div className="w-8 h-4 bg-sky-500 rounded-full flex items-center justify-end pr-1">
                            <div className="w-3 h-3 bg-white rounded-full"></div>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                            <File className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                            <List className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* Mobile Frame - Responsive Design */}
                      <div className="relative mx-auto w-64 sm:w-72 md:w-80 lg:w-64 xl:w-72 h-[500px] sm:h-[600px] md:h-[700px] lg:h-[500px] xl:h-[600px] bg-gray-900 rounded-[2rem] p-2 shadow-2xl">
                        <div className="w-full h-full bg-white rounded-[1.5rem] overflow-hidden relative">
                          {/* Mobile Screen Content */}
                          <div 
                            className="h-full flex flex-col"
                            style={{ 
                              background: themePresets.find(t => t.id === selectedTheme)?.background || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                          >
                            {/* Mobile Header - Responsive */}
                            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full shadow-sm"></div>
                              <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white hover:opacity-80 transition-opacity cursor-pointer" />
                            </div>
                            
                            {/* Mobile Content Area - Responsive Grid */}
                            <div className="flex-1 p-3 sm:p-4 md:p-5 space-y-2 sm:space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent relative">
                              {/* Droplink Waterdrop Watermark */}
                              <DroplinkWaterdrop 
                                size="lg" 
                                isWatermark={true} 
                                opacity={0.1}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                              />
                              {links && links.length > 0 ? (
                                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                                  {links.map((link) => {
                                    const IconComponent = FileText; // Default icon
                                    return (
                                      <div 
                                        key={link.id} 
                                        className={`${themePresets.find(t => t.id === selectedTheme)?.buttonStyle || 'rounded-lg bg-white text-gray-800 px-4 py-2 shadow-md'} p-3 sm:p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 touch-manipulation`}
                                      >
                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                          <span className="text-sm sm:text-base font-medium truncate">{link.title}</span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                  
                                  {/* Plan Badge - Show Droplink badge for FREE plan */}
                                  {planConfig.features.showDroplinkBadge && (
                                    <div className="flex justify-center mt-4">
                                      <Badge className={`text-xs text-white ${planConfig.color} bg-opacity-90`}>
                                        {planConfig.icon}
                                        <span className="ml-1">Droplink</span>
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-white py-8 sm:py-12">
                                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center backdrop-blur-sm">
                                    <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                                  </div>
                                  <h3 className="text-lg sm:text-xl font-bold mb-2">{apiProfile?.display_name || apiProfile?.username || 'Your Name'}</h3>
                                  <p className="text-sm sm:text-base opacity-80">Bio link preview</p>
                                  
                                  {/* Plan Badge - Show Droplink badge for FREE plan */}
                                  {planConfig.features.showDroplinkBadge && (
                                    <div className="flex justify-center mt-3">
                                      <Badge className={`text-xs text-white ${planConfig.color} bg-opacity-90`}>
                                        {planConfig.icon}
                                        <span className="ml-1">Droplink</span>
                                      </Badge>
                                    </div>
                                  )}
                                  
                                  <p className="text-xs sm:text-sm opacity-60 mt-2">Add blocks to see them here</p>
                                </div>
                              )}
                            </div>
                            
                            {/* Mobile Footer - Responsive */}
                            <div className="flex justify-between items-center p-3 sm:p-4 md:p-5 border-t border-white border-opacity-20">
                              <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-white opacity-80" />
                              <div className="flex items-center space-x-2">
                                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white bg-opacity-20 rounded flex items-center justify-center">
                                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-sm"></div>
                                </div>
                                <span className="text-white text-xs sm:text-sm font-medium">Droplink</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bio Link Entry */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <Hash className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{apiProfile?.username || 'username'}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <LinkIcon className="w-3 h-3 mr-1" />
                          {window.location.origin}/@{apiProfile?.username || 'username'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">#1,243</div>
                        <div className="text-xs text-gray-500">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-gray-900">{bioLinkBlocks.length}</div>
                        <div className="text-xs text-gray-500">Blocks</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <div className="w-12 h-6 bg-green-500 rounded-full flex items-center justify-end pr-1">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Links Section */}
            {activeSection === 'link' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Links</h1>
                  <p className="text-gray-600 mt-1">Manage all your links in one place</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Link
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading links...</p>
                    </div>
                  ) : errorMessage ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{errorMessage}</p>
                    </div>
                  ) : links.length > 0 ? (
                    <div className="space-y-4">
                      {links.map((link) => (
                        <div key={link.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <LinkIcon className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{link.url}</h3>
                                <p className="text-sm text-gray-600">{link.location_url}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {link.type}
                                  </Badge>
                                  <span className="text-xs text-gray-500">
                                    {link.clicks} clicks
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(link.datetime).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/${link.url}`);
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`${window.location.origin}/${link.url}`, '_blank')}
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this link?')) {
                                    apiDeleteLink(link.id.toString());
                                  }
                                }}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LinkIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No links created yet</h3>
                      <p className="text-gray-600 mb-4">Create your first link to get started</p>
                      <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Link
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            )}

            {/* Short Link Section */}
            {activeSection === 'shortlink' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Short link</h1>
                  <p className="text-gray-600 mt-1">Create and manage short links</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Short link
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistics
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* No Data State */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <LinkIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No filtered data found</h3>
                  <p className="text-gray-600 mb-6">No matches found for your filter.</p>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* File Link Section */}
            {activeSection === 'filelink' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">File link</h1>
                  <p className="text-gray-600 mt-1">Share files with your audience</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    File link
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistics
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <File className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No filtered data found</h3>
                  <p className="text-gray-600 mb-6">No matches found for your filter.</p>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* vCard Link Section */}
            {activeSection === 'vcard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">vCard link</h1>
                  <p className="text-gray-600 mt-1">Share contact information</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create vCard
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistics
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* vCard Creation Form */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Create vCard</h3>
                  <p className="text-sm text-gray-600">Fill in your contact information</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <Input placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                      <Input placeholder="Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                      <Input placeholder="Acme Corp" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input placeholder="john@example.com" type="email" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <Input placeholder="+1 (555) 123-4567" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <Input placeholder="https://johndoe.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={3}
                      placeholder="123 Main St, City, State 12345"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      Cancel
                    </Button>
                    <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create vCard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Empty State */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No vCards created yet</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first vCard to share your contact information.</p>
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first vCard
                  </Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Event Link Section */}
            {activeSection === 'event' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Event link</h1>
                  <p className="text-gray-600 mt-1">Create event invitations</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistics
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Event Creation Form */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Create Event</h3>
                  <p className="text-sm text-gray-600">Set up your event details</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Name</label>
                      <Input placeholder="My Awesome Event" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option>Conference</option>
                        <option>Workshop</option>
                        <option>Meetup</option>
                        <option>Webinar</option>
                        <option>Party</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      <Input type="datetime-local" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      <Input type="datetime-local" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <Input placeholder="123 Main St, City, State" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
                      <Input placeholder="100" type="number" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={4}
                      placeholder="Describe your event..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      Cancel
                    </Button>
                    <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Empty State */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No events created yet</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first event to invite people.</p>
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first event
                  </Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Static Link Section */}
            {activeSection === 'static' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Static link</h1>
                  <p className="text-gray-600 mt-1">Create static redirects</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Static Link
                  </Button>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Statistics
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Static Link Creation Form */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Create Static Link</h3>
                  <p className="text-sm text-gray-600">Set up a redirect to your destination URL</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Link Title</label>
                      <Input placeholder="My Important Link" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Slug (Optional)</label>
                      <Input placeholder="my-link" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
                      <Input placeholder="https://example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Redirect Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option>301 (Permanent)</option>
                        <option>302 (Temporary)</option>
                        <option>307 (Temporary)</option>
                        <option>308 (Permanent)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password Protection</label>
                      <Input placeholder="Optional password" type="password" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={3}
                      placeholder="Describe what this link is for..."
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      Cancel
                    </Button>
                    <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Static Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Empty State */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <LinkIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No static links created yet</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first static redirect link.</p>
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first static link
                  </Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* QR Link Section */}
            {activeSection === 'qr' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">QR codes</h1>
                  <p className="text-gray-600 mt-1">Start by creating your QR code.</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create QR
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* QR Code Creation Form */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Create QR Code</h3>
                  <p className="text-sm text-gray-600">Generate a QR code for your content</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Name</label>
                      <Input placeholder="My QR Code" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option>URL</option>
                        <option>Text</option>
                        <option>Email</option>
                        <option>Phone</option>
                        <option>WiFi</option>
                        <option>SMS</option>
                        <option>vCard</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <Input placeholder="https://example.com or your text content" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option>Small (100x100)</option>
                        <option>Medium (200x200)</option>
                        <option>Large (300x300)</option>
                        <option>Extra Large (500x500)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Error Correction</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option>Low (L)</option>
                        <option>Medium (M)</option>
                        <option>Quartile (Q)</option>
                        <option>High (H)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      Cancel
                    </Button>
                    <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate QR Code
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Empty State */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <QrCode className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No QR codes created yet</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first QR code.</p>
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first QR code
                  </Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Splash Link Section */}
            {activeSection === 'splash' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Splash pages link</h1>
                  <p className="text-gray-600 mt-1">Create splash page links</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create splash page
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Splash Page Creation Form */}
              <Card className="bg-white border-gray-200">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Create Splash Page</h3>
                  <p className="text-sm text-gray-600">Design a landing page for your content</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                      <Input placeholder="Welcome to My Page" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Page Type</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option>Coming Soon</option>
                        <option>Maintenance</option>
                        <option>Thank You</option>
                        <option>Custom</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                      <div className="flex space-x-2">
                        <input type="color" className="w-12 h-10 border border-gray-300 rounded" defaultValue="#3b82f6" />
                        <Input placeholder="#3b82f6" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                      <div className="flex space-x-2">
                        <input type="color" className="w-12 h-10 border border-gray-300 rounded" defaultValue="#ffffff" />
                        <Input placeholder="#ffffff" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL (Optional)</label>
                      <Input placeholder="https://example.com/logo.png" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Message</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={4}
                      placeholder="Enter your main message here..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Call to Action Button</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input placeholder="Button Text" />
                      <Input placeholder="Button URL" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      Cancel
                    </Button>
                    <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Splash Page
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Empty State */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Droplets className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No splash pages created yet</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first splash page.</p>
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create your first splash page
                  </Button>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Statistics Section */}
            {activeSection === 'statistics' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Links &gt; links_statistics.breadcrumb</h1>
                  <p className="text-gray-600 mt-1">View detailed analytics</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Calendar className="w-4 h-4 mr-2" />
                    29 Aug, 2025 - 28 Sep, 2025
                  </Button>
                </div>
              </div>

              {/* Analytics Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <Button variant="ghost" className="bg-white text-sky-600 shadow-sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Overview
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <List className="w-4 h-4 mr-2" />
                  Entries
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <Globe className="w-4 h-4 mr-2" />
                  Continent
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <Flag className="w-4 h-4 mr-2" />
                  Countries
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <Navigation className="w-4 h-4 mr-2" />
                  Cities
                </Button>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  <Share2 className="w-4 h-4 mr-2" />
                  Referrers
                </Button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6 text-center">
                    <Eye className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">1 Pageviews</div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6 text-center">
                    <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">1 Visitors</div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Area */}
              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Analytics chart will appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Tables */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Continents</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Europe</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-sky-500 rounded"></div>
                          <span className="text-sm font-medium">100%</span>
                          <span className="text-sm text-gray-500">1</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200">
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Countries</h3>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇷🇴</span>
                          <span className="text-gray-600">Romania</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-sky-500 rounded"></div>
                          <span className="text-sm font-medium">100%</span>
                          <span className="text-sm text-gray-500">1</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            )}

            {/* Custom Domains Section */}
            {activeSection === 'domain' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Custom Domains</h1>
                    <p className="text-gray-600 mt-1">Manage your custom domains and configure redirects</p>
                  </div>
                  <Button 
                    className="bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => {
                      const host = prompt('Enter domain host (e.g., example.com):');
                      if (host) {
                        const customIndexUrl = prompt('Enter custom index URL (optional):');
                        const customNotFoundUrl = prompt('Enter custom 404 URL (optional):');
                        apiCreateDomain(host, customIndexUrl || undefined, customNotFoundUrl || undefined);
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Domain
                  </Button>
                </div>

                <Card className="bg-white border-gray-200">
                  <CardContent className="p-6">
                    {loadingState.domains ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
                        <p className="text-gray-600 mt-2">Loading domains...</p>
                      </div>
                    ) : errors.domains ? (
                      <div className="text-center py-8">
                        <p className="text-red-600">{errors.domains}</p>
                      </div>
                    ) : domains.length > 0 ? (
                      <div className="space-y-4">
                        {domains.map((domain) => (
                          <div key={domain.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-green-600" />
                                  </div>
                                  <div>
                                    <h3 className="font-semibold text-gray-900">{domain.scheme}{domain.host}</h3>
                                    <p className="text-sm text-gray-600">
                                      {domain.is_enabled ? 'Enabled' : 'Disabled'} • Created {new Date(domain.datetime).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                                {domain.custom_index_url && (
                                  <div className="text-sm text-gray-600 mb-1">
                                    <span className="font-medium">Index URL:</span> {domain.custom_index_url}
                                  </div>
                                )}
                                {domain.custom_not_found_url && (
                                  <div className="text-sm text-gray-600">
                                    <span className="font-medium">404 URL:</span> {domain.custom_not_found_url}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newHost = prompt('Enter new domain host:', domain.host);
                                    if (newHost && newHost !== domain.host) {
                                      apiUpdateDomain(domain.id, { host: newHost });
                                    }
                                  }}
                                >
                                  <Settings className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this domain?')) {
                                      apiDeleteDomain(domain.id);
                                    }
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Globe className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No domains yet</h3>
                        <p className="text-gray-600 mb-4">Add your first custom domain to get started</p>
                        <Button 
                          className="bg-sky-500 hover:bg-sky-600 text-white"
                          onClick={() => {
                            const host = prompt('Enter domain host (e.g., example.com):');
                            if (host) {
                              const customIndexUrl = prompt('Enter custom index URL (optional):');
                              const customNotFoundUrl = prompt('Enter custom 404 URL (optional):');
                              apiCreateDomain(host, customIndexUrl || undefined, customNotFoundUrl || undefined);
                            }
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Your First Domain
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
            </div>
            )}

            {/* Projects Section */}
            {activeSection === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                  <p className="text-gray-600 mt-1">Organize your links into projects</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create project
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">There are no projects for now</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first project.</p>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Tracking Pixel Section */}
            {activeSection === 'trackingpixel' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tracking pixel</h1>
                  <p className="text-gray-600 mt-1">Track visitors with pixels</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create pixel
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Eye className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">There are no pixels for now</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first pixel.</p>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Custom Domain Section */}
            {activeSection === 'customdomain' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Custom domain</h1>
                  <p className="text-gray-600 mt-1">Connect your own domain</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Connect domain
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Globe className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">There are no custom domains added</h3>
                  <p className="text-gray-600 mb-6">Start by linking your first custom domain.</p>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Email Signature Section */}
            {activeSection === 'emailsignature' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Email signature</h1>
                  <p className="text-gray-600 mt-1">Create professional email signatures</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create signature
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Mail className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">There are no created signatures</h3>
                  <p className="text-gray-600 mb-6">Start by sending your first email signature.</p>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Notification Handlers Section */}
            {activeSection === 'notificationhandlers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Notification handlers</h1>
                  <p className="text-gray-600 mt-1">Manage notification settings</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create notification handler
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Bell className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">There are no notification handlers for now</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first notification handler.</p>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Payment Processors Section */}
            {activeSection === 'paymentprocessors' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Payment processors</h1>
                  <p className="text-gray-600 mt-1">Configure payment methods</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add payment processor
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No configured payment processors</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first payment processor.</p>
                </CardContent>
              </Card>
            </div>
            )}

            {/* AI Creation Section */}
            {activeSection === 'aicreation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI creation</h1>
                  <p className="text-gray-600 mt-1">AI-powered content creation</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Start AI creation
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* AI Creation Sub-sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* AI Documents */}
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Documents</h3>
                    <p className="text-sm text-gray-600 mb-4">Generate AI-written documents</p>
                    <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Document
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Images */}
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <File className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Images</h3>
                    <p className="text-sm text-gray-600 mb-4">Generate AI-created images</p>
                    <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Image
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Speech to Text */}
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Mic className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Speech to Text</h3>
                    <p className="text-sm text-gray-600 mb-4">Convert speech to text</p>
                    <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Start Transcription
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Text to Speech */}
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Volume2 className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Text to Speech</h3>
                    <p className="text-sm text-gray-600 mb-4">Convert text to speech</p>
                    <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Generate Speech
                    </Button>
                  </CardContent>
                </Card>

                {/* AI Chats */}
                <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Chats</h3>
                    <p className="text-sm text-gray-600 mb-4">Chat with AI assistants</p>
                    <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
            )}

            {/* Tools Section */}
            {activeSection === 'tools' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tools</h1>
                  <p className="text-gray-600 mt-1">Utility tools and features</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Tool
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Settings className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No tools available</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first tool.</p>
                </CardContent>
              </Card>
            </div>
            )}

            {/* Data Section */}
            {activeSection === 'data' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Collected Data</h1>
                  <p className="text-gray-600 mt-1">View and manage data collected from your bio links and forms</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  {loadingState.data ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading data...</p>
                      </div>
                  ) : errors.data ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{errors.data}</p>
                      </div>
                  ) : data.length > 0 ? (
                    <div className="space-y-4">
                      {data.map((datum) => (
                        <div key={datum.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Database className="w-5 h-5 text-blue-600" />
                    </div>
                                <div>
                                  <h3 className="font-semibold text-gray-900 capitalize">{datum.type} Data</h3>
                                  <p className="text-sm text-gray-600">
                                    Collected {new Date(datum.datetime).toLocaleDateString()} at {new Date(datum.datetime).toLocaleTimeString()}
                                  </p>
                  </div>
                              </div>
                              <div className="ml-13 space-y-1">
                                {Object.entries(datum.data).map(([key, value]) => (
                                  <div key={key} className="text-sm text-gray-600">
                                    <span className="font-medium capitalize">{key}:</span> {String(value)}
                                  </div>
                                ))}
                              </div>
                              <div className="ml-13 mt-2 text-xs text-gray-500">
                                <span className="font-medium">Link ID:</span> {datum.link_id} • 
                                <span className="font-medium ml-2">Project ID:</span> {datum.project_id} • 
                                <span className="font-medium ml-2">Block ID:</span> {datum.biolink_block_id}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this data entry?')) {
                                    apiDeleteDatum(datum.id);
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Database className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No data collected yet</h3>
                      <p className="text-gray-600 mb-4">Data will appear here when users interact with your bio links and forms</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            )}

            {/* QR Codes Section */}
            {activeSection === 'qrcodes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">QR Codes</h1>
                  <p className="text-gray-600 mt-1">Create and manage QR codes for your links and content</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create QR Code
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-6">
                  {loadingState.qrCodes ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto"></div>
                      <p className="text-gray-600 mt-2">Loading QR codes...</p>
                    </div>
                  ) : errors.qrCodes ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">{errors.qrCodes}</p>
                    </div>
                  ) : qrCodes.length > 0 ? (
                    <div className="space-y-4">
                      {qrCodes.map((qrCode) => (
                        <div key={qrCode.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                <img 
                                  src={qrCode.qr_code} 
                                  alt={`QR Code for ${qrCode.name}`}
                                  className="w-12 h-12 object-contain"
                                />
                      </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{qrCode.name}</h3>
                                <p className="text-sm text-gray-600 capitalize">{qrCode.type} QR Code</p>
                                <p className="text-sm text-gray-500">
                                  Created {new Date(qrCode.datetime).toLocaleDateString()}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge variant="outline" className="text-xs">
                                    {qrCode.settings.size}px
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {qrCode.settings.ecc} ECC
                                  </Badge>
                                  {qrCode.settings.url && (
                                    <Badge variant="outline" className="text-xs">
                                      URL
                                    </Badge>
                                  )}
                                  {qrCode.settings.text && (
                                    <Badge variant="outline" className="text-xs">
                                      Text
                                    </Badge>
                                  )}
                      </div>
                    </div>
                  </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Copy QR code URL to clipboard
                                  navigator.clipboard.writeText(qrCode.qr_code);
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Download QR code
                                  const link = document.createElement('a');
                                  link.href = qrCode.qr_code;
                                  link.download = `${qrCode.name}.svg`;
                                  link.click();
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Edit QR code
                                  // TODO: Implement edit functionality
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (confirm('Are you sure you want to delete this QR code?')) {
                                    apiDeleteQRCode(qrCode.id);
                                  }
                                }}
                                className="border-red-300 text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <QrCode className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No QR codes created yet</h3>
                      <p className="text-gray-600 mb-4">Create your first QR code to get started</p>
                      <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Create QR Code
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            )}

            {/* Customer Payments Section */}
            {activeSection === 'customerpayments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Customer payments</h1>
                  <p className="text-gray-600 mt-1">Manage customer payment processing</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button className="bg-sky-500 hover:bg-sky-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <Card className="bg-white border-gray-200">
                <CardContent className="p-12 text-center">
                  <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="text-left">
                        <div className="w-20 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded mb-2"></div>
                        <div className="w-24 h-2 bg-gray-300 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No payment methods configured</h3>
                  <p className="text-gray-600 mb-6">Start by adding your first payment method.</p>
                </CardContent>
              </Card>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 flex items-center justify-center relative">
                  <img 
                    src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png" 
                    alt="Droplink Logo" 
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <span className="text-xl font-bold text-sky-600">Droplink</span>
              </div>
              <p className="text-gray-600 text-sm">
                The complete link-in-bio platform for Pi Network creators. From custom profiles to Pi payments, analytics to templates.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-sky-600">
                  <Mail className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-sky-600">
                  <Globe className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Templates</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Analytics</a></li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-sky-600">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-sky-600">Contact</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">Get the latest updates and features.</p>
              <div className="flex">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="rounded-r-none border-gray-300"
                />
                <Button className="bg-sky-500 hover:bg-sky-600 text-white rounded-l-none">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              Copyright © 2025 Droplink. • Professional Link Management Platform
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-sky-600 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-600 hover:text-sky-600 text-sm">Terms of Service</a>
              <a href="#" className="text-gray-600 hover:text-sky-600 text-sm">Droplink.com</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white w-full max-w-md mx-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Create biolink page</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Name
                </label>
                <Input
                  placeholder="Enter page name"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short URL
                </label>
                <div className="flex">
                  <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-md border border-gray-300">
                    {window.location.origin}/@
                  </span>
                  <Input
                    placeholder="username"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              <Button
                onClick={handleCreateBiolink}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create biolink page
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create {selectedLinkType} Link</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowCreateModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
    </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const linkData = {
                type: selectedLinkType,
                title: formData.get('title') as string,
                url: formData.get('url') as string,
                description: formData.get('description') as string
              };
              await addLink(linkData);
              setShowCreateModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <Input 
                    name="title" 
                    placeholder="Enter link title" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL
                  </label>
                  <Input 
                    name="url" 
                    type="url" 
                    placeholder="https://example.com" 
                    required 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <Input 
                    name="description" 
                    placeholder="Enter description" 
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-sky-500 hover:bg-sky-600 text-white">
                    Create Link
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Block Modal */}
      {showAddBlockModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowAddBlockModal(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold">Add a new block</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowAddBlockModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Search Bar */}
              <div className="mb-6">
                <Input 
                  placeholder="Search blocks..." 
                  className="w-full"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <Button 
                  variant={activeBlockTab === 'standard' ? 'default' : 'ghost'}
                  className={activeBlockTab === 'standard' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
                  onClick={() => setActiveBlockTab('standard')}
                >
                  Standard
                </Button>
                <Button 
                  variant={activeBlockTab === 'advanced' ? 'default' : 'ghost'}
                  className={activeBlockTab === 'advanced' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
                  onClick={() => setActiveBlockTab('advanced')}
                >
                  Advanced
                </Button>
                <Button 
                  variant={activeBlockTab === 'payments' ? 'default' : 'ghost'}
                  className={activeBlockTab === 'payments' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
                  onClick={() => setActiveBlockTab('payments')}
                >
                  Payments
                </Button>
                <Button 
                  variant={activeBlockTab === 'embeds' ? 'default' : 'ghost'}
                  className={activeBlockTab === 'embeds' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}
                  onClick={() => setActiveBlockTab('embeds')}
                >
                  Embeds
                </Button>
              </div>

              {/* Category Headers */}
              {activeBlockTab === 'standard' && (
                <div className="mb-6">
                  <div className="bg-sky-100 p-4 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                        <Heart className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sky-800">Standard</h4>
                        <p className="text-sm text-sky-600">The base blocks to help you with your general needs.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeBlockTab === 'advanced' && (
                <div className="mb-6">
                  <div className="bg-purple-100 p-4 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Edit className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-purple-800">Advanced</h4>
                        <p className="text-sm text-purple-600">The blocks which help you achieve more complex functionality.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeBlockTab === 'payments' && (
                <div className="mb-6">
                  <div className="bg-green-100 p-4 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800">Payments</h4>
                        <p className="text-sm text-green-600">The blocks that help you get paid & make money.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeBlockTab === 'embeds' && (
                <div className="mb-6">
                  <div className="bg-pink-100 p-4 rounded-lg mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                        <File className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-pink-800">Embeds</h4>
                        <p className="text-sm text-pink-600">The blocks that help you integrate content from other websites.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Block Grid */}
              <div className="grid grid-cols-2 gap-4">
                {getBlocksByCategory(activeBlockTab).map((blockType) => {
                  const IconComponent = blockType.icon;
                  return (
                    <Button
                      key={blockType.id}
                      variant="outline"
                      className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-gray-50"
                      onClick={() => addBioLinkBlock(blockType.id)}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        <div className={`w-8 h-8 ${blockType.color} rounded-lg flex items-center justify-center`}>
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{blockType.name}</div>
                          <div className="text-xs text-gray-500">{blockType.description}</div>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Individual Block Modals */}
      {showBlockModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowBlockModal(false)}
        >
          <div 
            className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Link Button Modal */}
            {selectedBlockType === 'link' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a link button</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <LinkIcon className="w-4 h-4 inline mr-2" />
                      Destination URL
                    </label>
                    <Input 
                      placeholder="https://example.com/" 
                      defaultValue="https://example.com/"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4 inline mr-2" />
                      Name
                    </label>
                    <Input 
                      placeholder="Enter link name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Call to Action Button Modal */}
            {selectedBlockType === 'call-to-action' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a call to action button</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select onValueChange={(value) => setBlockModalData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                    <Input 
                      placeholder="Enter email address"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, email: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter button name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* File Block Modal */}
            {selectedBlockType === 'file' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a file block</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.pdf, .zip, .rar, .doc, .docx allowed. 10 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter file name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Audio File Modal */}
            {selectedBlockType === 'audio' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add an audio file</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audio file</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Volume2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.mp3, .m4a allowed. 5 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter audio name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Video File Modal */}
            {selectedBlockType === 'video' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a video file</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video file</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.mp4, .webm allowed. 200 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail image URL</label>
                    <Input 
                      placeholder="Enter thumbnail URL"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter video name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Big Link Button Modal */}
            {selectedBlockType === 'big-link' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a big link button</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
                    <Input 
                      placeholder="https://example.com/" 
                      defaultValue="https://example.com/"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter button name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={3}
                      placeholder="Enter description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Text List Modal */}
            {selectedBlockType === 'list' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <List className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a text list</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">List items</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={6}
                      placeholder="Write one item per line."
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, items: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Paragraph Modal */}
            {selectedBlockType === 'paragraph' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a paragraph</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                    <div className="border border-gray-300 rounded-md">
                      <div className="flex items-center space-x-2 p-2 border-b border-gray-200 bg-gray-50">
                        <Select>
                          <SelectTrigger className="w-24 h-8">
                            <SelectValue placeholder="Normal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="h1">H1</SelectItem>
                            <SelectItem value="h2">H2</SelectItem>
                            <SelectItem value="h3">H3</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Bold className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Italic className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Underline className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Strikethrough className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <AlignLeft className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <AlignCenter className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <AlignRight className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <AlignJustify className="w-4 h-4" />
                        </Button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <List className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <ListOrdered className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <LinkIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      <textarea 
                        className="w-full px-3 py-2 border-0 focus:outline-none focus:ring-0"
                        rows={8}
                        placeholder="Enter your text here..."
                        onChange={(e) => setBlockModalData(prev => ({ ...prev, text: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Heading Modal */}
            {selectedBlockType === 'heading' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Hash className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a heading</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">H Type</label>
                    <Select onValueChange={(value) => setBlockModalData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select heading type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="h1">H1</SelectItem>
                        <SelectItem value="h2">H2</SelectItem>
                        <SelectItem value="h3">H3</SelectItem>
                        <SelectItem value="h4">H4</SelectItem>
                        <SelectItem value="h5">H5</SelectItem>
                        <SelectItem value="h6">H6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                    <Input 
                      placeholder="Enter heading text"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, text: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Space Divider Modal */}
            {selectedBlockType === 'divider' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a space divider</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Margin top</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        defaultValue="4"
                        className="flex-1"
                        onChange={(e) => setBlockModalData(prev => ({ ...prev, marginTop: e.target.value }))}
                      />
                      <span className="text-sm font-medium text-gray-600 w-8">4</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Margin bottom</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        defaultValue="4"
                        className="flex-1"
                        onChange={(e) => setBlockModalData(prev => ({ ...prev, marginBottom: e.target.value }))}
                      />
                      <span className="text-sm font-medium text-gray-600 w-8">4</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Image Grid Modal */}
            {selectedBlockType === 'image-grid' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Grid3X3 className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add an image grid</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter grid name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.jpg, .jpeg, .png, .svg, .gif, .webp, .avif allowed. 10 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
                    <Input 
                      placeholder="https://example.com/"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Columns</label>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 bg-sky-500 text-white border-sky-500"
                        onClick={() => setBlockModalData(prev => ({ ...prev, columns: 2 }))}
                      >
                        2
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setBlockModalData(prev => ({ ...prev, columns: 3 }))}
                      >
                        3
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Social Links Modal */}
            {selectedBlockType === 'socials' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add social links</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                      <Input 
                        placeholder="2124567890"
                        onChange={(e) => setBlockModalData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label>
                      <div className="flex">
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-md border border-gray-300">facebook.com/</span>
                        <Input 
                          className="rounded-l-none"
                          placeholder="facebook-page"
                          onChange={(e) => setBlockModalData(prev => ({ ...prev, facebook: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label>
                      <div className="flex">
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-md border border-gray-300">instagram.com/</span>
                        <Input 
                          className="rounded-l-none"
                          placeholder="Instagram username"
                          onChange={(e) => setBlockModalData(prev => ({ ...prev, instagram: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                      <div className="flex">
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-md border border-gray-300">x.com/</span>
                        <Input 
                          className="rounded-l-none"
                          placeholder="Twitter username"
                          onChange={(e) => setBlockModalData(prev => ({ ...prev, twitter: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                      <div className="flex">
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-md border border-gray-300">linkedin.com/</span>
                        <Input 
                          className="rounded-l-none"
                          placeholder="Linked In Profile"
                          onChange={(e) => setBlockModalData(prev => ({ ...prev, linkedin: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Channel</label>
                      <div className="flex">
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-md border border-gray-300">youtube.com/</span>
                        <Input 
                          className="rounded-l-none"
                          placeholder="@username"
                          onChange={(e) => setBlockModalData(prev => ({ ...prev, youtube: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">TikTok</label>
                      <div className="flex">
                        <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-l-md border border-gray-300">tiktok.com/@</span>
                        <Input 
                          className="rounded-l-none"
                          placeholder="TikTok username"
                          onChange={(e) => setBlockModalData(prev => ({ ...prev, tiktok: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Avatar Modal */}
            {selectedBlockType === 'avatar' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add an avatar</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.jpg, .jpeg, .png, .svg, .gif, .webp, .avif allowed. 20 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <Select onValueChange={(value) => setBlockModalData(prev => ({ ...prev, size: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="50x50">50x50px</SelectItem>
                        <SelectItem value="75x75">75x75px</SelectItem>
                        <SelectItem value="100x100">100x100px</SelectItem>
                        <SelectItem value="150x150">150x150px</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Border Radius</label>
                    <Select onValueChange={(value) => setBlockModalData(prev => ({ ...prev, borderRadius: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select border radius" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="straight">Straight</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="circle">Circle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Business Hours Modal */}
            {selectedBlockType === 'business-hours' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add your business hours</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 max-h-96 overflow-y-auto space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Open 24/7</div>
                        <div className="text-sm text-gray-500">Mark as always open</div>
                      </div>
                      <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-end pr-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">Temporarily closed</div>
                        <div className="text-sm text-gray-500">Mark as temporarily closed</div>
                      </div>
                      <div className="w-12 h-6 bg-gray-300 rounded-full flex items-center justify-end pr-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <div key={day} className="flex items-center space-x-3">
                        <div className="w-20 text-sm font-medium text-gray-700">{day}</div>
                        <Input 
                          placeholder="10:00 - 18:00, Closed or 24 Hours"
                          className="flex-1"
                          onChange={(e) => setBlockModalData(prev => ({ ...prev, [day.toLowerCase()]: e.target.value }))}
                        />
                        <Clock className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional notice</label>
                    <Input 
                      placeholder="Enter additional notice"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, notice: e.target.value }))}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Image Modal */}
            {selectedBlockType === 'image' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <File className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add an image</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.jpg, .jpeg, .png, .svg, .gif, .webp, .avif allowed. 10 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
                    <Input 
                      placeholder="https://example.com/"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Advanced Block Modals */}

            {/* Markdown Modal */}
            {selectedBlockType === 'markdown' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a markdown block</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">biolink_link.markdown_text</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={8}
                      placeholder="Enter your markdown content here..."
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, content: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">biolink_link.markdown_text_help</p>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Image Slider Modal */}
            {selectedBlockType === 'image-slider' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Grid3X3 className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add an image slider block</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.jpg, .jpeg, .png, .svg, .gif, .webp, .avif allowed. 10 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image alt</label>
                    <Input 
                      placeholder="Enter image description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, alt: e.target.value }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Image description for accessibility & SEO purposes.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
                    <Input 
                      placeholder="https://example.com/"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Review Modal */}
            {selectedBlockType === 'review' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a review block</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input 
                      placeholder="Enter review title"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={4}
                      placeholder="Enter review description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.jpg, .jpeg, .png, .svg, .gif, .webp, .avif allowed. 10 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author name</label>
                    <Input 
                      placeholder="Enter author name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, authorName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author description</label>
                    <Input 
                      placeholder="Enter author description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, authorDescription: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stars</label>
                    <Input 
                      type="number"
                      min="1"
                      max="5"
                      defaultValue="5"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, stars: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Timeline Modal */}
            {selectedBlockType === 'timeline' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <List className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a Timeline feed</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input 
                      placeholder="Enter timeline title"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={4}
                      placeholder="Add a description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Input 
                      type="datetime-local"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" className="flex-1">
                      <X className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Create
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* YouTube Feed Modal */}
            {selectedBlockType === 'youtube-feed' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a YouTube feed</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Channel Id</label>
                    <Input 
                      placeholder="Enter YouTube Channel ID"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, channelId: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Countdown Timer Modal */}
            {selectedBlockType === 'countdown' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a countdown timer</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End date</label>
                    <Input 
                      type="datetime-local"
                      defaultValue="2025-09-28T07:35"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <Select onValueChange={(value) => setBlockModalData(prev => ({ ...prev, theme: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="colorful">Colorful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Payment Block Modals */}

            {/* PayPal Payment Modal */}
            {selectedBlockType === 'paypal' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a PayPal payment button</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <Select onValueChange={(value) => setBlockModalData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy-now">Buy now</SelectItem>
                        <SelectItem value="donate">Donate</SelectItem>
                        <SelectItem value="subscribe">Subscribe</SelectItem>
                        <SelectItem value="add-to-cart">Add to cart</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PayPal email</label>
                    <Input 
                      placeholder="Enter PayPal email address"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, paypalEmail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product title</label>
                    <Input 
                      placeholder="Enter product title"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, productTitle: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency code</label>
                    <Input 
                      placeholder="EUR"
                      defaultValue="EUR"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, currency: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <Input 
                      placeholder="Enter price"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter button name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Sell Service Modal */}
            {selectedBlockType === 'sell-service' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Sell a service</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter service name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Get Donations Modal */}
            {selectedBlockType === 'donations' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Get donations</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter donation campaign name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Sell Digital Product Modal */}
            {selectedBlockType === 'digital-product' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <File className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Sell a digital product</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter product name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Additional Block Modals */}

            {/* Coupon Code Modal */}
            {selectedBlockType === 'coupon-code' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a coupon code</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter coupon name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Coupon</label>
                    <Input 
                      placeholder="BF-30"
                      defaultValue="BF-30"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, coupon: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* External Item Modal */}
            {selectedBlockType === 'external-item' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add an external item</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter item name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <Input 
                      placeholder="Enter item description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <Input 
                      placeholder="20 USD"
                      defaultValue="20 USD"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, price: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Item URL</label>
                    <Input 
                      placeholder="https://example.com/"
                      defaultValue="https://example.com/"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Share Button Modal */}
            {selectedBlockType === 'share-button' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Share2 className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a share button</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
                    <Input 
                      placeholder="https://example.com/"
                      defaultValue="https://example.com/"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter button name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* VCard Modal */}
            {selectedBlockType === 'vcard' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add VCard</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter VCard name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Button Modal with Text Modal */}
            {selectedBlockType === 'button-modal-text' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a button modal with text</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter button name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Text</label>
                    <div className="border border-gray-300 rounded-md">
                      <div className="flex items-center space-x-2 p-2 border-b border-gray-200 bg-gray-50">
                        <Select>
                          <SelectTrigger className="w-24 h-8"><SelectValue placeholder="Normal" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="h1">H1</SelectItem>
                            <SelectItem value="h2">H2</SelectItem>
                            <SelectItem value="h3">H3</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Bold className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Italic className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Underline className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><Strikethrough className="w-4 h-4" /></Button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><AlignLeft className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><AlignCenter className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><AlignRight className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><AlignJustify className="w-4 h-4" /></Button>
                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><List className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><ListOrdered className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><LinkIcon className="w-4 h-4" /></Button>
                      </div>
                      <textarea className="w-full px-3 py-2 border-0 focus:outline-none focus:ring-0" rows={8} placeholder="Enter your text here..." onChange={(e) => setBlockModalData(prev => ({ ...prev, text: e.target.value }))} />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Sign Up Form Modal */}
            {selectedBlockType === 'signup-form' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a sign up form</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter form name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}


            {/* Video File Modal */}
            {selectedBlockType === 'video-file' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a video file</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Video file</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <Video className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.mp4, .webm allowed. 200 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail image URL</label>
                    <Input 
                      placeholder="Enter thumbnail URL"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, thumbnail: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter video name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* File Block Modal */}
            {selectedBlockType === 'file-block' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <File className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a file block</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <File className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <Button variant="outline" className="mb-2">Choose File</Button>
                      <p className="text-sm text-gray-500">No file chosen</p>
                      <p className="text-xs text-gray-400 mt-1">.pdf, .zip, .rar, .doc, .docx allowed. 10 MB maximum.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter file name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Big Link Button Modal */}
            {selectedBlockType === 'big-link-button' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <LinkIcon className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a big link button</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Destination URL</label>
                    <Input 
                      placeholder="https://example.com/"
                      defaultValue="https://example.com/"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, url: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <Input 
                      placeholder="Enter button name"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={3}
                      placeholder="Enter description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Text List Modal */}
            {selectedBlockType === 'text-list' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <List className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a text list</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">List items</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={6}
                      placeholder="Write one item per line"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, items: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Space Divider Modal */}
            {selectedBlockType === 'space-divider' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Minus className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a space divider</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Margin top</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        defaultValue="4"
                        className="flex-1"
                        onChange={(e) => setBlockModalData(prev => ({ ...prev, marginTop: e.target.value }))}
                      />
                      <span className="text-sm text-gray-600">4</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Margin bottom</label>
                    <div className="flex items-center space-x-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="10" 
                        defaultValue="4"
                        className="flex-1"
                        onChange={(e) => setBlockModalData(prev => ({ ...prev, marginBottom: e.target.value }))}
                      />
                      <span className="text-sm text-gray-600">4</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Phone Collector Modal */}
            {selectedBlockType === 'phone-collector' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add a phone collector</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input 
                      placeholder="Enter title"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={3}
                      placeholder="Enter description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}

            {/* Email Collector Modal */}
            {selectedBlockType === 'email-collector' && (
              <>
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold">Add an email collector</h3>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowBlockModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <Input 
                      placeholder="Enter title"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                      rows={3}
                      placeholder="Enter description"
                      onChange={(e) => setBlockModalData(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Info className="w-4 h-4" />
                    <span>All customization options available after creation.</span>
                  </div>
                  <Button 
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white"
                    onClick={() => createBioLinkBlock(blockModalData)}
                  >
                    Create block
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Theme Selection Modal - Full Screen */}
      {showThemeModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowThemeModal(false)}
        >
          <div
            className="bg-white w-full h-full max-w-none max-h-none rounded-none overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold">Select a theme</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowThemeModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 h-full overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {themePresets.map((theme) => (
                  <div
                    key={theme.id}
                    className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-200 hover:scale-105 ${
                      selectedTheme === theme.id ? 'ring-2 ring-sky-500' : ''
                    }`}
                    onClick={() => selectTheme(theme.id)}
                  >
                    <div
                      className="h-32 w-full"
                      style={{ background: theme.background }}
                    >
                      <div className="p-4 h-full flex flex-col justify-between">
                        <div className="text-white font-bold text-sm">mrwain</div>
                        <div className="text-white text-xs opacity-80">This is a sample description.</div>
                        <div className="space-y-1">
                          <div className={`${theme.buttonStyle} text-xs`}>Barcelona</div>
                          <div className={`${theme.buttonStyle} text-xs`}>Paris</div>
                          <div className={`${theme.buttonStyle} text-xs`}>Tokyo</div>
                        </div>
                        <div className="flex space-x-2">
                          <div className={`w-4 h-4 ${theme.socialIcons}`}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            </svg>
                          </div>
                          <div className={`w-4 h-4 ${theme.socialIcons}`}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                            </svg>
                          </div>
                          <div className={`w-4 h-4 ${theme.socialIcons}`}>
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <div className="font-medium text-sm text-gray-900">{theme.name}</div>
                      {selectedTheme === theme.id && (
                        <div className="text-xs text-sky-600 mt-1">Selected</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customizations Modal */}
      {showCustomizationsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowCustomizationsModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Pen className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold">Customizations</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomizationsModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-8">
                {/* Background Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Background</h4>
                  
                  {/* Background Type Selection */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      <button
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          customizations.background.type === 'gradient'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          background: { ...prev.background, type: 'gradient' }
                        }))}
                      >
                        Simple gradients
                      </button>
                      <button
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          customizations.background.type === 'abstract'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          background: { ...prev.background, type: 'abstract' }
                        }))}
                      >
                        Abstract gradients
                      </button>
                      <button
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          customizations.background.type === 'color'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          background: { ...prev.background, type: 'color' }
                        }))}
                      >
                        Custom color
                      </button>
                      <button
                        className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                          customizations.background.type === 'image'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          background: { ...prev.background, type: 'image' }
                        }))}
                      >
                        Custom image/video
                      </button>
                    </div>
                  </div>

                  {/* Gradient Presets */}
                  {customizations.background.type === 'gradient' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gradient Presets
                      </label>
                      <div className="grid grid-cols-6 gap-2">
                        {[
                          'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                          'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
                          'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                          'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)',
                          'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                          'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                          'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                          'linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%)',
                          'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                          'linear-gradient(135deg, #ff9a56 0%, #ff6b6b 100%)'
                        ].map((gradient, index) => (
                          <div
                            key={index}
                            className={`w-12 h-12 rounded-lg cursor-pointer border-2 transition-all hover:scale-105 ${
                              customizations.background.gradient === gradient
                                ? 'border-blue-500 ring-2 ring-blue-200'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ background: gradient }}
                            onClick={() => setCustomizations(prev => ({
                              ...prev,
                              background: { ...prev.background, gradient }
                            }))}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Background Attachment */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Background attachment
                    </label>
                    <div className="flex space-x-2">
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          customizations.background.attachment === 'scroll'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          background: { ...prev.background, attachment: 'scroll' }
                        }))}
                      >
                        Scroll
                      </button>
                      <button
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          customizations.background.attachment === 'fixed'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          background: { ...prev.background, attachment: 'fixed' }
                        }))}
                      >
                        Fixed
                      </button>
                    </div>
                  </div>

                  {/* Background Effects */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background blur: {customizations.background.blur}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={customizations.background.blur}
                        onChange={(e) => setCustomizations(prev => ({
                          ...prev,
                          background: { ...prev.background, blur: parseInt(e.target.value) }
                        }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Background brightness: {customizations.background.brightness}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={customizations.background.brightness}
                        onChange={(e) => setCustomizations(prev => ({
                          ...prev,
                          background: { ...prev.background, brightness: parseInt(e.target.value) }
                        }))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Font Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Font</h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Family
                    </label>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {[
                        'Lato', 'Arial', 'Inter', 'Karla', 'Impact', 'Monaco',
                        'Roboto', 'Tahoma', 'Courier', 'Default', 'Georgia', 'Papyrus',
                        'Verdana', 'Luminari', 'Helvetica', 'Open Sans', 'Montserrat', 'Baskerville',
                        'Courier New', 'Inconsolata', 'Trebuchet MS', 'Comic Sans MS', 'Brush Script MT', 'Times New Roman'
                      ].map((font) => (
                        <button
                          key={font}
                          className={`p-2 rounded text-sm font-medium transition-colors ${
                            customizations.font.family === font
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          style={{ fontFamily: font }}
                          onClick={() => setCustomizations(prev => ({
                            ...prev,
                            font: { ...prev.font, family: font }
                          }))}
                        >
                          {font}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Font Size: {customizations.font.size}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="32"
                      value={customizations.font.size}
                      onChange={(e) => setCustomizations(prev => ({
                        ...prev,
                        font: { ...prev.font, size: parseInt(e.target.value) }
                      }))}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Layout Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Layout</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'small', label: 'Small' },
                          { value: 'medium', label: 'Medium' },
                          { value: 'large', label: 'Large' },
                          { value: 'extra-large', label: 'Extra Large' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            className={`w-full p-2 rounded text-sm font-medium transition-colors ${
                              customizations.layout.width === option.value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setCustomizations(prev => ({
                              ...prev,
                              layout: { ...prev.layout, width: option.value as any }
                            }))}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        The width of the main content. This setting only applies to wide device screens.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Block height spacing
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'small', label: 'Small' },
                          { value: 'medium', label: 'Medium' },
                          { value: 'large', label: 'Large' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            className={`w-full p-2 rounded text-sm font-medium transition-colors ${
                              customizations.layout.blockSpacing === option.value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setCustomizations(prev => ({
                              ...prev,
                              layout: { ...prev.layout, blockSpacing: option.value as any }
                            }))}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Block hover animation
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'none', label: 'None' },
                          { value: 'smooth', label: 'Smooth' },
                          { value: 'instant', label: 'Instant' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            className={`w-full p-2 rounded text-sm font-medium transition-colors ${
                              customizations.layout.hoverAnimation === option.value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            onClick={() => setCustomizations(prev => ({
                              ...prev,
                              layout: { ...prev.layout, hoverAnimation: option.value as any }
                            }))}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Features</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium">Verified badge</div>
                          <div className="text-sm text-gray-500">Add a verified badge to your profile</div>
                        </div>
                      </div>
                      <button
                        className={`w-12 h-6 rounded-full transition-colors ${
                          customizations.features.verifiedBadge ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          features: { ...prev.features, verifiedBadge: !prev.features.verifiedBadge }
                        }))}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          customizations.features.verifiedBadge ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <X className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-500">Branding</div>
                          <div className="text-sm text-gray-500">Remove branding from your bio link</div>
                        </div>
                      </div>
                      <button
                        className={`w-12 h-6 rounded-full transition-colors ${
                          customizations.features.branding ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          features: { ...prev.features, branding: !prev.features.branding }
                        }))}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          customizations.features.branding ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Eye className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium">Pixels</div>
                          <div className="text-sm text-gray-500">Add tracking pixels to your bio link</div>
                        </div>
                      </div>
                      <button
                        className={`w-12 h-6 rounded-full transition-colors ${
                          customizations.features.pixels ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          features: { ...prev.features, pixels: !prev.features.pixels }
                        }))}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          customizations.features.pixels ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Hash className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium">UTM Parameters</div>
                          <div className="text-sm text-gray-500">Add UTM parameters to your links</div>
                        </div>
                      </div>
                      <button
                        className={`w-12 h-6 rounded-full transition-colors ${
                          customizations.features.utmParameters ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          features: { ...prev.features, utmParameters: !prev.features.utmParameters }
                        }))}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          customizations.features.utmParameters ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Shield className="w-5 h-5 text-gray-600" />
                        <div>
                          <div className="font-medium">Protection</div>
                          <div className="text-sm text-gray-500">Add password protection to your bio link</div>
                        </div>
                      </div>
                      <button
                        className={`w-12 h-6 rounded-full transition-colors ${
                          customizations.features.protection ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                        onClick={() => setCustomizations(prev => ({
                          ...prev,
                          features: { ...prev.features, protection: !prev.features.protection }
                        }))}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          customizations.features.protection ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <Button
                  onClick={() => {
                    setShowCustomizationsModal(false);
                    toast({
                      title: "Customizations Applied",
                      description: "Your bio link customizations have been saved successfully.",
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Customizations
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Verified Badge Modal */}
      {showVerifiedBadgeModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowVerifiedBadgeModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold">Verified Badge</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVerifiedBadgeModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Verified Badge</div>
                  <div className="text-sm text-gray-500">Add a verified badge to your bio link</div>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    verifiedBadgeSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setVerifiedBadgeSettings(prev => ({
                    ...prev,
                    enabled: !prev.enabled
                  }))}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    verifiedBadgeSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {verifiedBadgeSettings.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Badge Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
                        { value: 'green', label: 'Green', color: 'bg-green-500' },
                        { value: 'gold', label: 'Gold', color: 'bg-yellow-500' }
                      ].map((badge) => (
                        <button
                          key={badge.value}
                          className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                            verifiedBadgeSettings.badgeType === badge.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          onClick={() => setVerifiedBadgeSettings(prev => ({
                            ...prev,
                            badgeType: badge.value as any
                          }))}
                        >
                          <div className={`w-4 h-4 ${badge.color} rounded-full mx-auto mb-1`}></div>
                          {badge.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'top-right', label: 'Top Right' },
                        { value: 'top-left', label: 'Top Left' },
                        { value: 'bottom-right', label: 'Bottom Right' },
                        { value: 'bottom-left', label: 'Bottom Left' }
                      ].map((position) => (
                        <button
                          key={position.value}
                          className={`p-2 rounded text-sm font-medium transition-colors ${
                            verifiedBadgeSettings.position === position.value
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          onClick={() => setVerifiedBadgeSettings(prev => ({
                            ...prev,
                            position: position.value as any
                          }))}
                        >
                          {position.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowVerifiedBadgeModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowVerifiedBadgeModal(false);
                    toast({
                      title: "Verified Badge Updated",
                      description: "Your verified badge settings have been saved.",
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branding Modal */}
      {showBrandingModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowBrandingModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold">Branding</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBrandingModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Display Branding</div>
                  <div className="text-sm text-gray-500">Show custom branding on your bio link</div>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    brandingSettings.displayBranding ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setBrandingSettings(prev => ({
                    ...prev,
                    displayBranding: !prev.displayBranding
                  }))}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    brandingSettings.displayBranding ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {brandingSettings.displayBranding && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branding Name
                    </label>
                    <Input
                      placeholder="Enter your branding name"
                      value={brandingSettings.brandingName}
                      onChange={(e) => setBrandingSettings(prev => ({
                        ...prev,
                        brandingName: e.target.value
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branding URL
                    </label>
                    <Input
                      placeholder="https://example.com/"
                      value={brandingSettings.brandingUrl}
                      onChange={(e) => setBrandingSettings(prev => ({
                        ...prev,
                        brandingUrl: e.target.value
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Text Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={brandingSettings.textColor}
                        onChange={(e) => setBrandingSettings(prev => ({
                          ...prev,
                          textColor: e.target.value
                        }))}
                        className="w-12 h-10 rounded border border-gray-300"
                      />
                      <Input
                        value={brandingSettings.textColor}
                        onChange={(e) => setBrandingSettings(prev => ({
                          ...prev,
                          textColor: e.target.value
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Logo Upload
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="logo-upload"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setBrandingSettings(prev => ({
                              ...prev,
                              logo: file
                            }));
                          }
                        }}
                      />
                      <label htmlFor="logo-upload" className="cursor-pointer">
                        <div className="text-gray-500">
                          <Upload className="w-8 h-8 mx-auto mb-2" />
                          <p>Click to upload logo</p>
                          <p className="text-xs">PNG, JPG, SVG up to 5MB</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowBrandingModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowBrandingModal(false);
                    toast({
                      title: "Branding Updated",
                      description: "Your branding settings have been saved.",
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pixels Modal */}
      {showPixelsModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowPixelsModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold">Tracking Pixels</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPixelsModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Tracking Pixels</div>
                  <div className="text-sm text-gray-500">Add tracking pixels to monitor your bio link performance</div>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    pixelsSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setPixelsSettings(prev => ({
                    ...prev,
                    enabled: !prev.enabled
                  }))}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    pixelsSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {pixelsSettings.enabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Add New Pixel</div>
                      <div className="text-sm text-gray-500">Add tracking pixels from Facebook, Google, etc.</div>
                    </div>
                    <Button
                      onClick={() => {
                        const newPixel = {
                          id: Date.now(),
                          name: '',
                          code: '',
                          platform: 'facebook'
                        };
                        setPixelsSettings(prev => ({
                          ...prev,
                          pixels: [...prev.pixels, newPixel]
                        }));
                      }}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Pixel
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {pixelsSettings.pixels.map((pixel, index) => (
                      <div key={pixel.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="font-medium">Pixel {index + 1}</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPixelsSettings(prev => ({
                              ...prev,
                              pixels: prev.pixels.filter(p => p.id !== pixel.id)
                            }))}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Pixel Name
                            </label>
                            <Input
                              placeholder="e.g., Facebook Pixel"
                              value={pixel.name}
                              onChange={(e) => {
                                const updatedPixels = [...pixelsSettings.pixels];
                                updatedPixels[index].name = e.target.value;
                                setPixelsSettings(prev => ({
                                  ...prev,
                                  pixels: updatedPixels
                                }));
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Platform
                            </label>
                            <Select
                              value={pixel.platform}
                              onValueChange={(value) => {
                                const updatedPixels = [...pixelsSettings.pixels];
                                updatedPixels[index].platform = value;
                                setPixelsSettings(prev => ({
                                  ...prev,
                                  pixels: updatedPixels
                                }));
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="facebook">Facebook</SelectItem>
                                <SelectItem value="google">Google Analytics</SelectItem>
                                <SelectItem value="google-ads">Google Ads</SelectItem>
                                <SelectItem value="twitter">Twitter</SelectItem>
                                <SelectItem value="linkedin">LinkedIn</SelectItem>
                                <SelectItem value="tiktok">TikTok</SelectItem>
                                <SelectItem value="pinterest">Pinterest</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pixel Code
                          </label>
                          <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            placeholder="Paste your pixel code here..."
                            value={pixel.code}
                            onChange={(e) => {
                              const updatedPixels = [...pixelsSettings.pixels];
                              updatedPixels[index].code = e.target.value;
                              setPixelsSettings(prev => ({
                                ...prev,
                                pixels: updatedPixels
                              }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowPixelsModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowPixelsModal(false);
                    toast({
                      title: "Pixels Updated",
                      description: "Your tracking pixels have been saved.",
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UTM Parameters Modal */}
      {showUTMModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowUTMModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold">UTM Parameters</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUTMModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable UTM Parameters</div>
                  <div className="text-sm text-gray-500">Add UTM parameters to track your bio link performance</div>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    utmSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setUtmSettings(prev => ({
                    ...prev,
                    enabled: !prev.enabled
                  }))}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    utmSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {utmSettings.enabled && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <Input
                      placeholder="ex: newsletter, bing, google, youtube"
                      value={utmSettings.source}
                      onChange={(e) => setUtmSettings(prev => ({
                        ...prev,
                        source: e.target.value
                      }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">The referrer (e.g., google, newsletter)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medium
                    </label>
                    <Input
                      placeholder="ex: link, banner, email, social"
                      value={utmSettings.medium}
                      onChange={(e) => setUtmSettings(prev => ({
                        ...prev,
                        medium: e.target.value
                      }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Marketing medium (e.g., cpc, banner, email)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Campaign
                    </label>
                    <Input
                      placeholder="ex: spring_sale"
                      value={utmSettings.campaign}
                      onChange={(e) => setUtmSettings(prev => ({
                        ...prev,
                        campaign: e.target.value
                      }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Campaign name (e.g., spring_sale)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Term (Optional)
                    </label>
                    <Input
                      placeholder="ex: running shoes"
                      value={utmSettings.term}
                      onChange={(e) => setUtmSettings(prev => ({
                        ...prev,
                        term: e.target.value
                      }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Identify paid search keywords</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content (Optional)
                    </label>
                    <Input
                      placeholder="ex: logolink, textlink"
                      value={utmSettings.content}
                      onChange={(e) => setUtmSettings(prev => ({
                        ...prev,
                        content: e.target.value
                      }))}
                    />
                    <p className="text-xs text-gray-500 mt-1">Differentiate similar content or links</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-2">UTM Preview</div>
                    <div className="text-xs text-gray-600 font-mono">
                      {utmSettings.source && utmSettings.medium && utmSettings.campaign ? (
                        `?utm_source=${utmSettings.source}&utm_medium=${utmSettings.medium}&utm_campaign=${utmSettings.campaign}${utmSettings.term ? `&utm_term=${utmSettings.term}` : ''}${utmSettings.content ? `&utm_content=${utmSettings.content}` : ''}`
                      ) : (
                        'None'
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      This query parameter will be appended to your destination URL.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowUTMModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowUTMModal(false);
                    toast({
                      title: "UTM Parameters Updated",
                      description: "Your UTM parameters have been saved.",
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Protection Modal */}
      {showProtectionModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowProtectionModal(false)}
        >
          <div
            className="bg-white rounded-lg w-full max-w-lg mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-gray-600" />
                <h3 className="text-xl font-semibold">Protection</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProtectionModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Protection</div>
                  <div className="text-sm text-gray-500">Add security features to your bio link</div>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    protectionSettings.enabled ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                  onClick={() => setProtectionSettings(prev => ({
                    ...prev,
                    enabled: !prev.enabled
                  }))}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    protectionSettings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {protectionSettings.enabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Require Password</div>
                      <div className="text-sm text-gray-500">Protect your bio link with a password</div>
                    </div>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        protectionSettings.requirePassword ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onClick={() => setProtectionSettings(prev => ({
                        ...prev,
                        requirePassword: !prev.requirePassword
                      }))}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        protectionSettings.requirePassword ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {protectionSettings.requirePassword && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                      </label>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        value={protectionSettings.password}
                        onChange={(e) => setProtectionSettings(prev => ({
                          ...prev,
                          password: e.target.value
                        }))}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Block Bots</div>
                      <div className="text-sm text-gray-500">Prevent automated access to your bio link</div>
                    </div>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        protectionSettings.blockBots ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onClick={() => setProtectionSettings(prev => ({
                        ...prev,
                        blockBots: !prev.blockBots
                      }))}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        protectionSettings.blockBots ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Allow Specific Domains</div>
                      <div className="text-sm text-gray-500">Restrict access to specific domains only</div>
                    </div>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        protectionSettings.allowSpecificDomains ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onClick={() => setProtectionSettings(prev => ({
                        ...prev,
                        allowSpecificDomains: !prev.allowSpecificDomains
                      }))}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                        protectionSettings.allowSpecificDomains ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  {protectionSettings.allowSpecificDomains && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Allowed Domains
                      </label>
                      <div className="space-y-2">
                        {protectionSettings.allowedDomains.map((domain, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Input
                              placeholder="example.com"
                              value={domain}
                              onChange={(e) => {
                                const updatedDomains = [...protectionSettings.allowedDomains];
                                updatedDomains[index] = e.target.value;
                                setProtectionSettings(prev => ({
                                  ...prev,
                                  allowedDomains: updatedDomains
                                }));
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setProtectionSettings(prev => ({
                                ...prev,
                                allowedDomains: prev.allowedDomains.filter((_, i) => i !== index)
                              }))}
                            >
                              <X className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setProtectionSettings(prev => ({
                            ...prev,
                            allowedDomains: [...prev.allowedDomains, '']
                          }))}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Domain
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowProtectionModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowProtectionModal(false);
                    toast({
                      title: "Protection Updated",
                      description: "Your protection settings have been saved.",
                    });
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkrMeStyleDashboard;