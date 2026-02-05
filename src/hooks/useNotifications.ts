import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  user_id: string;
  type: 'tip_received' | 'link_clicked' | 'profile_viewed' | 'system' | 'upgrade' | 'feature';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  tip_notifications: boolean;
  link_notifications: boolean;
  system_notifications: boolean;
  marketing_notifications: boolean;
}

// Mock notifications
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    user_id: "current_user",
    type: "tip_received",
    title: "New Pi Tip Received! 🎉",
    message: "You received 5 π from @john_doe",
    data: { amount: 5, from_user: "john_doe" },
    read: false,
    created_at: "2024-01-21T15:30:00Z"
  },
  {
    id: "2",
    user_id: "current_user",
    type: "link_clicked",
    title: "Link Clicked",
    message: "Your Instagram link was clicked 10 times today",
    data: { link_id: "1", clicks: 10 },
    read: false,
    created_at: "2024-01-21T14:20:00Z"
  },
  {
    id: "3",
    user_id: "current_user",
    type: "profile_viewed",
    title: "Profile Views Up!",
    message: "Your profile had 25 views today",
    data: { views: 25 },
    read: true,
    created_at: "2024-01-21T12:00:00Z"
  },
  {
    id: "4",
    user_id: "current_user",
    type: "system",
    title: "Welcome to Droplink!",
    message: "Your profile is now live and ready to share",
    read: true,
    created_at: "2024-01-20T10:00:00Z"
  }
];

const MOCK_SETTINGS: NotificationSettings = {
  email_notifications: true,
  push_notifications: true,
  tip_notifications: true,
  link_notifications: true,
  system_notifications: true,
  marketing_notifications: false
};

export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(MOCK_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setNotifications(MOCK_NOTIFICATIONS);
        return;
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Failed to load notifications",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchNotificationSettings = async () => {
    if (!userId) return;
    
    try {
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setSettings(MOCK_SETTINGS);
        return;
      }
      
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings({
          email_notifications: data.email_notifications,
          push_notifications: data.push_notifications,
          tip_notifications: data.tip_notifications,
          link_notifications: data.link_notifications,
          system_notifications: data.system_notifications,
          marketing_notifications: data.marketing_notifications
        });
      }
      
    } catch (error) {
      console.error('Error fetching notification settings:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setNotifications(prev => prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ));
        return { success: true };
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
      
      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false, error };
    }
  };

  const markAllAsRead = async () => {
    try {
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
        return { success: true };
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      
      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false, error };
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        return { success: true };
      }
      
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false, error };
    }
  };

  const createNotification = async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    try {
      const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}`,
        created_at: new Date().toISOString()
      };

      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setNotifications(prev => [newNotification, ...prev]);
        return { success: true, notification: newNotification };
      }
      
      const { data, error } = await supabase
        .from('notifications')
        .insert([newNotification])
        .select()
        .single();

      if (error) throw error;
      
      setNotifications(prev => [data, ...prev]);
      
      return { success: true, notification: data };
    } catch (error) {
      console.error('Error creating notification:', error);
      return { success: false, error };
    }
  };

  const updateNotificationSettings = async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setSettings(updatedSettings);
        localStorage.setItem('notificationSettings', JSON.stringify(updatedSettings));
        return { success: true };
      }
      
      const { error } = await supabase
        .from('notification_settings')
        .upsert({
          user_id: userId,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setSettings(updatedSettings);
      return { success: true };
      
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast({
        title: "Failed to update settings",
        description: "Please try again",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const getNotificationsByType = (type: Notification['type']) => {
    return notifications.filter(notif => notif.type === type);
  };

  const getRecentNotifications = (limit: number = 5) => {
    return notifications.slice(0, limit);
  };

  useEffect(() => {
    fetchNotifications();
    fetchNotificationSettings();
  }, [userId]);

  return {
    notifications,
    settings,
    isLoading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification,
    updateNotificationSettings,
    getUnreadCount,
    getNotificationsByType,
    getRecentNotifications,
    fetchNotifications
  };
}
