"use client";

import PhotoAlbum, { Photo } from "react-photo-album";
import GalleryImage from "./GalleryImage";
import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Slideshow from "yet-another-react-lightbox/plugins/slideshow";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/thumbnails.css";

interface PhotoGalleryProps {
    photos: Photo[];
}

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
    const [index, setIndex] = useState(-1);

    return (
        <>
            <PhotoAlbum
                photos={photos}
                layout="columns"
                columns={(containerWidth) => {
                    if (containerWidth < 1000) return 2;
                    if (containerWidth < 1500) return 3;
                    return 5;
                }}
                renderPhoto={GalleryImage}
                defaultContainerWidth={1200}
                sizes={{
                    size: "calc(100vw - 40px)",
                    sizes: [
                        { viewport: "(max-width: 299px)", size: "calc(100vw - 10px)" },
                        { viewport: "(max-width: 599px)", size: "calc(100vw - 20px)" },
                        { viewport: "(max-width: 1199px)", size: "calc(100vw - 30px)" },
                    ],
                }}
                onClick={({ index }) => setIndex(index)}
            />

            <Lightbox
                slides={photos}
                open={index >= 0}
                index={index}
                close={() => setIndex(-1)}
                plugins={[Fullscreen, Slideshow, Thumbnails, Zoom]}
            />
        </>
    );
}
