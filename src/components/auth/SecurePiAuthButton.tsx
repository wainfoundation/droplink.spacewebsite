
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { authenticateWithPi } from '@/utils/pi-sdk';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Loader2, Shield, Zap } from 'lucide-react';
import { useAuthSecurity } from '@/hooks/useAuthSecurity';

export const SecurePiAuthButton = () => {
  // Secure Pi Auth is disabled for now
  return null;
};
