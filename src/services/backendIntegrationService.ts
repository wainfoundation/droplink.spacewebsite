// Complete Backend Integration Service for Droplink Dashboard
// This service connects all backend functionality with the dashboard

import { supabase } from '@/integrations/supabase/client';
import { piNetworkService } from './piNetworkService';
import { piPaymentService } from './piPaymentService';
import { piProfileService } from './piProfileService';

export interface DashboardData {
  user: any;
  profile: any;
  links: any[];
  analytics: any;
  subscription: any;
  products: any[];
  tips: any[];
}

export interface BackendStats {
  totalUsers: number;
  totalProfiles: number;
  totalLinks: number;
  totalClicks: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

class BackendIntegrationService {
  private static instance: BackendIntegrationService;
  private isInitialized = false;

  public static getInstance(): BackendIntegrationService {
    if (!BackendIntegrationService.instance) {
      BackendIntegrationService.instance = new BackendIntegrationService();
    }
    return BackendIntegrationService.instance;
  }

  // Initialize all backend services
  public async initialize(): Promise<boolean> {
    try {
      console.log('🚀 Initializing Droplink Backend Integration...');
      
      // Initialize Pi Network services
      await piNetworkService.initialize();
      await piPaymentService.initialize();
      await piProfileService.initialize();
      
      // Test Supabase connection
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      if (error) {
        console.warn('Supabase connection test failed:', error);
      } else {
        console.log('✅ Supabase connection successful');
      }
      
      this.isInitialized = true;
      console.log('✅ Backend Integration Service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Backend initialization failed:', error);
      return false;
    }
  }

  // Complete dashboard data loading
  public async loadDashboardData(userId: string): Promise<DashboardData> {
    try {
      console.log('📊 Loading complete dashboard data for user:', userId);
      
      // Load user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile loading error:', profileError);
        throw new Error('Failed to load user profile');
      }

      // Load user links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('position');

      if (linksError) {
        console.error('Links loading error:', linksError);
        throw new Error('Failed to load user links');
      }

      // Load analytics data
      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics')
        .select('*')
        .eq('user_id', userId);

      if (analyticsError) {
        console.warn('Analytics loading error:', analyticsError);
      }

      // Load subscription data
      const { data: subscription, error: subscriptionError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .single();

      if (subscriptionError && subscriptionError.code !== 'PGRST116') {
        console.warn('Subscription loading error:', subscriptionError);
      }

      // Load products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (productsError) {
        console.warn('Products loading error:', productsError);
      }

      // Load tips received
      const { data: tips, error: tipsError } = await supabase
        .from('tips')
        .select('*')
        .eq('to_user_id', userId)
        .eq('status', 'completed');

      if (tipsError) {
        console.warn('Tips loading error:', tipsError);
      }

      return {
        user: { id: userId },
        profile,
        links: links || [],
        analytics: analytics || [],
        subscription,
        products: products || [],
        tips: tips || []
      };
    } catch (error) {
      console.error('Dashboard data loading failed:', error);
      throw error;
    }
  }

