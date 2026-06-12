import { useAsciiStore } from "@/store/useAsciiStore";
import { History, Trash2, RotateCcw, Clock } from "lucide-react";

const HistoryPanel = () => {
  const { history, loadFromHistory, deleteFromHistory, clearHistory } =
    useAsciiStore();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - timestamp;

    if (diff < 60000) return "刚刚";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`;

    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-terminal-bgDark/50 border border-terminal-border rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-terminal-bg/50">
        <div className="flex items-center gap-2">
          <History size={16} className="text-terminal-cyan" />
          <span className="text-terminal-green/80 font-medium text-sm">
            历史记录
          </span>
          <span className="text-[10px] bg-terminal-bgLight px-1.5 py-0.5 rounded text-terminal-green/60">
            {history.length}
          </span>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="text-[11px] text-terminal-green/50 hover:text-red-400 transition-colors"
          >
            清空
          </button>
        )}
      </div>

      <div className="max-h-64 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-6 text-center">
            <Clock
              size={28}
              className="mx-auto mb-2 text-terminal-green/20"
            />
            <p className="text-terminal-green/40 text-xs">
              暂无历史记录
            </p>
            <p className="text-terminal-green/30 text-[10px] mt-1">
              生成字符画后会自动保存
            </p>
          </div>
        ) : (
          <div className="divide-y divide-terminal-border/50">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-3 hover:bg-terminal-bgLight/30 transition-colors group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-20 h-14 bg-terminal-bgDark border border-terminal-border/50 rounded overflow-hidden"
                    title="缩略预览"
                  >
                    <pre
                      className="text-[4px] leading-tight text-terminal-green/70 p-1 whitespace-pre font-mono"
                      style={{ fontSize: "4px", lineHeight: "5px" }}
                    >
                      {item.thumbnail}
                    </pre>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] text-terminal-green/80 font-medium">
                        {item.params.width} 宽
                      </span>
                      <span className="text-[10px] text-terminal-green/50">
                        ·
                      </span>
                      <span className="text-[10px] text-terminal-green/50">
                        {item.params.charSetId}
                      </span>
                    </div>
                    <div className="text-[10px] text-terminal-green/40 font-mono">
                      {formatTime(item.timestamp)}
                    </div>

                    <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => loadFromHistory(item.id)}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] text-terminal-green/70 hover:text-terminal-green hover:bg-terminal-green/10 rounded transition-colors"
                        title="恢复此记录"
                      >
                        <RotateCcw size={10} />
                        恢复
                      </button>
                      <button
                        onClick={() => deleteFromHistory(item.id)}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] text-terminal-green/50 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                        title="删除此记录"
                      >
                        <Trash2 size={10} />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
