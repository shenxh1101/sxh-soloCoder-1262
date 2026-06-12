import type { ExportSettings } from "@/types";

export const generateThumbnail = (
  asciiArt: string,
  maxWidth: number = 120,
  maxHeight: number = 80
): string => {
  const lines = asciiArt.split("\n");
  const height = Math.min(lines.length, maxHeight);
  const width = Math.min(lines[0]?.length || 0, maxWidth);

  const thumbnailLines: string[] = [];
  for (let i = 0; i < height; i++) {
    const line = lines[i] || "";
    thumbnailLines.push(line.slice(0, width));
  }

  return thumbnailLines.join("\n");
};

export const exportAsTxt = (asciiArt: string, filename: string = "ascii-art.txt") => {
  const blob = new Blob([asciiArt], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportAsPng = (
  asciiArt: string,
  settings: Omit<ExportSettings, "format">,
  filename: string = "ascii-art.png"
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const lines = asciiArt.split("\n");
    const lineCount = lines.length;
    const charCount = Math.max(...lines.map((l) => l.length), 0);

    const fontSize = settings.fontSize;
    const lineHeight = fontSize * 1.2;
    const padding = settings.padding;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Cannot get canvas context"));
      return;
    }

    const fontFamilies =
      '"JetBrains Mono", "Fira Code", "Courier New", monospace';

    const measureAndDraw = () => {
      ctx.font = `${fontSize}px ${fontFamilies}`;
      const charWidth = ctx.measureText("M").width;

      canvas.width = Math.ceil(charCount * charWidth + padding * 2);
      canvas.height = Math.ceil(lineCount * lineHeight + padding * 2);

      ctx.fillStyle = settings.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px ${fontFamilies}`;
      ctx.fillStyle = settings.foregroundColor;
      ctx.textBaseline = "top";
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      lines.forEach((line, index) => {
        ctx.fillText(line, padding, padding + index * lineHeight);
      });

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Failed to create blob"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        resolve();
      }, "image/png");
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measureAndDraw();
      }).catch(() => {
        measureAndDraw();
      });
    } else {
      setTimeout(measureAndDraw, 100);
    }
  });
};

export const exportAsHtml = (
  asciiArt: string,
  settings: Omit<ExportSettings, "format">,
  filename: string = "ascii-art.html"
) => {
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ASCII Art</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      background: ${settings.backgroundColor};
      display: flex;
      align-items: center;
      justify-content: center;
      padding: ${settings.padding}px;
    }
    pre {
      font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace;
      font-size: ${settings.fontSize}px;
      line-height: 1.2;
      color: ${settings.foregroundColor};
      white-space: pre;
      text-shadow: 0 0 10px ${settings.foregroundColor}40;
    }
  </style>
</head>
<body>
  <pre>${asciiArt.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
</body>
</html>`;

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
