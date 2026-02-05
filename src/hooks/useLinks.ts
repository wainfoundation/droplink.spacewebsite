
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Mock data for development
const MOCK_LINKS = [
  {
    id: "1",
    user_id: "mock-user",
    title: "Instagram",
    url: "https://instagram.com/myprofile",
    icon: "📷",
    position: 0,
    clicks: 1240,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2", 
    user_id: "mock-user",
    title: "YouTube Channel",
    url: "https://youtube.com/@mychannel",
    icon: "🎥",
    position: 1,
    clicks: 856,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "3",
    user_id: "mock-user", 
    title: "My Website",
    url: "https://mywebsite.com",
    icon: "🌐",
    position: 2,
    clicks: 432,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "4",
    user_id: "mock-user",
    title: "Contact Me",
    url: "mailto:hello@example.com", 
    icon: "📧",
    position: 3,
    clicks: 298,
    is_active: true,
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z"
  }
];

export function useLinks(userId?: string) {
  const [links, setLinks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveLinksToLocalStorage = (linksData: any[]) => {
    try {
      localStorage.setItem('mockLinks', JSON.stringify(linksData));
    } catch (error) {
      console.error('Error saving links to localStorage:', error);
    }
  };

  const loadLinksFromLocalStorage = () => {
    try {
      const storedLinks = localStorage.getItem('mockLinks');
      if (storedLinks) {
        return JSON.parse(storedLinks);
      }
      return null;
    } catch (error) {
      console.error('Error loading links from localStorage:', error);
      return null;
    }
  };

  const fetchLinks = async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        // Try to load from localStorage first
        const storedLinks = loadLinksFromLocalStorage();
        if (storedLinks && storedLinks.length > 0) {
          console.log("Using links from localStorage");
          setLinks(storedLinks);
        } else {
          // Use default mock data
          console.log("Using default mock links data");
          setLinks(MOCK_LINKS);
          saveLinksToLocalStorage(MOCK_LINKS);
        }
        return;
      }
      
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });
      
      if (error) throw error;
      
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Failed to load links",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [userId]);

  const addLink = async (linkData: {
    title: string;
    url: string;
    icon: string;
    is_active?: boolean;
  }) => {
    try {
      const newLink = {
        id: `link_${Date.now()}`,
        user_id: userId || 'mock-user',
        title: linkData.title,
        url: linkData.url,
        icon: linkData.icon,
        position: links.length,
        clicks: 0,
        is_active: linkData.is_active !== undefined ? linkData.is_active : true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        const updatedLinks = [...links, newLink];
        setLinks(updatedLinks);
        saveLinksToLocalStorage(updatedLinks);
        return { success: true, data: newLink };
      }

      const { data, error } = await supabase
        .from('links')
        .insert([newLink])
        .select()
        .single();

      if (error) throw error;

      setLinks(prev => [...prev, data]);
      return { success: true, data };
    } catch (error) {
      console.error('Error adding link:', error);
      toast({
        title: "Failed to add link",
        description: "Please try again",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const updateLink = async (linkId: string, linkData: {
    title?: string;
    url?: string;
    icon?: string;
    is_active?: boolean;
  }) => {
    try {
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        const updatedLinks = links.map(link => 
          link.id === linkId 
            ? { ...link, ...linkData, updated_at: new Date().toISOString() }
            : link
        );
        setLinks(updatedLinks);
        saveLinksToLocalStorage(updatedLinks);
        return { success: true };
      }

      const { error } = await supabase
        .from('links')
        .update({ ...linkData, updated_at: new Date().toISOString() })
        .eq('id', linkId);

      if (error) throw error;

      setLinks(prev => prev.map(link => 
        link.id === linkId 
          ? { ...link, ...linkData, updated_at: new Date().toISOString() }
          : link
      ));
      return { success: true };
    } catch (error) {
      console.error('Error updating link:', error);
      toast({
        title: "Failed to update link",
        description: "Please try again",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        const updatedLinks = links.filter(link => link.id !== linkId);
        setLinks(updatedLinks);
        saveLinksToLocalStorage(updatedLinks);
        return { success: true };
      }

      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;

      setLinks(prev => prev.filter(link => link.id !== linkId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Failed to delete link",
        description: "Please try again",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const handleReorderLink = async (direction: 'up' | 'down', linkId: string, currentPosition: number) => {
    try {
      const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1;
      
      if (newPosition < 0 || newPosition >= links.length) {
        return { success: false, error: 'Invalid position' };
      }

      const updatedLinks = [...links];
      const linkToMove = updatedLinks[currentPosition];
      const linkToSwap = updatedLinks[newPosition];

      updatedLinks[currentPosition] = { ...linkToSwap, position: currentPosition };
      updatedLinks[newPosition] = { ...linkToMove, position: newPosition };

      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        setLinks(updatedLinks);
        saveLinksToLocalStorage(updatedLinks);
        return { success: true };
      }

      // Update both links in database
      const { error } = await supabase
        .from('links')
        .upsert([
          { id: linkToMove.id, position: newPosition, updated_at: new Date().toISOString() },
          { id: linkToSwap.id, position: currentPosition, updated_at: new Date().toISOString() }
        ]);

      if (error) throw error;

      setLinks(updatedLinks);
      return { success: true };
    } catch (error) {
      console.error('Error reordering link:', error);
      toast({
        title: "Failed to reorder link",
        description: "Please try again",
        variant: "destructive",
      });
      return { success: false, error };
    }
  };

  const trackLinkClick = async (linkId: string) => {
    try {
      // Check if we're in mock mode
      const mockSession = localStorage.getItem('mockSession');
      if (mockSession) {
        const updatedLinks = links.map(link => 
          link.id === linkId 
            ? { ...link, clicks: (link.clicks || 0) + 1 }
            : link
        );
        setLinks(updatedLinks);
        saveLinksToLocalStorage(updatedLinks);
        return { success: true };
      }

      const { error } = await supabase
        .from('links')
        .update({ 
          clicks: (links.find(l => l.id === linkId)?.clicks || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', linkId);

      if (error) throw error;

      setLinks(prev => prev.map(link => 
        link.id === linkId 
          ? { ...link, clicks: (link.clicks || 0) + 1 }
          : link
      ));
      return { success: true };
    } catch (error) {
      console.error('Error tracking link click:', error);
      return { success: false, error };
    }
  };

  return {
    links,
    isLoading,
    addLink,
    updateLink,
    deleteLink,
    handleReorderLink,
    trackLinkClick,
    fetchLinks
  };
}
