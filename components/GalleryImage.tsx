
import { urlForImage } from "@/sanity/lib/utils";
import { Image } from "next-sanity/image";
import type { RenderPhotoProps } from "react-photo-album";

export default function GalleryImage({
    photo,
    imageProps: { alt, title, sizes, className, onClick },
    wrapperStyle,
}: RenderPhotoProps) {
    return (
        <div style={{ ...wrapperStyle, position: "relative" }}>
            <Image
                fill
                src={photo.src}
                placeholder={"blurDataURL" in photo ? "blur" : undefined}
                {...{ alt, title, sizes, className, onClick }}
            />
        </div>
    );
}
