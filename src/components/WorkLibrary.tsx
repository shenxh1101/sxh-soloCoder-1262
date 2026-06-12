import { useState, useMemo } from "react";
import { useAsciiStore } from "@/store/useAsciiStore";
import {
  FolderKanban,
  Trash2,
  Clock,
  Search,
  Star,
  Pencil,
  Check,
  X,
  Layers,
  GitCompare,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const WorkLibrary = () => {
  const {
    history,
    activeWorkId,
    loadFromHistory,
    loadVersion,
    deleteFromHistory,
    clearHistory,
    renameHistoryItem,
    toggleFavorite,
    deleteVersion,
    renameVersion,
    setCompareMode,
    compareMode,
    selectedVersionIds,
    toggleVersionSelection,
    clearVersionSelection,
  } = useAsciiStore();

  const [search, setSearch] = useState("");
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingVersionId, setEditingVersionId] = useState<string | null>(null);
  const [editingVersionName, setEditingVersionName] = useState("");
  const [expandedWorkId, setExpandedWorkId] = useState<string | null>(null);

  const filteredWorks = useMemo(() => {
    return history.filter((w) => {
      if (filterFavorites && !w.isFavorite) return false;
      if (search && !w.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [history, filterFavorites, search]);

  const favoriteCount = history.filter((w) => w.isFavorite).length;

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

  const startRename = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const saveRename = () => {
    if (editingId && editingName.trim()) {
      renameHistoryItem(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName("");
  };

  const cancelRename = () => {
    setEditingId(null);
    setEditingName("");
  };

  const startRenameVersion = (versionId: string, currentName: string) => {
    setEditingVersionId(versionId);
    setEditingVersionName(currentName);
  };

  const saveRenameVersion = (workId: string, versionId: string) => {
    if (editingVersionName.trim()) {
      renameVersion(workId, versionId, editingVersionName.trim());
    }
    setEditingVersionId(null);
    setEditingVersionName("");
  };

  return (
    <div className="bg-terminal-bgDark/50 border border-terminal-border rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="px-4 py-3 border-b border-terminal-border bg-terminal-bg/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FolderKanban size={16} className="text-terminal-amber" />
            <span className="text-terminal-green/80 font-medium text-sm">
              作品库
            </span>
            <span className="text-[10px] bg-terminal-bgLight px-1.5 py-0.5 rounded text-terminal-green/60">
              {history.length}
            </span>
          </div>
          <button
            onClick={() => {
              if (compareMode === "off") {
                setCompareMode("selecting");
                clearVersionSelection();
              } else {
                setCompareMode("off");
                clearVersionSelection();
              }
            }}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors
              ${
                compareMode !== "off"
                  ? "bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan/50"
                  : "text-terminal-green/50 hover:text-terminal-green/80 hover:bg-terminal-bgLight"
              }
            `}
            title="对比模式"
          >
            <GitCompare size={12} />
            {compareMode !== "off" ? `对比中 ${selectedVersionIds.length}` : "对比"}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={12}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-terminal-green/40"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索作品..."
              className="w-full bg-terminal-bg border border-terminal-border rounded-md pl-7 pr-3 py-1.5 text-xs text-terminal-green placeholder-terminal-green/30 outline-none focus:border-terminal-green/50"
            />
          </div>
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`
              p-1.5 rounded-md border transition-colors
              ${
                filterFavorites
                  ? "bg-terminal-amber/20 border-terminal-amber/50 text-terminal-amber"
                  : "border-terminal-border text-terminal-green/50 hover:text-terminal-amber"
              }
            `}
            title={`收藏夹 (${favoriteCount})`}
          >
            <Star size={14} fill={filterFavorites ? "currentColor" : "none"} />
          </button>
        </div>

        {history.length > 0 && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-terminal-border/30">
            <span className="text-[10px] text-terminal-green/40">
              {filterFavorites
                ? `收藏 ${filteredWorks.length}/${favoriteCount}`
                : `显示 ${filteredWorks.length}/${history.length}`}
            </span>
            <button
              onClick={clearHistory}
              className="text-[10px] text-terminal-green/40 hover:text-red-400 transition-colors"
            >
              清空全部
            </button>
          </div>
        )}
      </div>

      <div className="max-h-80 overflow-y-auto">
        {history.length === 0 ? (
          <div className="p-8 text-center">
            <Clock size={32} className="mx-auto mb-3 text-terminal-green/20" />
            <p className="text-terminal-green/50 text-sm">作品库是空的</p>
            <p className="text-terminal-green/30 text-[11px] mt-1">
              生成字符画或编辑后会自动保存
            </p>
          </div>
        ) : filteredWorks.length === 0 ? (
          <div className="p-6 text-center">
            <Search size={24} className="mx-auto mb-2 text-terminal-green/20" />
            <p className="text-terminal-green/40 text-xs">没有匹配的作品</p>
          </div>
        ) : (
          <div className="divide-y divide-terminal-border/40">
            {filteredWorks.map((work) => (
              <div key={work.id} className="relative">
                <div
                  className={`
                    p-3 transition-colors
                    ${activeWorkId === work.id ? "bg-terminal-green/5" : "hover:bg-terminal-bgLight/20"}
                    ${compareMode === "selecting" ? "cursor-pointer" : ""}
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`
                        flex-shrink-0 w-16 h-12 bg-terminal-bgDark border rounded overflow-hidden relative
                        ${
                          activeWorkId === work.id
                            ? "border-terminal-green/60 shadow-glow"
                            : "border-terminal-border/50"
                        }
                      `}
                    >
                      <pre
                        className="text-[3px] leading-[4px] text-terminal-green/70 p-1 whitespace-pre font-mono"
                        style={{ fontSize: "3px", lineHeight: "3.5px" }}
                      >
                        {work.thumbnail}
                      </pre>
                      {work.versions.length > 1 && (
                        <div className="absolute top-0.5 right-0.5 bg-terminal-bg/80 px-1 rounded text-[8px] text-terminal-cyan/80 font-mono">
                          <Layers size={8} className="inline mr-0.5" />
                          {work.versions.length}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingId === work.id ? (
                        <div className="flex items-center gap-1 mb-1">
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveRename();
                              if (e.key === "Escape") cancelRename();
                            }}
                            autoFocus
                            className="flex-1 bg-terminal-bg border border-terminal-green/50 rounded px-1.5 py-0.5 text-xs text-terminal-green outline-none font-medium"
                          />
                          <button
                            onClick={saveRename}
                            className="p-1 text-terminal-green hover:bg-terminal-green/10 rounded"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={cancelRename}
                            className="p-1 text-terminal-green/50 hover:text-terminal-green rounded"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mb-1 min-w-0">
                          <button
                            onClick={() => toggleFavorite(work.id)}
                            className={`
                              flex-shrink-0 p-0.5 rounded transition-colors
                              ${
                                work.isFavorite
                                  ? "text-terminal-amber"
                                  : "text-terminal-green/20 hover:text-terminal-amber/60"
                              }
                            `}
                            title={work.isFavorite ? "取消收藏" : "收藏"}
                          >
                            <Star
                              size={12}
                              fill={work.isFavorite ? "currentColor" : "none"}
                            />
                          </button>
                          <span
                            className={`
                              text-xs font-medium truncate
                              ${
                                activeWorkId === work.id
                                  ? "text-terminal-green"
                                  : "text-terminal-green/80"
                              }
                            `}
                            title={work.name}
                          >
                            {work.name}
                          </span>
                          <button
                            onClick={() => startRename(work.id, work.name)}
                            className="flex-shrink-0 p-0.5 text-terminal-green/20 hover:text-terminal-green/60 rounded opacity-0 group-hover:opacity-100"
                            title="重命名"
                          >
                            <Pencil size={10} />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[10px] text-terminal-green/40">
                        <span>{work.params.width}宽</span>
                        <span>·</span>
                        <span>{work.params.charSetId}</span>
                        <span>·</span>
                        <span>{formatTime(work.timestamp)}</span>
                      </div>

                      <div className="flex items-center gap-1 mt-2">
                        <button
                          onClick={() => {
                            if (compareMode === "selecting") return;
                            loadFromHistory(work.id);
                            setExpandedWorkId(
                              expandedWorkId === work.id ? null : work.id
                            );
                          }}
                          className={`
                            flex items-center gap-1 px-2 py-1 rounded text-[10px] transition-colors
                            ${
                              activeWorkId === work.id
                                ? "bg-terminal-green/20 text-terminal-green"
                                : "text-terminal-green/70 hover:bg-terminal-green/10 hover:text-terminal-green"
                            }
                          `}
                        >
                          {activeWorkId === work.id
                            ? "编辑中"
                            : "恢复编辑"}
                        </button>
                        <button
                          onClick={() =>
                            setExpandedWorkId(
                              expandedWorkId === work.id ? null : work.id
                            )
                          }
                          className="p-1 text-terminal-green/50 hover:text-terminal-green rounded hover:bg-terminal-bgLight"
                          title={
                            work.versions.length > 1
                              ? "查看版本历史"
                              : "版本"
                          }
                        >
                          {expandedWorkId === work.id ? (
                            <ChevronDown size={14} />
                          ) : (
                            <ChevronRight size={14} />
                          )}
                        </button>
                        <div className="flex-1" />
                        <button
                          onClick={() => {
                            if (confirm(`确定删除 "${work.name}" 吗?`)) {
                              deleteFromHistory(work.id);
                            }
                          }}
                          className="p-1 text-terminal-green/30 hover:text-red-400 rounded hover:bg-red-500/10"
                          title="删除作品"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 版本列表 */}
                {expandedWorkId === work.id && work.versions.length > 0 && (
                  <div className="border-t border-terminal-border/30 bg-terminal-bgDark/50 px-3 py-2">
                    <div className="text-[10px] text-terminal-green/50 mb-2 flex items-center gap-1">
                      <Layers size={10} />
                      版本历史 ({work.versions.length})
                    </div>
                    <div className="space-y-1">
                      {work.versions.map((version, idx) => {
                        const isSelected = selectedVersionIds.includes(
                          version.id
                        );
                        return (
                          <div
                            key={version.id}
                            className={`
                              flex items-center gap-2 p-1.5 rounded text-[10px]
                              ${
                                compareMode === "selecting"
                                  ? "cursor-pointer hover:bg-terminal-cyan/10"
                                  : ""
                              }
                              ${
                                isSelected
                                  ? "bg-terminal-cyan/15 border border-terminal-cyan/40"
                                  : "hover:bg-terminal-bgLight/30"
                              }
                              ${
                                work.activeVersionId === version.id
                                  ? "bg-terminal-green/10"
                                  : ""
                              }
                            `}
                            onClick={() => {
                              if (compareMode === "selecting") {
                                toggleVersionSelection(work.id, version.id);
                              }
                            }}
                          >
                            {compareMode === "selecting" && (
                              <div
                                className={`
                                  w-3 h-3 rounded border flex items-center justify-center flex-shrink-0
                                  ${
                                    isSelected
                                      ? "bg-terminal-cyan border-terminal-cyan text-terminal-bgDark"
                                      : "border-terminal-green/40"
                                  }
                                `}
                              >
                                {isSelected && <Check size={8} />}
                              </div>
                            )}
                            <div
                              className={`
                                w-10 h-8 bg-terminal-bgDark border border-terminal-border/30 rounded overflow-hidden flex-shrink-0
                              `}
                            >
                              <pre
                                className="whitespace-pre font-mono"
                                style={{
                                  fontSize: "2.5px",
                                  lineHeight: "3px",
                                  padding: "2px",
                                }}
                              >
                                <span className="text-terminal-green/60">
                                  {version.thumbnail}
                                </span>
                              </pre>
                            </div>
                            <div className="flex-1 min-w-0">
                              {editingVersionId === version.id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="text"
                                    value={editingVersionName}
                                    onChange={(e) =>
                                      setEditingVersionName(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        saveRenameVersion(
                                          work.id,
                                          version.id
                                        );
                                      if (e.key === "Escape")
                                        setEditingVersionId(null);
                                    }}
                                    autoFocus
                                    className="flex-1 bg-terminal-bg border border-terminal-green/50 rounded px-1 py-0.5 text-[10px] text-terminal-green outline-none"
                                  />
                                  <button
                                    onClick={() =>
                                      saveRenameVersion(work.id, version.id)
                                    }
                                    className="text-terminal-green"
                                  >
                                    <Check size={10} />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <span className="text-terminal-green/80 font-medium truncate">
                                    {version.name}
                                  </span>
                                  {work.activeVersionId === version.id && (
                                    <span className="text-[8px] px-1 rounded bg-terminal-green/20 text-terminal-green">
                                      当前
                                    </span>
                                  )}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      startRenameVersion(
                                        version.id,
                                        version.name
                                      );
                                    }}
                                    className="p-0.5 text-terminal-green/20 hover:text-terminal-green/60"
                                  >
                                    <Pencil size={8} />
                                  </button>
                                </div>
                              )}
                              <div className="text-[9px] text-terminal-green/40 flex items-center gap-1">
                                <span>v{idx + 1}</span>
                                <span>·</span>
                                <span>{version.params.width}宽</span>
                                <span>·</span>
                                <span>{formatTime(version.timestamp)}</span>
                              </div>
                            </div>
                            {compareMode !== "selecting" && (
                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    loadVersion(work.id, version.id);
                                  }}
                                  className="p-1 text-terminal-green/50 hover:text-terminal-green rounded hover:bg-terminal-green/10"
                                  title="载入此版本"
                                >
                                  <Check size={10} />
                                </button>
                                {work.versions.length > 1 && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (
                                        confirm(
                                          `确定删除 "${version.name}" 吗?`
                                        )
                                      ) {
                                        deleteVersion(work.id, version.id);
                                      }
                                    }}
                                    className="p-1 text-terminal-green/30 hover:text-red-400 rounded hover:bg-red-500/10"
                                    title="删除版本"
                                  >
                                    <Trash2 size={10} />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {compareMode === "selecting" && (
        <div className="px-3 py-2 border-t border-terminal-border/50 bg-terminal-cyan/10">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-terminal-cyan">
              已选 {selectedVersionIds.length}/4 个版本对比
            </span>
            <div className="flex gap-1">
              <button
                onClick={clearVersionSelection}
                className="px-2 py-0.5 text-terminal-green/60 hover:text-terminal-green rounded"
              >
                清空
              </button>
              <button
                onClick={() => setCompareMode("off")}
                className="px-2 py-0.5 text-terminal-green/60 hover:text-terminal-green rounded"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkLibrary;
