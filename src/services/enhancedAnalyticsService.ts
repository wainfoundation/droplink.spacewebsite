import { supabase } from '@/integrations/supabase/client';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  linkId?: string;
  type: 'page_view' | 'link_click' | 'conversion' | 'bounce' | 'session_start' | 'session_end';
  timestamp: string;
  metadata: {
    userAgent: string;
    referrer: string;
    ipAddress: string;
    location: {
      country: string;
      region: string;
      city: string;
      latitude: number;
      longitude: number;
    };
    device: {
      type: 'mobile' | 'tablet' | 'desktop';
      os: string;
      browser: string;
      screenResolution: string;
    };
    session: {
      sessionId: string;
      duration?: number;
      pageViews: number;
      isNewSession: boolean;
    };
    utm?: {
      source: string;
      medium: string;
      campaign: string;
      term: string;
      content: string;
    };
    custom?: Record<string, any>;
  };
}

export interface AnalyticsSummary {
  totalViews: number;
  totalClicks: number;
  uniqueVisitors: number;
  bounceRate: number;
  averageSessionDuration: number;
  conversionRate: number;
  topLinks: Array<{
    linkId: string;
    title: string;
    clicks: number;
    views: number;
    ctr: number;
  }>;
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  deviceTypes: Array<{
    device: string;
    count: number;
    percentage: number;
  }>;
  geographicData: Array<{
    country: string;
    visitors: number;
    percentage: number;
  }>;
  hourlyData: Array<{
    hour: number;
    views: number;
    clicks: number;
  }>;
  dailyData: Array<{
    date: string;
    views: number;
    clicks: number;
    visitors: number;
  }>;
}

export interface RealTimeAnalytics {
  activeUsers: number;
  currentViews: number;
  currentClicks: number;
  topPages: Array<{
    page: string;
    views: number;
  }>;
  recentEvents: Array<{
    type: string;
    timestamp: string;
    location: string;
    device: string;
  }>;
}

class EnhancedAnalyticsService {
  private static instance: EnhancedAnalyticsService;
  private realTimeData: Map<string, AnalyticsEvent> = new Map();
  private sessionData: Map<string, any> = new Map();

  public static getInstance(): EnhancedAnalyticsService {
    if (!EnhancedAnalyticsService.instance) {
      EnhancedAnalyticsService.instance = new EnhancedAnalyticsService();
    }
    return EnhancedAnalyticsService.instance;
  }

