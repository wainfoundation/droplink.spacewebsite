import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export type SubscriptionPlan = "free" | "basic" | "pro" | "premium" | null;

interface UserContextType {
  user: User | null;
  profile: any;
  subscription: any;
  isLoading: boolean;
  isLoggedIn: boolean;
  showAds: boolean;
  isAdmin: boolean;
  currentPlan: SubscriptionPlan;
  setIsAdmin: (value: boolean) => void;
  refreshUserData: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  cancelSubscription: () => Promise<boolean>;
  upgradePlan: (planName: SubscriptionPlan) => Promise<boolean>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  profile: null,
  subscription: null,
  isLoading: true,
  isLoggedIn: false,
  showAds: true,
  isAdmin: false,
  currentPlan: "free",
  setIsAdmin: () => {},
  refreshUserData: async () => {},
  signOut: async () => {},
  updateProfile: async () => {},
  cancelSubscription: async () => false,
  upgradePlan: async () => false,
});

// Helper function to check if user is logged in
const isUserLoggedIn = (user: User | null): boolean => {
  return user !== null && user.id !== undefined;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAds, setShowAds] = useState(true);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan>("free");

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for:', userId);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        // If the error is about missing table, treat as public/no-profile (do not throw or log as error)
        if (
          profileError.message &&
          (profileError.message.includes("Could not find table") ||
            profileError.message.includes("does not exist") ||
            profileError.message.includes("schema cache"))
        ) {
          setProfile(null);
          return;
        }
        // Other errors: log and set profile to null
        console.error('Error fetching profile:', profileError);
        setProfile(null);
        return;
      }

      if (profileData) {
        console.log('Profile fetched successfully:', profileData);
        setProfile(profileData);
        setCurrentPlan('free'); // Default to free plan
        setShowAds(true); // Show ads by default
        // Check admin status (simplified for now)
        const isAdminUser = profileData.is_admin === true;
        setIsAdmin(isAdminUser);
      } else {
        console.log('No profile data found for user:', userId);
        setProfile(null);
      }
    } catch (error: any) {
      // If the error is about missing table, treat as public/no-profile (do not throw or log as error)
      if (
        error.message &&
        (error.message.includes("Could not find table") ||
          error.message.includes("does not exist") ||
          error.message.includes("schema cache"))
      ) {
        setProfile(null);
        return;
      }
      // Other errors: log and set profile to null
      console.error('Error in fetchUserProfile:', error);
      setProfile(null);
    }
  };

  // Refresh user data
  const refreshUserData = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    } else {
      // If no user but Pi auth exists, try to load it
      const piAuthResult = localStorage.getItem('pi_auth_result');
      if (piAuthResult) {
        const piAuth = JSON.parse(piAuthResult);
        if (piAuth.user && piAuth.accessToken) {
            const mockUser = {
              id: piAuth.user.uid,
              email: `${piAuth.user.username}@pi-network-user.com`,
              user_metadata: {
                username: piAuth.user.username,
                pi_username: piAuth.user.username,
                display_name: piAuth.user.username,
                auth_method: "pi_network",
                pi_user_id: piAuth.user.uid,
                access_token: piAuth.accessToken
              },
              app_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              email_confirmed_at: new Date().toISOString(),
              phone: '',
              confirmed_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              role: 'authenticated',
              identities: []
            } as User;
          setUser(mockUser);
          await fetchUserProfile(mockUser.id);
        }
      }
    }
  };

  // Update user profile
  const updateProfile = async (data: any) => {
    if (!user) {
      console.error('No user found for profile update');
      return;
    }

    try {
      console.log('Updating profile for user:', user.id, 'with data:', data);
      
      // First, try to get existing profile
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && (fetchError as any).code !== 'PGRST116') {
        console.error('Error fetching existing profile:', fetchError);
        throw fetchError;
      }

      if (existingProfile) {
        // Update existing profile
        console.log('Updating existing profile:', existingProfile.id);
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            ...data,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }
      } else {
        // Create new profile
        console.log('Creating new profile for user:', user.id);
        const profileData = {
          id: user.id,
          username: data.username || user.user_metadata?.username || user.email?.split('@')[0] || 'user',
          display_name: data.display_name || data.username || user.user_metadata?.display_name || user.user_metadata?.username || 'User',
          bio: data.bio || '',
          avatar_url: data.avatar_url || null,
          theme: data.theme || 'modern-dark',
          template: data.template || data.theme || 'modern-dark',
          is_verified: false,
          location: data.location || null,
          wallet_address: data.wallet_address || null,
          website: data.website || null,
          twitter: data.twitter || null,
          instagram: data.instagram || null,
          youtube: data.youtube || null,
          tiktok: data.tiktok || null,
          github: data.github || null,
          email: data.email || null,
          whatsapp: data.whatsapp || null,
          setup_completed: data.setup_completed || false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          throw insertError;
        }
      }

      // Refresh profile data
      await fetchUserProfile(user.id);
      console.log('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  // Cancel subscription
  const cancelSubscription = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      // Update user plan to free in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          // Note: profiles table doesn't have plan field, this is for future use
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error canceling subscription:', error);
        return false;
      }

      // Update local state
      setCurrentPlan('free');
      setShowAds(true);
      
      // Refresh profile data
      await fetchUserProfile(user.id);
      
      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      return false;
    }
  };

  // Upgrade plan
  const upgradePlan = async (planName: SubscriptionPlan): Promise<boolean> => {
    if (!user || !planName) return false;

    try {
      // Note: profiles table doesn't have plan field yet, this is for future use
      const { error } = await supabase
        .from('profiles')
        .update({ 
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Error upgrading plan:', error);
        return false;
      }

      // Update local state
      setCurrentPlan(planName);
      setShowAds(planName === 'free');
      
      // Refresh profile data
      await fetchUserProfile(user.id);
      
      return true;
    } catch (error) {
      console.error('Error upgrading plan:', error);
      return false;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSubscription(null);
      setIsAdmin(false);
      setShowAds(true);
      setCurrentPlan('free');
      
      // Clear localStorage
      localStorage.removeItem('pi_auth_result');
      localStorage.removeItem('pi_access_token');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Initialize user session
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // First check for Pi Network authentication
        const piAuthResult = localStorage.getItem('pi_auth_result');
        if (piAuthResult) {
          console.log('Auth: Found Pi auth result in localStorage:', JSON.parse(piAuthResult));
          const piAuth = JSON.parse(piAuthResult);
          
          if (piAuth.user && piAuth.accessToken) {
            console.log('Auth: Parsed Pi auth data:', piAuth);
            
            // Create a mock Supabase user object from Pi auth data
            const mockUser = {
              id: piAuth.user.uid,
              email: `${piAuth.user.username}@pi-network-user.com`,
              user_metadata: {
                username: piAuth.user.username,
                pi_username: piAuth.user.username,
                display_name: piAuth.user.username,
                auth_method: "pi_network",
                pi_user_id: piAuth.user.uid,
                access_token: piAuth.accessToken
              },
              app_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              email_confirmed_at: new Date().toISOString(),
              phone: '',
              confirmed_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              role: 'authenticated',
              identities: []
            } as User;
            
            console.log('Auth: Created mock user from Pi auth:', mockUser);
            setUser(mockUser);
            await fetchUserProfile(mockUser.id);
            setIsLoading(false);
            return;
          }
        }
        
        // Fallback to Supabase session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Get session error:', error);
        } else if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Session initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Check for Pi Network authentication first
        const piAuthResult = localStorage.getItem('pi_auth_result');
        if (piAuthResult) {
          const piAuth = JSON.parse(piAuthResult);
          if (piAuth.user && piAuth.accessToken) {
            const mockUser = {
              id: piAuth.user.uid,
              email: `${piAuth.user.username}@pi-network-user.com`,
              user_metadata: {
                username: piAuth.user.username,
                pi_username: piAuth.user.username,
                display_name: piAuth.user.username,
                auth_method: "pi_network",
                pi_user_id: piAuth.user.uid,
                access_token: piAuth.accessToken
              },
              app_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              email_confirmed_at: new Date().toISOString(),
              phone: '',
              confirmed_at: new Date().toISOString(),
              last_sign_in_at: new Date().toISOString(),
              role: 'authenticated',
              identities: []
            } as User;
            setUser(mockUser);
            await fetchUserProfile(mockUser.id);
            setIsLoading(false);
            return;
          }
        }
        
        // Handle Supabase session
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setSubscription(null);
          setIsAdmin(false);
          setShowAds(true);
          setCurrentPlan('free');
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    profile,
    subscription,
    isLoading,
    isLoggedIn: isUserLoggedIn(user),
    showAds,
    isAdmin,
    currentPlan,
    setIsAdmin,
    refreshUserData,
    signOut,
    updateProfile,
    cancelSubscription,
    upgradePlan,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;