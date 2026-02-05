import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthResponse } from "@supabase/supabase-js";
import { loadPiSDK } from "@/utils/pi-sdk-loader";
import { authenticateWithPi } from "@/utils/pi-auth";
// Removed PiLogger import to prevent build issues

// Define explicit interfaces for user data
interface PiUser {
  id: string;
  username: string;
  uid?: string;
  roles?: string[];
}

interface UserData {
  id: string;
  username: string;
  email?: string;
  avatar_url?: string | null;
  bio?: string | null;
  created_at?: string;
  uid?: string;
  plan?: string;
  auth_method?: string;
  updated_at?: string;
}

interface PiAuthResult {
  user: {
    uid: string;
    username: string;
  };
  accessToken: string;
}

// Export as a named function so it can be imported as: import { usePiAuth } from "@/hooks/usePiAuth"
export function usePiAuth() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [piUser, setPiUser] = useState<PiUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [piAuthenticating, setPiAuthenticating] = useState(false);

  useEffect(() => {
    // Initialize Pi SDK with lazy loading
    const initializePi = async () => {
      try {
        console.log('hook_init_start');
        
        if (window.Pi) {
          await loadPiSDK();
          console.log('hook_init_success', { method: 'window_pi' });
        } else {
          console.warn('hook_init_no_pi', { message: 'Pi SDK not available in window' });
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : 'Unknown initialization error';
        console.error('hook_init_error', err as Error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    
    initializePi();
  }, []);

  const onIncompletePaymentFound = (payment: any) => {
    console.warn('incomplete_payment_in_auth', { paymentId: payment?.identifier });
    return null;
  };

  const handlePiLogin = async () => {
    try {
      setPiAuthenticating(true);
      setError(null);

      console.log('auth_login_start - MAINNET MODE');
      
      let authResult: PiAuthResult;
      
      // Use Pi Network authentication in mainnet mode
      console.log('Mainnet mode: Using Pi Network authentication...');
      
      try {
        authResult = await authenticateWithPi(["payments", "username"]);
      } catch (error) {
        console.error('Pi authentication failed in mainnet mode:', error);
        // Do not use mock authentication in mainnet - throw error
        throw error;
      }

      if (authResult) {
        console.log('auth_login_pi_success', authResult);
        
        // Convert to PiUser format
        const piUserData: PiUser = {
          id: authResult.user.uid,
          username: authResult.user.username || "",
          uid: authResult.user.uid
        };
        setPiUser(piUserData);
        
        // Store access token
        if (authResult.accessToken) {
          localStorage.setItem('pi_access_token', authResult.accessToken);
          console.log('Stored Pi access token');
        }
        
        // Store Pi auth result for later use
        localStorage.setItem('pi_auth_result', JSON.stringify(authResult));
        
        // Using correct table name 'profiles' instead of 'user_profiles'
        let existingUser = null;
        let fetchError = null;
        
        try {
          const result = await supabase
            .from('profiles')
            .select()
            .eq("id", authResult.user.uid)
            .maybeSingle();
          
          existingUser = result.data;
          fetchError = result.error;
        } catch (error) {
          console.error("Supabase connection failed:", error);
          throw new Error("Database connection failed. Please try again.");
        }
          
        if (fetchError && fetchError.code !== "PGRST116") {
          console.error("Error checking existing user:", fetchError);
          throw new Error("Failed to check user profile. Please try again.");
        }

        let userData: UserData | null = null;
        
        if (!existingUser) {
          // Register new user
          let newUser = null;
          let createError = null;
          
          try {
            const result = await supabase
              .from('profiles')
              .insert({
                id: authResult.user.uid,
                username: authResult.user.username,
                auth_method: "pi_network"
              })
              .select()
              .maybeSingle();

            newUser = result.data;
            createError = result.error;
          } catch (error) {
            console.error("Supabase user creation failed:", error);
            throw new Error("Failed to create user profile. Please try again.");
          }

          if (createError) {
            console.error("Error creating user:", createError);
            throw new Error("Failed to create user profile. Please try again.");
          } else {
            userData = newUser;
          }
        } else {
          userData = existingUser;
        }

        // Sign in with supabase custom auth
        let authResponse: AuthResponse;
        
        try {
          // Store Pi Network auth result in localStorage for easy access
          localStorage.setItem('pi_auth_result', JSON.stringify(authResult));
          
          // Create user metadata with Pi Network data
          const userMetadata = {
            username: authResult.user.username,
            pi_username: authResult.user.username,
            display_name: authResult.user.username, // Use username as display name initially
            pi_display_name: authResult.user.username,
            avatar_url: null, // Pi Network doesn't provide avatar by default
            pi_avatar_url: null,
            auth_method: "pi_network",
            pi_user_id: authResult.user.uid,
            access_token: authResult.accessToken
          };
          
          authResponse = await supabase.auth.signInWithPassword({
            email: `${authResult.user.username}@pi-network-user.com`,
            password: authResult.user.uid as string,
          });
          
          // Update user metadata with Pi Network data
          if (authResponse.data?.user) {
            await supabase.auth.updateUser({
              data: userMetadata
            });
          }
        } catch (error) {
          console.error("Supabase authentication failed:", error);
          throw new Error("Authentication failed. Please try again.");
        }
        
        if (authResponse.error) {
          console.error("Error signing in with Supabase:", authResponse.error);
          throw new Error("Authentication failed. Please try again.");
        }

        setIsAuthenticated(true);
        console.log('auth_login_complete', { userId: authResult.user.uid });
        return { user: userData, piUser: piUserData };
      } else {
        console.error('auth_login_no_result', 'No authentication result received');
        throw new Error('No authentication result received from Pi Network');
      }
    } catch (err) {
      console.error('auth_login_error', err as Error, { 
        step: 'pi_authentication' 
      });
      setError(err instanceof Error ? err.message : "Unknown error during authentication");
      return null;
    } finally {
      setPiAuthenticating(false);
    }
  };

  return {
    loading,
    error,
    piUser,
    isAuthenticated,
    piAuthenticating,
    handlePiLogin,
  };
}

// Also export as default for backward compatibility
export default usePiAuth;
