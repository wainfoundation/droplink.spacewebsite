// Complete Dashboard Data Service
// Handles all dashboard data operations with proper error handling

import { supabase } from '@/integrations/supabase/client';
import { supabaseConnectionService } from './supabaseConnectionService';

export interface DashboardData {
  user: any;
  profile: any;
  links: any[];
  analytics: any;
  subscription: any;
  products: any[];
  tips: any[];
  projects: any[];
  domains: any[];
  templates: any[];
}

export interface LinkData {
  id?: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  position?: number;
  is_active?: boolean;
  type?: 'link' | 'file' | 'vcard' | 'event' | 'static' | 'qr' | 'splash';
}

export interface ProjectData {
  id?: string;
  name: string;
  description?: string;
  domain?: string;
  is_active?: boolean;
  created_at?: string;
}

export interface TemplateData {
  id?: string;
  name: string;
  category: string;
  preview_url: string;
  is_premium?: boolean;
}

class DashboardDataService {
  private static instance: DashboardDataService;
  private isInitialized = false;

  public static getInstance(): DashboardDataService {
    if (!DashboardDataService.instance) {
      DashboardDataService.instance = new DashboardDataService();
    }
    return DashboardDataService.instance;
  }

  // Initialize the service
  public async initialize(): Promise<boolean> {
    try {
      console.log('🚀 Initializing Dashboard Data Service...');
      
      // Test connection
      const connectionStatus = await supabaseConnectionService.testConnection();
      if (!connectionStatus.connected) {
        console.log('📊 Initializing database...');
        await supabaseConnectionService.initializeDatabase();
      }

      this.isInitialized = true;
      console.log('✅ Dashboard Data Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Dashboard Data Service initialization failed:', error);
      return false;
    }
  }

  // Load complete dashboard data
  public async loadDashboardData(userId: string): Promise<DashboardData> {
    try {
      console.log('📊 Loading dashboard data for user:', userId);
      
      const [profile, links, analytics, subscription, products, tips, projects, domains, templates] = await Promise.all([
        this.getUserProfile(userId),
        this.getUserLinks(userId),
        this.getUserAnalytics(userId),
        this.getUserSubscription(userId),
        this.getUserProducts(userId),
        this.getUserTips(userId),
        this.getUserProjects(userId),
        this.getUserDomains(userId),
        this.getTemplates()
      ]);

      return {
        user: { id: userId },
        profile,
        links,
        analytics,
        subscription,
        products,
        tips,
        projects,
        domains,
        templates
      };
    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      throw error;
    }
  }

  // User Profile Operations
  public async getUserProfile(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw new Error(`Profile loading failed: ${error.message}`);
      }

