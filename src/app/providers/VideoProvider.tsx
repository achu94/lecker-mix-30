import React, { createContext, useState, useContext, ReactNode } from "react";

interface VideoContextType {
    currentVideo: string | null;
    playVideo: (src: string) => void;
    stopVideo: () => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

type VideoProviderProps = {
    children: ReactNode;
};

export function VideoProvider({ children }: VideoProviderProps) {
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);

    const playVideo = (src: string) => {
        setCurrentVideo(src);
    };

    const stopVideo = () => {
        setCurrentVideo(null);
    };

    return (
        <VideoContext.Provider value={{ currentVideo, playVideo, stopVideo }}>
            {children}
        </VideoContext.Provider>
    );
}

export const useVideo = (): VideoContextType => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error("useVideo must be used within a VideoProvider");
    }
    return context;
};
