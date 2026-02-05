
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ForumTopic {
  id: string;
  category_id: string;
  user_id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  is_locked: boolean;
  view_count: number;
  reply_count: number;
  last_reply_at: string;
  created_at: string;
  user_email?: string;
}

export const useForumTopics = (categoryId?: string) => {
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
  }, [categoryId]);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      
      // For development, return mock data if database tables don't exist
      if (import.meta.env.DEV) {
        const mockTopics: ForumTopic[] = [
          {
            id: '1',
            category_id: categoryId || '1',
            user_id: 'mock_user_1',
            title: 'How to get started with Droplink?',
            content: 'I\'m new to Droplink and would love some tips on getting started...',
            is_pinned: true,
            is_locked: false,
            view_count: 1250,
            reply_count: 23,
            last_reply_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            user_email: 'user@example.com'
          },
          {
            id: '2',
            category_id: categoryId || '1',
            user_id: 'mock_user_2',
            title: 'Best practices for Pi Network integration',
            content: 'What are the best practices for integrating Pi payments...',
            is_pinned: false,
            is_locked: false,
            view_count: 890,
            reply_count: 15,
            last_reply_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
            user_email: 'creator@example.com'
          },
          {
            id: '3',
            category_id: categoryId || '1',
            user_id: 'mock_user_3',
            title: 'Custom templates and design tips',
            content: 'I want to create a custom template for my profile...',
            is_pinned: false,
            is_locked: false,
            view_count: 567,
            reply_count: 8,
            last_reply_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
            user_email: 'designer@example.com'
          }
        ];
        
        setTopics(mockTopics);
        return;
      }
      
      let query = supabase
        .from('forum_topics')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('last_reply_at', { ascending: false });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      const { data, error } = await query;
      if (error) throw error;

      setTopics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async (topicData: {
    category_id: string;
    title: string;
    content: string;
  }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('forum_topics')
        .insert({
          ...topicData,
          user_id: user.id
        })
        .select()
        .single();

      if (error) throw error;
      await fetchTopics();
      return data;
    } catch (err) {
      throw err;
    }
  };

  return { topics, loading, error, createTopic, refetch: fetchTopics };
};
