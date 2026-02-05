// Username Validation Service
// Handles username availability checking and validation

import { supabase } from '@/integrations/supabase/client';

export interface UsernameValidationResult {
  isValid: boolean;
  isAvailable: boolean;
  error?: string;
  suggestions?: string[];
}

export interface UsernameCheckOptions {
  excludeUserId?: string;
  checkAvailability?: boolean;
}

class UsernameService {
  private static instance: UsernameService;

  public static getInstance(): UsernameService {
    if (!UsernameService.instance) {
      UsernameService.instance = new UsernameService();
    }
    return UsernameService.instance;
  }

  // Validate username format
  public validateUsernameFormat(username: string): UsernameValidationResult {
    // Username requirements
    const minLength = 3;
    const maxLength = 30;
    const allowedPattern = /^[a-zA-Z0-9_-]+$/;

    // Check length
    if (username.length < minLength) {
      return {
        isValid: false,
        isAvailable: false,
        error: `Username must be at least ${minLength} characters long`
      };
    }

    if (username.length > maxLength) {
      return {
        isValid: false,
        isAvailable: false,
        error: `Username must be no more than ${maxLength} characters long`
      };
    }

    // Check pattern
    if (!allowedPattern.test(username)) {
      return {
        isValid: false,
        isAvailable: false,
        error: 'Username can only contain letters, numbers, underscores, and hyphens'
      };
    }

    // Check for reserved usernames
    const reservedUsernames = [
      'admin', 'api', 'app', 'www', 'mail', 'ftp', 'blog', 'shop', 'store',
      'support', 'help', 'about', 'contact', 'privacy', 'terms', 'login',
      'signup', 'register', 'dashboard', 'profile', 'settings', 'account',
      'user', 'users', 'public', 'private', 'home', 'index', 'root', 'test',
      'demo', 'sample', 'example', 'droplink', 'droplinks', 'link', 'links',
      'bio', 'bios', 'page', 'pages', 'site', 'sites', 'web', 'webs'
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
      return {
        isValid: false,
        isAvailable: false,
        error: 'This username is reserved and cannot be used'
      };
    }

    // Check for consecutive special characters
    if (/[_-]{2,}/.test(username)) {
      return {
        isValid: false,
        isAvailable: false,
        error: 'Username cannot contain consecutive underscores or hyphens'
      };
    }

    // Check for starting/ending with special characters
    if (username.startsWith('_') || username.startsWith('-') || 
        username.endsWith('_') || username.endsWith('-')) {
      return {
        isValid: false,
        isAvailable: false,
        error: 'Username cannot start or end with underscores or hyphens'
      };
    }

    return {
      isValid: true,
      isAvailable: true
    };
  }

  // Check username availability
  public async checkUsernameAvailability(
    username: string, 
    options: UsernameCheckOptions = {}
  ): Promise<UsernameValidationResult> {
    try {
      // First validate format
      const formatValidation = this.validateUsernameFormat(username);
      if (!formatValidation.isValid) {
        return formatValidation;
      }

      // Check availability in database
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username')
        .eq('username', username.toLowerCase())
        .limit(1);

      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      // Check if username is taken
      if (data && data.length > 0) {
        // If checking for a specific user, allow their own username
        if (options.excludeUserId && data[0].id === options.excludeUserId) {
          return {
            isValid: true,
            isAvailable: true
          };
        }

        return {
          isValid: true,
          isAvailable: false,
          error: 'This username is already taken',
          suggestions: await this.generateUsernameSuggestions(username)
        };
      }

      return {
        isValid: true,
        isAvailable: true
      };
    } catch (error) {
      console.error('Username availability check failed:', error);
      return {
        isValid: false,
        isAvailable: false,
        error: 'Failed to check username availability'
      };
    }
  }

