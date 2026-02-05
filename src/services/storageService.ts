
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";

/**
 * Uploads a file to Supabase storage
 * @param file - The file to upload
 * @param bucket - The storage bucket name
 * @param folder - Optional folder path
 * @returns The file URL if successful, null if failed
 */
export async function uploadFile(
  file: File,
  bucket: string = "profile_images", 
  folder: string = ""
): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Create a unique file name to prevent collisions
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;
    
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
}

/**
 * Uploads a profile image with local storage fallback
 * @param file - The image file to upload
 * @param userId - The user ID
 * @returns The file URL if successful, null if failed
 */
export async function uploadProfileImage(
  file: File,
  userId: string
): Promise<string | null> {
  console.log('storageService: Starting profile image upload', file.name, userId);
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error("File must be an image");
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    console.log('storageService: File validation passed, uploading to Supabase');
    // Try to upload to Supabase storage first
    const supabaseUrl = await uploadFile(file, "profile_images", userId);
    
    console.log('storageService: Supabase upload result', supabaseUrl);
    if (supabaseUrl) {
      return supabaseUrl;
    }

    console.log('storageService: Supabase upload failed, trying local storage');
    // Fallback to local storage (base64)
    return await uploadToLocalStorage(file);
    
  } catch (error) {
    console.error("Error uploading profile image:", error);
    return null;
  }
}

/**
 * Uploads a file to local storage as base64
 * @param file - The file to upload
 * @returns The base64 data URL
 */
export async function uploadToLocalStorage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Saves profile image URL to user profile
 * @param imageUrl - The image URL
 * @param userId - The user ID
 * @returns True if successful, false if failed
 */
export async function saveProfileImageUrl(
  imageUrl: string,
  userId: string
): Promise<boolean> {
  console.log('storageService: Saving profile image URL', imageUrl, userId);
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: imageUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error saving profile image URL:', error);
      return false;
    }

    console.log('storageService: Profile image URL saved successfully');
    return true;
  } catch (error) {
    console.error('Error saving profile image URL:', error);
    return false;
  }
}

/**
 * Deletes a file from Supabase storage
 * @param filePath - The path of the file to delete
 * @param bucket - The storage bucket name
 * @returns True if successful, false if failed
 */
export async function deleteFile(
  filePath: string,
  bucket: string = "profile_images"
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

/**
 * Deletes a profile image and updates user profile
 * @param userId - The user ID
 * @returns True if successful, false if failed
 */
export async function deleteProfileImage(userId: string): Promise<boolean> {
  try {
    // Get current profile to find image URL
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // If image is stored in Supabase, delete it
    if (profile?.avatar_url && profile.avatar_url.includes('supabase.co')) {
      const urlParts = profile.avatar_url.split('/');
      const filePath = urlParts[urlParts.length - 1];
      await deleteFile(filePath, "profile_images");
    }

    // Clear avatar URL from profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (updateError) {
      throw updateError;
    }

    return true;
  } catch (error) {
    console.error("Error deleting profile image:", error);
    return false;
  }
}

/**
 * Imports profile image from Pi Network
 * @param piUsername - The Pi Network username
 * @param userId - The user ID
 * @returns The image URL if successful, null if failed
 */
export async function importPiProfileImage(
  piUsername: string,
  userId: string
): Promise<string | null> {
  try {
    // Call the Pi profile import function
    const { data, error } = await supabase.functions.invoke('import-pi-profile', {
      body: { username: piUsername }
    });

    if (error || !data?.avatar) {
      throw new Error("Failed to import Pi profile image");
    }

    // Save the imported avatar URL to user profile
    const success = await saveProfileImageUrl(data.avatar, userId);
    
    if (!success) {
      throw new Error("Failed to save imported image URL");
    }

    return data.avatar;
  } catch (error) {
    console.error("Error importing Pi profile image:", error);
    return null;
  }
}
