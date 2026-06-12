import { useState } from "react";
import { useAsciiStore } from "@/store/useAsciiStore";
import { Copy, Download, RotateCcw, Check } from "lucide-react";

const ActionBar = () => {
  const { asciiArt, params, generateAscii, imageState } = useAsciiStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!asciiArt) return;
    try {
      await navigator.clipboard.writeText(asciiArt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Copy failed:", e);
    }
  };

  const handleDownload = () => {
    if (!asciiArt) return;
    const blob = new Blob([asciiArt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ascii-art-${params.width}w-${params.charSetId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    generateAscii();
  };

  const isDisabled = !asciiArt || !imageState.source;

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleCopy}
        disabled={isDisabled}
        className={`
          flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold
          flex items-center justify-center gap-2 transition-all duration-300
          ${
            copied
              ? "bg-green-500 text-white shadow-glow"
              : isDisabled
              ? "bg-terminal-border/50 text-terminal-green/30 cursor-not-allowed"
              : "bg-terminal-green text-terminal-bg hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] btn-glow"
          }
        `}
      >
        {copied ? (
          <>
            <Check size={18} />
            已复制!
          </>
        ) : (
          <>
            <Copy size={18} />
            复制到剪贴板
          </>
        )}
      </button>

      <button
        onClick={handleDownload}
        disabled={isDisabled}
        className={`
          flex-1 min-w-[120px] py-3 px-4 rounded-xl font-semibold border
          flex items-center justify-center gap-2 transition-all duration-300
          ${
            isDisabled
              ? "border-terminal-border/50 text-terminal-green/30 cursor-not-allowed"
              : "border-terminal-cyan text-terminal-cyan hover:bg-terminal-cyan/10 hover:border-terminal-cyan hover:shadow-glowCyan active:scale-[0.98]"
          }
        `}
      >
        <Download size={18} />
        下载 TXT
      </button>

      <button
        onClick={handleReset}
        disabled={isDisabled}
        className={`
          py-3 px-4 rounded-xl border transition-all duration-300
          flex items-center justify-center gap-2
          ${
            isDisabled
              ? "border-terminal-border/50 text-terminal-green/30 cursor-not-allowed"
              : "border-terminal-border text-terminal-green/70 hover:border-terminal-amber hover:text-terminal-amber active:scale-[0.95]"
          }
        `}
        title="重置为生成的原始字符画"
      >
        <RotateCcw size={18} />
      </button>
    </div>
  );
};

export default ActionBar;
