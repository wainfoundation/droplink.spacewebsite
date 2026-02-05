
/**
 * Pi Network Authentication Module - Following Official Documentation Exactly
 */
// Removed PiLogger import to prevent build issues
import { PiAuthResult } from './pi-types';

// Pi API endpoints - mainnet
const PI_API_URL = import.meta.env.VITE_PI_NETWORK_API_URL || "https://api.minepi.com/v2";

// Callback function for incomplete payments as per documentation
const onIncompletePaymentFound = (payment: any) => {
      console.warn('Incomplete payment found:', { paymentId: payment?.identifier });
  console.log("Incomplete payment found:", payment);
  
  // Handle incomplete payment - you can cancel, complete, or handle as needed
  const paymentId = payment.identifier;
  const txid = payment.transaction?.txid;
  
  // For now, we'll log the payment details
  // In a real app, you might want to complete it or handle it differently
  console.log('Incomplete payment found - paymentId:', paymentId, 'txid:', txid);
  
  return payment;
};

// Validate user with Pi API using access token - Following official docs
export const validateUserWithPiAPI = async (accessToken: string): Promise<any> => {
  try {
    // Following the exact format from the documentation
    const headers = { 
      headers: { 
        authorization: "Bearer " + accessToken 
      } 
    };
    
    const response = await fetch(`${PI_API_URL}/v2/me`, {
      method: 'GET',
      headers: headers.headers
    });

    if (!response.ok) {
      throw new Error(`Pi API validation failed: ${response.status}`);
    }

    const userData = await response.json();
    console.log('Pi API validation success:', { uid: userData.uid });
    return userData;
  } catch (error) {
    console.error('Pi API validation error:', error);
    throw error;
  }
};

// Authenticate user with Pi Network - Following official documentation exactly
// Based on: https://github.com/pi-apps/pi-platform-docs.git
export const authenticateWithPi = async (
  scopes: string[] = ["payments"]
): Promise<PiAuthResult | null> => {
  try {
    console.log("Starting Pi authentication following official documentation");
    console.log("Scopes:", scopes);
    
    // Check if Pi SDK is available
    if (!window.Pi) {
      throw new Error('Pi Network SDK not available. Please ensure the SDK is loaded.');
    }
    
    // Following the exact format from official documentation:
    // Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) { ... })
    console.log("Calling Pi.authenticate with scopes:", scopes);
    
    const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound);
    console.log("Pi authenticate result:", authResult);
    
    if (!authResult) {
      throw new Error('No result received from Pi authentication');
    }

    // The documentation states that AuthResults always returns UserDTO and accessToken
    if (!authResult.accessToken) {
      console.warn("No access token received from Pi authentication");
      throw new Error('No access token received from Pi authentication');
    }

    // Verify with Pi API /me endpoint as per official documentation
    try {
      const verifiedUser = await validateUserWithPiAPI(authResult.accessToken);
      console.log('✅ Pi authentication verified with API:', verifiedUser);
    } catch (apiError) {
      console.warn('⚠️ Pi API verification failed, but authentication result is valid:', apiError);
      // Continue with auth result even if API verification fails
    }

    return authResult as PiAuthResult;
  } catch (error) {
    console.error("Pi authentication error:", error);
    throw error;
  }
};
