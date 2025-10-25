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
        error,
    } = useReactMediaRecorder({
        video: { facingMode: facingMode},
        customMediaStream: cameraStream,
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
                    video: { facingMode },
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
    }, [facingMode, setFacingMode, setCameraStream, customStatus]);

    const switchCamera = useCallback(async () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach((track) => track.stop());
        }

        const newMode = facingMode === "user" ? "environment" : "user";
        setFacingMode(newMode);

        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode}
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
        setRecoredVideoList,
        error,
    };
}

const VideoPreview = ({
    stream,
    error,
}: {
    stream: MediaStream | null;
    error: string;
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream, error]);

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-full text-white text-center space-y-2 px-4">
                <p className="text-lg font-semibold">
                    Zugriff auf Kamera fehlgeschlagen
                </p>
                <p className="text-sm">
                    Bitte wählen Sie ein Video über den Button{" "}
                    <strong>„Media Auswahl“</strong> aus.
                </p>
            </div>
        );
    }

    if (!stream) {
        return (
            <div className="flex flex-col justify-center items-center h-full text-white">
                <span className="w-24 loading loading-ring"></span>
            </div>
        );
    }

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
