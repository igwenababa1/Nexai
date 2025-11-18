// globals.d.ts
export {};

declare global {
  // Interface for AI Studio environment
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
    aistudio?: AIStudio;
  }

  // Augment the NodeJS namespace to add API_KEY to ProcessEnv.
  // This ensures compatibility with the existing 'process' declaration from @types/node.
  namespace NodeJS {
    interface ProcessEnv {
      API_KEY: string;
      [key: string]: string | undefined;
    }
  }
}

// Declare module for html2pdf.js specific import.
// Use shorthand declaration to avoid "Exports and export assignments are not permitted in module augmentations" error.
declare module 'html2pdf.js/dist/html2pdf.min.js';

// Fallback declaration for the main package
declare module 'html2pdf.js';
