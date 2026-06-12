import { useState } from "react";
import { useAsciiStore } from "@/store/useAsciiStore";
import { Copy, Check, Save, RotateCcw } from "lucide-react";

const ActionBar = () => {
  const { asciiArt, imageState, generateAscii, saveToHistory } = useAsciiStore();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

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

  const handleSave = () => {
    if (!asciiArt) return;
    saveToHistory();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
          flex-1 min-w-[100px] py-2.5 px-4 rounded-xl font-semibold
          flex items-center justify-center gap-2 transition-all duration-300
          text-sm
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
            <Check size={16} />
            已复制!
          </>
        ) : (
          <>
            <Copy size={16} />
            复制
          </>
        )}
      </button>

      <button
        onClick={handleSave}
        disabled={isDisabled}
        className={`
          flex-1 min-w-[100px] py-2.5 px-4 rounded-xl font-semibold border
          flex items-center justify-center gap-2 transition-all duration-300
          text-sm
          ${
            saved
              ? "border-green-500 text-green-400 bg-green-500/10"
              : isDisabled
              ? "border-terminal-border/50 text-terminal-green/30 cursor-not-allowed"
              : "border-terminal-amber text-terminal-amber hover:bg-terminal-amber/10 hover:shadow-glowAmber active:scale-[0.98]"
          }
        `}
      >
        {saved ? (
          <>
            <Check size={16} />
            已保存
          </>
        ) : (
          <>
            <Save size={16} />
            保存记录
          </>
        )}
      </button>

      <button
        onClick={handleReset}
        disabled={isDisabled}
        className={`
          py-2.5 px-4 rounded-xl border transition-all duration-300
          flex items-center justify-center gap-2
          ${
            isDisabled
              ? "border-terminal-border/50 text-terminal-green/30 cursor-not-allowed"
              : "border-terminal-border text-terminal-green/70 hover:border-terminal-cyan hover:text-terminal-cyan active:scale-[0.95]"
          }
        `}
        title="重置为生成的原始字符画"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
};

export default ActionBar;
