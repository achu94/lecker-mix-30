import { NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

import { createVideoId, uploadVideo } from "@/lib/uploadVideo";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const title = formData.get("title")?.toString() || "test";
        const videoFile = formData.get("video");

        if (!videoFile || !(videoFile instanceof File)) {
            return NextResponse.json({ error: "Keine Videodatei gefunden" }, { status: 400 });
        }

        // Speicherpfad festlegen
        const uploadDir = path.join(process.cwd(), "uploads");
        await fs.mkdir(uploadDir, { recursive: true });

        const arrayBuffer = await videoFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Dateiname generieren (kannst du anpassen)
        const filename = `${Date.now()}-${videoFile.name}`;
        const filePath = path.join(uploadDir, filename);

        // Datei speichern
        await fs.writeFile(filePath, buffer);

        // Video-ID erstellen
        const { guid, error: createIdError } = await createVideoId({ title });
        if (createIdError) {
            return NextResponse.json({ error: "Fehler beim Erstellen der Video-ID" }, { status: 500 });
        }

        // Upload-Funktion aufrufen
        const { success, error: uploadError } = await uploadVideo({ videoPath: filePath, videoId: guid });
        if (uploadError || !success) {
            return NextResponse.json({ error: "Fehler beim Upload des Videos" }, { status: 500 });
        }

        return NextResponse.json({ message: "Upload erfolgreich", videoId: guid });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 });
    }
}
