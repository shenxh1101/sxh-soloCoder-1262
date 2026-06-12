import type { Preset } from "@/types";

export const presets: Preset[] = [
  {
    id: "classic",
    name: "经典",
    icon: "🎯",
    params: {
      width: 80,
      charSetId: "classic",
      contrast: 100,
      invert: false,
    },
    description: "默认参数，平衡的显示效果",
  },
  {
    id: "high-contrast",
    name: "高对比",
    icon: "⚡",
    params: {
      width: 80,
      charSetId: "minimal",
      contrast: 160,
      invert: false,
    },
    description: "强烈的黑白对比，轮廓分明",
  },
  {
    id: "soft",
    name: "柔和",
    icon: "🌸",
    params: {
      width: 100,
      charSetId: "dots",
      contrast: 70,
      invert: false,
    },
    description: "柔和过渡，适合人像照片",
  },
  {
    id: "comic",
    name: "漫画",
    icon: "🎨",
    params: {
      width: 120,
      charSetId: "detailed",
      contrast: 130,
      invert: false,
    },
    description: "丰富的细节层次，漫画风格",
  },
  {
    id: "terminal-green",
    name: "终端绿",
    icon: "💚",
    params: {
      width: 80,
      charSetId: "classic",
      contrast: 110,
      invert: true,
    },
    description: "经典绿色终端显示效果",
  },
  {
    id: "blocks",
    name: "像素块",
    icon: "🧱",
    params: {
      width: 60,
      charSetId: "blocks",
      contrast: 120,
      invert: false,
    },
    description: "方块像素风格，复古游戏感",
  },
  {
    id: "binary",
    name: "赛博",
    icon: "🤖",
    params: {
      width: 100,
      charSetId: "binary",
      contrast: 140,
      invert: false,
    },
    description: "0和1的赛博朋克风格",
  },
  {
    id: "fine",
    name: "精细",
    icon: "🔬",
    params: {
      width: 160,
      charSetId: "detailed",
      contrast: 105,
      invert: false,
    },
    description: "超精细模式，细节丰富",
  },
];
