"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export function useVideoRecord() {

    const [recoredVideoList, setRecoredVideoList] = useState<string[]>([]);
    const [customStatus, setCustomStatus] = useState<"idle" | "recording">("idle");
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user");

    const {
        startRecording,
        stopRecording,
        mediaBlobUrl,
        pauseRecording,
        resumeRecording,
    } = useReactMediaRecorder({
        video: { facingMode },
        askPermissionOnMount: true,
        onStart() {
            setCustomStatus("recording");
        },
        onStop(blobUrl) {
            setRecoredVideoList((prev) => [...prev, blobUrl]);
            setCustomStatus("idle");
        },
    });

    useEffect(() => {
        const initCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
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

    const switchCamera = useCallback(async () => {
        if (!cameraStream) return;

        try {
            // Stop old tracks
            cameraStream.getTracks().forEach((track) => track.stop());

            // Toggle facingMode
            const newMode = facingMode === "user" ? "environment" : "user";
            setFacingMode(newMode);

            // Request new stream
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: newMode },
            });
            setCameraStream(newStream);
        } catch (err) {
            console.error("Camera switch failed:", err);
        }
    }, [cameraStream, facingMode]);


    return {
        startRecording,
        stopRecording,
        cameraStream,
        VideoPreview,
        recoredVideoList,
        customStatus,
        mediaBlobUrl,
        pauseRecording,
        resumeRecording,
        switchCamera
    }
}

const VideoPreview = ({ stream }: { stream: MediaStream | null }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    if (!stream)
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <p>Kamera wird geladen...</p>
            </div>
        );

    return (
        <div className="flex justify-center items-center w-full h-[90vh] bg-black">
            <div className="relative w-[90vw] max-w-[420px] aspect-[9/16] overflow-hidden rounded-2xl shadow-2xl border border-gray-800">
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                />

                {/* 🔹 Optional: Overlay für Status / Text */}
                <div className="absolute bottom-4 right-4 text-white text-sm opacity-80">
                    Live Kamera
                </div>
            </div>
        </div>
    );
};
