// Profile View Tracking API
// Tracks profile visits for analytics

import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/integrations/supabase/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { profile_id } = req.body;

  if (!profile_id) {
    return res.status(400).json({ error: 'Profile ID is required' });
  }

  try {
    // Get client IP and user agent
    const ip_address = req.headers['x-forwarded-for'] || 
                      req.headers['x-real-ip'] || 
                      req.connection.remoteAddress || 
                      '127.0.0.1';
    
    const user_agent = req.headers['user-agent'] || '';
    const referrer = req.headers['referer'] || '';

    // Insert view tracking record
    const { data, error } = await supabase
      .from('profile_views')
      .insert({
        profile_id,
        ip_address: Array.isArray(ip_address) ? ip_address[0] : ip_address,
        user_agent,
        referrer,
        viewed_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('View tracking error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to track view' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      view_id: data.id 
    });

  } catch (error) {
    console.error('View tracking error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
}
