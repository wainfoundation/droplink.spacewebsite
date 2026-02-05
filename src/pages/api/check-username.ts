// Username Availability Check API
// Provides real-time username availability checking

// Note: This is a Vite/React app, not Next.js
// Using standard Request/Response types instead
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: Request, res: Response) {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { 
      status: 405, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  const url = new URL(req.url);
  const username = url.searchParams.get('username');

  if (!username) {
    return new Response(JSON.stringify({ error: 'Username is required' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  // Validate username format
  const minLength = 3;
  const maxLength = 30;
  const allowedPattern = /^[a-zA-Z0-9_-]+$/;

  if (username.length < minLength) {
    return new Response(JSON.stringify({ 
      available: false, 
      error: `Username must be at least ${minLength} characters long` 
    }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  if (username.length > maxLength) {
    return new Response(JSON.stringify({ 
      available: false, 
      error: `Username must be no more than ${maxLength} characters long` 
    }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  if (!allowedPattern.test(username)) {
    return new Response(JSON.stringify({ 
      available: false, 
      error: 'Username can only contain letters, numbers, underscores, and hyphens' 
    }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
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
    return new Response(JSON.stringify({ 
      available: false, 
      error: 'This username is reserved and cannot be used' 
    }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    // Check if username exists in database
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('username', username.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ 
        available: false, 
        error: 'Failed to check username availability' 
      }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    if (data) {
      return new Response(JSON.stringify({ 
        available: false, 
        message: 'Username is already taken' 
      }), { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ 
      available: true, 
      message: 'Username is available' 
    }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });

  } catch (error) {
    console.error('Username check error:', error);
    return new Response(JSON.stringify({ 
      available: false, 
      error: 'Internal server error' 
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
