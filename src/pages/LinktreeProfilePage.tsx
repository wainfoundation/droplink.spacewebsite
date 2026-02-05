import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DroplinkExactStyle from '@/components/profile/LinktreeExactStyle';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  username: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  theme?: string;
  custom_colors?: {
    primary: string;
    secondary: string;
    background: string;
  };
}

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  icon?: string;
  is_active: boolean;
  clicks: number;
  type?: 'link' | 'tip' | 'product' | 'contact' | 'social';
}

const LinktreeProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) {
        setError('Username is required');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (profileError) {
          if (profileError.code === 'PGRST116') {
            setError('Profile not found');
          } else {
            setError('Failed to load profile');
          }
          setIsLoading(false);
          return;
        }

        // Fetch links data
        const { data: linksData, error: linksError } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', profileData.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (linksError) {
          console.error('Error fetching links:', linksError);
          // Continue without links rather than failing completely
        }

        // Transform profile data to match component interface
        const transformedProfile: Profile = {
          id: profileData.id,
          username: profileData.username,
          displayName: profileData.display_name,
          bio: profileData.bio,
          avatar: profileData.avatar_url,
          theme: profileData.theme || 'gradient',
          customColors: profileData.custom_colors || {
            primary: '#8B5CF6',
            secondary: '#EC4899',
            background: '#F3F4F6'
          }
        };

        // Transform links data
        const transformedLinks: Link[] = (linksData || []).map(link => ({
          id: link.id,
          title: link.title,
          url: link.url,
          description: link.description,
          icon: link.icon || '🔗',
          is_active: link.is_active,
          clicks: link.clicks || 0,
          type: link.type || 'link'
        }));

        setProfile(transformedProfile);
        setLinks(transformedLinks);

        // Track profile view
        await supabase
          .from('profile_views')
          .insert({
            profile_id: profileData.id,
            viewed_at: new Date().toISOString()
          });

      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [username]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <DroplinkExactStyle 
      profile={profile || undefined}
      links={links}
      isLoading={isLoading}
    />
  );
};

export default LinktreeProfilePage;
