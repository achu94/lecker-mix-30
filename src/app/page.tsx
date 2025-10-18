"use client";

import { useEffect, useState, useCallback } from "react";
import { VideoPlayer } from "./components/VideoPlayer";

interface Recipe {
  id: string;
  title: string;
  video_url: string;
  recipe_link: string;
  tags: string[];
  created_at: string;
}

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("/api/recipes");
      if (!response.ok) throw new Error("Fehler beim Laden der Rezepte");
      const recipes = await response.json();
      setRecipes(recipes);
    };

    fetchRecipes();
  }, []);

  // Nächstes/prev Video
  const nextVideo = useCallback(() => {
    setCurrentIndex((i) => (recipes.length > 0 ? (i + 1) % recipes.length : 0));
  }, [recipes.length]);

  const prevVideo = useCallback(() => {
    setCurrentIndex((i) =>
      recipes.length > 0 ? (i - 1 + recipes.length) % recipes.length : 0
    );
  }, [recipes.length]);

  // Scroll- und Tasten-Events
  useEffect(() => {
    const onScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) nextVideo();
      else if (e.deltaY < 0) prevVideo();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") nextVideo();
      else if (e.key === "ArrowUp") prevVideo();
    };
    window.addEventListener("wheel", onScroll, { passive: false });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, [nextVideo, prevVideo]);

  const recipe = recipes[currentIndex];

  return (
    <main className="flex h-full justify-center items-center min-h-screen">
      {recipe && (
        <div key={recipe.id}>
          <div className="w-[360px] h-[640px] bg-black rounded-lg overflow-hidden flex flex-col justify-center">
            <VideoPlayer
              link={recipe.video_url}
              onEnded={nextVideo} // Callback bei Ende
            />
          </div>
          <div className="mt-4 text-center">
            <h2 className="font-bold">{recipe.title}</h2>
            <a
              href={recipe.recipe_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Rezept ansehen
            </a>
            <p>Tags: {recipe.tags?.join(", ")}</p>
            <p className="mt-2 text-sm opacity-60">
              Scrollen oder Pfeiltasten für nächstes/letztes Video
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
