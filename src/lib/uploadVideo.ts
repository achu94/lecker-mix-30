import fs from "fs";
import axios from "axios"

type createVideoIdType = {
    title: string;
};

export const createVideoId = async ({ title }: createVideoIdType) => {
    try {
        const url = process.env.BUNNY_STREAM_UPLOAD_URL;
        if (!url) throw new Error("[env:BUNNY_STREAM_UPLOAD_URL]: STREAM UPLOAD URL IS MISSING");

        const libaryId = process.env.BUNNY_LIBARY_ID;
        if (!libaryId) throw new Error("[env:BUNNY_LIBARY_ID]: STREAM UPLOAD LIBRARY ID IS MISSING");

        const accesKey = process.env.BUNNY_API_KEY;
        if (!accesKey) throw new Error("[env:BUNNY_API_KEY]: STREAM UPLOAD API-KEY IS MISSING");

        const params = {
            title: title
        };

        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                "AccessKey": process.env.BUNNY_API_KEY!
            },
            body: JSON.stringify(params),
        };

        const result = await fetch(url.replace("libraryId", libaryId), options)
            .then(res => res.json())

        console.log(result);
        const { guid } = result;

        return {
            guid,
            error: null,
        };

    } catch (err) {
        return {
            videoLibraryId: null,
            error: err,
        };
    }
}

type UploadVideoType = {
    videoPath: string;
    videoId: string;
};

export const uploadVideo = async ({ videoPath, videoId }: UploadVideoType) => {
    try {
        const url = process.env.BUNNY_STREAM_UPLOAD_URL;
        if (!url) throw new Error("[env:BUNNY_STREAM_UPLOAD_URL]: STREAM UPLOAD URL IS MISSING");

        const libraryId = process.env.BUNNY_LIBARY_ID;
        if (!libraryId) throw new Error("[env:BUNNY_LIBARY_ID]: STREAM UPLOAD LIBRARY ID IS MISSING");

        const accessKey = process.env.BUNNY_API_KEY;
        if (!accessKey) throw new Error("[env:BUNNY_API_KEY]: STREAM UPLOAD API-KEY IS MISSING");

        const uploadUrl = `${url.replace("libraryId", libraryId)}/${videoId}`;

        const stream = fs.createReadStream(videoPath);

        const response = await axios.put(uploadUrl, stream, {
            headers: {
                "AccessKey": accessKey,
                "Content-Type": "application/octet-stream", // or video/mp4 if you prefer
                "Accept": "application/json",
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
        
        console.log(response);

        return {
            success: true,
            data: response.data,
            error: null,
        };
    } catch (error) {
        
        console.log(error)
    
        return {
            success: false,
            data: null,
            error: error,
        };
    }
};