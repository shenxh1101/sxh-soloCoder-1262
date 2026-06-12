import { create } from "zustand";
import type { GeneratorParams, ImageState } from "@/types";
import { generateAsciiArt, getImageData } from "@/utils/pixelUtils";

interface AsciiState {
  imageState: ImageState;
  params: GeneratorParams;
  asciiArt: string;
  isGenerating: boolean;
  setImage: (img: HTMLImageElement) => void;
  clearImage: () => void;
  setParams: (params: Partial<GeneratorParams>) => void;
  generateAscii: () => void;
  setAsciiArt: (art: string) => void;
}

export const useAsciiStore = create<AsciiState>((set, get) => ({
  imageState: {
    source: null,
    originalWidth: 0,
    originalHeight: 0,
  },
  params: {
    width: 80,
    charSetId: "classic",
    contrast: 100,
    invert: false,
  },
  asciiArt: "",
  isGenerating: false,

  setImage: (img: HTMLImageElement) => {
    set({
      imageState: {
        source: img,
        originalWidth: img.naturalWidth,
        originalHeight: img.naturalHeight,
      },
    });
    get().generateAscii();
  },

  clearImage: () => {
    set({
      imageState: { source: null, originalWidth: 0, originalHeight: 0 },
      asciiArt: "",
    });
  },

  setParams: (newParams: Partial<GeneratorParams>) => {
    set((state) => ({ params: { ...state.params, ...newParams } }));
    if (get().imageState.source) {
      get().generateAscii();
    }
  },

  generateAscii: () => {
    const { imageState, params } = get();
    if (!imageState.source) return;

    set({ isGenerating: true });

    requestAnimationFrame(() => {
      try {
        const imageData = getImageData(imageState.source!);
        const art = generateAsciiArt(
          imageData,
          params.width,
          params.charSetId,
          params.contrast,
          params.invert
        );
        set({ asciiArt: art, isGenerating: false });
      } catch (e) {
        console.error("Failed to generate ASCII art:", e);
        set({ isGenerating: false });
      }
    });
  },

  setAsciiArt: (art: string) => {
    set({ asciiArt: art });
  },
}));
