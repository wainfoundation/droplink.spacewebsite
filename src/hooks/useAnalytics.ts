import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  totalViews: number;
  totalClicks: number;
  topLinks: Array<{
    id: string;
    title: string;
    clicks: number;
    url: string;
  }>;
  dailyStats: Array<{
    date: string;
    views: number;
    clicks: number;
  }>;
}

// Mock analytics data for development
const MOCK_ANALYTICS: AnalyticsData = {
  totalViews: 1247,
  totalClicks: 2840,
  topLinks: [
    { id: "1", title: "Instagram", clicks: 1240, url: "https://instagram.com/myprofile" },
    { id: "2", title: "YouTube Channel", clicks: 856, url: "https://youtube.com/@mychannel" },
    { id: "3", title: "My Website", clicks: 432, url: "https://mywebsite.com" },
    { id: "4", title: "Contact Me", clicks: 298, url: "mailto:hello@example.com" }
  ],
  dailyStats: [
    { date: "2024-01-15", views: 45, clicks: 89 },
    { date: "2024-01-16", views: 52, clicks: 98 },
    { date: "2024-01-17", views: 38, clicks: 76 },
    { date: "2024-01-18", views: 67, clicks: 134 },
    { date: "2024-01-19", views: 43, clicks: 87 },
    { date: "2024-01-20", views: 56, clicks: 112 },
    { date: "2024-01-21", views: 49, clicks: 95 }
  ]
};

export function useAnalytics(userId?: string, profileId?: string) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    if (!userId || !profileId) return;
    
    try {
      setIsLoading(true);
      
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setAnalytics(MOCK_ANALYTICS);
        return;
      }
      
      // Real analytics implementation would go here
      setAnalytics(MOCK_ANALYTICS);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Failed to load analytics",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const trackProfileView = async (profileId: string) => {
    try {
      // Mock tracking for now
      if (analytics) {
        setAnalytics({
          ...analytics,
          totalViews: analytics.totalViews + 1
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Error tracking profile view:', error);
      return { success: false, error };
    }
  };

  const trackLinkClick = async (linkId: string) => {
    try {
      // Mock tracking for now
      if (analytics) {
        setAnalytics({
          ...analytics,
          totalClicks: analytics.totalClicks + 1,
          topLinks: analytics.topLinks.map(link => 
            link.id === linkId 
              ? { ...link, clicks: link.clicks + 1 }
              : link
          )
        });
      }
      return { success: true };
    } catch (error) {
      console.error('Error tracking link click:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [userId, profileId]);

  return {
    analytics,
    isLoading,
    trackProfileView,
    trackLinkClick,
    fetchAnalytics
  };
}