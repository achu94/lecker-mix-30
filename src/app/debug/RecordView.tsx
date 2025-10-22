"use client";

import { useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export const RecordView = () => {
    const [videos, setVideos] = useState<string[]>([]);
    const [customStatus, setCustomStatus] = useState<"idle" | "recording">(
        "idle"
    );
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

    const { startRecording, stopRecording, mediaBlobUrl } =
        useReactMediaRecorder({
            video: true,
            askPermissionOnMount: true,
            onStart() {
                setCustomStatus("recording");
            },
            onStop(blobUrl) {
                setVideos((prev) => [...prev, blobUrl]);
                setCustomStatus("idle");
            },
        });

    // Kamera dauerhaft aktiv halten (unabhängig von Aufnahme)
    useEffect(() => {
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                setCameraStream(stream);
            } catch (err) {
                console.error("Kamera Zugriff fehlgeschlagen:", err);
            }
        };
        initCamera();

        return () => {
            cameraStream?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={startRecording}
                    disabled={customStatus === "recording"}
                    className={`px-4 py-2 rounded-lg text-white ${customStatus === "recording"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500"
                        }`}
                >
                    🎥 Start Recording
                </button>
                <button
                    onClick={stopRecording}
                    disabled={customStatus === "idle"}
                    className={`px-4 py-2 rounded-lg text-white ${customStatus === "idle"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500"
                        }`}
                >
                    ⏹ Stop Recording
                </button>
                <p className="ml-4 text-gray-700">
                    Status:{" "}
                    {customStatus === "recording" ? "Recording..." : "Idle"}
                </p>
            </div>

            {/* Live Kamera Vorschau (immer an) */}
            <VideoPreview stream={cameraStream} />

            {/* Alle aufgenommenen Videos */}
            {videos.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-2">Aufgenommene Videos:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {videos.map((url, index) => (
                            <video
                                key={index}
                                src={url}
                                controls
                                className="w-full rounded-lg shadow-md"
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream) return <p>Kamera wird geladen...</p>;

    return (
        <div>
            <h3 className="font-semibold mb-1">Live Kamera:</h3>
            <video
                ref={videoRef}
                width={400}
                height={300}
                autoPlay
                muted
                className="rounded-lg shadow-md"
            />
        </div>
    );
};
