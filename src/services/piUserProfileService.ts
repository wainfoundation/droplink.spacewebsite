import { supabase } from '@/integrations/supabase/client';
// Removed PiLogger import to prevent build issues

interface CreateOrUpdateProfileResult {
  success: boolean;
  isNewUser: boolean;
  error?: string;
}

export const createOrUpdateUserProfile = async (user: { uid: string; username: string }): Promise<CreateOrUpdateProfileResult> => {
  try {
    console.log('Creating/updating user profile', { uid: user.uid, username: user.username });

    // Check if user already exists
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.uid)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching existing user', { error: fetchError });
      return { success: false, isNewUser: false, error: fetchError.message };
    }

    const isNewUser = !existingUser;

    if (isNewUser) {
      // Create new user profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.uid,
          username: user.username,
          full_name: user.username,
          avatar_url: null,
          updated_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating user profile', { error: insertError });
        return { success: false, isNewUser: true, error: insertError.message };
      }

      console.log('New user profile created', { uid: user.uid });
    } else {
      // Update existing user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          username: user.username,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.uid);

      if (updateError) {
        console.error('Error updating user profile', { error: updateError });
        return { success: false, isNewUser: false, error: updateError.message };
      }

      console.log('Existing user profile updated', { uid: user.uid });
    }

    return { success: true, isNewUser };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Unexpected error in createOrUpdateUserProfile', { error: errorMessage });
    return { success: false, isNewUser: false, error: errorMessage };
  }
}; 