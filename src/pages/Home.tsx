import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import AsciiPreview from "@/components/AsciiPreview";
import ControlPanel from "@/components/ControlPanel";
import Editor from "@/components/Editor";
import ActionBar from "@/components/ActionBar";
import WorkLibrary from "@/components/WorkLibrary";
import ExportPanel from "@/components/ExportPanel";
import UndoRedoBar from "@/components/UndoRedoBar";
import ComparePanel from "@/components/ComparePanel";
import { useAsciiStore } from "@/store/useAsciiStore";

const Home = () => {
  const { compareMode, selectedVersionIds } = useAsciiStore();
  const showCompare = compareMode !== "off" && selectedVersionIds.length >= 2;

  return (
    <div className="min-h-screen bg-terminal-bg text-terminal-green relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-terminal-green/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-terminal-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pb-12">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左栏 */}
          <div className="lg:col-span-3 space-y-6">
            <div
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: "0.1s" }}
            >
              <ImageUploader />
            </div>
            <div
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: "0.15s" }}
            >
              <WorkLibrary />
            </div>
          </div>

          {/* 中栏 */}
          <div className="lg:col-span-6 space-y-6">
            {showCompare && (
              <div
                className="opacity-0 animate-fadeInUp"
                style={{ animationDelay: "0.18s" }}
              >
                <ComparePanel />
              </div>
            )}
            <div className="flex items-center justify-between">
              <div
                className="opacity-0 animate-fadeInUp"
                style={{ animationDelay: "0.19s" }}
              >
                <UndoRedoBar />
              </div>
            </div>
            <div
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: "0.2s" }}
            >
              <AsciiPreview />
            </div>
            <div
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: "0.3s" }}
            >
              <ActionBar />
            </div>
            <div
              className="opacity-0 animate-fadeInUp"
              style={{ animationDelay: "0.35s" }}
            >
              <Editor />
            </div>
          </div>

          {/* 右栏 */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-6 space-y-6">
              <div
                className="opacity-0 animate-fadeInUp"
                style={{ animationDelay: "0.25s" }}
              >
                <ControlPanel />
              </div>
              <div
                className="opacity-0 animate-fadeInUp"
                style={{ animationDelay: "0.3s" }}
              >
                <ExportPanel />
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-terminal-border/30 text-center">
          <p className="text-terminal-green/40 text-xs">
            ASCII Art Generator · 纯前端运行 · 所有处理均在本地完成 ·
            作品库自动保存 · 支持撤销重做 · 版本对比
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
