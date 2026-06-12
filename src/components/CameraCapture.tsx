import { useRef, useEffect, useState } from "react";
import { Camera as CameraIcon, X, Circle } from "lucide-react";
import type { CameraStatus } from "@/types";

interface CameraCaptureProps {
  onCapture: (img: HTMLImageElement) => void;
  onClose: () => void;
}

const CameraCapture = ({ onCapture, onClose }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [status, setStatus] = useState<CameraStatus>("requesting");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setStatus("requesting");
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus("active");
      }
    } catch (e) {
      console.error("Camera error:", e);
      setError("无法访问摄像头，请检查权限设置");
      setStatus("error");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || status !== "active") return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);

    const img = new Image();
    img.onload = () => {
      onCapture(img);
      stopCamera();
    };
    img.src = canvas.toDataURL("image/png");
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-terminal-bgDark rounded-lg overflow-hidden">
        {status === "requesting" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-terminal-green/60">
            <CameraIcon size={32} className="animate-pulse mb-2" />
            <p className="text-sm">正在启动摄像头...</p>
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-red-400/80 p-4 text-center">
            <X size={32} className="mb-2" />
            <p className="text-sm mb-3">{error}</p>
            <button
              onClick={startCamera}
              className="px-4 py-2 border border-terminal-border rounded text-terminal-green/80 hover:text-terminal-green text-sm"
            >
              重试
            </button>
          </div>
        )}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${status === "active" ? "" : "hidden"}`}
          playsInline
          muted
        />
        {status === "active" && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 px-2 py-1 rounded text-xs text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="px-6 py-2 border border-terminal-border rounded-lg
            text-terminal-green/70 hover:text-terminal-green hover:border-terminal-green/50
            transition-all duration-300 text-sm"
        >
          取消
        </button>
        <button
          onClick={handleCapture}
          disabled={status !== "active"}
          className={`
            px-8 py-2 rounded-lg font-semibold transition-all duration-300
            flex items-center gap-2
            ${
              status === "active"
                ? "bg-terminal-green text-terminal-bg hover:shadow-glow active:scale-95"
                : "bg-terminal-border/50 text-terminal-green/30 cursor-not-allowed"
            }
          `}
        >
          <Circle size={18} fill="currentColor" />
          拍照
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
