
// Helper function to play sounds with volume control
export const playSound = (audioUrl: string, volume = 1): void => {
  // Check if user has interacted with the page
  if (!document.body.classList.contains('user-interacted')) {
    // Don't log this as an error, just return silently
    return;
  }

  // Check if the audio URL is valid
  if (!audioUrl || audioUrl === '') {
    console.warn('Invalid audio URL provided');
    return;
  }

  try {
    const audio = new Audio(audioUrl);
    audio.volume = volume;
    
    // Handle Safari/iOS requirement for user interaction
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Only log non-user-interaction errors
        if (!error.message.includes('user interaction')) {
          console.warn("Audio playback error:", error);
        }
      });
    }
  } catch (error) {
    // Only log non-user-interaction errors
    if (!(error instanceof Error) || !error.message.includes('user interaction')) {
      console.warn("Audio initialization error:", error);
    }
  }
};

// Mark user interaction for audio playback
export const markUserInteraction = (): void => {
  document.body.classList.add('user-interacted');
};

// Predefined sound effects
export const sounds = {
  loadingComplete: "/sounds/loading-complete.mp3",
  setupComplete: "/sounds/setup-complete.mp3",
};
