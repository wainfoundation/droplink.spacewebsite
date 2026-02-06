import { supabase } from '@/integrations/supabase/client';

export interface BlogStats {
  slug: string;
  likes_count: number;
  views_count: number;
}

export const blogService = {
  // Subscribe to realtime updates for a specific post
  subscribeToStats(slug: string, onUpdate: (stats: BlogStats) => void) {
    return supabase
      .channel(`blog_stats:${slug}`)
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE)
          schema: 'public',
          table: 'blog_stats',
          filter: `slug=eq.${slug}`,
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          if (payload.new) {
            onUpdate(payload.new as BlogStats);
          }
        }
      )
      .subscribe();
  },

  // Get initial stats
  async getStats(slug: string): Promise<BlogStats | null> {
    const { data, error } = await supabase
      .from('blog_stats')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching blog stats:', error);
      return null;
    }

    // If no stats exist yet, return zeros (but don't create row yet, let the first interaction do it)
    if (!data) {
      return { slug, likes_count: 0, views_count: 0 };
    }

    return data as BlogStats;
  },

  // Increment view count (atomic)
  async incrementView(slug: string) {
    const { error } = await supabase.rpc('increment_blog_view', { slug_input: slug });
    if (error) {
      console.error('Error incrementing view:', error);
      // Fallback if RPC fails (e.g. not created yet): try insert/update manually (less safe)
    }
  },

  // Increment like count (atomic)
  async incrementLike(slug: string, amount: number = 1) {
    const { error } = await supabase.rpc('increment_blog_like', { 
      slug_input: slug, 
      increment_amount: amount 
    });
    
    if (error) {
      console.error('Error incrementing like:', error);
    }
  }
};
