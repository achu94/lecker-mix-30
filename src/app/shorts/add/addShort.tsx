"use client";

import RecordVideo from "@/app/components/recordVideo";
import Loading from "@/app/loading";
import { Suspense } from "react";

export default function AddShort() {
    return (
        <Suspense fallback={<Loading />}>
            <RecordVideo />
        </Suspense>
    );
}
