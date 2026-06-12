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
