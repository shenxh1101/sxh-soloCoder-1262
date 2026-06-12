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
  timestamp: number;
  asciiArt: string;
  params: GeneratorParams;
  thumbnail: string;
  originalDimensions: {
    width: number;
    height: number;
  };
}

export interface ExportSettings {
  format: "txt" | "png" | "html";
  fontSize: number;
  foregroundColor: string;
  backgroundColor: string;
  padding: number;
}
