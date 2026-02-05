/**
 * Pi Username Helper - Centralized utility for getting Pi username
 */

export const getPiUsername = (): string | null => {
  try {
    const piAuthResult = localStorage.getItem('pi_auth_result');
    if (piAuthResult) {
      const piAuth = JSON.parse(piAuthResult);
      if (piAuth.user && piAuth.user.username) {
        console.log('PiUsernameHelper: Found Pi username:', piAuth.user.username);
        return piAuth.user.username;
      }
    }
  } catch (error) {
    console.error('Error parsing Pi auth result in PiUsernameHelper:', error);
  }
  return null;
};

export const getDisplayName = (profile?: any, user?: any): string => {
  // Try Pi username first
  const piUsername = getPiUsername();
  if (piUsername) {
    return piUsername;
  }
  
  // Fallback to profile or user data
  return profile?.display_name || 
         user?.user_metadata?.display_name || 
         user?.user_metadata?.username || 
         user?.email?.split('@')[0] || 
         'User';
};

export const getUsername = (profile?: any, user?: any): string => {
  // Try Pi username first
  const piUsername = getPiUsername();
  if (piUsername) {
    return piUsername;
  }
  
  // Fallback to profile or user data
  return profile?.username || 
         user?.user_metadata?.username || 
         user?.email?.split('@')[0] || 
         'user';
};

export const getAvatarInitial = (profile?: any, user?: any): string => {
  const piUsername = getPiUsername();
  const displayName = getDisplayName(profile, user);
  
  return (piUsername || displayName).charAt(0).toUpperCase();
};

export const getAvatarUrl = (profile?: any, user?: any): string | null => {
  return profile?.avatar_url || user?.user_metadata?.avatar_url || null;
};
