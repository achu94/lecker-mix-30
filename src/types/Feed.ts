import type { Tags } from "./Tags";

export type FeedDataType = {
    id: string;
    name: string;
    description: string;
    created_at: string;
    repice_tags: {
        id: string;
        repice_id: string;
        tag_id: string;
        created_at: string;
        recipes: {
            id: string;
            title: string;
            video_url: string;
            recipe_link: string;
            created_at: string;
            recipe_thum_name: string;
        }
    }[];
};
