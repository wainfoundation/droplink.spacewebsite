// Complete Dashboard Backend Hook
// Provides all backend functionality for the dashboard components

import { useState, useEffect, useCallback } from 'react';
import { dashboardApiService, DashboardApiResponse, LinkData, ProfileData, AnalyticsData } from '@/services/dashboardApiService';
import { useToast } from '@/hooks/use-toast';

export interface UseDashboardBackendReturn {
  // State
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // User & Profile
  profile: ProfileData | null;
  updateProfile: (profileData: ProfileData) => Promise<boolean>;
  
  // Links
  links: LinkData[];
  createLink: (linkData: LinkData) => Promise<boolean>;
  updateLink: (linkId: string, linkData: Partial<LinkData>) => Promise<boolean>;
  deleteLink: (linkId: string) => Promise<boolean>;
  reorderLinks: (linkIds: string[]) => Promise<boolean>;
  
  // Analytics
  analytics: AnalyticsData | null;
  trackPageView: (metadata?: any) => Promise<void>;
  trackLinkClick: (linkId: string, metadata?: any) => Promise<void>;
  refreshAnalytics: () => Promise<void>;
  
  // Pi Network
  processPiPayment: (amount: number, memo: string) => Promise<boolean>;
  
  // Subscription
  createSubscription: (plan: string, amount: number) => Promise<boolean>;
  
  // Health
  healthCheck: () => Promise<boolean>;
}

