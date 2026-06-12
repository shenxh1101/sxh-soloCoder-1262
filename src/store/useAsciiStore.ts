import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  GeneratorParams,
  ImageState,
  HistoryItem,
  ExportSettings,
  WorkVersion,
  HistoryState,
  CompareMode,
} from "@/types";
import { generateAsciiArt, getImageData } from "@/utils/pixelUtils";
import { generateThumbnail } from "@/utils/exportUtils";
import {
  generateImageHash,
  paramsEqual,
  generateWorkName,
  generateVersionName,
} from "@/utils/workUtils";

interface AsciiState {
  imageState: ImageState;
  params: GeneratorParams;
  asciiArt: string;
  isGenerating: boolean;
  history: HistoryItem[];
  activeWorkId: string | null;
  exportSettings: ExportSettings;
  historyState: HistoryState;
  compareMode: CompareMode;
  selectedVersionIds: string[];
  currentWorkVersions: WorkVersion[];

  setImage: (img: HTMLImageElement) => void;
  clearImage: () => void;
  setParams: (params: Partial<GeneratorParams>) => void;
  generateAscii: () => void;
  setAsciiArt: (art: string) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  saveToHistory: (options?: { asNewVersion?: boolean; autoSave?: boolean }) => void;
  loadFromHistory: (id: string) => void;
  loadVersion: (workId: string, versionId: string) => void;
  deleteFromHistory: (id: string) => void;
  clearHistory: () => void;
  renameHistoryItem: (id: string, name: string) => void;
  toggleFavorite: (id: string) => void;
  deleteVersion: (workId: string, versionId: string) => void;
  renameVersion: (workId: string, versionId: string, name: string) => void;

  setExportSettings: (settings: Partial<ExportSettings>) => void;

  setCompareMode: (mode: CompareMode) => void;
  toggleVersionSelection: (workId: string, versionId: string) => void;
  clearVersionSelection: () => void;
}

const MAX_HISTORY_ITEMS = 50;
const MAX_VERSIONS_PER_WORK = 10;
const MAX_HISTORY_STATE = 50;
const AUTO_SAVE_DEBOUNCE = 0;

let autoSaveTimer: number | null = null;

