import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { realDataService, RealUserData } from '@/services/realDataService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface UseRealDataReturn {
  data: RealUserData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<boolean>;
  createLink: (linkData: any) => Promise<boolean>;
  updateLink: (linkId: string, linkData: any) => Promise<boolean>;
  deleteLink: (linkId: string) => Promise<boolean>;
}

export function useRealData(): UseRealDataReturn {
  const { user } = useUser();
  const { toast } = useToast();
  
  const [data, setData] = useState<RealUserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load real user data
  const loadData = useCallback(async () => {
    if (!user?.id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await realDataService.getUserData(user.id);
      
      if (userData) {
        setData(userData);
      } else {
        setError('Failed to load user data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error loading real data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Refresh data
  const refresh = useCallback(async () => {
    await loadData();
  }, [loadData]);

  // Update profile
  const updateProfile = useCallback(async (profileData: any): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        return false;
      }

      // Refresh data
      await refresh();
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, refresh, toast]);

  // Create link
  const createLink = useCallback(async (linkData: any): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('links')
        .insert({
          ...linkData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create link",
          variant: "destructive",
        });
        return false;
      }

      // Refresh data
      await refresh();
      
      toast({
        title: "Success",
        description: "Link created successfully",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create link",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, refresh, toast]);

  // Update link
  const updateLink = useCallback(async (linkId: string, linkData: any): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('links')
        .update({
          ...linkData,
          updated_at: new Date().toISOString()
        })
        .eq('id', linkId)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update link",
          variant: "destructive",
        });
        return false;
      }

      // Refresh data
      await refresh();
      
      toast({
        title: "Success",
        description: "Link updated successfully",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update link",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, refresh, toast]);

  // Delete link
  const deleteLink = useCallback(async (linkId: string): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)
        .eq('user_id', user.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete link",
          variant: "destructive",
        });
        return false;
      }

      // Refresh data
      await refresh();
      
      toast({
        title: "Success",
        description: "Link deleted successfully",
      });
      
      return true;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
      return false;
    }
  }, [user?.id, refresh, toast]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    isLoading,
    error,
    refresh,
    updateProfile,
    createLink,
    updateLink,
    deleteLink
  };
}
