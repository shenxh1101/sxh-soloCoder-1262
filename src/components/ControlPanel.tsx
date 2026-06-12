import { useAsciiStore } from "@/store/useAsciiStore";
import { charSets } from "@/utils/charSets";
import { Settings2, Contrast, Maximize, FlipHorizontal } from "lucide-react";

const ControlPanel = () => {
  const { params, setParams, imageState } = useAsciiStore();

  const isDisabled = !imageState.source;

  return (
    <div className="bg-terminal-bgDark/50 border border-terminal-border rounded-xl p-5 backdrop-blur-sm">
      <h3 className="text-terminal-green font-semibold flex items-center gap-2 mb-5">
        <Settings2 size={18} />
        参数调节
      </h3>

      <div className="space-y-6">
        {/* 字符集选择 */}
        <div>
          <label className="block text-terminal-green/80 text-sm mb-3 font-medium">
            字符集
          </label>
          <div className="grid grid-cols-2 gap-2">
            {charSets.map((cs) => (
              <button
                key={cs.id}
                onClick={() => setParams({ charSetId: cs.id })}
                disabled={isDisabled}
                className={`
                  p-3 rounded-lg border text-left transition-all duration-200
                  ${
                    params.charSetId === cs.id
                      ? "border-terminal-green bg-terminal-green/10 text-terminal-green shadow-glow"
                      : "border-terminal-border text-terminal-green/70 hover:border-terminal-green/50 hover:text-terminal-green"
                  }
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div className="font-semibold text-sm">{cs.name}</div>
                <div className="text-[10px] mt-1 opacity-70 font-mono truncate">
                  {cs.chars.slice(0, 10)}...
                </div>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-terminal-green/40 mt-2">
            {charSets.find((cs) => cs.id === params.charSetId)?.description}
          </p>
        </div>

        {/* 宽度调节 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-terminal-green/80 text-sm font-medium flex items-center gap-2">
              <Maximize size={14} />
              字符宽度
            </label>
            <span className="text-terminal-green font-mono text-sm bg-terminal-bgLight px-2 py-0.5 rounded">
              {params.width}
            </span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            value={params.width}
            onChange={(e) => setParams({ width: Number(e.target.value) })}
            disabled={isDisabled}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-terminal-green/40 mt-1">
            <span>20</span>
            <span>200</span>
          </div>
        </div>

        {/* 对比度调节 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-terminal-green/80 text-sm font-medium flex items-center gap-2">
              <Contrast size={14} />
              对比度
            </label>
            <span className="text-terminal-green font-mono text-sm bg-terminal-bgLight px-2 py-0.5 rounded">
              {params.contrast}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="200"
            value={params.contrast}
            onChange={(e) => setParams({ contrast: Number(e.target.value) })}
            disabled={isDisabled}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-terminal-green/40 mt-1">
            <span>0%</span>
            <span>100%</span>
            <span>200%</span>
          </div>
        </div>

        {/* 反色开关 */}
        <div>
          <button
            onClick={() => setParams({ invert: !params.invert })}
            disabled={isDisabled}
            className={`
              w-full flex items-center justify-between p-3 rounded-lg border
              transition-all duration-200
              ${
                params.invert
                  ? "border-terminal-amber bg-terminal-amber/10 text-terminal-amber"
                  : "border-terminal-border text-terminal-green/70 hover:border-terminal-green/50"
              }
              ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <span className="flex items-center gap-2 text-sm font-medium">
              <FlipHorizontal size={14} />
              反色模式
            </span>
            <div
              className={`
                w-10 h-5 rounded-full relative transition-colors duration-200
                ${params.invert ? "bg-terminal-amber" : "bg-terminal-border"}
              `}
            >
              <div
                className={`
                  absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200
                  ${params.invert ? "translate-x-5" : "translate-x-0.5"}
                `}
              />
            </div>
          </button>
        </div>
      </div>

      {isDisabled && (
        <p className="text-[11px] text-terminal-green/40 text-center mt-4 pt-4 border-t border-terminal-border">
          上传图片后即可调节参数
        </p>
      )}
    </div>
  );
};

export default ControlPanel;
