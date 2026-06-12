import type { GeneratorParams } from "@/types";

export const generateImageHash = (imageData: ImageData): string => {
  const data = imageData.data;
  let hash = 0;
  const step = Math.max(1, Math.floor(data.length / 1000));
  for (let i = 0; i < data.length; i += step * 4) {
    hash = ((hash << 5) - hash + data[i] + data[i + 1] + data[i + 2]) | 0;
  }
  return `img_${Math.abs(hash).toString(36)}`;
};

export const paramsEqual = (
  a: Partial<GeneratorParams>,
  b: Partial<GeneratorParams>
): boolean => {
  return (
    a.width === b.width &&
    a.charSetId === b.charSetId &&
    a.contrast === b.contrast &&
    a.invert === b.invert
  );
};

export const generateWorkName = (timestamp: number, index: number = 0): string => {
  const date = new Date(timestamp);
  const dateStr = `${date.getMonth() + 1}月${date.getDate()}日`;
  const timeStr = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
  return index > 0 ? `作品 ${dateStr} ${timeStr} #${index + 1}` : `作品 ${dateStr} ${timeStr}`;
};

export const generateVersionName = (timestamp: number, idx: number): string => {
  return `版本 ${idx + 1}`;
};
