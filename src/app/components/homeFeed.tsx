"use client"

import { useEffect, useState } from "react"
import Image from "next/image";

import { FeedDataType } from "@/types/Feed";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons/faEllipsisV";

import { useVideo } from "../providers/VideoProvider";

export default function HomeFeed() {

    const [feeds, setFeeds] = useState<FeedDataType[]>([]);
    const { playVideo } = useVideo();

    useEffect(() => {
        const fetchFeed = async () => {
            const response = await fetch("/api/feed");
            if (!response.ok) throw new Error("Fehler beim Laden der Rezepte");
            const feeds = await response.json();
            console.log(feeds)
            setFeeds(feeds);
        };
        fetchFeed();
    }, []);

    return (
        <div className="flex flex-col gap-12 items-start">
            {feeds.length > 0 ? (
                feeds.map(feed => (
                    <div key={feed.id} className="flex flex-col w-full">
                        <div className="flex justify-between p-2">
                            <h1 className="text-md">{feed.name}</h1>
                            <button><FontAwesomeIcon icon={faEllipsisV} /></button>
                        </div>
                        <div className="carousel rounded-box">
                            {feed.repice_tags.map(tag => (
                                <div className="carousel-item" key={tag.recipes.id}>
                                    <Image
                                        alt={tag.recipes.title}
                                        src={"/thumbnails/" + tag.recipes.recipe_thum_name}
                                        width={200}  // <--- Beispielgröße, passe an dein Layout an
                                        height={150} // <--- Beispielgröße, passe an dein Layout an
                                        onClick={() => playVideo("/videos/"+tag.recipes.video_url)} // Video abspielen beim Klick
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p>Keine Daten</p>
            )}
        </div>
    );
}