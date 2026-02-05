// Complete Dashboard Data Hook
// Fixes connection issues and provides all dashboard functionality

import { useState, useEffect, useCallback } from 'react';
import { dashboardDataService, DashboardData } from '@/services/dashboardDataService';
import { supabaseConnectionService } from '@/services/supabaseConnectionService';
import { useRealtimeUpdates, RealtimeUpdate } from '@/hooks/useRealtimeUpdates';
import { useToast } from '@/hooks/use-toast';

export interface UseDashboardDataReturn {
  // State
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  dashboardData: DashboardData | null;
  isRealtimeConnected: boolean;
  lastUpdate: Date | null;
  updateCount: number;
  
  // Actions
  refreshData: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<boolean>;
  createLink: (linkData: any) => Promise<boolean>;
  updateLink: (linkId: string, linkData: any) => Promise<boolean>;
  deleteLink: (linkId: string) => Promise<boolean>;
  reorderLinks: (linkIds: string[]) => Promise<boolean>;
  trackPageView: (metadata?: any) => Promise<void>;
  trackLinkClick: (linkId: string, metadata?: any) => Promise<void>;
  createSubscription: (plan: string, amount: number) => Promise<boolean>;
  healthCheck: () => Promise<boolean>;
}

export function useDashboardData(userId?: string): UseDashboardDataReturn {
  const { toast } = useToast();
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  // Real-time updates
  const { isConnected: isRealtimeConnected, lastUpdate, updateCount } = useRealtimeUpdates({
    userId,
    onUpdate: (update: RealtimeUpdate) => {
      console.log('🔄 Real-time update received:', update);
      
      // Handle different types of updates
      switch (update.type) {
        case 'profile':
          if (update.action === 'update' && dashboardData) {
            setDashboardData(prev => prev ? {
              ...prev,
              profile: { ...prev.profile, ...update.data }
            } : null);
          }
          break;
          
        case 'link':
          if (dashboardData) {
            if (update.action === 'insert') {
              setDashboardData(prev => prev ? {
                ...prev,
                links: [...prev.links, update.data]
              } : null);
            } else if (update.action === 'update') {
              setDashboardData(prev => prev ? {
                ...prev,
                links: prev.links.map(link => 
                  link.id === update.data.id ? update.data : link
                )
              } : null);
            } else if (update.action === 'delete') {
              setDashboardData(prev => prev ? {
                ...prev,
                links: prev.links.filter(link => link.id !== update.oldData?.id)
              } : null);
            }
          }
          break;
          
        case 'analytics':
          // Refresh analytics data
          if (userId) {
            dashboardDataService.getUserAnalytics(userId).then(analytics => {
              setDashboardData(prev => prev ? {
                ...prev,
                analytics
              } : null);
            });
          }
          break;
          
        case 'subscription':
          if (update.action === 'insert' || update.action === 'update') {
            setDashboardData(prev => prev ? {
              ...prev,
              subscription: update.data
            } : null);
          }
          break;
          
        case 'product':
          if (update.action === 'insert') {
            setDashboardData(prev => prev ? {
              ...prev,
              products: [...prev.products, update.data]
            } : null);
          } else if (update.action === 'update') {
            setDashboardData(prev => prev ? {
              ...prev,
              products: prev.products.map(product => 
                product.id === update.data.id ? update.data : product
              )
            } : null);
          } else if (update.action === 'delete') {
            setDashboardData(prev => prev ? {
              ...prev,
              products: prev.products.filter(product => product.id !== update.oldData?.id)
            } : null);
          }
          break;
          
        case 'tip':
          if (update.action === 'insert') {
            setDashboardData(prev => prev ? {
              ...prev,
              tips: [...prev.tips, update.data]
            } : null);
          }
          break;
      }
    }
  });

  // Initialize service and load data
  const initializeAndLoadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🚀 Initializing dashboard data service...');
      
      // Initialize the service
      const initialized = await dashboardDataService.initialize();
      if (!initialized) {
        throw new Error('Failed to initialize dashboard data service');
      }

      // Test connection
      const connectionStatus = await supabaseConnectionService.testConnection();
      setIsConnected(connectionStatus.connected);
      
      if (!connectionStatus.connected) {
        throw new Error(connectionStatus.error || 'Failed to connect to database');
      }

      // Load dashboard data if user ID is provided
      if (userId) {
        console.log('📊 Loading dashboard data for user:', userId);
        const data = await dashboardDataService.loadDashboardData(userId);
        setDashboardData(data);
      }

      console.log('✅ Dashboard data service initialized successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('❌ Dashboard data initialization failed:', errorMessage);
      
      // Show user-friendly error message
      toast({
        title: "Connection Error",
        description: "Failed to connect to the database. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  // Refresh data
  const refreshData = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await dashboardDataService.loadDashboardData(userId);
      setDashboardData(data);
      
      toast({
        title: "Data Refreshed",
        description: "Dashboard data has been updated successfully.",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Data refresh failed:', errorMessage);
      
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, toast]);

  // Update profile
  const updateProfile = useCallback(async (profileData: any): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const updatedProfile = await dashboardDataService.updateUserProfile(userId, profileData);
      
      // Update local state
      setDashboardData(prev => prev ? {
        ...prev,
        profile: updatedProfile
      } : null);
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Profile update failed:', errorMessage);
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [userId, toast]);

  // Create link
  const createLink = useCallback(async (linkData: any): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const newLink = await dashboardDataService.createLink(userId, linkData);
      
      // Update local state
      setDashboardData(prev => prev ? {
        ...prev,
        links: [...prev.links, newLink]
      } : null);
      
      toast({
        title: "Link Created",
        description: "Your link has been created successfully.",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Link creation failed:', errorMessage);
      
      toast({
        title: "Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [userId, toast]);

  // Update link
  const updateLink = useCallback(async (linkId: string, linkData: any): Promise<boolean> => {
    try {
      const updatedLink = await dashboardDataService.updateLink(linkId, linkData);
      
      // Update local state
      setDashboardData(prev => prev ? {
        ...prev,
        links: prev.links.map(link => 
          link.id === linkId ? updatedLink : link
        )
      } : null);
      
      toast({
        title: "Link Updated",
        description: "Your link has been updated successfully.",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Link update failed:', errorMessage);
      
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);

  // Delete link
  const deleteLink = useCallback(async (linkId: string): Promise<boolean> => {
    try {
      await dashboardDataService.deleteLink(linkId);
      
      // Update local state
      setDashboardData(prev => prev ? {
        ...prev,
        links: prev.links.filter(link => link.id !== linkId)
      } : null);
      
      toast({
        title: "Link Deleted",
        description: "Your link has been deleted successfully.",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Link deletion failed:', errorMessage);
      
      toast({
        title: "Deletion Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [toast]);

  // Reorder links
  const reorderLinks = useCallback(async (linkIds: string[]): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      await dashboardDataService.reorderLinks(userId, linkIds);
      
      // Update local state
      setDashboardData(prev => prev ? {
        ...prev,
        links: linkIds.map((id, index) => {
          const link = prev.links.find(l => l.id === id);
          return link ? { ...link, position: index } : link;
        }).filter(Boolean)
      } : null);
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Link reordering failed:', errorMessage);
      
      toast({
        title: "Reordering Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [userId, toast]);

  // Track page view
  const trackPageView = useCallback(async (metadata?: any): Promise<void> => {
    if (!userId) return;
    
    try {
      await dashboardDataService.trackPageView(userId, metadata);
    } catch (err) {
      console.error('Page view tracking failed:', err);
    }
  }, [userId]);

  // Track link click
  const trackLinkClick = useCallback(async (linkId: string, metadata?: any): Promise<void> => {
    try {
      await dashboardDataService.trackLinkClick(linkId, metadata);
      
      // Refresh analytics
      if (userId) {
        const analytics = await dashboardDataService.getUserAnalytics(userId);
        setDashboardData(prev => prev ? {
          ...prev,
          analytics
        } : null);
      }
    } catch (err) {
      console.error('Link click tracking failed:', err);
    }
  }, [userId]);

  // Create subscription
  const createSubscription = useCallback(async (plan: string, amount: number): Promise<boolean> => {
    if (!userId) return false;
    
    try {
      const subscription = await dashboardDataService.createSubscription(userId, plan, amount);
      
      // Update local state
      setDashboardData(prev => prev ? {
        ...prev,
        subscription
      } : null);
      
      toast({
        title: "Subscription Created",
        description: "Your subscription has been created successfully.",
      });
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Subscription creation failed:', errorMessage);
      
      toast({
        title: "Subscription Failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  }, [userId, toast]);

  // Health check
  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const isHealthy = await dashboardDataService.healthCheck();
      setIsConnected(isHealthy);
      return isHealthy;
    } catch (err) {
      console.error('Health check failed:', err);
      setIsConnected(false);
      return false;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeAndLoadData();
  }, [initializeAndLoadData]);

  return {
    // State
    isLoading,
    isConnected,
    error,
    dashboardData,
    isRealtimeConnected,
    lastUpdate,
    updateCount,
    
    // Actions
    refreshData,
    updateProfile,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    trackPageView,
    trackLinkClick,
    createSubscription,
    healthCheck,
  };
}

export default useDashboardData;
