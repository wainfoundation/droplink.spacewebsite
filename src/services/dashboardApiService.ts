// Complete Dashboard API Service
// Provides all backend functionality for the dashboard

import { backendIntegrationService } from './backendIntegrationService';
import { piNetworkService } from './piNetworkService';
import { piPaymentService } from './piPaymentService';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LinkData {
  id?: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  position?: number;
  is_active?: boolean;
  type?: 'link' | 'tip' | 'product' | 'contact' | 'social';
}

export interface ProfileData {
  id?: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: string;
  template?: string;
  custom_colors?: any;
  location?: string;
  website?: string;
  social_links?: any;
}

export interface AnalyticsData {
  total_views: number;
  total_clicks: number;
  click_rate: number;
  top_links: any[];
  recent_activity: any[];
}

class DashboardApiService {
  private static instance: DashboardApiService;
  private isInitialized = false;

  public static getInstance(): DashboardApiService {
    if (!DashboardApiService.instance) {
      DashboardApiService.instance = new DashboardApiService();
    }
    return DashboardApiService.instance;
  }

  // Initialize the service
  public async initialize(): Promise<boolean> {
    try {
      console.log('🚀 Initializing Dashboard API Service...');
      
      // Initialize backend integration
      await backendIntegrationService.initialize();
      
      // Initialize Pi Network services
      await piNetworkService.initialize();
      await piPaymentService.initialize();
      
      this.isInitialized = true;
      console.log('✅ Dashboard API Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Dashboard API Service initialization failed:', error);
      return false;
    }
  }

  // User and Profile Management
  public async getUserProfile(userId: string): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: profile
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async updateUserProfile(userId: string, profileData: ProfileData): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Link Management
  public async getUserLinks(userId: string): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { data: links, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('position');

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data: links || []
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async createLink(userId: string, linkData: LinkData): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: userId,
          ...linkData
        })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data,
        message: 'Link created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async updateLink(linkId: string, linkData: Partial<LinkData>): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { data, error } = await supabase
        .from('links')
        .update(linkData)
        .eq('id', linkId)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data,
        message: 'Link updated successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async deleteLink(linkId: string): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Link deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async reorderLinks(userId: string, linkIds: string[]): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Update positions for all links
      const updates = linkIds.map((linkId, index) => 
        supabase
          .from('links')
          .update({ position: index })
          .eq('id', linkId)
          .eq('user_id', userId)
      );

      await Promise.all(updates);

      return {
        success: true,
        message: 'Links reordered successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Analytics
  public async getAnalytics(userId: string, dateRange?: { start: string; end: string }): Promise<DashboardApiResponse<AnalyticsData>> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Get user links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId);

      if (linksError) {
        return {
          success: false,
          error: linksError.message
        };
      }

      // Get analytics data
      let analyticsQuery = supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId);

      if (dateRange) {
        analyticsQuery = analyticsQuery
          .gte('created_at', dateRange.start)
          .lte('created_at', dateRange.end);
      }

      const { data: analytics, error: analyticsError } = await analyticsQuery;

      if (analyticsError) {
        return {
          success: false,
          error: analyticsError.message
        };
      }

      // Calculate analytics
      const totalViews = analytics?.filter(a => a.page_view).length || 0;
      const totalClicks = links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
      const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

      // Get top links
      const topLinks = links
        ?.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
        .slice(0, 5) || [];

      // Get recent activity
      const recentActivity = analytics
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10) || [];

      return {
        success: true,
        data: {
          total_views: totalViews,
          total_clicks: totalClicks,
          click_rate: parseFloat(clickRate.toFixed(2)),
          top_links: topLinks,
          recent_activity: recentActivity
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async trackPageView(userId: string, metadata?: any): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const { error } = await supabase
        .from('analytics')
        .insert({
          user_id: userId,
          page_view: true,
          ...metadata
        });

      if (error) {
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        message: 'Page view tracked'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public async trackLinkClick(linkId: string, metadata?: any): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      // Update link click count
      const { error: updateError } = await supabase
        .from('links')
        .update({ clicks: supabase.raw('clicks + 1') })
        .eq('id', linkId);

      if (updateError) {
        console.warn('Link click count update failed:', updateError);
      }

      // Record analytics
      const { error: analyticsError } = await supabase
        .from('analytics')
        .insert({
          link_id: linkId,
          link_click: true,
          ...metadata
        });

      if (analyticsError) {
        return {
          success: false,
          error: analyticsError.message
        };
      }

      return {
        success: true,
        message: 'Link click tracked'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Pi Network Integration
  public async processPiPayment(userId: string, amount: number, memo: string): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const paymentResult = await piPaymentService.createPayment({
        amount,
        memo,
        metadata: { userId }
      });

      if (paymentResult.success) {
        // Record payment in database
        const { data, error } = await supabase
          .from('orders')
          .insert({
            user_id: userId,
            amount_pi: amount,
            pi_payment_id: paymentResult.paymentId,
            status: 'pending'
          })
          .select()
          .single();

        if (error) {
          console.warn('Payment recording failed:', error);
        }

        return {
          success: true,
          data: {
            ...paymentResult,
            orderId: data?.id
          },
          message: 'Payment processed successfully'
        };
      }

      return {
        success: false,
        error: paymentResult.error || 'Payment failed'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Subscription Management
  public async createSubscription(userId: string, plan: string, amount: number): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

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
        return {
          success: false,
          error: error.message
        };
      }

      return {
        success: true,
        data,
        message: 'Subscription created successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Health Check
  public async healthCheck(): Promise<DashboardApiResponse> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const isHealthy = await backendIntegrationService.healthCheck();
      
      return {
        success: isHealthy,
        data: { status: isHealthy ? 'healthy' : 'unhealthy' },
        message: isHealthy ? 'All systems operational' : 'System issues detected'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const dashboardApiService = DashboardApiService.getInstance();

// Export types
export type { DashboardApiResponse, LinkData, ProfileData, AnalyticsData };
