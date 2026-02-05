import { supabase } from '@/integrations/supabase/client';

export type AdvancedLinkType = 
  | 'music' 
  | 'video' 
  | 'file' 
  | 'contact' 
  | 'event' 
  | 'product' 
  | 'social_embed'
  | 'form'
  | 'gallery'
  | 'location';

export interface MusicLink {
  id: string;
  type: 'music';
  title: string;
  url: string;
  platform: 'spotify' | 'apple_music' | 'soundcloud' | 'youtube_music' | 'deezer';
  trackId?: string;
  albumId?: string;
  artistId?: string;
  previewUrl?: string;
  thumbnail?: string;
  duration?: number;
  isExplicit?: boolean;
}

export interface VideoLink {
  id: string;
  type: 'video';
  title: string;
  url: string;
  platform: 'youtube' | 'tiktok' | 'instagram' | 'vimeo' | 'twitch';
  videoId?: string;
  thumbnail?: string;
  duration?: number;
  views?: number;
  likes?: number;
  isLive?: boolean;
  embedUrl?: string;
}

export interface FileLink {
  id: string;
  type: 'file';
  title: string;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  downloadCount: number;
  isPasswordProtected: boolean;
  expiresAt?: string;
  maxDownloads?: number;
}

export interface ContactLink {
  id: string;
  type: 'contact';
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  website?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  avatar?: string;
  vcardUrl?: string;
}

export interface EventLink {
  id: string;
  type: 'event';
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  timezone: string;
  location?: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  isVirtual: boolean;
  virtualUrl?: string;
  price?: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  maxAttendees?: number;
  registrationUrl?: string;
  calendarUrls?: {
    google?: string;
    outlook?: string;
    ical?: string;
  };
}

export interface ProductLink {
  id: string;
  type: 'product';
  title: string;
  description: string;
  price: {
    amount: number;
    currency: string;
    isOnSale: boolean;
    originalPrice?: number;
    salePrice?: number;
  };
  images: string[];
  category: string;
  tags: string[];
  inStock: boolean;
  stockQuantity?: number;
  sku?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  shippingInfo?: {
    freeShipping: boolean;
    shippingCost?: number;
    estimatedDelivery: string;
  };
  sellerInfo?: {
    name: string;
    email: string;
    phone?: string;
    website?: string;
  };
}

export interface SocialEmbedLink {
  id: string;
  type: 'social_embed';
  title: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'linkedin' | 'tiktok';
  embedCode: string;
  postId: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  content: {
    text?: string;
    images?: string[];
    video?: string;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  publishedAt: string;
}

export interface FormLink {
  id: string;
  type: 'form';
  title: string;
  description: string;
  fields: Array<{
    id: string;
    type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox' | 'radio';
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
    validation?: {
      minLength?: number;
      maxLength?: number;
      pattern?: string;
    };
  }>;
  submitAction: {
    type: 'email' | 'webhook' | 'database';
    email?: string;
    webhookUrl?: string;
    successMessage: string;
    redirectUrl?: string;
  };
  isActive: boolean;
  submissions: number;
}

export interface GalleryLink {
  id: string;
  type: 'gallery';
  title: string;
  description: string;
  images: Array<{
    id: string;
    url: string;
    thumbnail: string;
    alt: string;
    caption?: string;
    order: number;
  }>;
  layout: 'grid' | 'masonry' | 'carousel' | 'slideshow';
  showCaptions: boolean;
  allowDownload: boolean;
  isPublic: boolean;
}

export interface LocationLink {
  id: string;
  type: 'location';
  title: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  placeId?: string;
  businessHours?: Array<{
    day: string;
    open: string;
    close: string;
    isClosed: boolean;
  }>;
  contactInfo?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  amenities?: string[];
  photos?: string[];
  rating?: number;
  reviews?: number;
}

export type AdvancedLink = 
  | MusicLink 
  | VideoLink 
  | FileLink 
  | ContactLink 
  | EventLink 
  | ProductLink 
  | SocialEmbedLink 
  | FormLink 
  | GalleryLink 
  | LocationLink;

class AdvancedLinkTypesService {
  private static instance: AdvancedLinkTypesService;

  public static getInstance(): AdvancedLinkTypesService {
    if (!AdvancedLinkTypesService.instance) {
      AdvancedLinkTypesService.instance = new AdvancedLinkTypesService();
    }
    return AdvancedLinkTypesService.instance;
  }

  public async createAdvancedLink(
    userId: string,
    linkData: AdvancedLink
  ): Promise<{ success: boolean; data?: AdvancedLink; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('advanced_links')
        .insert({
          user_id: userId,
          link_id: linkData.id,
          type: linkData.type,
          data: linkData,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, data: linkData };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getAdvancedLinks(
    userId: string,
    type?: AdvancedLinkType
  ): Promise<{ success: boolean; data?: AdvancedLink[]; error?: string }> {
    try {
      let query = supabase
        .from('advanced_links')
        .select('*')
        .eq('user_id', userId);

      if (type) {
        query = query.eq('type', type);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        return { success: false, error: error.message };
      }

      const advancedLinks = data?.map(item => item.data as AdvancedLink) || [];
      return { success: true, data: advancedLinks };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateAdvancedLink(
    linkId: string,
    updates: Partial<AdvancedLink>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('advanced_links')
        .update({ 
          data: updates,
          updated_at: new Date().toISOString()
        })
        .eq('link_id', linkId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async deleteAdvancedLink(linkId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('advanced_links')
        .delete()
        .eq('link_id', linkId);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Platform-specific helpers
  public extractSpotifyId(url: string): string | null {
    const match = url.match(/spotify\.com\/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  public extractYouTubeId(url: string): string | null {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }

  public extractTikTokId(url: string): string | null {
    const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    return match ? match[1] : null;
  }

  public generateVCard(contact: ContactLink): string {
    const vcard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${contact.firstName} ${contact.lastName}`,
      `N:${contact.lastName};${contact.firstName};;;`,
      `EMAIL:${contact.email}`,
      contact.phone ? `TEL:${contact.phone}` : '',
      contact.company ? `ORG:${contact.company}` : '',
      contact.jobTitle ? `TITLE:${contact.jobTitle}` : '',
      contact.website ? `URL:${contact.website}` : '',
      contact.address ? `ADR:;;${contact.address.street};${contact.address.city};${contact.address.state};${contact.address.zipCode};${contact.address.country}` : '',
      'END:VCARD'
    ].filter(line => line !== '').join('\n');

    return vcard;
  }

  public generateCalendarEvent(event: EventLink): { google: string; outlook: string; ical: string } {
    const startDate = new Date(event.startDate);
    const endDate = event.endDate ? new Date(event.endDate) : new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDate(startDate)}/${formatDate(endDate)}&details=${encodeURIComponent(event.description)}`;
    
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${startDate.toISOString()}&enddt=${endDate.toISOString()}&body=${encodeURIComponent(event.description)}`;

    const ical = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Droplink//Event//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@droplink.com`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description}`,
      event.location ? `LOCATION:${event.location.name || event.location.address}` : '',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');

    return {
      google: googleUrl,
      outlook: outlookUrl,
      ical: ical
    };
  }
}

export const advancedLinkTypesService = AdvancedLinkTypesService.getInstance();
