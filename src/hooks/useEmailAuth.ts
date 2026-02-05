
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';

export const useEmailAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { refreshUserData } = useUser();

  // Mock authentication for development
  const createMockUser = (email: string, password: string) => {
    const timestamp = Date.now();
    const mockUserId = `mock_user_${timestamp}`;
    
    return {
      id: mockUserId,
      email: email,
      created_at: new Date().toISOString(),
      user_metadata: {
        username: email.split('@')[0],
        first_name: email.split('@')[0],
        last_name: 'User',
        display_name: email.split('@')[0] + ' User',
        marketing_consent: true
      }
    };
  };

  const signUp = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      // Mock signup - always succeeds
      const mockUser = createMockUser(email, password);
      
      // Store mock session in localStorage
      const mockSession = {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        user: mockUser
      };
      
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      
      toast({
        title: "Account Created",
        description: "Your mock account has been created successfully!",
      });
      
      return { success: true, user: mockUser };
    } catch (error: any) {
      console.error('Mock signup error:', error);
      toast({
        title: "Signup Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      // Mock signin - always succeeds with any email/password
      const mockUser = createMockUser(email, password);
      
      // Store mock session in localStorage
      const mockSession = {
        access_token: `mock_token_${Date.now()}`,
        refresh_token: `mock_refresh_${Date.now()}`,
        user: mockUser
      };
      
      localStorage.setItem('mockSession', JSON.stringify(mockSession));
      
      toast({
        title: "Welcome Back!",
        description: "You have been signed in successfully (mock mode).",
      });
      
      return { success: true, user: mockUser };
    } catch (error: any) {
      console.error('Mock signin error:', error);
      toast({
        title: "Sign In Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    setIsSubmitting(true);
    try {
      // Clear mock session
      localStorage.removeItem('mockSession');
      
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
      return { success: true };
    } catch (error: any) {
      console.error('Mock signout error:', error);
      toast({
        title: "Sign Out Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle login form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    const result = await signIn(email, password);
    
    if (result.success) {
      await refreshUserData();
      navigate('/admin-dashboard');
    }
  };

  // Handle signup form submission
  const handleSignup = async (signupData: {
    email: string;
    password: string;
    username: string;
    firstName: string;
    lastName: string;
    marketingConsent: boolean;
  }) => {
    const result = await signUp(signupData.email, signupData.password);
    
    if (result.success) {
      // Create mock user profile
      const mockProfile = {
        id: result.user?.id,
        username: signupData.username.toLowerCase(),
        display_name: `${signupData.firstName} ${signupData.lastName}`,
        bio: '',
        avatar_url: null,
        intent: 'personal',
        plan: 'free',
        consent_updates: signupData.marketingConsent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Store mock profile in localStorage
      localStorage.setItem('mockProfile', JSON.stringify(mockProfile));
      
      await refreshUserData();
      // Navigate to admin dashboard
      navigate('/admin-dashboard');
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    isSubmitting,
    handleSubmit,
    handleSignup,
    signUp,
    signIn,
    signOut,
    isLoading: isSubmitting,
  };
};
