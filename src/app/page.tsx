"use client";

import { useEffect, useState, useCallback } from "react";
import { VideoProvider } from "./providers/VideoProvider";
import { VideoPlayer } from "./components/videoPlayer";

import HomeFeed from "./components/homeFeed";

interface Recipe {
  id: string;
  title: string;
  video_url: string;
  recipe_link: string;
  tags: string[];
  created_at: string;
}

export default function HomePage() {
  // const [recipes, setRecipes] = useState<Recipe[]>([]);

  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     const response = await fetch("/api/recipes");
  //     if (!response.ok) throw new Error("Fehler beim Laden der Rezepte");
  //     const recipes = await response.json();
  //     setRecipes(recipes);
  //   };

  //   fetchRecipes();
  // }, []);

  return (
    <VideoProvider>
      <VideoPlayer />
      <main className="h-full w-full p-2">
        <HomeFeed />
      </main>
    </VideoProvider>
  );
}
