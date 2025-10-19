import React, { useRef, useEffect } from "react";
import { useVideo } from "@/app/providers/VideoProvider";

export function VideoPlayer() {
  const { currentVideo, stopVideo } = useVideo();
  const videoRef = useRef<HTMLVideoElement>(null);

  // 🟢 ESC-Taste auf Desktop → schließen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") stopVideo();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [stopVideo]);

  // 🟢 Browser-Zurück-Button auf Mobile → schließen
  useEffect(() => {
    if (currentVideo) {
      // "Virtuellen" State hinzufügen, damit Zurück-Taste funktioniert
      window.history.pushState({ videoOpen: true }, "");

      const handlePopState = () => {
        stopVideo();
      };
      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        // Beim Schließen: Wenn Video-Overlay offen war, wieder einen Schritt vorwärts,
        // damit man nicht die Seite verlässt, wenn man danach zurück drückt
        if (window.history.state?.videoOpen) {
          window.history.go(1);
        }
      };
    }
  }, [currentVideo, stopVideo]);

  // 🟢 Video automatisch starten
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (currentVideo) {
        video.load();
        video.play().catch(() => { });
      } else {
        video.pause();
      }
    }
  }, [currentVideo]);

  if (!currentVideo) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={stopVideo}
    >
      <div
        className="relative w-full h-full flex items-center justify-center sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={videoRef}
          src={currentVideo}
          controls
          autoPlay
          playsInline
          className="w-full h-full max-w-[420px] sm:rounded-xl object-contain"
        />
      </div>
    </div>
  );
}
