// globals.d.ts
export {};

// Fix: Moved the AIStudio interface into the `declare global` block to ensure it is globally scoped.
// This resolves the error "Subsequent property declarations must have the same type" by making
// AIStudio a global type, which can then be consistently applied to the global `window` object.
declare global {
  // Fix: Defined a named interface `AIStudio` to resolve a type conflict.
  // The error message indicated that subsequent property declarations for `window.aistudio`
  // must use the type `AIStudio` instead of an inline object.
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // For Speech Recognition API
    SpeechRecognition: any;
    webkitSpeechRecognition: any;

    // For AI Studio environment, used for Veo API key selection
    aistudio?: AIStudio;
  }
}
