import { useAsciiStore } from "@/store/useAsciiStore";
import { Undo2, Redo2, Layers } from "lucide-react";
import { useEffect } from "react";

const UndoRedoBar = () => {
  const { undo, redo, canUndo, canRedo, historyState } = useAsciiStore();

  const undoCount = historyState.past.length;
  const redoCount = historyState.future.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;
      if (e.target && (e.target as HTMLElement).tagName === "TEXTAREA") return;

      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      if (!isCtrlOrCmd) return;

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.key === "z" && e.shiftKey) || e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 bg-terminal-bgDark/80 rounded-lg border border-terminal-border">
      <div className="flex items-center gap-1 px-2 text-[10px] text-terminal-green/50 mr-1">
        <Layers size={12} />
        <span className="font-mono">{undoCount}/{50}</span>
      </div>
      <button
        onClick={undo}
        disabled={!canUndo()}
        title={`撤销 (Ctrl+Z) · 剩余${undoCount}步`}
        className={`
          p-1.5 rounded-md transition-all
          ${
            canUndo()
              ? "text-terminal-green/80 hover:text-terminal-green hover:bg-terminal-green/10"
              : "text-terminal-green/20 cursor-not-allowed"
          }
        `}
      >
        <Undo2 size={16} />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo()}
        title={`重做 (Ctrl+Shift+Z) · ${redoCount}步可重做`}
        className={`
          p-1.5 rounded-md transition-all
          ${
            canRedo()
              ? "text-terminal-green/80 hover:text-terminal-green hover:bg-terminal-green/10"
              : "text-terminal-green/20 cursor-not-allowed"
          }
        `}
      >
        <Redo2 size={16} />
      </button>
    </div>
  );
};

export default UndoRedoBar;
