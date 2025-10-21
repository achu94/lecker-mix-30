// components/SortableVideoList.tsx
"use client";

import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

type Props = {
    videos: string[];
    onClick: (url: string) => void;
    onRemove: (url: string) => void;
    onReorder: (newOrder: string[]) => void;
};

export function SortableVideoList({ videos, onClick, onRemove, onReorder }: Props) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
                const { active, over } = event;
                if (active.id !== over?.id) {
                    const oldIndex = videos.findIndex((v) => v === active.id);
                    const newIndex = videos.findIndex((v) => v === over?.id);
                    onReorder(arrayMove(videos, oldIndex, newIndex));
                }
            }}
        >
            <SortableContext items={videos} strategy={verticalListSortingStrategy}>
                <div className="absolute top-4 left-4 bg-white/20 text-white p-2 rounded-xl backdrop-blur-md flex flex-col gap-2 max-h-[50vh] overflow-y-auto">
                    {videos.map((video) => (
                        <SortableVideoItem
                            key={video}
                            video={video}
                            onClick={onClick}
                            onRemove={onRemove}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function SortableVideoItem({
    video,
    onClick,
    onRemove,
}: {
    video: string;
    onClick: (url: string) => void;
    onRemove: (url: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: video,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="relative w-20 h-20 group cursor-move flex-shrink-0"
        >
            <video
                src={video}
                className="w-full h-full rounded-md border border-white/30 object-cover"
                onClick={() => onClick(video)}
                muted
            />
            <button
                onClick={() => onRemove(video)}
                className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-80 hover:opacity-100"
                title="Löschen"
            >
                <FontAwesomeIcon icon={faTimes} size="xs" />
            </button>
        </div>
    );
}
