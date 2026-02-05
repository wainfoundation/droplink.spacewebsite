import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { 
  uploadProfileImage, 
  saveProfileImageUrl, 
  deleteProfileImage, 
  importPiProfileImage 
} from '@/services/storageService';
import { useToast } from '@/hooks/use-toast';

export const useProfileImage = () => {
  const { user, refreshUserData } = useUser();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  /**
   * Upload a profile image
   */
  const uploadImage = async (file: File): Promise<boolean> => {
    console.log('useProfileImage: Starting upload', file.name, file.size);
    if (!user?.id) {
      console.log('useProfileImage: No user ID found');
      toast({
        title: "Error",
        description: "You must be logged in to upload an image.",
        variant: "destructive"
      });
      return false;
    }

    setIsUploading(true);

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error("Please select a valid image file");
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size must be less than 5MB");
      }

      console.log('useProfileImage: File validation passed, uploading to storage');
      // Upload image
      const imageUrl = await uploadProfileImage(file, user.id);
      
      console.log('useProfileImage: Storage upload result', imageUrl);
      if (!imageUrl) {
        throw new Error("Failed to upload image");
      }

      console.log('useProfileImage: Saving image URL to profile');
      // Save URL to profile
      const success = await saveProfileImageUrl(imageUrl, user.id);
      
      console.log('useProfileImage: Save URL result', success);
      if (!success) {
        throw new Error("Failed to save image URL");
      }

      console.log('useProfileImage: Refreshing user data');
      // Refresh user data
      await refreshUserData();

      toast({
        title: "Success",
        description: "Profile image uploaded successfully!",
      });

      return true;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Delete current profile image
   */
  const deleteImage = async (): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to delete your image.",
        variant: "destructive"
      });
      return false;
    }

    try {
      const success = await deleteProfileImage(user.id);
      
      if (!success) {
        throw new Error("Failed to delete image");
      }

      // Refresh user data
      await refreshUserData();

      toast({
        title: "Success",
        description: "Profile image removed successfully!",
      });

      return true;
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete profile image",
        variant: "destructive"
      });
      return false;
    }
  };

  /**
   * Import profile image from Pi Network
   */
  const importFromPi = async (piUsername: string): Promise<boolean> => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to import an image.",
        variant: "destructive"
      });
      return false;
    }

    setIsImporting(true);

    try {
      const imageUrl = await importPiProfileImage(piUsername, user.id);
      
      if (!imageUrl) {
        throw new Error("Failed to import Pi profile image");
      }

      // Refresh user data
      await refreshUserData();

      toast({
        title: "Success",
        description: "Pi profile image imported successfully!",
      });

      return true;
    } catch (error) {
      console.error("Error importing Pi image:", error);
      toast({
        title: "Import Failed",
        description: "Failed to import Pi profile image. Make sure the profile is public.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsImporting(false);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>): Promise<boolean> => {
    const file = event.target.files?.[0];
    if (!file) return false;

    return await uploadImage(file);
  };

  /**
   * Create a file input and trigger upload
   */
  const triggerFileUpload = (): void => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      handleFileChange(event as React.ChangeEvent<HTMLInputElement>);
    };
    input.click();
  };

  return {
    uploadImage,
    deleteImage,
    importFromPi,
    handleFileChange,
    triggerFileUpload,
    isUploading,
    isImporting
  };
}; 