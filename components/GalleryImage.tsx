'use client';

import { Image } from "next-sanity/image";
import { useState } from "react";
import type { RenderPhotoProps } from "react-photo-album";

export default function GalleryImage({
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
}: RenderPhotoProps) {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoad = () => {
        setIsLoading(false);
    };

    return (
        <div style={{ ...wrapperStyle, position: "relative" }}>
            {isLoading && <div className="h-full w-full bg-gray-300 animate-pulse" />}
            <Image
                style={{ objectFit: "contain", objectPosition: "center" }}
                fill
                src={photo.src}
                placeholder={"blurDataURL" in photo ? "blur" : undefined}
                onLoad={handleLoad}
                {...{ alt, title, sizes, className, onClick }}
            />
            {photo.title && (
                <div
                    className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-50 text-white text-center"
                    style={{ fontSize: "0.75rem" }}
                >
                    {photo.title}
                </div>
            )}
        </div>
    );
}