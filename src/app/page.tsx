import { VideoProvider } from "../providers/VideoProvider";
import { VideoPlayer } from "./components/videoPlayer";

import HomeFeed from "./components/homeFeed";

export default function HomePage() {
    return (
        <VideoProvider>
            <VideoPlayer />
            <main className="h-full w-full p-2">
                <HomeFeed />
            </main>
        </VideoProvider>
    );
}
