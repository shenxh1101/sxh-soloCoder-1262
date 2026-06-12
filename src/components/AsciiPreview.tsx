import { useAsciiStore } from "@/store/useAsciiStore";
import { Terminal, Loader2, Minus, Square, X } from "lucide-react";

const AsciiPreview = () => {
  const { asciiArt, isGenerating, imageState, params } = useAsciiStore();

  const placeholder = `
╔══════════════════════════════════════════════════════════════╗
║  █████╗ ███████╗ ██████╗██╗██╗    ██████╗ ███████╗███╗   ██╗ ║
║ ██╔══██╗██╔════╝██╔════╝██║██║    ██╔══██╗██╔════╝████╗  ██║ ║
║ ███████║███████╗██║     ██║██║    ██████╔╝█████╗  ██╔██╗ ██║ ║
║ ██╔══██║╚════██║██║     ██║██║    ██╔══██╗██╔══╝  ██║╚██╗██║ ║
║ ██║  ██║███████║╚██████╗██║██║    ██║  ██║███████╗██║ ╚████║ ║
║ ╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝╚═╝    ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝ ║
╚══════════════════════════════════════════════════════════════╝

                    ┌─────────────────────┐
                    │  欢迎使用字符画生成器  │
                    └─────────────────────┘


  ◆ 拖拽图片到左侧上传区域，或点击选择文件
  ◆ 支持 JPG / PNG / GIF 等常见图片格式
  ◆ 也可以使用摄像头直接拍照生成

  ◆ 调节右侧参数，实时预览效果
  ◆ 6 种字符集：经典、精细、块状、极简、二进制、点阵
  ◆ 支持对比度调节和反色模式

  ◆ 生成后可直接编辑字符画
  ◆ 一键复制到剪贴板
  ◆ 下载为 TXT 文本文件


  > 系统状态: 就绪 _
`;

  const displayText = asciiArt || placeholder;
  const lineCount = asciiArt ? asciiArt.split("\n").length : 0;
  const charCount = asciiArt ? asciiArt.replace(/\n/g, "").length : 0;

  return (
    <div className="bg-terminal-bgDark border border-terminal-border rounded-xl overflow-hidden shadow-glow flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-terminal-border bg-terminal-bgLight/30">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex items-center gap-2 ml-3">
            <Terminal size={14} className="text-terminal-green/70" />
            <span className="text-terminal-green/70 font-mono text-xs">
              ascii-generator — bash — 80×24
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-terminal-green/40">
          <Minus size={12} />
          <Square size={12} />
          <X size={12} />
        </div>
      </div>

      <div className="relative flex-1 overflow-auto min-h-[450px] max-h-[600px] bg-terminal-bgDark">
        <div className="absolute inset-0 crt-scanlines pointer-events-none z-10" />
        <div className="absolute inset-0 crt-noise pointer-events-none z-10" />
        
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-terminal-bgDark/80 border-r border-terminal-border/50 z-[5]">
          <div className="py-4 pr-2 text-right text-terminal-green/30 font-mono text-[10px] leading-tight select-none">
            {Array.from({ length: Math.max(lineCount || 30, 30) }, (_, i) => (
              <div key={i}>{String(i + 1).padStart(2, "0")}</div>
            ))}
          </div>
        </div>

        <pre
          className={`
            pl-10 pr-4 py-4 font-mono text-xs leading-tight whitespace-pre
            ${asciiArt ? "text-terminal-green text-glow-sm animate-flicker" : "text-terminal-green/40"}
          `}
          style={{ 
            fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
            letterSpacing: '0.02em'
          }}
        >
          {displayText}
          {asciiArt && <span className="cursor-blink" />}
        </pre>

        {isGenerating && (
          <div className="absolute top-3 right-3 flex items-center gap-2 bg-terminal-bg/90 px-3 py-1.5 rounded-md border border-terminal-border text-[11px] text-terminal-green/70 z-20">
            <Loader2 size={12} className="animate-spin" />
            生成中...
          </div>
        )}
      </div>

      {asciiArt && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-terminal-border bg-terminal-bgLight/20 text-[11px] text-terminal-green/50 font-mono">
          <span>行 {lineCount}</span>
          <span>字符 {charCount}</span>
          <span>{params.width} 宽</span>
        </div>
      )}
    </div>
  );
};

export default AsciiPreview;
