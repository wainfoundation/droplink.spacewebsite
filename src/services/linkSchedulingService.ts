import { supabase } from '@/integrations/supabase/client';

export interface ScheduledLink {
  id: string;
  linkId: string;
  userId: string;
  scheduledDate: string;
  expiresAt?: string;
  isActive: boolean;
  timezone: string;
  recurring?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LinkScheduleConfig {
  timezone: string;
  defaultScheduling: boolean;
  autoExpire: boolean;
  maxScheduledLinks: number;
}

class LinkSchedulingService {
  private static instance: LinkSchedulingService;
  private scheduledLinks: Map<string, ScheduledLink> = new Map();
  private intervalId: NodeJS.Timeout | null = null;

  public static getInstance(): LinkSchedulingService {
    if (!LinkSchedulingService.instance) {
      LinkSchedulingService.instance = new LinkSchedulingService();
    }
    return LinkSchedulingService.instance;
  }

  public async initialize(): Promise<void> {
    await this.loadScheduledLinks();
    this.startScheduler();
  }

  private async loadScheduledLinks(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('scheduled_links')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error loading scheduled links:', error);
        return;
      }

      data?.forEach(link => {
        this.scheduledLinks.set(link.id, link);
      });
    } catch (error) {
      console.error('Error loading scheduled links:', error);
    }
  }

  private startScheduler(): void {
    // Check every minute for scheduled links
    this.intervalId = setInterval(() => {
      this.processScheduledLinks();
    }, 60000);
  }

  private async processScheduledLinks(): Promise<void> {
    const now = new Date();
    
    for (const [id, scheduledLink] of this.scheduledLinks) {
      const scheduledDate = new Date(scheduledLink.scheduledDate);
      const expiresAt = scheduledLink.expiresAt ? new Date(scheduledLink.expiresAt) : null;

      // Check if link should be activated
      if (scheduledDate <= now && scheduledLink.isActive) {
        await this.activateLink(scheduledLink);
      }

      // Check if link should be deactivated
      if (expiresAt && expiresAt <= now && scheduledLink.isActive) {
        await this.deactivateLink(scheduledLink);
      }
    }
  }

  private async activateLink(scheduledLink: ScheduledLink): Promise<void> {
    try {
      // Update link status in database
      const { error } = await supabase
        .from('links')
        .update({ is_active: true })
        .eq('id', scheduledLink.linkId);

      if (error) {
        console.error('Error activating link:', error);
        return;
      }

      // Update scheduled link status
      await supabase
        .from('scheduled_links')
        .update({ is_active: false })
        .eq('id', scheduledLink.id);

      // Remove from memory
      this.scheduledLinks.delete(scheduledLink.id);

      console.log(`Link ${scheduledLink.linkId} activated at scheduled time`);
    } catch (error) {
      console.error('Error activating link:', error);
    }
  }

  private async deactivateLink(scheduledLink: ScheduledLink): Promise<void> {
    try {
      // Update link status in database
      const { error } = await supabase
        .from('links')
        .update({ is_active: false })
        .eq('id', scheduledLink.linkId);

      if (error) {
        console.error('Error deactivating link:', error);
        return;
      }

      // Update scheduled link status
      await supabase
        .from('scheduled_links')
        .update({ is_active: false })
        .eq('id', scheduledLink.id);

      // Remove from memory
      this.scheduledLinks.delete(scheduledLink.id);

      console.log(`Link ${scheduledLink.linkId} deactivated at scheduled time`);
    } catch (error) {
      console.error('Error deactivating link:', error);
    }
  }

  public async scheduleLink(
    linkId: string,
    userId: string,
    scheduledDate: string,
    expiresAt?: string,
    timezone: string = 'UTC',
    recurring?: {
      type: 'daily' | 'weekly' | 'monthly';
      interval: number;
      endDate?: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const scheduledLink: Omit<ScheduledLink, 'id' | 'createdAt' | 'updatedAt'> = {
        linkId,
        userId,
        scheduledDate,
        expiresAt,
        isActive: true,
        timezone,
        recurring
      };

      const { data, error } = await supabase
        .from('scheduled_links')
        .insert(scheduledLink)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      // Add to memory
      this.scheduledLinks.set(data.id, data);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async getScheduledLinks(userId: string): Promise<ScheduledLink[]> {
    try {
      const { data, error } = await supabase
        .from('scheduled_links')
        .select('*')
        .eq('user_id', userId)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching scheduled links:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching scheduled links:', error);
      return [];
    }
  }

  public async cancelScheduledLink(scheduledLinkId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('scheduled_links')
        .update({ is_active: false })
        .eq('id', scheduledLinkId);

      if (error) {
        return { success: false, error: error.message };
      }

      // Remove from memory
      this.scheduledLinks.delete(scheduledLinkId);

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public async updateScheduledLink(
    scheduledLinkId: string,
    updates: Partial<ScheduledLink>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('scheduled_links')
        .update(updates)
        .eq('id', scheduledLinkId);

      if (error) {
        return { success: false, error: error.message };
      }

      // Update in memory
      const existing = this.scheduledLinks.get(scheduledLinkId);
      if (existing) {
        this.scheduledLinks.set(scheduledLinkId, { ...existing, ...updates });
      }

      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  public destroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.scheduledLinks.clear();
  }
}

export const linkSchedulingService = LinkSchedulingService.getInstance();
