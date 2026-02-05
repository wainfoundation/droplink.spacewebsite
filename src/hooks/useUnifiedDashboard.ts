import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { realDataService, RealUserData } from '@/services/realDataService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/productionLogger';

export interface UnifiedDashboardData {
  // User & Profile
  user: any;
  profile: any;
  
  // Links
  links: any[];
  
  // Analytics
  analytics: any;
  dashboardStats: any;
  
  // Loading states
  isLoading: boolean;
  isInitialized: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  refreshData: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<boolean>;
  createLink: (linkData: any) => Promise<boolean>;
  updateLink: (linkId: string, linkData: any) => Promise<boolean>;
  deleteLink: (linkId: string) => Promise<boolean>;
  reorderLinks: (linkIds: string[]) => Promise<boolean>;
  
  // Analytics actions
  trackPageView: (metadata?: any) => Promise<void>;
  trackLinkClick: (linkId: string, metadata?: any) => Promise<void>;
  
  // Health check
  healthCheck: () => Promise<boolean>;
}

export function useUnifiedDashboard(): UnifiedDashboardData {
  const { user } = useUser();
  const { toast } = useToast();
  
  // State
  const [data, setData] = useState<RealUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize dashboard
  const initialize = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      setIsInitialized(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      logger.info('Initializing unified dashboard', { userId: user.id });
      
      // Test database connection
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      if (testError) {
        throw new Error(`Database connection failed: ${testError.message}`);
      }
      
      logger.info('Database connection successful');
      setIsInitialized(true);
      
      // Load user data
      await loadUserData();
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      logger.error('Dashboard initialization failed', err);
      
      toast({
        title: "Connection Error",
        description: "Failed to connect to database. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, toast]);

  // Load user data
  const loadUserData = useCallback(async () => {
    if (!user?.id || !isInitialized) return;

    try {
      logger.info('Loading user data', { userId: user.id });
      
      const userData = await realDataService.getUserData(user.id);
      
      if (userData) {
        setData(userData);
        logger.info('User data loaded successfully', { 
          profileId: userData.profile?.id,
          linksCount: userData.links?.length || 0
        });
      } else {
        // Create default profile if none exists
        await createDefaultProfile();
      }
    } catch (err) {
      logger.error('Failed to load user data', err);
      setError('Failed to load user data');
    }
  }, [user?.id, isInitialized]);

  // Create default profile
  const createDefaultProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      const defaultProfile = {
        id: user.id,
        username: user.user_metadata?.username || `user_${user.id.slice(0, 8)}`,
        display_name: user.user_metadata?.full_name || 'New User',
        bio: 'Welcome to Droplink!',
        avatar: user.user_metadata?.avatar_url || null,
        theme: 'default',
        is_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('profiles')
        .insert(defaultProfile);

      if (error) {
        logger.error('Failed to create default profile', error);
        return;
      }

      logger.info('Default profile created');
      await loadUserData();
    } catch (err) {
      logger.error('Error creating default profile', err);
    }
  }, [user?.id, loadUserData]);

  // Refresh data
  const refreshData = useCallback(async () => {
    if (!isInitialized) {
      await initialize();
      return;
    }
    
    await loadUserData();
  }, [initialize, loadUserData]);

  // Update profile
  const updateProfile = useCallback(async (profileData: any): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      logger.userAction('update_profile', { userId: user.id, profileData });
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        logger.error('Failed to update profile', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return false;
      }

      await refreshData();
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return true;
    } catch (err) {
      logger.error('Profile update error', err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, refreshData, toast]);

  // Create link
  const createLink = useCallback(async (linkData: any): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      logger.userAction('create_link', { userId: user.id, linkData });
      
      // Get current links count for position
      const { data: existingLinks } = await supabase
        .from('links')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const position = existingLinks?.length || 0;

      const { error } = await supabase
        .from('links')
        .insert({
          ...linkData,
          user_id: user.id,
          position,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        logger.error('Failed to create link', error);
        toast({
          title: "Error",
          description: "Failed to create link",
          variant: "destructive",
        });
        return false;
      }

      await refreshData();
      
      toast({
        title: "Success",
        description: "Link created successfully",
      });
      
      return true;
    } catch (err) {
      logger.error('Link creation error', err);
      toast({
        title: "Error",
        description: "Failed to create link",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, refreshData, toast]);

  // Update link
  const updateLink = useCallback(async (linkId: string, linkData: any): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      logger.userAction('update_link', { userId: user.id, linkId, linkData });
      
      const { error } = await supabase
        .from('links')
        .update({
          ...linkData,
          updated_at: new Date().toISOString()
        })
        .eq('id', linkId)
        .eq('user_id', user.id);

      if (error) {
        logger.error('Failed to update link', error);
        toast({
          title: "Error",
          description: "Failed to update link",
          variant: "destructive",
        });
        return false;
      }

      await refreshData();
      
      toast({
        title: "Success",
        description: "Link updated successfully",
      });
      
      return true;
    } catch (err) {
      logger.error('Link update error', err);
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, refreshData, toast]);

  // Delete link
  const deleteLink = useCallback(async (linkId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      logger.userAction('delete_link', { userId: user.id, linkId });
      
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', user.id);

      if (error) {
        logger.error('Failed to delete link', error);
        toast({
          title: "Error",
          description: "Failed to delete link",
          variant: "destructive",
        });
        return false;
      }

      await refreshData();
      
      toast({
        title: "Success",
        description: "Link deleted successfully",
      });
      
      return true;
    } catch (err) {
      logger.error('Link deletion error', err);
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, refreshData, toast]);

  // Reorder links
  const reorderLinks = useCallback(async (linkIds: string[]): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      logger.userAction('reorder_links', { userId: user.id, linkIds });
      
      const updates = linkIds.map((linkId, index) => 
        supabase
          .from('links')
          .update({ position: index, updated_at: new Date().toISOString() })
          .eq('id', linkId)
          .eq('user_id', user.id)
      );

      await Promise.all(updates);
      await refreshData();
      
      return true;
    } catch (err) {
      logger.error('Link reordering error', err);
      return false;
    }
  }, [user?.id, refreshData]);

  // Track page view
  const trackPageView = useCallback(async (metadata?: any): Promise<void> => {
    if (!user?.id) return;

    try {
      await supabase
        .from('link_analytics')
        .insert({
          user_id: user.id,
          link_id: null,
          event_type: 'page_view',
          metadata: metadata || {},
          created_at: new Date().toISOString()
        });
    } catch (err) {
      logger.error('Page view tracking error', err);
    }
  }, [user?.id]);

  // Track link click
  const trackLinkClick = useCallback(async (linkId: string, metadata?: any): Promise<void> => {
    if (!user?.id) return;

    try {
      await supabase
        .from('link_analytics')
        .insert({
          user_id: user.id,
          link_id: linkId,
          event_type: 'click',
          metadata: metadata || {},
          created_at: new Date().toISOString()
        });
    } catch (err) {
      logger.error('Link click tracking error', err);
    }
  }, [user?.id]);

  // Health check
  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      return !error;
    } catch (err) {
      logger.error('Health check failed', err);
      return false;
    }
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Return unified data
  return {
    // Data
    user: data?.user || user,
    profile: data?.profile || null,
    links: data?.links || [],
    analytics: data?.analytics || null,
    dashboardStats: data?.dashboardStats || null,
    
    // Loading states
    isLoading,
    isInitialized,
    
    // Error handling
    error,
    
    // Actions
    refreshData,
    updateProfile,
    createLink,
    updateLink,
    deleteLink,
    reorderLinks,
    trackPageView,
    trackLinkClick,
    healthCheck
  };
}