  public async trackEvent(
    userId: string,
    eventType: AnalyticsEvent['type'],
    metadata: Partial<AnalyticsEvent['metadata']>,
    linkId?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const event: Omit<AnalyticsEvent, 'id'> = {
        userId,
        linkId,
        type: eventType,
        timestamp: new Date().toISOString(),
        metadata: {
          userAgent: metadata.userAgent || navigator.userAgent,
          referrer: metadata.referrer || document.referrer,
          ipAddress: metadata.ipAddress || await this.getClientIP(),
          location: metadata.location || await this.getLocationFromIP(metadata.ipAddress),
          device: metadata.device || this.getDeviceInfo(),
          session: metadata.session || await this.getSessionInfo(userId),
          utm: metadata.utm || this.extractUTMParameters(),
          custom: metadata.custom || {}
        }
      };

      const { error } = await supabase
        .from('analytics_events')
        .insert(event);

      if (error) {
        return { success: false, error: error.message };
      }

      // Store in real-time data
      this.realTimeData.set(`${userId}-${Date.now()}`, event as AnalyticsEvent);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getAnalyticsSummary(
    userId: string,
    dateRange: { start: string; end: string }
  ): Promise<{ success: boolean; data?: AnalyticsSummary; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end);

      if (error) {
        return { success: false, error: error.message };
      }

      const summary = this.calculateAnalyticsSummary(data || []);
      return { success: true, data: summary };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getRealTimeAnalytics(userId: string): Promise<{ success: boolean; data?: RealTimeAnalytics; error?: string }> {
    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('timestamp', fiveMinutesAgo.toISOString());

      if (error) {
        return { success: false, error: error.message };
      }

      const realTimeData = this.calculateRealTimeAnalytics(data || []);
      return { success: true, data: realTimeData };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getLinkAnalytics(
    linkId: string,
    dateRange: { start: string; end: string }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('link_id', linkId)
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end);

      if (error) {
        return { success: false, error: error.message };
      }

      const linkAnalytics = this.calculateLinkAnalytics(data || []);
      return { success: true, data: linkAnalytics };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getGeographicAnalytics(
    userId: string,
    dateRange: { start: string; end: string }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('metadata->location')
        .eq('user_id', userId)
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end);

      if (error) {
        return { success: false, error: error.message };
      }

      const geographicData = this.calculateGeographicAnalytics(data || []);
      return { success: true, data: geographicData };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getDeviceAnalytics(
    userId: string,
    dateRange: { start: string; end: string }
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('metadata->device')
        .eq('user_id', userId)
        .gte('timestamp', dateRange.start)
        .lte('timestamp', dateRange.end);

      if (error) {
        return { success: false, error: error.message };
      }

      const deviceData = this.calculateDeviceAnalytics(data || []);
      return { success: true, data: deviceData };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private calculateAnalyticsSummary(events: any[]): AnalyticsSummary {
    const views = events.filter(e => e.type === 'page_view').length;
    const clicks = events.filter(e => e.type === 'link_click').length;
    const uniqueVisitors = new Set(events.map(e => e.metadata?.session?.sessionId)).size;
    const conversions = events.filter(e => e.type === 'conversion').length;
    const bounces = events.filter(e => e.type === 'bounce').length;

    const sessionDurations = events
      .filter(e => e.metadata?.session?.duration)
      .map(e => e.metadata.session.duration);
    const avgSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
      : 0;

    return {
      totalViews: views,
      totalClicks: clicks,
      uniqueVisitors,
      bounceRate: views > 0 ? (bounces / views) * 100 : 0,
      averageSessionDuration: avgSessionDuration,
      conversionRate: views > 0 ? (conversions / views) * 100 : 0,
      topLinks: this.calculateTopLinks(events),
      trafficSources: this.calculateTrafficSources(events),
      deviceTypes: this.calculateDeviceTypes(events),
      geographicData: this.calculateGeographicData(events),
      hourlyData: this.calculateHourlyData(events),
      dailyData: this.calculateDailyData(events)
    };
  }

  private calculateRealTimeAnalytics(events: any[]): RealTimeAnalytics {
    const activeUsers = new Set(events.map(e => e.metadata?.session?.sessionId)).size;
    const currentViews = events.filter(e => e.type === 'page_view').length;
    const currentClicks = events.filter(e => e.type === 'link_click').length;

    return {
      activeUsers,
      currentViews,
      currentClicks,
      topPages: this.calculateTopPages(events),
      recentEvents: this.calculateRecentEvents(events)
    };
  }

  private calculateTopLinks(events: any[]): Array<{ linkId: string; title: string; clicks: number; views: number; ctr: number }> {
    const linkStats = new Map<string, { clicks: number; views: number; title: string }>();
    
    events.forEach(event => {
      if (event.linkId) {
        if (!linkStats.has(event.linkId)) {
          linkStats.set(event.linkId, { clicks: 0, views: 0, title: 'Unknown Link' });
        }
        
        const stats = linkStats.get(event.linkId)!;
        if (event.type === 'link_click') stats.clicks++;
        if (event.type === 'page_view') stats.views++;
      }
    });

    return Array.from(linkStats.entries())
      .map(([linkId, stats]) => ({
        linkId,
        title: stats.title,
        clicks: stats.clicks,
        views: stats.views,
        ctr: stats.views > 0 ? (stats.clicks / stats.views) * 100 : 0
      }))
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
  }

  private calculateTrafficSources(events: any[]): Array<{ source: string; visitors: number; percentage: number }> {
    const sources = new Map<string, number>();
    
    events.forEach(event => {
      const referrer = event.metadata?.referrer || 'Direct';
      const source = this.categorizeReferrer(referrer);
      sources.set(source, (sources.get(source) || 0) + 1);
    });

    const total = Array.from(sources.values()).reduce((a, b) => a + b, 0);
    
    return Array.from(sources.entries())
      .map(([source, visitors]) => ({
        source,
        visitors,
        percentage: total > 0 ? (visitors / total) * 100 : 0
      }))
      .sort((a, b) => b.visitors - a.visitors);
  }

  private calculateDeviceTypes(events: any[]): Array<{ device: string; count: number; percentage: number }> {
    const devices = new Map<string, number>();
    
    events.forEach(event => {
      const deviceType = event.metadata?.device?.type || 'unknown';
      devices.set(deviceType, (devices.get(deviceType) || 0) + 1);
    });

    const total = Array.from(devices.values()).reduce((a, b) => a + b, 0);
    
    return Array.from(devices.entries())
      .map(([device, count]) => ({
        device,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count);
  }

  private calculateGeographicData(events: any[]): Array<{ country: string; visitors: number; percentage: number }> {
    const countries = new Map<string, number>();
    
    events.forEach(event => {
      const country = event.metadata?.location?.country || 'Unknown';
      countries.set(country, (countries.get(country) || 0) + 1);
    });

    const total = Array.from(countries.values()).reduce((a, b) => a + b, 0);
    
    return Array.from(countries.entries())
      .map(([country, visitors]) => ({
        country,
        visitors,
        percentage: total > 0 ? (visitors / total) * 100 : 0
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 10);
  }

  private calculateHourlyData(events: any[]): Array<{ hour: number; views: number; clicks: number }> {
    const hourlyStats = new Map<number, { views: number; clicks: number }>();
    
    for (let i = 0; i < 24; i++) {
      hourlyStats.set(i, { views: 0, clicks: 0 });
    }
    
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      const stats = hourlyStats.get(hour)!;
      
      if (event.type === 'page_view') stats.views++;
      if (event.type === 'link_click') stats.clicks++;
    });

    return Array.from(hourlyStats.entries())
      .map(([hour, stats]) => ({ hour, ...stats }))
      .sort((a, b) => a.hour - b.hour);
  }

  private calculateDailyData(events: any[]): Array<{ date: string; views: number; clicks: number; visitors: number }> {
    const dailyStats = new Map<string, { views: number; clicks: number; visitors: Set<string> }>();
    
    events.forEach(event => {
      const date = event.timestamp.split('T')[0];
      if (!dailyStats.has(date)) {
        dailyStats.set(date, { views: 0, clicks: 0, visitors: new Set() });
      }
      
      const stats = dailyStats.get(date)!;
      if (event.type === 'page_view') stats.views++;
      if (event.type === 'link_click') stats.clicks++;
      if (event.metadata?.session?.sessionId) {
        stats.visitors.add(event.metadata.session.sessionId);
      }
    });

    return Array.from(dailyStats.entries())
      .map(([date, stats]) => ({
        date,
        views: stats.views,
        clicks: stats.clicks,
        visitors: stats.visitors.size
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private calculateTopPages(events: any[]): Array<{ page: string; views: number }> {
    const pages = new Map<string, number>();
    
    events.forEach(event => {
      if (event.type === 'page_view') {
        const page = event.linkId || 'home';
        pages.set(page, (pages.get(page) || 0) + 1);
      }
    });

    return Array.from(pages.entries())
      .map(([page, views]) => ({ page, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);
  }

  private calculateRecentEvents(events: any[]): Array<{ type: string; timestamp: string; location: string; device: string }> {
    return events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10)
      .map(event => ({
        type: event.type,
        timestamp: event.timestamp,
        location: event.metadata?.location?.city || 'Unknown',
        device: event.metadata?.device?.type || 'Unknown'
      }));
  }

  private categorizeReferrer(referrer: string): string {
    if (!referrer || referrer === '') return 'Direct';
    
    const domain = new URL(referrer).hostname.toLowerCase();
    
    if (domain.includes('google')) return 'Google';
    if (domain.includes('facebook')) return 'Facebook';
    if (domain.includes('twitter')) return 'Twitter';
    if (domain.includes('instagram')) return 'Instagram';
    if (domain.includes('linkedin')) return 'LinkedIn';
    if (domain.includes('youtube')) return 'YouTube';
    if (domain.includes('tiktok')) return 'TikTok';
    
    return 'Referral';
  }

  private async getClientIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  }

  private async getLocationFromIP(ip: string): Promise<{ country: string; region: string; city: string; latitude: number; longitude: number }> {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      const data = await response.json();
      return {
        country: data.country_name || 'Unknown',
        region: data.region || 'Unknown',
        city: data.city || 'Unknown',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0
      };
    } catch {
      return {
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        latitude: 0,
        longitude: 0
      };
    }
  }

  private getDeviceInfo(): { type: 'mobile' | 'tablet' | 'desktop'; os: string; browser: string; screenResolution: string } {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
    if (screenWidth < 768) deviceType = 'mobile';
    else if (screenWidth < 1024) deviceType = 'tablet';
    
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    return {
      type: deviceType,
      os,
      browser,
      screenResolution: `${screenWidth}x${window.screen.height}`
    };
  }

  private async getSessionInfo(userId: string): Promise<{ sessionId: string; duration?: number; pageViews: number; isNewSession: boolean }> {
    const sessionId = this.generateSessionId();
    const existingSession = this.sessionData.get(sessionId);
    
    if (existingSession) {
      return {
        sessionId,
        duration: Date.now() - existingSession.startTime,
        pageViews: existingSession.pageViews + 1,
        isNewSession: false
      };
    }
    
    this.sessionData.set(sessionId, {
      startTime: Date.now(),
      pageViews: 1
    });
    
    return {
      sessionId,
      pageViews: 1,
      isNewSession: true
    };
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private extractUTMParameters(): { source: string; medium: string; campaign: string; term: string; content: string } | undefined {
    const urlParams = new URLSearchParams(window.location.search);
    const utm = {
      source: urlParams.get('utm_source') || '',
      medium: urlParams.get('utm_medium') || '',
      campaign: urlParams.get('utm_campaign') || '',
      term: urlParams.get('utm_term') || '',
      content: urlParams.get('utm_content') || ''
    };
    
    return Object.values(utm).some(value => value !== '') ? utm : undefined;
  }

  private calculateLinkAnalytics(events: any[]): any {
    // Implementation for link-specific analytics
    return {
      totalClicks: events.filter(e => e.type === 'link_click').length,
      totalViews: events.filter(e => e.type === 'page_view').length,
      uniqueVisitors: new Set(events.map(e => e.metadata?.session?.sessionId)).size,
      clickRate: 0, // Will be calculated
      topReferrers: this.calculateTrafficSources(events),
      deviceBreakdown: this.calculateDeviceTypes(events),
      geographicBreakdown: this.calculateGeographicData(events)
    };
  }

  private calculateGeographicAnalytics(events: any[]): any {
    // Implementation for geographic analytics
    return this.calculateGeographicData(events);
  }

  private calculateDeviceAnalytics(events: any[]): any {
    // Implementation for device analytics
    return this.calculateDeviceTypes(events);
  }
}

export const enhancedAnalyticsService = EnhancedAnalyticsService.getInstance();
