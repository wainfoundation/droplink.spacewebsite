import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/context/UserContext';

export interface RealUserData {
  user: any;
  profile: any;
  links: any[];
  analytics: any;
  dashboardStats: any;
}

export class RealDataService {
  private static instance: RealDataService;
  
  public static getInstance(): RealDataService {
    if (!RealDataService.instance) {
      RealDataService.instance = new RealDataService();
    }
    return RealDataService.instance;
  }

  // Get real user data
  async getUserData(userId: string): Promise<RealUserData | null> {
    try {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        return null;
      }

      // Get user links
      const { data: links, error: linksError } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('position', { ascending: true });

      if (linksError) {
        console.error('Links error:', linksError);
      }

      // Get analytics data
      const analytics = await this.getAnalyticsData(userId);

      // Get dashboard stats
      const dashboardStats = await this.getDashboardStats(userId, links || []);

      return {
        user: { id: userId },
        profile,
        links: links || [],
        analytics,
        dashboardStats
      };
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  // Get real analytics data
  async getAnalyticsData(userId: string): Promise<any> {
    try {
      // Get link clicks and views from analytics table
      const { data: analyticsData, error } = await supabase
        .from('link_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        console.error('Analytics error:', error);
        return this.getDefaultAnalytics();
      }

      // Calculate real analytics
      const totalClicks = analyticsData?.reduce((sum, item) => sum + (item.clicks || 0), 0) || 0;
      const totalViews = analyticsData?.reduce((sum, item) => sum + (item.views || 0), 0) || 0;
      const uniqueVisitors = analyticsData?.filter((item, index, self) => 
        index === self.findIndex(t => t.visitor_id === item.visitor_id)
      ).length || 0;

      return {
        totalClicks,
        totalViews,
        uniqueVisitors,
        clickRate: totalViews > 0 ? (totalClicks / totalViews) * 100 : 0,
        topLinks: analyticsData?.slice(0, 5) || [],
        trafficSources: this.calculateTrafficSources(analyticsData || []),
        deviceTypes: this.calculateDeviceTypes(analyticsData || []),
        geographicData: this.calculateGeographicData(analyticsData || []),
        timeSeriesData: this.calculateTimeSeriesData(analyticsData || [])
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return this.getDefaultAnalytics();
    }
  }

  // Get dashboard stats
  async getDashboardStats(userId: string, links: any[]): Promise<any> {
    try {
      const totalLinks = links.length;
      const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
      const totalViews = links.reduce((sum, link) => sum + (link.views || 0), 0);
      const clickRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

      return {
        totalLinks,
        totalClicks,
        totalViews,
        clickRate,
        topLink: links.reduce((top, link) => 
          (link.clicks || 0) > (top?.clicks || 0) ? link : top, links[0] || null
        ),
        recentActivity: links
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 5)
      };
    } catch (error) {
      console.error('Error calculating dashboard stats:', error);
      return this.getDefaultDashboardStats();
    }
  }

  // Helper methods for analytics calculations
  private calculateTrafficSources(analyticsData: any[]): any[] {
    const sources: { [key: string]: number } = {};
    
    analyticsData.forEach(item => {
      const source = item.referrer || 'Direct';
      sources[source] = (sources[source] || 0) + (item.clicks || 0);
    });

    const total = Object.values(sources).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(sources).map(([source, clicks]) => ({
      source,
      clicks,
      percentage: total > 0 ? (clicks / total) * 100 : 0
    }));
  }

  private calculateDeviceTypes(analyticsData: any[]): any[] {
    const devices: { [key: string]: number } = {};
    
    analyticsData.forEach(item => {
      const device = item.device_type || 'Desktop';
      devices[device] = (devices[device] || 0) + (item.clicks || 0);
    });

    const total = Object.values(devices).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(devices).map(([device, clicks]) => ({
      device,
      clicks,
      percentage: total > 0 ? (clicks / total) * 100 : 0
    }));
  }

  private calculateGeographicData(analyticsData: any[]): any[] {
    const countries: { [key: string]: number } = {};
    
    analyticsData.forEach(item => {
      const country = item.country || 'Unknown';
      countries[country] = (countries[country] || 0) + (item.clicks || 0);
    });

    const total = Object.values(countries).reduce((sum, count) => sum + count, 0);
    
    return Object.entries(countries).map(([country, clicks]) => ({
      country,
      clicks,
      percentage: total > 0 ? (clicks / total) * 100 : 0
    }));
  }

  private calculateTimeSeriesData(analyticsData: any[]): any[] {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      const dayData = analyticsData.filter(item => 
        item.created_at?.startsWith(date)
      );
      
      return {
        date,
        clicks: dayData.reduce((sum, item) => sum + (item.clicks || 0), 0),
        views: dayData.reduce((sum, item) => sum + (item.views || 0), 0)
      };
    }).reverse();
  }

  // Default data fallbacks
  private getDefaultAnalytics(): any {
    return {
      totalClicks: 0,
      totalViews: 0,
      uniqueVisitors: 0,
      clickRate: 0,
      topLinks: [],
      trafficSources: [],
      deviceTypes: [],
      geographicData: [],
      timeSeriesData: []
    };
  }

  private getDefaultDashboardStats(): any {
    return {
      totalLinks: 0,
      totalClicks: 0,
      totalViews: 0,
      clickRate: 0,
      topLink: null,
      recentActivity: []
    };
  }
}

export const realDataService = RealDataService.getInstance();
