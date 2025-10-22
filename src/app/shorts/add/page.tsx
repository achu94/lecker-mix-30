"use client"

import dynamic from "next/dynamic";

const AddShort = dynamic(() => import("./addShort"), { ssr: false });

export default function Page() {
    return <AddShort />;
}
