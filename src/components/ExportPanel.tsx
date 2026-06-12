import { useState } from "react";
import { useAsciiStore } from "@/store/useAsciiStore";
import { exportAsTxt, exportAsPng, exportAsHtml } from "@/utils/exportUtils";
import { Download, FileText, Image, Code, Settings, ChevronDown, ChevronUp } from "lucide-react";

const ExportPanel = () => {
  const { asciiArt, exportSettings, setExportSettings, saveToHistory } = useAsciiStore();
  const [expanded, setExpanded] = useState(true);
  const [exporting, setExporting] = useState(false);

  const isDisabled = !asciiArt;

  const handleExport = async (format: "txt" | "png" | "html") => {
    if (!asciiArt) return;

    saveToHistory();

    if (format === "txt") {
      exportAsTxt(asciiArt, `ascii-art-${Date.now()}.txt`);
      return;
    }

    setExporting(true);
    try {
      const settings = {
        fontSize: exportSettings.fontSize,
        foregroundColor: exportSettings.foregroundColor,
        backgroundColor: exportSettings.backgroundColor,
        padding: exportSettings.padding,
      };

      if (format === "png") {
        await exportAsPng(asciiArt, settings, `ascii-art-${Date.now()}.png`);
      } else if (format === "html") {
        exportAsHtml(asciiArt, settings, `ascii-art-${Date.now()}.html`);
      }
    } catch (e) {
      console.error("Export failed:", e);
      alert("导出失败，请重试");
    } finally {
      setExporting(false);
    }
  };

  const colorPresets = [
    { name: "终端绿", fg: "#39ff14", bg: "#0a1914" },
    { name: "琥珀", fg: "#ffb000", bg: "#1a1200" },
    { name: "青色", fg: "#00b7c2", bg: "#001a1c" },
    { name: "紫色", fg: "#bf5fff", bg: "#1a0a2e" },
    { name: "白纸黑字", fg: "#000000", bg: "#ffffff" },
    { name: "黑纸白字", fg: "#ffffff", bg: "#000000" },
  ];

  return (
    <div className="bg-terminal-bgDark/50 border border-terminal-border rounded-xl overflow-hidden backdrop-blur-sm">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-terminal-bg/50 hover:bg-terminal-bgLight/20 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Download size={16} className="text-terminal-cyan" />
          <span className="text-terminal-green/80 font-medium text-sm">
            导出设置
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-terminal-green/50" />
        ) : (
          <ChevronDown size={16} className="text-terminal-green/50" />
        )}
      </button>

      {expanded && (
        <div className="p-4 space-y-4">
          {/* 导出按钮 */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleExport("txt")}
              disabled={isDisabled || exporting}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-lg border transition-all
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed border-terminal-border"
                    : "cursor-pointer border-terminal-border hover:border-terminal-green/50 hover:bg-terminal-green/5"
                }
              `}
            >
              <FileText size={18} className="text-terminal-green/80" />
              <span className="text-[11px] text-terminal-green/70">TXT</span>
            </button>
            <button
              onClick={() => handleExport("png")}
              disabled={isDisabled || exporting}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-lg border transition-all
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed border-terminal-border"
                    : "cursor-pointer border-terminal-cyan/50 hover:border-terminal-cyan hover:bg-terminal-cyan/5 text-terminal-cyan"
                }
              `}
            >
              <Image size={18} />
              <span className="text-[11px]">PNG</span>
            </button>
            <button
              onClick={() => handleExport("html")}
              disabled={isDisabled || exporting}
              className={`
                flex flex-col items-center gap-1 p-3 rounded-lg border transition-all
                ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed border-terminal-border"
                    : "cursor-pointer border-terminal-amber/50 hover:border-terminal-amber hover:bg-terminal-amber/5 text-terminal-amber"
                }
              `}
            >
              <Code size={18} />
              <span className="text-[11px]">HTML</span>
            </button>
          </div>

          {/* 样式设置 */}
          <div className="space-y-3 pt-2 border-t border-terminal-border/50">
            <div className="flex items-center gap-2 text-[11px] text-terminal-green/60">
              <Settings size={12} />
              样式设置
            </div>

            {/* 字体大小 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-terminal-green/70">
                  字体大小
                </label>
                <span className="text-[11px] text-terminal-green font-mono">
                  {exportSettings.fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                value={exportSettings.fontSize}
                onChange={(e) =>
                  setExportSettings({ fontSize: Number(e.target.value) })
                }
                className="w-full h-1"
              />
            </div>

            {/* 内边距 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] text-terminal-green/70">
                  内边距
                </label>
                <span className="text-[11px] text-terminal-green font-mono">
                  {exportSettings.padding}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                value={exportSettings.padding}
                onChange={(e) =>
                  setExportSettings({ padding: Number(e.target.value) })
                }
                className="w-full h-1"
              />
            </div>

            {/* 颜色预设 */}
            <div>
              <label className="text-[11px] text-terminal-green/70 block mb-2">
                配色方案
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {colorPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setExportSettings({
                        foregroundColor: preset.fg,
                        backgroundColor: preset.bg,
                      })
                    }
                    className="p-1.5 rounded border border-terminal-border/50 hover:border-terminal-green/50 transition-colors"
                    title={preset.name}
                  >
                    <div
                      className="w-full h-4 rounded-sm flex items-center justify-center text-[8px] font-mono"
                      style={{ backgroundColor: preset.bg, color: preset.fg }}
                    >
                      Aa
                    </div>
                    <div className="text-[9px] text-terminal-green/50 mt-1 text-center truncate">
                      {preset.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 自定义颜色 */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-terminal-green/50 block mb-1">
                  前景色
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={exportSettings.foregroundColor}
                    onChange={(e) =>
                      setExportSettings({ foregroundColor: e.target.value })
                    }
                    className="w-8 h-8 rounded border border-terminal-border bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={exportSettings.foregroundColor}
                    onChange={(e) =>
                      setExportSettings({ foregroundColor: e.target.value })
                    }
                    className="flex-1 bg-terminal-bg border border-terminal-border rounded px-2 py-1 text-[10px] font-mono text-terminal-green outline-none focus:border-terminal-green/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] text-terminal-green/50 block mb-1">
                  背景色
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={exportSettings.backgroundColor}
                    onChange={(e) =>
                      setExportSettings({ backgroundColor: e.target.value })
                    }
                    className="w-8 h-8 rounded border border-terminal-border bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={exportSettings.backgroundColor}
                    onChange={(e) =>
                      setExportSettings({ backgroundColor: e.target.value })
                    }
                    className="flex-1 bg-terminal-bg border border-terminal-border rounded px-2 py-1 text-[10px] font-mono text-terminal-green outline-none focus:border-terminal-green/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
