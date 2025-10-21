"use client"

import { useVideoRecord } from "@/hooks/useVideoRecord"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { faRepeat } from "@fortawesome/free-solid-svg-icons";

export default function AddShort() {
    const {
        startRecording,
        stopRecording,
        cameraStream,
        VideoPreview,
        customStatus,
        mediaBlobUrl,
        recoredVideoList,
        pauseRecording,
        resumeRecording,
        switchCamera
    } = useVideoRecord();

    const startStopRecordHandle = () => {
        if (customStatus === "recording") {
            stopRecording();
            return;
        }

        startRecording();
    }

    return (
        <div className="bg-black h-full w-full fixed inset-0 z-1000 flex flex-col">
            <VideoPreview stream={cameraStream} />
            <div className="absolute p-8 inset-0 flex flex-col items-end justify-start w-full h-full">
                <button onClick={switchCamera} className="btn-ghost text-primary">
                    <FontAwesomeIcon size="2x" icon={faRepeat} />
                </button>
            </div>
            <div className="absolute p-8 inset-0 flex flex-col items-center justify-end w-full h-full">
                <button onClick={startStopRecordHandle} className="btn-ghost text-primary">
                    {customStatus === "idle"
                        ? <FontAwesomeIcon size="2x" icon={faPlay} />
                        : <FontAwesomeIcon size="2x" icon={faStop} />
                    }
                </button>
            </div>
           
        </div>
    );

}