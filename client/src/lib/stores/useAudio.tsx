import { create } from "zustand";

interface AudioState {
  backgroundMusic: HTMLAudioElement | null;
  hitSound: HTMLAudioElement | null;
  successSound: HTMLAudioElement | null;
  isMuted: boolean;
  audioSupported: boolean; // Whether audio is supported/allowed
  
  // Setter functions
  setBackgroundMusic: (music: HTMLAudioElement | null) => void;
  setHitSound: (sound: HTMLAudioElement | null) => void;
  setSuccessSound: (sound: HTMLAudioElement | null) => void;
  
  // Control functions
  toggleMute: () => void;
  playHit: () => void;
  playSuccess: () => void;
  checkAudioSupport: () => void;
}

// Check if audio is supported and allowed
const checkAudioAvailable = (): boolean => {
  try {
    // Check if HTMLAudioElement is available
    if (typeof HTMLAudioElement === 'undefined') {
      return false;
    }
    
    // Try creating a test audio element
    const testAudio = new Audio();
    if (!testAudio) {
      return false;
    }
    
    // Check if play() method exists (some restricted environments remove it)
    if (typeof testAudio.play !== 'function') {
      return false;
    }
    
    return true;
  } catch (error) {
    // Audio is blocked or not supported
    console.log("Audio not available in this environment:", error);
    return false;
  }
};

export const useAudio = create<AudioState>((set, get) => ({
  backgroundMusic: null,
  hitSound: null,
  successSound: null,
  isMuted: true, // Start muted by default (good for schools)
  audioSupported: checkAudioAvailable(), // Check on initialization
  
  setBackgroundMusic: (music) => {
    // Try to set audio, but handle gracefully if blocked
    if (music && get().audioSupported) {
      music.preload = "auto";
      music.volume = 0.5; // Moderate volume
      
      // Add error handler for when audio fails to load
      music.addEventListener('error', () => {
        console.log("Background music failed to load (likely blocked)");
        set({ backgroundMusic: null });
      });
      
      set({ backgroundMusic: music });
    } else {
      set({ backgroundMusic: null });
    }
  },
  
  setHitSound: (sound) => {
    if (sound && get().audioSupported) {
      sound.preload = "auto";
      sound.volume = 0.3;
      
      sound.addEventListener('error', () => {
        console.log("Hit sound failed to load (likely blocked)");
        set({ hitSound: null });
      });
      
      set({ hitSound: sound });
    } else {
      set({ hitSound: null });
    }
  },
  
  setSuccessSound: (sound) => {
    if (sound && get().audioSupported) {
      sound.preload = "auto";
      sound.volume = 0.5;
      
      sound.addEventListener('error', () => {
        console.log("Success sound failed to load (likely blocked)");
        set({ successSound: null });
      });
      
      set({ successSound: sound });
    } else {
      set({ successSound: null });
    }
  },
  
  checkAudioSupport: () => {
    const supported = checkAudioAvailable();
    set({ audioSupported: supported });
    if (!supported) {
      // If audio not supported, clear all audio references
      set({ backgroundMusic: null, hitSound: null, successSound: null });
    }
  },
  
  toggleMute: () => {
    const { isMuted, audioSupported } = get();
    
    // If audio isn't supported, silently do nothing
    if (!audioSupported) {
      return;
    }
    
    const newMutedState = !isMuted;
    set({ isMuted: newMutedState });
    
    // Try to pause/play background music based on mute state
    const { backgroundMusic } = get();
    if (backgroundMusic) {
      if (newMutedState) {
        backgroundMusic.pause().catch(() => {
          // Ignore errors
        });
      } else {
        backgroundMusic.play().catch(() => {
          // Audio autoplay blocked, which is fine
        });
      }
    }
  },
  
  playHit: () => {
    const { hitSound, isMuted, audioSupported } = get();
    
    // Don't try to play if audio isn't supported or muted
    if (!audioSupported || isMuted || !hitSound) {
      return;
    }
    
    try {
      // Clone the sound to allow overlapping playback
      const soundClone = hitSound.cloneNode() as HTMLAudioElement;
      soundClone.volume = 0.3;
      soundClone.play().catch(error => {
        // Silently fail - audio may be blocked by school policy
        // Don't log errors to avoid cluttering console in restricted environments
      });
    } catch (error) {
      // Audio playback not allowed - silently continue
    }
  },
  
  playSuccess: () => {
    const { successSound, isMuted, audioSupported } = get();
    
    // Don't try to play if audio isn't supported or muted
    if (!audioSupported || isMuted || !successSound) {
      return;
    }
    
    try {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        // Silently fail - audio may be blocked by school policy
      });
    } catch (error) {
      // Audio playback not allowed - silently continue
    }
  }
}));