  // Create or update user profile
  public async createOrUpdateProfile(profileData: any): Promise<any> {
    try {
      console.log('👤 Creating/updating user profile:', profileData);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        console.error('Profile creation/update error:', error);
        throw new Error('Failed to create/update profile');
      }

      return data;
    } catch (error) {
      console.error('Profile operation failed:', error);
      throw error;
    }
  }

  // Link management
  public async createLink(userId: string, linkData: any): Promise<any> {
    try {
      console.log('🔗 Creating new link:', linkData);
      
      const { data, error } = await supabase
        .from('links')
        .insert({
          user_id: userId,
          ...linkData
        })
        .select()
        .single();

      if (error) {
        console.error('Link creation error:', error);
        throw new Error('Failed to create link');
      }

      return data;
    } catch (error) {
      console.error('Link creation failed:', error);
      throw error;
    }
  }

  public async updateLink(linkId: string, linkData: any): Promise<any> {
    try {
      console.log('🔗 Updating link:', linkId, linkData);
      
      const { data, error } = await supabase
        .from('links')
        .update(linkData)
        .eq('id', linkId)
        .select()
        .single();

      if (error) {
        console.error('Link update error:', error);
        throw new Error('Failed to update link');
      }

      return data;
    } catch (error) {
      console.error('Link update failed:', error);
      throw error;
    }
  }

  public async deleteLink(linkId: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting link:', linkId);
      
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

      if (error) {
        console.error('Link deletion error:', error);
        throw new Error('Failed to delete link');
      }

      return true;
    } catch (error) {
      console.error('Link deletion failed:', error);
      throw error;
    }
  }

  // Analytics tracking
  public async trackPageView(userId: string, analyticsData: any): Promise<void> {
    try {
      console.log('📊 Tracking page view for user:', userId);
      
      const { error } = await supabase
        .from('analytics')
        .insert({
          user_id: userId,
          page_view: true,
          ...analyticsData
        });

      if (error) {
        console.error('Analytics tracking error:', error);
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  }

  public async trackLinkClick(linkId: string, analyticsData: any): Promise<void> {
    try {
      console.log('🔗 Tracking link click:', linkId);
      
      // Update link click count
      const { error: updateError } = await supabase
        .from('links')
        .update({ clicks: supabase.raw('clicks + 1') })
        .eq('id', linkId);

      if (updateError) {
        console.error('Link click update error:', updateError);
      }

      // Record analytics
      const { error: analyticsError } = await supabase
        .from('analytics')
        .insert({
          link_id: linkId,
          link_click: true,
          ...analyticsData
        });

      if (analyticsError) {
        console.error('Analytics recording error:', analyticsError);
      }
    } catch (error) {
      console.error('Link click tracking failed:', error);
    }
  }

  // Subscription management
  public async createSubscription(userId: string, plan: string, amount: number): Promise<any> {
    try {
      console.log('💳 Creating subscription:', { userId, plan, amount });
      
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          plan,
          amount,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        })
        .select()
        .single();

      if (error) {
        console.error('Subscription creation error:', error);
        throw new Error('Failed to create subscription');
      }

      return data;
    } catch (error) {
      console.error('Subscription creation failed:', error);
      throw error;
    }
  }

  // Pi Network integration
  public async processPiPayment(userId: string, amount: number, memo: string): Promise<any> {
    try {
      console.log('💰 Processing Pi payment:', { userId, amount, memo });
      
      const paymentResult = await piPaymentService.createPayment({
        amount,
        memo,
        metadata: { userId }
      });

      if (paymentResult.success) {
        // Record the payment in database
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
          console.error('Payment recording error:', error);
        }

        return { ...paymentResult, orderId: data?.id };
      }

      return paymentResult;
    } catch (error) {
      console.error('Pi payment processing failed:', error);
      throw error;
    }
  }

  // Admin functions
  public async getBackendStats(): Promise<BackendStats> {
    try {
      console.log('📈 Loading backend statistics...');
      
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total links
      const { count: totalLinks } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true });

      // Get total clicks
      const { data: clicksData } = await supabase
        .from('links')
        .select('clicks');

      const totalClicks = clicksData?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;

      // Get active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get total revenue
      const { data: revenueData } = await supabase
        .from('subscriptions')
        .select('amount');

      const totalRevenue = revenueData?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;

      return {
        totalUsers: totalUsers || 0,
        totalProfiles: totalUsers || 0,
        totalLinks: totalLinks || 0,
        totalClicks,
        totalRevenue,
        activeSubscriptions: activeSubscriptions || 0
      };
    } catch (error) {
      console.error('Backend stats loading failed:', error);
      throw error;
    }
  }

  // Health check
  public async healthCheck(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      return !error;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const backendIntegrationService = BackendIntegrationService.getInstance();

// Export types
export type { DashboardData, BackendStats };
