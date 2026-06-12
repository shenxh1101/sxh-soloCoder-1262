import { getCharSetById } from "./charSets";

export const getPixelLuminance = (r: number, g: number, b: number): number => {
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

export const adjustContrast = (luminance: number, contrast: number): number => {
  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const result = factor * (luminance - 128) + 128;
  return Math.max(0, Math.min(255, result));
};

export const mapLuminanceToChar = (
  luminance: number,
  charSetId: string,
  invert: boolean
): string => {
  const charSet = getCharSetById(charSetId);
  const chars = charSet.chars;
  const charCount = chars.length;

  let adjustedLuminance = luminance;
  if (invert) {
    adjustedLuminance = 255 - luminance;
  }

  const index = Math.floor((adjustedLuminance / 255) * (charCount - 1));
  return chars[Math.max(0, Math.min(charCount - 1, index))];
};

export const generateAsciiArt = (
  imageData: ImageData,
  width: number,
  charSetId: string,
  contrast: number,
  invert: boolean
): string => {
  const { data, width: imgWidth, height: imgHeight } = imageData;

  if (imgWidth === 0 || imgHeight === 0 || width <= 0) {
    return "";
  }

  const aspectRatio = imgHeight / imgWidth;
  let charHeight = Math.floor(width * aspectRatio * 0.5);

  if (charHeight < 1) {
    charHeight = 1;
  }

  const safeWidth = Math.max(1, Math.floor(width));

  const canvas = document.createElement("canvas");
  canvas.width = safeWidth;
  canvas.height = charHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  const srcCanvas = document.createElement("canvas");
  srcCanvas.width = imgWidth;
  srcCanvas.height = imgHeight;
  const srcCtx = srcCanvas.getContext("2d");

  if (!srcCtx) return "";

  const tempImageData = srcCtx.createImageData(imgWidth, imgHeight);
  tempImageData.data.set(data);
  srcCtx.putImageData(tempImageData, 0, 0);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(srcCanvas, 0, 0, safeWidth, charHeight);

  const scaledData = ctx.getImageData(0, 0, safeWidth, charHeight).data;

  const lines: string[] = [];

  for (let y = 0; y < charHeight; y++) {
    let line = "";
    for (let x = 0; x < safeWidth; x++) {
      const idx = (y * safeWidth + x) * 4;
      const r = scaledData[idx];
      const g = scaledData[idx + 1];
      const b = scaledData[idx + 2];
      const luminance = getPixelLuminance(r, g, b);
      const adjustedLuminance = adjustContrast(luminance, contrast - 100);
      const char = mapLuminanceToChar(adjustedLuminance, charSetId, invert);
      line += char;
    }
    lines.push(line);
  }

  return lines.join("\n");
};

export const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const getImageData = (img: HTMLImageElement): ImageData => {
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get canvas context");
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
};
