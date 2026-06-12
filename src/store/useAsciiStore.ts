import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeneratorParams, ImageState, HistoryItem, ExportSettings } from "@/types";
import { generateAsciiArt, getImageData } from "@/utils/pixelUtils";
import { generateThumbnail } from "@/utils/exportUtils";

interface AsciiState {
  imageState: ImageState;
  params: GeneratorParams;
  asciiArt: string;
  isGenerating: boolean;
  history: HistoryItem[];
  exportSettings: ExportSettings;
  setImage: (img: HTMLImageElement) => void;
  clearImage: () => void;
  setParams: (params: Partial<GeneratorParams>) => void;
  generateAscii: () => void;
  setAsciiArt: (art: string) => void;
  saveToHistory: () => void;
  loadFromHistory: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
  setExportSettings: (settings: Partial<ExportSettings>) => void;
}

const MAX_HISTORY_ITEMS = 20;

export const useAsciiStore = create<AsciiState>()(
  persist(
    (set, get) => ({
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
      history: [],
      exportSettings: {
        format: "png",
        fontSize: 14,
        foregroundColor: "#39ff14",
        backgroundColor: "#0a1914",
        padding: 20,
      },

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

      saveToHistory: () => {
        const { asciiArt, params, imageState, history } = get();
        if (!asciiArt) return;

        const newItem: HistoryItem = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          asciiArt,
          params: { ...params },
          thumbnail: generateThumbnail(asciiArt, 40, 20),
          originalDimensions: {
            width: imageState.originalWidth,
            height: imageState.originalHeight,
          },
        };

        const newHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
        set({ history: newHistory });
      },

      loadFromHistory: (id: string) => {
        const item = get().history.find((h) => h.id === id);
        if (!item) return;

        set({
          asciiArt: item.asciiArt,
          params: { ...item.params },
        });
      },

      deleteFromHistory: (id: string) => {
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        }));
      },

      clearHistory: () => {
        set({ history: [] });
      },

      setExportSettings: (settings: Partial<ExportSettings>) => {
        set((state) => ({
          exportSettings: { ...state.exportSettings, ...settings },
        }));
      },
    }),
    {
      name: "ascii-generator-storage",
      partialize: (state) => ({
        history: state.history,
        exportSettings: state.exportSettings,
        params: state.params,
      }),
    }
  )
);
