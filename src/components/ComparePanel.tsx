import { useMemo } from "react";
import { useAsciiStore } from "@/store/useAsciiStore";
import { GitCompare, X, Layers, Check } from "lucide-react";

const ComparePanel = () => {
  const {
    history,
    selectedVersionIds,
    compareMode,
    setCompareMode,
    loadVersion,
    clearVersionSelection,
  } = useAsciiStore();

  const selectedVersions = useMemo(() => {
    const result: {
      workId: string;
      workName: string;
      versionId: string;
      versionName: string;
      asciiArt: string;
      params: any;
    }[] = [];

    for (const work of history) {
      for (const version of work.versions) {
        if (selectedVersionIds.includes(version.id)) {
          result.push({
            workId: work.id,
            workName: work.name,
            versionId: version.id,
            versionName: version.name,
            asciiArt: version.asciiArt,
            params: version.params,
          });
        }
      }
    }
    return result.slice(0, 4);
  }, [history, selectedVersionIds]);

  if (compareMode === "off" || selectedVersions.length < 2) {
    return null;
  }

  return (
    <div className="bg-terminal-bgDark/90 border-2 border-terminal-cyan/40 rounded-2xl overflow-hidden shadow-glowCyan backdrop-blur-sm">
      <div className="flex items-center justify-between px-5 py-3 border-b border-terminal-cyan/30 bg-terminal-cyan/10">
        <div className="flex items-center gap-2">
          <GitCompare size={18} className="text-terminal-cyan" />
          <span className="text-terminal-cyan font-semibold text-sm">
            版本对比
          </span>
          <span className="text-[10px] bg-terminal-cyan/20 text-terminal-cyan px-2 py-0.5 rounded-full">
            {selectedVersions.length} 个版本
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearVersionSelection}
            className="text-[11px] text-terminal-green/60 hover:text-terminal-green px-2 py-1 rounded hover:bg-terminal-bgLight transition-colors"
          >
            清空选择
          </button>
          <button
            onClick={() => {
              setCompareMode("off");
              clearVersionSelection();
            }}
            className="p-1.5 text-terminal-green/60 hover:text-terminal-green rounded hover:bg-terminal-bgLight transition-colors"
            title="关闭对比"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div
        className="grid gap-3 p-4 overflow-x-auto"
        style={{
          gridTemplateColumns: `repeat(${selectedVersions.length}, minmax(280px, 1fr))`,
        }}
      >
        {selectedVersions.map((item, idx) => (
          <div
            key={item.versionId}
            className="bg-terminal-bg border border-terminal-border rounded-xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-3 py-2 border-b border-terminal-border/50 bg-terminal-bgLight/30">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-full bg-terminal-cyan/20 text-terminal-cyan flex items-center justify-center text-xs font-bold">
                  {idx + 1}
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] text-terminal-green/90 font-medium truncate">
                    {item.versionName}
                  </div>
                  <div className="text-[9px] text-terminal-green/40 truncate">
                    {item.workName}
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  loadVersion(item.workId, item.versionId);
                  setCompareMode("off");
                  clearVersionSelection();
                }}
                className="flex items-center gap-1 px-2 py-1 text-[10px] bg-terminal-green/15 text-terminal-green rounded hover:bg-terminal-green/25 transition-colors"
                title="载入此版本继续编辑"
              >
                <Check size={10} />
                载入
              </button>
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 border-b border-terminal-border/30 text-[9px] text-terminal-green/50 font-mono bg-terminal-bgDark/50">
              <span>{item.params.width} 宽</span>
              <span>{item.params.charSetId}</span>
              <span>对比 {item.params.contrast}%</span>
              <span>{item.params.invert ? "反色" : "正常"}</span>
            </div>

            <div className="flex-1 overflow-auto max-h-64 min-h-[200px] p-2 relative">
              <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-30" />
              <pre
                className="text-[7px] leading-[8px] whitespace-pre font-mono text-terminal-green/80 relative z-10"
                style={{ fontFamily: '"JetBrains Mono", monospace' }}
              >
                {item.asciiArt}
              </pre>
            </div>

            <div className="px-3 py-2 border-t border-terminal-border/30 bg-terminal-bgDark/30 text-[9px] text-terminal-green/40 font-mono">
              <Layers size={10} className="inline mr-1" />
              {item.asciiArt.split("\n").length} 行 ·{" "}
              {item.asciiArt.replace(/\n/g, "").length} 字符
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparePanel;