  // Generate username suggestions
  public async generateUsernameSuggestions(baseUsername: string): Promise<string[]> {
    const suggestions: string[] = [];
    const base = baseUsername.toLowerCase();

    // Add numbers
    for (let i = 1; i <= 5; i++) {
      suggestions.push(`${base}${i}`);
    }

    // Add random numbers
    for (let i = 0; i < 3; i++) {
      const randomNum = Math.floor(Math.random() * 1000);
      suggestions.push(`${base}${randomNum}`);
    }

    // Add underscores and hyphens
    suggestions.push(`${base}_`);
    suggestions.push(`${base}-`);
    suggestions.push(`_${base}`);
    suggestions.push(`-${base}`);

    // Add common suffixes
    const suffixes = ['official', 'real', 'pro', 'new', 'live', 'here'];
    for (const suffix of suffixes) {
      suggestions.push(`${base}${suffix}`);
    }

    // Filter out invalid suggestions and check availability
    const validSuggestions: string[] = [];
    for (const suggestion of suggestions) {
      const validation = this.validateUsernameFormat(suggestion);
      if (validation.isValid) {
        const availability = await this.checkUsernameAvailability(suggestion);
        if (availability.isAvailable) {
          validSuggestions.push(suggestion);
        }
      }
    }

    return validSuggestions.slice(0, 5); // Return top 5 suggestions
  }

  // Get username suggestions for a given name
  public async getUsernameSuggestions(fullName: string): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Split name into parts
    const nameParts = fullName.toLowerCase().split(' ').filter(part => part.length > 0);
    
    if (nameParts.length === 0) return suggestions;

    // Generate variations
    const first = nameParts[0];
    const last = nameParts[nameParts.length - 1];

    // Single name variations
    suggestions.push(first);
    suggestions.push(`${first}${last}`);
    suggestions.push(`${first}.${last}`);
    suggestions.push(`${first}_${last}`);
    suggestions.push(`${first}-${last}`);

    // Add numbers
    for (let i = 1; i <= 3; i++) {
      suggestions.push(`${first}${i}`);
      suggestions.push(`${first}${last}${i}`);
    }

    // Add random numbers
    for (let i = 0; i < 2; i++) {
      const randomNum = Math.floor(Math.random() * 100);
      suggestions.push(`${first}${randomNum}`);
    }

    // Check availability and return valid suggestions
    const validSuggestions: string[] = [];
    for (const suggestion of suggestions) {
      const validation = this.validateUsernameFormat(suggestion);
      if (validation.isValid) {
        const availability = await this.checkUsernameAvailability(suggestion);
        if (availability.isAvailable) {
          validSuggestions.push(suggestion);
        }
      }
    }

    return validSuggestions.slice(0, 8); // Return top 8 suggestions
  }

  // Create username from email
  public async createUsernameFromEmail(email: string): Promise<string> {
    // Extract username from email
    const emailUsername = email.split('@')[0].toLowerCase();
    
    // Clean up the username
    let username = emailUsername.replace(/[^a-zA-Z0-9_-]/g, '');
    
    // Ensure it starts with a letter or number
    if (!/^[a-zA-Z0-9]/.test(username)) {
      username = 'user' + username;
    }

    // Check availability and add numbers if needed
    let finalUsername = username;
    let counter = 1;
    
    while (true) {
      const availability = await this.checkUsernameAvailability(finalUsername);
      if (availability.isAvailable) {
        break;
      }
      finalUsername = `${username}${counter}`;
      counter++;
      
      // Prevent infinite loop
      if (counter > 1000) {
        finalUsername = `${username}${Date.now()}`;
        break;
      }
    }

    return finalUsername;
  }

  // Update username
  public async updateUsername(userId: string, newUsername: string): Promise<boolean> {
    try {
      // Check availability (excluding current user)
      const availability = await this.checkUsernameAvailability(newUsername, {
        excludeUserId: userId
      });

      if (!availability.isAvailable) {
        throw new Error(availability.error || 'Username is not available');
      }

      // Update username in database
      const { error } = await supabase
        .from('profiles')
        .update({ username: newUsername.toLowerCase() })
        .eq('id', userId);

      if (error) {
        throw new Error(`Failed to update username: ${error.message}`);
      }

      return true;
    } catch (error) {
      console.error('Username update failed:', error);
      throw error;
    }
  }

  // Get username by user ID
  public async getUsernameByUserId(userId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(`Failed to get username: ${error.message}`);
      }

      return data?.username || null;
    } catch (error) {
      console.error('Get username failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const usernameService = UsernameService.getInstance();

// Export types
export type { UsernameValidationResult, UsernameCheckOptions };
