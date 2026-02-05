import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PiTip {
  id: string;
  from_user: string;
  to_user: string;
  amount: number;
  message?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
}

interface TippingSettings {
  enabled: boolean;
  default_amount: number;
  custom_message: string;
  show_tip_history: boolean;
}

// Mock tipping data
const MOCK_TIPS: PiTip[] = [
  {
    id: "1",
    from_user: "pi_user_123",
    to_user: "current_user",
    amount: 5,
    message: "Great content! Keep it up!",
    status: "completed",
    created_at: "2024-01-20T10:00:00Z",
    completed_at: "2024-01-20T10:01:00Z"
  },
  {
    id: "2",
    from_user: "pi_user_456",
    to_user: "current_user",
    amount: 10,
    message: "Love your work!",
    status: "completed",
    created_at: "2024-01-19T15:30:00Z",
    completed_at: "2024-01-19T15:31:00Z"
  }
];

const MOCK_TIPPING_SETTINGS: TippingSettings = {
  enabled: true,
  default_amount: 5,
  custom_message: "Thanks for the tip! 🙏",
  show_tip_history: true
};

export function usePiTipping(userId?: string) {
  const [tips, setTips] = useState<PiTip[]>([]);
  const [tippingSettings, setTippingSettings] = useState<TippingSettings>(MOCK_TIPPING_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [isTipping, setIsTipping] = useState(false);
  const { toast } = useToast();

  const fetchTips = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setTips(MOCK_TIPS);
        return;
      }
      
      const { data, error } = await supabase
        .from('pi_tips')
        .select('*')
        .eq('to_user', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTips(data || []);
      
    } catch (error) {
      console.error('Error fetching tips:', error);
      toast({
        title: "Failed to load tips",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTippingSettings = async () => {
    if (!userId) return;
    
    try {
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setTippingSettings(MOCK_TIPPING_SETTINGS);
        return;
      }
      
      const { data, error } = await supabase
        .from('tipping_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setTippingSettings({
          enabled: data.enabled,
          default_amount: data.default_amount,
          custom_message: data.custom_message,
          show_tip_history: data.show_tip_history
        });
      }
      
    } catch (error) {
      console.error('Error fetching tipping settings:', error);
    }
  };

  const sendTip = async (toUserId: string, amount: number, message?: string) => {
    try {
      setIsTipping(true);
      
      // Check if Pi SDK is available
      if (!window.Pi) {
        throw new Error("Pi Network SDK not available");
      }

      // Create payment request
      const paymentData = {
        amount: amount,
        memo: message || "Tip via Droplink",
        metadata: {
          to_user: toUserId,
          from_user: userId,
          type: "tip"
        }
      };

      // Mock tip for development
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        const newTip: PiTip = {
          id: `tip_${Date.now()}`,
          from_user: userId || 'current_user',
          to_user: toUserId,
          amount,
          message,
          status: 'completed',
          created_at: new Date().toISOString(),
          completed_at: new Date().toISOString()
        };
        
        setTips(prev => [newTip, ...prev]);
        
        toast({
          title: "Tip Sent! 🎉",
          description: `You sent ${amount} π to this user`,
        });
        
        return { success: true, tip: newTip };
      }

      // Real Pi payment would go here
      // Note: The actual Pi SDK method might be different
      // This is a placeholder for the real implementation
      const payment = await (window.Pi as any).createPayment?.(paymentData);
      
      if (payment) {
        const newTip: PiTip = {
          id: payment.identifier,
          from_user: userId || 'current_user',
          to_user: toUserId,
          amount,
          message,
          status: 'pending',
          created_at: new Date().toISOString()
        };
        
        setTips(prev => [newTip, ...prev]);
        
        toast({
          title: "Tip Sent! 🎉",
          description: `You sent ${amount} π to this user`,
        });
        
        return { success: true, tip: newTip };
      }
      
      return { success: false, error: "Payment failed" };
      
    } catch (error) {
      console.error('Error sending tip:', error);
      toast({
        title: "Failed to send tip",
        description: "Please try again",
        variant: "destructive",
      });
      return { success: false, error };
    } finally {
      setIsTipping(false);
    }
  };

  const updateTippingSettings = async (settings: Partial<TippingSettings>) => {
    try {
      if (!userId) return { success: false };
      
      const updatedSettings = { ...tippingSettings, ...settings };
      
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setTippingSettings(updatedSettings);
        localStorage.setItem('tippingSettings', JSON.stringify(updatedSettings));
        return { success: true };
      }
      
      const { error } = await supabase
        .from('tipping_settings')
        .upsert({
          user_id: userId,
          ...updatedSettings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setTippingSettings(updatedSettings);
      return { success: true };
      
    } catch (error) {
      console.error('Error updating tipping settings:', error);
      toast({
        title: "Failed to update settings",
        description: "Please try again",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const getTotalTipsReceived = () => {
    return tips
      .filter(tip => tip.status === 'completed')
      .reduce((total, tip) => total + tip.amount, 0);
  };

  const getTotalTipsSent = () => {
    return tips
      .filter(tip => tip.from_user === userId && tip.status === 'completed')
      .reduce((total, tip) => total + tip.amount, 0);
  };

  const getRecentTips = (limit: number = 5) => {
    return tips
      .filter(tip => tip.status === 'completed')
      .slice(0, limit);
  };

  useEffect(() => {
    fetchTips();
    fetchTippingSettings();
  }, [userId]);

  return {
    tips,
    tippingSettings,
    isLoading,
    isTipping,
    sendTip,
    updateTippingSettings,
    getTotalTipsReceived,
    getTotalTipsSent,
    getRecentTips,
    fetchTips
  };
}