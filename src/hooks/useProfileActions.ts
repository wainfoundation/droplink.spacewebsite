
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProfileActions = (profileId: string | undefined) => {
  const [processingTip, setProcessingTip] = useState(false);
  const { toast } = useToast();

  const handleLinkClick = async (link: any) => {
    try {

      // Track link click in analytics
      if (profileId) {
        const { error: analyticsError } = await supabase
          .from('analytics')
          .insert({
            user_id: profileId,
            link_click: true,
            link_id: link.id,
            link_title: link.title,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
          });

        if (analyticsError) {
          console.error("Failed to track link click:", analyticsError);
        }
      }

      // Update link click count
      const { error: linkUpdateError } = await supabase
        .from('links')
        .update({ clicks: (link.clicks || 0) + 1 })
        .eq('id', link.id);

      if (linkUpdateError) {
        console.error("Failed to update link clicks:", linkUpdateError);
      }

      // Open the link
      window.open(link.url, '_blank');

    } catch (error) {
      console.error("Error handling link click:", error);
      // Still open the link even if tracking fails
      window.open(link.url, '_blank');
    }
  };

  const handleTipSubmit = async (amount: number, message: string, username: string) => {
    setProcessingTip(true);
    
    try {

      // Process tip with Pi Network
      const { error } = await supabase
        .from('tips')
        .insert({
          recipient_id: profileId,
          amount: amount,
          message: message,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Tip Processing",
        description: `Your ${amount}π tip is being processed...`,
      });

    } catch (error) {
      console.error("Error processing tip:", error);
      toast({
        title: "Tip Failed",
        description: "Failed to process your tip. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingTip(false);
    }
  };

  const handleShareProfile = async (username: string) => {
    try {
      const profileUrl = `https://droplink.space/@${username}`;
      
      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: `${username} on Droplink`,
          text: `Check out ${username}'s links on Droplink!`,
          url: profileUrl,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(profileUrl);
        toast({
          title: "Profile URL Copied!",
          description: "Share this link with your friends",
        });
      }

      // Track share event
      if (profileId) {
        const { error: analyticsError } = await supabase
          .from('analytics')
          .insert({
            user_id: profileId,
            share: true,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
          });

        if (analyticsError) {
          console.error("Failed to track share:", analyticsError);
        }
      }

    } catch (error) {
      console.error("Error sharing profile:", error);
      toast({
        title: "Share Failed",
        description: "Failed to share profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyProfileUrl = async (username: string) => {
    try {
      const profileUrl = `https://droplink.space/@${username}`;
      await navigator.clipboard.writeText(profileUrl);
      
      toast({
        title: "Profile URL Copied! 📋",
        description: "Share this link with your friends",
      });

      // Track copy event
      if (profileId) {
        const { error: analyticsError } = await supabase
          .from('analytics')
          .insert({
            user_id: profileId,
            copy_url: true,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
          });

        if (analyticsError) {
          console.error("Failed to track URL copy:", analyticsError);
        }
      }

    } catch (error) {
      console.error("Error copying profile URL:", error);
      toast({
        title: "Copy Failed",
        description: "Failed to copy profile URL. Please try again.",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = (username: string) => {
    const profileUrl = `https://droplink.space/@${username}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(profileUrl)}`;
    return qrCodeUrl;
  };

  return {
    processingTip,
    handleLinkClick,
    handleTipSubmit,
    handleShareProfile,
    copyProfileUrl,
    generateQRCode
  };
};
