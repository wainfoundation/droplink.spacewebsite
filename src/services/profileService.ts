import { supabase } from '@/integrations/supabase/client';
import { DOMAIN_CONFIG } from '@/config/domain';

export interface Profile {
  id: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: string;
  custom_colors?: {
    primary: string;
    secondary: string;
    background: string;
    text?: string;
    accent?: string;
  };
  template?: string;
  is_verified?: boolean;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Link {
  id: string;
  user_id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  clicks: number;
  type?: 'link' | 'tip' | 'product' | 'contact' | 'social';
  created_at?: string;
  updated_at?: string;
}

export interface ProfileStats {
  total_views: number;
  total_clicks: number;
  total_links: number;
}

export class ProfileService {
  // Get profile by username
  static async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Profile not found
        }
        console.warn('Profile fetch error:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Get profile by ID
  static async getProfileById(id: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null;
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  // Get links for a profile
  static async getProfileLinks(userId: string): Promise<Link[]> {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching links:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching links:', error);
      return [];
    }
  }

  // Get profile stats
  static async getProfileStats(profileId: string): Promise<ProfileStats> {
    try {
      const { data, error } = await supabase
        .rpc('get_profile_stats', { profile_uuid: profileId });

      if (error) {
        console.error('Error fetching profile stats:', error);
        return {
          total_views: 0,
          total_clicks: 0,
          total_links: 0
        };
      }

      return data || {
        total_views: 0,
        total_clicks: 0,
        total_links: 0
      };
    } catch (error) {
      console.error('Error fetching profile stats:', error);
      return {
        total_views: 0,
        total_clicks: 0,
        total_links: 0
      };
    }
  }

  // Track profile view
  static async trackProfileView(profileId: string, metadata?: {
    userAgent?: string;
    referrer?: string;
    ipAddress?: string;
  }): Promise<void> {
    try {
      const { error } = await supabase
        .from('profile_views')
        .insert({
          profile_id: profileId,
          user_agent: metadata?.userAgent,
          referrer: metadata?.referrer,
          ip_address: metadata?.ipAddress
        });

      if (error) {
        console.warn('Error tracking profile view:', error);
      }
    } catch (error) {
      console.warn('Error tracking profile view:', error);
    }
  }

  // Track link click
  static async trackLinkClick(linkId: string, metadata?: {
    userAgent?: string;
    referrer?: string;
    ipAddress?: string;
  }): Promise<void> {
    try {
      // Insert click tracking
      const { error: clickError } = await supabase
        .from('link_clicks')
        .insert({
          link_id: linkId,
          user_agent: metadata?.userAgent,
          referrer: metadata?.referrer,
          ip_address: metadata?.ipAddress
        });

      if (clickError) {
        console.warn('Error tracking link click:', clickError);
      }

      // Update click count
      const { error: updateError } = await supabase
        .from('links')
        .update({ clicks: supabase.raw('clicks + 1') })
        .eq('id', linkId);

      if (updateError) {
        console.warn('Error updating click count:', updateError);
      }
    } catch (error) {
      console.warn('Error tracking link click:', error);
    }
  }

  // Create new profile
  static async createProfile(profileData: {
    username: string;
    display_name?: string;
    bio?: string;
    avatar_url?: string;
    theme?: string;
    custom_colors?: any;
    template?: string;
    location?: string;
  }): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  // Update profile
  static async updateProfile(profileId: string, updates: Partial<Profile>): Promise<Profile> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profileId)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Check if username is available
  static async isUsernameAvailable(username: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single();

      if (error && error.code === 'PGRST116') {
        return true; // Username is available
      }

      return false; // Username is taken
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  }

  // Get profile URL
  static getProfileUrl(username: string): string {
    return DOMAIN_CONFIG.getProfileUrl(username);
  }

  // Validate username
  static validateUsername(username: string): { isValid: boolean; error?: string } {
    if (!username) {
      return { isValid: false, error: 'Username is required' };
    }

    if (username.length < 3) {
      return { isValid: false, error: 'Username must be at least 3 characters long' };
    }

    if (username.length > 30) {
      return { isValid: false, error: 'Username must be less than 30 characters' };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }

    // Reserved usernames
    const reservedUsernames = [
      'admin', 'api', 'app', 'www', 'mail', 'ftp', 'blog', 'shop', 'store',
      'support', 'help', 'about', 'contact', 'privacy', 'terms', 'login',
      'signup', 'register', 'dashboard', 'profile', 'settings', 'account',
      'billing', 'payment', 'pricing', 'features', 'docs', 'documentation',
      'status', 'health', 'monitor', 'test', 'demo', 'example', 'sample'
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
      return { isValid: false, error: 'This username is reserved' };
    }

    return { isValid: true };
  }
}

export default ProfileService;
