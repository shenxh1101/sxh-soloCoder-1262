import { useState } from "react";
import { useAsciiStore } from "@/store/useAsciiStore";
import { Edit3, Check, X } from "lucide-react";

const Editor = () => {
  const { asciiArt, setAsciiArt, imageState } = useAsciiStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState("");

  const handleStartEdit = () => {
    setEditText(asciiArt);
    setIsEditing(true);
  };

  const handleSave = () => {
    setAsciiArt(editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!imageState.source) {
    return null;
  }

  return (
    <div className="bg-terminal-bgDark/50 border border-terminal-border rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-terminal-border bg-terminal-bg/50">
        <div className="flex items-center gap-2">
          <Edit3 size={16} className="text-terminal-amber" />
          <span className="text-terminal-green/80 font-medium text-sm">
            字符画编辑
          </span>
        </div>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="p-1.5 rounded bg-terminal-green/20 text-terminal-green hover:bg-terminal-green/30 transition-colors"
              title="保存"
            >
              <Check size={14} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1.5 rounded bg-terminal-border/50 text-terminal-green/60 hover:bg-terminal-border transition-colors"
              title="取消"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartEdit}
            className="text-xs text-terminal-amber hover:text-terminal-amber/80 transition-colors flex items-center gap-1"
          >
            <Edit3 size={12} />
            手动编辑
          </button>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="w-full h-48 p-4 bg-terminal-bg text-terminal-green font-mono text-xs leading-tight
            border-none outline-none resize-none placeholder-terminal-green/30
            focus:ring-1 focus:ring-terminal-amber/50"
          spellCheck={false}
          style={{ fontFamily: '"JetBrains Mono", "Fira Code", monospace' }}
        />
      ) : (
        <div className="p-4">
          <p className="text-[11px] text-terminal-green/50 text-center">
            点击「手动编辑」可以直接修改生成的字符画
          </p>
        </div>
      )}
    </div>
  );
};

export default Editor;
