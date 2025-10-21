"use client";

import { useVideoRecord } from "@/hooks/useVideoRecord";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlay,
    faStop,
    faRepeat,
    faArrowLeft,
    faTimes,
    faCheck,
    faPhotoFilm,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

export default function AddShort() {
    const {
        startRecording,
        stopRecording,
        cameraStream,
        VideoPreview,
        customStatus,
        recoredVideoList,
        setRecoredVideoList,
        switchCamera,
    } = useVideoRecord();

    const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const isDragging = dragIndex !== null;

    const isLive = previewVideoUrl === null;

    const moveVideo = (from: number, to: number) => {
        setRecoredVideoList((prev) => {
            const updated = [...prev];
            const [moved] = updated.splice(from, 1);
            updated.splice(to, 0, moved);
            return updated;
        });
    };

    const recordHandler = () => {
        if (customStatus === "recording") {
            stopRecording();
        } else {
            startRecording();
            setPreviewVideoUrl(null);
        }
    };

    const removeVideo = (url: string) => {
        setRecoredVideoList((prev) => prev.filter((v) => v !== url));
        if (previewVideoUrl === url) {
            setPreviewVideoUrl(null);
        }
    };

    const uploadVideo = () => {
        // Verstecktes File-Input
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "video/*";

        input.onchange = () => {
            if (!input.files || input.files.length === 0) return;
            const file = input.files[0];

            // Erstelle temporäre URL für Video-Preview & Liste
            const videoUrl = URL.createObjectURL(file);

            // Video zur Liste hinzufügen
            setRecoredVideoList((prev) => [...prev, videoUrl]);
        };

        input.click();
    };

    const finishRecording = () => {};

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            <div className="relative w-[90vw] max-w-[420px] aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl border border-gray-800 bg-black">
                {/* 🎥 Main video area */}
                {isLive ? (
                    <VideoPreview stream={cameraStream} />
                ) : (
                    <video
                        src={previewVideoUrl}
                        className="w-full h-full object-cover"
                        controls
                        autoPlay
                    />
                )}

                {/* 📹 Recorded videos (top-left) */}
                <div
                    className={`absolute top-4 left-4 p-2 rounded-xl backdrop-blur-md flex gap-2 overflow-x-auto max-w-[90%] transition-all duration-300
                    ${
                        isDragging
                            ? "bg-white/30 h-20 shadow-xl"
                            : "bg-white/20 h-16"
                    }`}
                >
                    {recoredVideoList.map((video, idx) => (
                        <div
                            key={idx}
                            className={`relative group flex-shrink-0 transition-all duration-200 rounded-md
                            ${
                                isDragging
                                    ? "w-16 h-16 scale-105 shadow-md"
                                    : "w-12 h-12"
                            }`}
                            draggable
                            onDragStart={() => setDragIndex(idx)}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => {
                                if (dragIndex !== null && dragIndex !== idx) {
                                    moveVideo(dragIndex, idx);
                                    setDragIndex(null);
                                }
                            }}
                            onDragEnd={() => setDragIndex(null)}
                        >
                            <video
                                src={video}
                                className="w-full h-full rounded-md border border-white/30 object-cover cursor-pointer"
                                onClick={() => setPreviewVideoUrl(video)}
                                muted
                            />
                            <button
                                onClick={() => removeVideo(video)}
                                className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-80 hover:opacity-100"
                                title="Löschen"
                            >
                                <FontAwesomeIcon icon={faTimes} size="xs" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* 🔄 Switch camera (only in live mode) */}
                {isLive && (
                    <button
                        onClick={switchCamera}
                        className="absolute top-6 right-4 bg-white/20 text-white p-3 rounded-full backdrop-blur-md"
                        title="Kamera wechseln"
                    >
                        <FontAwesomeIcon size="lg" icon={faRepeat} />
                    </button>
                )}

                {/* 🔙 Back to live camera (if in preview mode) */}
                {!isLive && (
                    <button
                        onClick={() => setPreviewVideoUrl(null)}
                        className="absolute top-4 right-4 bg-white/20 text-white p-3 rounded-full backdrop-blur-md"
                        title="Zurück zur Kamera"
                    >
                        <FontAwesomeIcon size="lg" icon={faArrowLeft} />
                    </button>
                )}

                {/* ⏺️ Record / Stop (only in live mode) */}
                {isLive && (
                    <>
                        <button
                            onClick={recordHandler}
                            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-red-500 border-2 border-red-500 rounded-full p-4 bg-white/10 backdrop-blur-md"
                        >
                            {customStatus === "idle" ? (
                                <FontAwesomeIcon size="2x" icon={faPlay} />
                            ) : (
                                <FontAwesomeIcon
                                    className="animate-pulse"
                                    size="2x"
                                    icon={faStop}
                                />
                            )}
                        </button>

                        <button
                            onClick={uploadVideo}
                            className="absolute bottom-7 right-6/8 bg-white/20 text-white p-3 rounded-full backdrop-blur-md"
                        >
                            <FontAwesomeIcon size="2x" icon={faPhotoFilm} />
                        </button>

                        {recoredVideoList.length && (
                            <button
                                onClick={finishRecording}
                                className="absolute bottom-7 left-6/8 bg-white/20 text-white p-3 rounded-full backdrop-blur-md"
                            >
                                <FontAwesomeIcon size="2x" icon={faCheck} />
                            </button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
