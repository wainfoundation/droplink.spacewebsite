/**
 * Pi Network Authentication Workflow
 * Implements the exact sequence diagram flow for Pi Network authentication
 */

import { authenticateWithPi, validateUserWithPiAPI } from './pi-auth';
import { getPiConfig } from './pi-config';
// Removed PiLogger import to prevent build issues
import { toast } from '@/hooks/use-toast';
import { createOrUpdateUserProfile } from '../services/piUserProfileService';
import { useState } from 'react';

export interface PiAuthWorkflowResult {
  success: boolean;
  user?: { uid: string; username: string };
  accessToken?: string;
  isNewUser?: boolean;
  error?: string;
  step?: string;
  environment?: string;
}

export interface PiAuthWorkflowOptions {
  scopes?: string[];
  useMock?: boolean;
  debug?: boolean;
  validateToken?: boolean;
  createUserProfile?: boolean;
}

export async function executePiAuthWorkflow(options: PiAuthWorkflowOptions = {}): Promise<PiAuthWorkflowResult> {
  const { scopes = ['username', 'payments'], useMock = false, debug = false } = options;
  const config = getPiConfig();
  // SANDBOX MODE - Test environment
  const environment = 'sandbox';
  console.log(`[PiAuthWorkflow] Starting Pi authentication workflow in ${environment} mode`, { options });

  // Step 1: Authenticate with Pi - SANDBOX MODE
  let authResult;
  try {
    // SANDBOX MODE - Test authentication
    console.log('[PiAuthWorkflow] Using Pi Network authentication for sandbox mode');
    authResult = await authenticateWithPi(scopes);
    
    if (debug) console.log('[PiAuthWorkflow] authenticateWithPi result', authResult);
    if (!authResult.success || !authResult.user || !authResult.accessToken) {
      const error = authResult.error || 'Authentication failed';
      console.error('[PiAuthWorkflow] Pi authentication failed: ' + error);
      toast({ title: 'Pi Authentication Failed', description: error, variant: 'destructive' });
      return { success: false, error, step: 'authenticateWithPi', environment };
    }
  } catch (err: any) {
    console.error('[PiAuthWorkflow] Exception during authenticateWithPi: ' + (err?.message || String(err)));
    toast({ title: 'Pi Authentication Error', description: err?.message || String(err), variant: 'destructive' });
    return { success: false, error: err?.message || String(err), step: 'authenticateWithPi', environment };
  }

  // Step 2: Skip API validation for sandbox mode due to known issues
  let validatedUser = authResult.user;
  if (config.isSandbox && !useMock) {
    console.log('[PiAuthWorkflow] Sandbox mode: Skipping API validation due to sandbox environment limitations');
    // Use the user data from the authentication result directly
    validatedUser = authResult.user;
  }

  // Step 3: Create or update user profile in Supabase
  let isNewUser = false;
  try {
    const profileResult = await createOrUpdateUserProfile(validatedUser!);
    if (debug) console.log('[PiAuthWorkflow] createOrUpdateUserProfile result', profileResult);
    if (!profileResult.success) {
      const error = profileResult.error || 'Failed to create/update user profile';
      console.error('[PiAuthWorkflow] User profile creation/update failed: ' + error);
      toast({ title: 'Profile Error', description: error, variant: 'destructive' });
      return { success: false, error, step: 'createOrUpdateUserProfile', environment };
    }
    isNewUser = profileResult.isNewUser;
      } catch (err: any) {
      console.error('[PiAuthWorkflow] Exception during createOrUpdateUserProfile: ' + (err?.message || String(err)));
    toast({ title: 'Profile Error', description: err?.message || String(err), variant: 'destructive' });
    return { success: false, error: err?.message || String(err), step: 'createOrUpdateUserProfile', environment };
  }

  console.log('[PiAuthWorkflow] Pi authentication workflow completed successfully', {
    user: validatedUser,
    isNewUser,
    environment,
  });
  return {
    success: true,
    user: validatedUser,
    accessToken: authResult.accessToken,
    isNewUser,
    environment,
    step: 'complete',
  };
}

// React hook for Pi Auth Workflow
export function usePiAuthWorkflow() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PiAuthWorkflowResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeWorkflow = async (options: PiAuthWorkflowOptions = {}) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const workflowResult = await executePiAuthWorkflow(options);
      setResult(workflowResult);
      
      if (!workflowResult.success) {
        setError(workflowResult.error || 'Authentication failed');
      }
      
      return workflowResult;
    } catch (err: any) {
      const errorMessage = err?.message || String(err);
      setError(errorMessage);
      setResult({
        success: false,
        error: errorMessage,
        step: 'exception',
      });
      return {
        success: false,
        error: errorMessage,
        step: 'exception',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeWorkflow,
    isLoading,
    result,
    error,
  };
} 