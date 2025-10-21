"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

export function useVideoRecord() {
    const [recoredVideoList, setRecoredVideoList] = useState<string[]>([]);
    const [customStatus, setCustomStatus] = useState<"idle" | "recording">(
        "idle"
    );
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [facingMode, setFacingMode] = useState<"user" | "environment">(
        "user"
    );

    const {
        startRecording,
        stopRecording,
        mediaBlobUrl,
        pauseRecording,
        resumeRecording,
    } = useReactMediaRecorder({
        // video: { facingMode },
        video: true,
        customMediaStream: cameraStream ?? undefined,
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

    const switchCamera = useCallback(async () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
        }

        const newMode = facingMode === "user" ? "environment" : "user";
        setFacingMode(newMode);

        try {
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
        switchCamera,
        setRecoredVideoList
    };
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
        <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
        />
    );
};
