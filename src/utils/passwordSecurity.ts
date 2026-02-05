
// Password security check using Have I Been Pwned API
export const checkPasswordSecurity = async (password: string): Promise<{
  isSecure: boolean;
  strength: 'weak' | 'medium' | 'strong';
  message: string;
  breaches?: number;
}> => {
  try {
    // Basic password strength validation
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength: 'weak' | 'medium' | 'strong' = 'weak';
    let message = '';

    if (hasMinLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
      strength = 'strong';
      message = 'Password is very strong';
    } else if (hasMinLength && hasUpperCase && hasLowerCase && hasNumbers) {
      strength = 'medium';
      message = 'Password is moderately strong';
    } else {
      strength = 'weak';
      message = 'Password is weak - consider adding uppercase, lowercase, numbers, and special characters';
    }

    // Try to check against breached passwords (with fallback)
    let breaches = 0;
    try {
      const sha1Password = await sha1(password);
      const prefix = sha1Password.substring(0, 5);
      const suffix = sha1Password.substring(5).toUpperCase();

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Droplink-Password-Check'
        }
      });

      if (response.ok) {
        const text = await response.text();
        const lines = text.split('\n');
        const found = lines.find(line => line.startsWith(suffix));
        if (found) {
          breaches = parseInt(found.split(':')[1]) || 0;
        }
      }
    } catch (error) {
      console.warn('Password breach check failed, continuing with basic validation:', error);
      // Continue with basic validation only
    }

    const isSecure = strength === 'strong' && breaches === 0;

    return {
      isSecure,
      strength,
      message: breaches > 0 
        ? `Password found in ${breaches} data breaches. Please choose a different password.`
        : message,
      breaches
    };
  } catch (error) {
    console.error('Password security check error:', error);
    // Fallback to basic validation
    return {
      isSecure: password.length >= 8,
      strength: password.length >= 8 ? 'medium' : 'weak',
      message: 'Password validation completed (breach check unavailable)',
      breaches: 0
    };
  }
};

// SHA-1 hash function for password checking
const sha1 = async (str: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Legacy export for backward compatibility
export const isPasswordCompromised = async (password: string): Promise<boolean> => {
  try {
    const result = await checkPasswordSecurity(password);
    return result.breaches ? result.breaches > 0 : false;
  } catch (error) {
    console.warn('Password compromise check failed:', error);
    return false;
  }
};

// Password strength indicator
export const getPasswordStrength = (password: string): {
  score: number;
  strength: 'weak' | 'medium' | 'strong';
  color: string;
} => {
  let score = 0;
  
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  let color = 'bg-red-500';

  if (score >= 5) {
    strength = 'strong';
    color = 'bg-green-500';
  } else if (score >= 3) {
    strength = 'medium';
    color = 'bg-yellow-500';
  }

  return { score, strength, color };
};
