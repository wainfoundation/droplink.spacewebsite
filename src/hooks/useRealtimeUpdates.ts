// Real-time Updates Hook
// Provides real-time synchronization for dashboard and public profiles

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RealtimeUpdate {
  type: 'profile' | 'link' | 'analytics' | 'subscription' | 'product' | 'tip';
  action: 'insert' | 'update' | 'delete';
  data: any;
  oldData?: any;
}

export interface UseRealtimeUpdatesOptions {
  userId?: string;
  profileId?: string;
  onUpdate?: (update: RealtimeUpdate) => void;
  enableProfileUpdates?: boolean;
  enableLinkUpdates?: boolean;
  enableAnalyticsUpdates?: boolean;
  enableSubscriptionUpdates?: boolean;
  enableProductUpdates?: boolean;
  enableTipUpdates?: boolean;
}

export function useRealtimeUpdates(options: UseRealtimeUpdatesOptions = {}) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);

  const {
    userId,
    profileId,
    onUpdate,
    enableProfileUpdates = true,
    enableLinkUpdates = true,
    enableAnalyticsUpdates = true,
    enableSubscriptionUpdates = true,
    enableProductUpdates = true,
    enableTipUpdates = true
  } = options;

  // Handle real-time updates
  const handleUpdate = useCallback((update: RealtimeUpdate) => {
    setLastUpdate(new Date());
    setUpdateCount(prev => prev + 1);
    
    if (onUpdate) {
      onUpdate(update);
    }

    // Show toast for important updates
    if (update.type === 'profile' && update.action === 'update') {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated in real-time.",
        duration: 3000,
      });
    } else if (update.type === 'link' && update.action === 'insert') {
      toast({
        title: "New Link Added",
        description: "A new link has been added to your profile.",
        duration: 3000,
      });
    } else if (update.type === 'link' && update.action === 'delete') {
      toast({
        title: "Link Removed",
        description: "A link has been removed from your profile.",
        duration: 3000,
      });
    }
  }, [onUpdate, toast]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!userId && !profileId) return;

    const subscriptions: any[] = [];

    // Profile updates subscription
    if (enableProfileUpdates && (userId || profileId)) {
      const profileChannel = supabase
        .channel(`profile-updates-${userId || profileId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId || profileId}`
          },
          (payload) => {
            handleUpdate({
              type: 'profile',
              action: payload.eventType as any,
              data: payload.new,
              oldData: payload.old
            });
          }
        )
        .subscribe();

      subscriptions.push(profileChannel);
    }

    // Links updates subscription
    if (enableLinkUpdates && (userId || profileId)) {
      const linksChannel = supabase
        .channel(`links-updates-${userId || profileId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'links',
            filter: `user_id=eq.${userId || profileId}`
          },
          (payload) => {
            handleUpdate({
              type: 'link',
              action: payload.eventType as any,
              data: payload.new,
              oldData: payload.old
            });
          }
        )
        .subscribe();

      subscriptions.push(linksChannel);
    }

    // Analytics updates subscription
    if (enableAnalyticsUpdates && (userId || profileId)) {
      const analyticsChannel = supabase
        .channel(`analytics-updates-${userId || profileId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'analytics',
            filter: `user_id=eq.${userId || profileId}`
          },
          (payload) => {
            handleUpdate({
              type: 'analytics',
              action: payload.eventType as any,
              data: payload.new,
              oldData: payload.old
            });
          }
        )
        .subscribe();

      subscriptions.push(analyticsChannel);
    }

    // Subscriptions updates subscription
    if (enableSubscriptionUpdates && (userId || profileId)) {
      const subscriptionChannel = supabase
        .channel(`subscription-updates-${userId || profileId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'subscriptions',
            filter: `user_id=eq.${userId || profileId}`
          },
          (payload) => {
            handleUpdate({
              type: 'subscription',
              action: payload.eventType as any,
              data: payload.new,
              oldData: payload.old
            });
          }
        )
        .subscribe();

      subscriptions.push(subscriptionChannel);
    }

    // Products updates subscription
    if (enableProductUpdates && (userId || profileId)) {
      const productsChannel = supabase
        .channel(`products-updates-${userId || profileId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'products',
            filter: `user_id=eq.${userId || profileId}`
          },
          (payload) => {
            handleUpdate({
              type: 'product',
              action: payload.eventType as any,
              data: payload.new,
              oldData: payload.old
            });
          }
        )
        .subscribe();

      subscriptions.push(productsChannel);
    }

    // Tips updates subscription
    if (enableTipUpdates && (userId || profileId)) {
      const tipsChannel = supabase
        .channel(`tips-updates-${userId || profileId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tips',
            filter: `to_user_id=eq.${userId || profileId}`
          },
          (payload) => {
            handleUpdate({
              type: 'tip',
              action: payload.eventType as any,
              data: payload.new,
              oldData: payload.old
            });
          }
        )
        .subscribe();

      subscriptions.push(tipsChannel);
    }

    // Set connected state
    setIsConnected(true);

    // Cleanup function
    return () => {
      subscriptions.forEach(subscription => {
        supabase.removeChannel(subscription);
      });
      setIsConnected(false);
    };
  }, [
    userId,
    profileId,
    enableProfileUpdates,
    enableLinkUpdates,
    enableAnalyticsUpdates,
    enableSubscriptionUpdates,
    enableProductUpdates,
    enableTipUpdates,
    handleUpdate
  ]);

  // Test connection
  const testConnection = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

      if (error) {
        throw new Error(`Connection test failed: ${error.message}`);
      }

      setIsConnected(true);
      return true;
    } catch (error) {
      console.error('Real-time connection test failed:', error);
      setIsConnected(false);
      return false;
    }
  }, []);

  return {
    isConnected,
    lastUpdate,
    updateCount,
    testConnection
  };
}

export default useRealtimeUpdates;