      return data || {
        id: userId,
        username: 'user_' + userId.slice(-8),
        display_name: 'User',
        bio: '',
        avatar_url: '',
        theme: { primary: '#8B5CF6', secondary: '#EC4899' },
        template: 'modern',
        plan: 'free',
        is_verified: false,
        location: '',
        website: '',
        social_links: {}
      };
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  }

  public async updateUserProfile(userId: string, profileData: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({ id: userId, ...profileData })
        .select()
        .single();

      if (error) {
        throw new Error(`Profile update failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Update user profile error:', error);
      throw error;
    }
  }

  // Link Management
  public async getUserLinks(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('position');

      if (error) {
        console.warn('Links loading error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get user links error:', error);
      return [];
    }
  }

  public async createLink(userId: string, linkData: LinkData): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: userId,
          ...linkData
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Link creation failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create link error:', error);
      throw error;
    }
  }

  public async updateLink(linkId: string, linkData: Partial<LinkData>): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('links')
        .update(linkData)
        .eq('id', linkId)
        .select()
        .single();

      if (error) {
        throw new Error(`Link update failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Update link error:', error);
      throw error;
    }
  }

  public async deleteLink(linkId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

      if (error) {
        throw new Error(`Link deletion failed: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Delete link error:', error);
      throw error;
    }
  }

  public async reorderLinks(userId: string, linkIds: string[]): Promise<boolean> {
    try {
      const updates = linkIds.map((linkId, index) => 
        supabase
          .from('links')
          .update({ position: index })
          .eq('id', linkId)
          .eq('user_id', userId)
      );

      await Promise.all(updates);
      return true;
    } catch (error) {
      console.error('Reorder links error:', error);
      throw error;
    }
  }

  // Analytics
  public async getUserAnalytics(userId: string): Promise<any> {
    try {
      const { data: analytics, error } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.warn('Analytics loading error:', error);
        return {
          total_views: 0,
          total_clicks: 0,
          click_rate: 0,
          top_links: [],
          recent_activity: []
        };
      }

      // Calculate analytics
      const totalViews = analytics?.filter(a => a.page_view).length || 0;
      const totalClicks = analytics?.filter(a => a.link_click).length || 0;
      const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

      return {
        total_views: totalViews,
        total_clicks: totalClicks,
        click_rate: parseFloat(clickRate.toFixed(2)),
        top_links: [],
        recent_activity: analytics?.slice(-10) || []
      };
    } catch (error) {
      console.error('Get user analytics error:', error);
      return {
        total_views: 0,
        total_clicks: 0,
        click_rate: 0,
        top_links: [],
        recent_activity: []
      };
    }
  }

  public async trackPageView(userId: string, metadata?: any): Promise<void> {
    try {
      await supabase
        .from('analytics')
        .insert({
          user_id: userId,
          page_view: true,
          ...metadata
        });
    } catch (error) {
      console.error('Track page view error:', error);
    }
  }

  public async trackLinkClick(linkId: string, metadata?: any): Promise<void> {
    try {
      // Update link click count
      await supabase
        .from('links')
        .update({ clicks: supabase.raw('clicks + 1') })
        .eq('id', linkId);

      // Record analytics
      await supabase
        .from('analytics')
        .insert({
          link_id: linkId,
          link_click: true,
          ...metadata
        });
    } catch (error) {
      console.error('Track link click error:', error);
    }
  }

  // Subscription Management
  public async getUserSubscription(userId: string): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Subscription loading error:', error);
      }

      return data || null;
    } catch (error) {
      console.error('Get user subscription error:', error);
      return null;
    }
  }

  public async createSubscription(userId: string, plan: string, amount: number): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan,
          amount,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select()
        .single();

      if (error) {
        throw new Error(`Subscription creation failed: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Create subscription error:', error);
      throw error;
    }
  }

  // Product Management
  public async getUserProducts(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.warn('Products loading error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get user products error:', error);
      return [];
    }
  }

  // Tips Management
  public async getUserTips(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('tips')
        .select('*')
        .eq('to_user_id', userId)
        .eq('status', 'completed');

      if (error) {
        console.warn('Tips loading error:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Get user tips error:', error);
      return [];
    }
  }

  // Projects Management
  public async getUserProjects(userId: string): Promise<any[]> {
    try {
      // For now, return mock data - can be implemented with a projects table
      return [
        {
          id: '1',
          name: 'Main Bio Link',
          description: 'Primary bio link project',
          domain: 'mrwain.droplinkspace',
          is_active: true,
          created_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Get user projects error:', error);
      return [];
    }
  }

  // Domains Management
  public async getUserDomains(userId: string): Promise<any[]> {
    try {
      // For now, return mock data - can be implemented with a domains table
      return [
        {
          id: '1',
          domain: 'mrwain.droplinkspace',
          is_active: true,
          is_verified: true,
          created_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Get user domains error:', error);
      return [];
    }
  }

  // Templates
  public async getTemplates(): Promise<any[]> {
    try {
      // Return available templates
      return [
        {
          id: '1',
          name: 'Modern Dark',
          category: 'Professional',
          preview_url: '/templates/modern-dark.jpg',
          is_premium: false
        },
        {
          id: '2',
          name: 'Ocean Blue',
          category: 'Creative',
          preview_url: '/templates/ocean-blue.jpg',
          is_premium: false
        },
        {
          id: '3',
          name: 'Minimal White',
          category: 'Minimal',
          preview_url: '/templates/minimal-white.jpg',
          is_premium: true
        }
      ];
    } catch (error) {
      console.error('Get templates error:', error);
      return [];
    }
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      return await supabaseConnectionService.healthCheck();
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const dashboardDataService = DashboardDataService.getInstance();

// Export types
export type { DashboardData, LinkData, ProjectData, TemplateData };
