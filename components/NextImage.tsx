import Image from "next/image";

import { urlForImage } from "@/sanity/lib/utils";

interface NextImageProps {
  image: any;
  priority?: boolean;
  fit?: 'contain' | 'cover';
  onLoad?: () => void;
}

export default function NextImage(props: NextImageProps) {
  const { image, priority, fit, onLoad } = props;

  if (!image) {
    return null;
  }

  const blurDataUrl = urlForImage(image)
    ?.width(10)
    .height(10)
    .quality(30)
    .url() as string;

  return (
    <Image
      className="h-full w-full"
      fill
      alt={image?.alt || ""}
      blurDataURL={blurDataUrl}
      src={urlForImage(image)?.url() as string}
      sizes="10vw"
      priority={priority}
      style={{ objectFit: fit || 'cover' }}
      onLoad={onLoad}
    />
  );
}