export function useDashboardBackend(userId?: string): UseDashboardBackendReturn {
  const { toast } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [links, setLinks] = useState<LinkData[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  // Initialize the service
  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await dashboardApiService.initialize();
      if (success) {
        setIsInitialized(true);
        console.log('✅ Dashboard backend initialized successfully');
      } else {
        throw new Error('Failed to initialize dashboard backend');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Dashboard backend initialization failed:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load user profile
  const loadProfile = useCallback(async () => {
    if (!userId || !isInitialized) return;
    
    try {
      const response = await dashboardApiService.getUserProfile(userId);
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        console.warn('Failed to load profile:', response.error);
      }
    } catch (err) {
      console.error('Profile loading error:', err);
    }
  }, [userId, isInitialized]);

  // Load user links
  const loadLinks = useCallback(async () => {
    if (!userId || !isInitialized) return;
    
    try {
      const response = await dashboardApiService.getUserLinks(userId);
      if (response.success && response.data) {
        setLinks(response.data);
      } else {
        console.warn('Failed to load links:', response.error);
      }
    } catch (err) {
      console.error('Links loading error:', err);
    }
  }, [userId, isInitialized]);

  // Load analytics
  const loadAnalytics = useCallback(async () => {
    if (!userId || !isInitialized) return;
    
    try {
      const response = await dashboardApiService.getAnalytics(userId);
      if (response.success && response.data) {
        setAnalytics(response.data);
      } else {
        console.warn('Failed to load analytics:', response.error);
      }
    } catch (err) {
      console.error('Analytics loading error:', err);
    }
  }, [userId, isInitialized]);

  // Update profile
  const updateProfile = useCallback(async (profileData: ProfileData): Promise<boolean> => {
    if (!userId || !isInitialized) return false;
    
    try {
      const response = await dashboardApiService.updateUserProfile(userId, profileData);
      if (response.success) {
        setProfile(response.data);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update profile",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [userId, isInitialized, toast]);

  // Create link
  const createLink = useCallback(async (linkData: LinkData): Promise<boolean> => {
    if (!userId || !isInitialized) return false;
    
    try {
      const response = await dashboardApiService.createLink(userId, linkData);
      if (response.success) {
        await loadLinks(); // Refresh links
        toast({
          title: "Link Created",
          description: "Your link has been created successfully.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create link",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [userId, isInitialized, loadLinks, toast]);

  // Update link
  const updateLink = useCallback(async (linkId: string, linkData: Partial<LinkData>): Promise<boolean> => {
    if (!isInitialized) return false;
    
    try {
      const response = await dashboardApiService.updateLink(linkId, linkData);
      if (response.success) {
        await loadLinks(); // Refresh links
        toast({
          title: "Link Updated",
          description: "Your link has been updated successfully.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to update link",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [isInitialized, loadLinks, toast]);

  // Delete link
  const deleteLink = useCallback(async (linkId: string): Promise<boolean> => {
    if (!isInitialized) return false;
    
    try {
      const response = await dashboardApiService.deleteLink(linkId);
      if (response.success) {
        await loadLinks(); // Refresh links
        toast({
          title: "Link Deleted",
          description: "Your link has been deleted successfully.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to delete link",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [isInitialized, loadLinks, toast]);

  // Reorder links
  const reorderLinks = useCallback(async (linkIds: string[]): Promise<boolean> => {
    if (!userId || !isInitialized) return false;
    
    try {
      const response = await dashboardApiService.reorderLinks(userId, linkIds);
      if (response.success) {
        await loadLinks(); // Refresh links
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to reorder links",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [userId, isInitialized, loadLinks, toast]);

  // Track page view
  const trackPageView = useCallback(async (metadata?: any): Promise<void> => {
    if (!userId || !isInitialized) return;
    
    try {
      await dashboardApiService.trackPageView(userId, metadata);
    } catch (err) {
      console.error('Page view tracking error:', err);
    }
  }, [userId, isInitialized]);

  // Track link click
  const trackLinkClick = useCallback(async (linkId: string, metadata?: any): Promise<void> => {
    if (!isInitialized) return;
    
    try {
      await dashboardApiService.trackLinkClick(linkId, metadata);
      await loadAnalytics(); // Refresh analytics
    } catch (err) {
      console.error('Link click tracking error:', err);
    }
  }, [isInitialized, loadAnalytics]);

  // Refresh analytics
  const refreshAnalytics = useCallback(async (): Promise<void> => {
    await loadAnalytics();
  }, [loadAnalytics]);

  // Process Pi payment
  const processPiPayment = useCallback(async (amount: number, memo: string): Promise<boolean> => {
    if (!userId || !isInitialized) return false;
    
    try {
      const response = await dashboardApiService.processPiPayment(userId, amount, memo);
      if (response.success) {
        toast({
          title: "Payment Processed",
          description: "Your Pi payment has been processed successfully.",
        });
        return true;
      } else {
        toast({
          title: "Payment Failed",
          description: response.error || "Payment processing failed",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [userId, isInitialized, toast]);

  // Create subscription
  const createSubscription = useCallback(async (plan: string, amount: number): Promise<boolean> => {
    if (!userId || !isInitialized) return false;
    
    try {
      const response = await dashboardApiService.createSubscription(userId, plan, amount);
      if (response.success) {
        toast({
          title: "Subscription Created",
          description: "Your subscription has been created successfully.",
        });
        return true;
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to create subscription",
          variant: "destructive",
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    }
  }, [userId, isInitialized, toast]);

  // Health check
  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const response = await dashboardApiService.healthCheck();
      return response.success;
    } catch (err) {
      console.error('Health check error:', err);
      return false;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Load data when user ID is available
  useEffect(() => {
    if (userId && isInitialized) {
      loadProfile();
      loadLinks();
      loadAnalytics();
    }
  }, [userId, isInitialized, loadProfile, loadLinks, loadAnalytics]);

  return {
    // State
    isLoading,
    isInitialized,
    error,
    
    // User & Profile
    profile,
    updateProfile,
    
    // Links
    links,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    
    // Analytics
    analytics,
    trackPageView,
    trackLinkClick,
    refreshAnalytics,
    
    // Pi Network
    processPiPayment,
    
    // Subscription
    createSubscription,
    
    // Health
    healthCheck,
  };
}

export default useDashboardBackend;
