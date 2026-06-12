import { useState, useRef, useCallback } from "react";
import { Upload, Camera, Image as ImageIcon, X } from "lucide-react";
import { useAsciiStore } from "@/store/useAsciiStore";
import { loadImage } from "@/utils/pixelUtils";
import CameraCapture from "./CameraCapture";

const ImageUploader = () => {
  const { imageState, setImage, clearImage } = useAsciiStore();
  const [isDragging, setIsDragging] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        alert("请上传图片文件");
        return;
      }
      try {
        const img = await loadImage(file);
        setImage(img);
      } catch (e) {
        console.error("Failed to load image:", e);
        alert("图片加载失败");
      }
    },
    [setImage]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (showCamera) {
    return (
      <div className="bg-terminal-bgDark/50 border border-terminal-border rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-terminal-green font-semibold flex items-center gap-2">
            <Camera size={18} />
            摄像头拍照
          </h3>
          <button
            onClick={() => setShowCamera(false)}
            className="text-terminal-green/60 hover:text-terminal-green transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>
        <CameraCapture
          onCapture={(img) => {
            setImage(img);
            setShowCamera(false);
          }}
          onClose={() => setShowCamera(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 md:p-8 text-center
          transition-all duration-300 cursor-pointer
          ${
            isDragging
              ? "border-terminal-green bg-terminal-green/10 shadow-glow"
              : "border-terminal-border hover:border-terminal-green/50 hover:bg-terminal-bgLight/30"
          }
          ${imageState.source ? "hidden" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-terminal-bgLight flex items-center justify-center">
            <Upload
              size={28}
              className={`text-terminal-green transition-transform duration-300 ${
                isDragging ? "scale-125" : ""
              }`}
            />
          </div>
          <div>
            <p className="text-terminal-green font-semibold mb-1">
              拖拽图片到这里
            </p>
            <p className="text-terminal-green/50 text-sm">
              或点击选择文件 · 支持 JPG / PNG / GIF
            </p>
          </div>
        </div>
      </div>

      {!imageState.source && (
        <button
          onClick={() => setShowCamera(true)}
          className="w-full py-3 px-4 border border-terminal-border rounded-lg
            text-terminal-green/80 hover:text-terminal-green hover:border-terminal-green/50
            hover:bg-terminal-bgLight/30 transition-all duration-300
            flex items-center justify-center gap-2 btn-glow"
        >
          <Camera size={18} />
          使用摄像头拍照
        </button>
      )}

      {imageState.source && (
        <div className="bg-terminal-bgDark/50 border border-terminal-border rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-terminal-green font-semibold flex items-center gap-2">
              <ImageIcon size={18} />
              原图
            </h3>
            <button
              onClick={clearImage}
              className="text-terminal-green/60 hover:text-terminal-red transition-colors p-1 hover:text-red-400"
              title="移除图片"
            >
              <X size={18} />
            </button>
          </div>
          <div className="relative rounded-lg overflow-hidden bg-terminal-bgDark">
            <img
              src={imageState.source.src}
              alt="Original"
              className="w-full h-auto max-h-48 object-contain"
            />
          </div>
          <div className="mt-2 text-xs text-terminal-green/50 text-center">
            {imageState.originalWidth} × {imageState.originalHeight} px
          </div>
          <button
            onClick={handleClick}
            className="w-full mt-3 py-2 px-4 border border-terminal-border rounded-lg
              text-terminal-green/70 hover:text-terminal-green hover:border-terminal-green/50
              hover:bg-terminal-bgLight/30 transition-all duration-300
              flex items-center justify-center gap-2 text-sm"
          >
            <Upload size={16} />
            更换图片
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