export const useAsciiStore = create<AsciiState>()(
  persist(
    (set, get) => ({
      imageState: {
        source: null,
        originalWidth: 0,
        originalHeight: 0,
        imageHash: undefined,
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
      activeWorkId: null,
      exportSettings: {
        format: "png",
        fontSize: 14,
        foregroundColor: "#39ff14",
        backgroundColor: "#0a1914",
        padding: 20,
      },
      historyState: {
        past: [],
        future: [],
      },
      compareMode: "off",
      selectedVersionIds: [],
      currentWorkVersions: [],

      setImage: (img: HTMLImageElement) => {
        const imageData = getImageData(img);
        const hash = generateImageHash(imageData);

        set({
          imageState: {
            source: img,
            originalWidth: img.naturalWidth,
            originalHeight: img.naturalHeight,
            imageHash: hash,
          },
          activeWorkId: null,
          historyState: { past: [], future: [] },
          currentWorkVersions: [],
        });

        get().generateAscii();
      },

      clearImage: () => {
        set({
          imageState: {
            source: null,
            originalWidth: 0,
            originalHeight: 0,
            imageHash: undefined,
          },
          asciiArt: "",
          activeWorkId: null,
          historyState: { past: [], future: [] },
          currentWorkVersions: [],
        });
      },

      setParams: (newParams: Partial<GeneratorParams>) => {
        const state = get();
        if (!state.imageState.source) {
          set((s) => ({ params: { ...s.params, ...newParams } }));
          return;
        }

        const mergedParams = { ...state.params, ...newParams };
        if (paramsEqual(state.params, mergedParams)) return;

        const newPast = [
          ...state.historyState.past,
          { params: { ...state.params }, asciiArt: state.asciiArt },
        ].slice(-MAX_HISTORY_STATE);

        set({
          params: mergedParams,
          historyState: {
            past: newPast,
            future: [],
          },
        });

        get().generateAscii();

        if (autoSaveTimer) {
          clearTimeout(autoSaveTimer);
        }
        autoSaveTimer = window.setTimeout(() => {
          get().saveToHistory({ autoSave: true });
        }, AUTO_SAVE_DEBOUNCE);
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
        const state = get();
        const newPast = [
          ...state.historyState.past,
          { params: { ...state.params }, asciiArt: state.asciiArt },
        ].slice(-MAX_HISTORY_STATE);

        set({
          asciiArt: art,
          historyState: {
            past: newPast,
            future: [],
          },
        });
      },

      undo: () => {
        const state = get();
        if (state.historyState.past.length === 0) return;

        const prev = state.historyState.past[state.historyState.past.length - 1];
        const newPast = state.historyState.past.slice(0, -1);
        const newFuture = [
          { params: { ...state.params }, asciiArt: state.asciiArt },
          ...state.historyState.future,
        ].slice(0, MAX_HISTORY_STATE);

        set({
          params: prev.params,
          asciiArt: prev.asciiArt,
          historyState: {
            past: newPast,
            future: newFuture,
          },
        });
      },

      redo: () => {
        const state = get();
        if (state.historyState.future.length === 0) return;

        const next = state.historyState.future[0];
        const newFuture = state.historyState.future.slice(1);
        const newPast = [
          ...state.historyState.past,
          { params: { ...state.params }, asciiArt: state.asciiArt },
        ].slice(-MAX_HISTORY_STATE);

        set({
          params: next.params,
          asciiArt: next.asciiArt,
          historyState: {
            past: newPast,
            future: newFuture,
          },
        });
      },

      canUndo: () => get().historyState.past.length > 0,
      canRedo: () => get().historyState.future.length > 0,

      saveToHistory: (options = {}) => {
        const { asciiArt, params, imageState, history, activeWorkId } = get();
        const { asNewVersion = false, autoSave = false } = options;

        if (!asciiArt) return;

        const now = Date.now();
        const thumbnail = generateThumbnail(asciiArt, 40, 20);

        let newHistory = [...history];
        let targetWorkId = activeWorkId;

        if (activeWorkId && !asNewVersion) {
          const workIdx = newHistory.findIndex((w) => w.id === activeWorkId);
          if (workIdx >= 0) {
            const work = newHistory[workIdx];

            const lastVersion = work.versions[work.versions.length - 1];
            if (
              lastVersion &&
              paramsEqual(lastVersion.params, params) &&
              lastVersion.asciiArt === asciiArt
            ) {
              return;
            }

            const newVersion: WorkVersion = {
              id: `v_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
              name: generateVersionName(now, work.versions.length),
              timestamp: now,
              asciiArt,
              params: { ...params },
              thumbnail,
            };

            const newVersions = [...work.versions, newVersion].slice(-MAX_VERSIONS_PER_WORK);

            newHistory[workIdx] = {
              ...work,
              asciiArt,
              params: { ...params },
              thumbnail,
              timestamp: now,
              versions: newVersions,
              activeVersionId: newVersion.id,
            };

            set({
              history: newHistory,
              currentWorkVersions: newVersions,
            });
            return;
          }
        }

        if (!targetWorkId || asNewVersion) {
          const newVersion: WorkVersion = {
            id: `v_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
            name: "版本 1",
            timestamp: now,
            asciiArt,
            params: { ...params },
            thumbnail,
          };

          const workName = generateWorkName(now);

          const newWork: HistoryItem = {
            id: `w_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
            name: workName,
            timestamp: now,
            asciiArt,
            params: { ...params },
            thumbnail,
            originalDimensions: {
              width: imageState.originalWidth,
              height: imageState.originalHeight,
            },
            isFavorite: false,
            sourceImageHash: imageState.imageHash,
            versions: [newVersion],
            activeVersionId: newVersion.id,
          };

          newHistory = [newWork, ...newHistory].slice(0, MAX_HISTORY_ITEMS);
          targetWorkId = newWork.id;

          set({
            history: newHistory,
            activeWorkId: targetWorkId,
            currentWorkVersions: newWork.versions,
          });
        }
      },

      loadFromHistory: (id: string) => {
        const work = get().history.find((h) => h.id === id);
        if (!work) return;

        set({
          asciiArt: work.asciiArt,
          params: { ...work.params },
          activeWorkId: work.id,
          currentWorkVersions: work.versions,
          historyState: { past: [], future: [] },
        });
      },

      loadVersion: (workId: string, versionId: string) => {
        const work = get().history.find((h) => h.id === workId);
        if (!work) return;
        const version = work.versions.find((v) => v.id === versionId);
        if (!version) return;

        set({
          asciiArt: version.asciiArt,
          params: { ...version.params },
          activeWorkId: work.id,
          historyState: { past: [], future: [] },
        });
      },

      deleteFromHistory: (id: string) => {
        set((state) => {
          const newHistory = state.history.filter((h) => h.id !== id);
          const newActiveId = state.activeWorkId === id ? null : state.activeWorkId;
          return {
            history: newHistory,
            activeWorkId: newActiveId,
            currentWorkVersions: newActiveId
              ? newHistory.find((h) => h.id === newActiveId)?.versions || []
              : [],
          };
        });
      },

      clearHistory: () => {
        set({
          history: [],
          activeWorkId: null,
          currentWorkVersions: [],
        });
      },

      renameHistoryItem: (id: string, name: string) => {
        set((state) => ({
          history: state.history.map((h) =>
            h.id === id ? { ...h, name: name || h.name } : h
          ),
        }));
      },

      toggleFavorite: (id: string) => {
        set((state) => ({
          history: state.history.map((h) =>
            h.id === id ? { ...h, isFavorite: !h.isFavorite } : h
          ),
        }));
      },

      deleteVersion: (workId: string, versionId: string) => {
        set((state) => {
          const newHistory = state.history.map((h) => {
            if (h.id !== workId) return h;
            const newVersions = h.versions.filter((v) => v.id !== versionId);
            return {
              ...h,
              versions: newVersions,
              activeVersionId:
                h.activeVersionId === versionId
                  ? newVersions[newVersions.length - 1]?.id
                  : h.activeVersionId,
            };
          });
          return {
            history: newHistory,
            currentWorkVersions:
              state.activeWorkId === workId
                ? newHistory.find((h) => h.id === workId)?.versions || []
                : state.currentWorkVersions,
          };
        });
      },

      renameVersion: (workId: string, versionId: string, name: string) => {
        set((state) => ({
          history: state.history.map((h) =>
            h.id !== workId
              ? h
              : {
                  ...h,
                  versions: h.versions.map((v) =>
                    v.id === versionId ? { ...v, name: name || v.name } : v
                  ),
                }
          ),
        }));
      },

      setExportSettings: (settings: Partial<ExportSettings>) => {
        set((state) => ({
          exportSettings: { ...state.exportSettings, ...settings },
        }));
      },

      setCompareMode: (mode: CompareMode) => {
        set({
          compareMode: mode,
          selectedVersionIds: mode === "off" ? [] : get().selectedVersionIds,
        });
      },

      toggleVersionSelection: (_workId: string, versionId: string) => {
        const state = get();
        const isSelected = state.selectedVersionIds.includes(versionId);
        set({
          selectedVersionIds: isSelected
            ? state.selectedVersionIds.filter((id) => id !== versionId)
            : [...state.selectedVersionIds, versionId],
        });
      },

      clearVersionSelection: () => {
        set({ selectedVersionIds: [] });
      },
    }),
    {
      name: "ascii-generator-storage-v2",
      partialize: (state) => ({
        history: state.history,
        exportSettings: state.exportSettings,
        params: state.params,
      }),
      version: 2,
    }
  )
);
