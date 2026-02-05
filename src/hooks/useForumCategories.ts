
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ForumCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  sort_order: number;
  topic_count?: number;
  latest_activity?: string;
}

export const useForumCategories = () => {
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      
      // For development, return mock data if database tables don't exist
      if (import.meta.env.DEV) {
        const mockCategories: ForumCategory[] = [
          {
            id: '1',
            name: 'Getting Started',
            description: 'New to Droplink? Start here with guides and tutorials.',
            icon: '🚀',
            color: 'bg-blue-100 text-blue-600',
            is_active: true,
            sort_order: 1,
            topic_count: 45,
            latest_activity: '2 hours ago'
          },
          {
            id: '2',
            name: 'Features & Tips',
            description: 'Share tips, tricks, and feature requests for Droplink.',
            icon: '💡',
            color: 'bg-green-100 text-green-600',
            is_active: true,
            sort_order: 2,
            topic_count: 128,
            latest_activity: '1 hour ago'
          },
          {
            id: '3',
            name: 'Pi Network Integration',
            description: 'Discuss Pi payments, tips, and Pi Network features.',
            icon: 'π',
            color: 'bg-orange-100 text-orange-600',
            is_active: true,
            sort_order: 3,
            topic_count: 89,
            latest_activity: '30 minutes ago'
          },
          {
            id: '4',
            name: 'Templates & Design',
            description: 'Share templates, design tips, and customization ideas.',
            icon: '🎨',
            color: 'bg-purple-100 text-purple-600',
            is_active: true,
            sort_order: 4,
            topic_count: 67,
            latest_activity: '15 minutes ago'
          },
          {
            id: '5',
            name: 'Community Showcase',
            description: 'Show off your Droplink profiles and get feedback.',
            icon: '⭐',
            color: 'bg-yellow-100 text-yellow-600',
            is_active: true,
            sort_order: 5,
            topic_count: 156,
            latest_activity: '5 minutes ago'
          },
          {
            id: '6',
            name: 'Support & Help',
            description: 'Get help with technical issues and account problems.',
            icon: '🆘',
            color: 'bg-red-100 text-red-600',
            is_active: true,
            sort_order: 6,
            topic_count: 234,
            latest_activity: '1 minute ago'
          }
        ];
        
        setCategories(mockCategories);
        return;
      }
      
      // First get categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('forum_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (categoriesError) throw categoriesError;

      // Then get topic counts for each category
      const categoriesWithCounts = await Promise.all(
        (categoriesData || []).map(async (category) => {
          const { count } = await supabase
            .from('forum_topics')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id);

          return {
            ...category,
            topic_count: count || 0,
            latest_activity: '2 hours ago' // This would be calculated from actual data
          };
        })
      );

      setCategories(categoriesWithCounts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
};
