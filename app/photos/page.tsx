import PhotoGallery from "@/components/PhotoGallery";
import { getGalleryImagesByPage } from "../actions";
import { urlForImage } from "@/sanity/lib/utils";
import { Photo } from "react-photo-album";

export default async function Page() {

    const photos = await getGalleryImagesByPage('Photos');

    const breakpoints = [1080, 640, 384, 256, 128, 96, 64, 48];

    if (!photos) return null;

    const mappedPhotos: Photo[] = photos.map((photo) => {
        const { width, height } = photo.picture.asset.metadata.dimensions;
        const srcSet = breakpoints.map((breakpoint) => {
            const calculatedHeight = Math.round((height / width) * breakpoint);
            return {
                src: photo.picture.asset.url,
                width: breakpoint,
                height: calculatedHeight,
            };
        });

        return {
            src: photo.picture.asset.url,
            srcSet: srcSet,
            width,
            height,
            alt: photo.picture.alt || "",
        };

    });

    return (
        <div className="mx-auto p-2 md:p-10">
            <PhotoGallery photos={mappedPhotos} />
        </div >
    );
}