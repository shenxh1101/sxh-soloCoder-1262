import type { CharSet } from "@/types";

export const charSets: CharSet[] = [
  {
    id: "classic",
    name: "经典",
    chars: "@%#*+=-:. ",
    description: "从@到.的经典灰度字符集",
  },
  {
    id: "detailed",
    name: "精细",
    chars: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
    description: "更多字符级别，更细腻的灰度层次",
  },
  {
    id: "blocks",
    name: "块状",
    chars: "█▓▒░ ",
    description: "使用方块字符，适合复古风格",
  },
  {
    id: "minimal",
    name: "极简",
    chars: "#. ",
    description: "极简风格，只有黑白两档",
  },
  {
    id: "binary",
    name: "二进制",
    chars: "01",
    description: "0和1的赛博朋克风格",
  },
  {
    id: "dots",
    name: "点阵",
    chars: "●○•· ",
    description: "圆点字符集，柔和过渡",
  },
];

export const getCharSetById = (id: string): CharSet => {
  return charSets.find((cs) => cs.id === id) || charSets[0];
};
