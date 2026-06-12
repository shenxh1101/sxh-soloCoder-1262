export interface CharSet {
  id: string;
  name: string;
  chars: string;
  description: string;
}

export interface GeneratorParams {
  width: number;
  charSetId: string;
  contrast: number;
  invert: boolean;
}

export interface ImageState {
  source: HTMLImageElement | null;
  originalWidth: number;
  originalHeight: number;
  imageHash?: string;
}

export type CameraStatus = "idle" | "requesting" | "active" | "error";

export interface Preset {
  id: string;
  name: string;
  icon: string;
  params: Partial<GeneratorParams>;
  description: string;
}

export interface HistoryItem {
  id: string;
  name: string;
  timestamp: number;
  asciiArt: string;
  params: GeneratorParams;
  thumbnail: string;
  originalDimensions: {
    width: number;
    height: number;
  };
  isFavorite: boolean;
  sourceImageHash?: string;
  imageDataUrl?: string;
  versions: WorkVersion[];
  activeVersionId?: string;
}

export interface WorkVersion {
  id: string;
  name: string;
  timestamp: number;
  asciiArt: string;
  params: GeneratorParams;
  thumbnail: string;
  note?: string;
}

export interface HistoryState {
  past: {
    params: GeneratorParams;
    asciiArt: string;
  }[];
  future: {
    params: GeneratorParams;
    asciiArt: string;
  }[];
}

export interface ExportSettings {
  format: "txt" | "png" | "html";
  fontSize: number;
  foregroundColor: string;
  backgroundColor: string;
  padding: number;
}

export type ViewMode = "workspace" | "gallery" | "compare";

export type CompareMode = "off" | "selecting" | "comparing";
