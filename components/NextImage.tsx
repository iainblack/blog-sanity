import { Image } from "next-sanity/image";

import { urlForImage } from "@/sanity/lib/utils";

interface NextImageProps {
  image: any;
  priority?: boolean;
  fit?: 'contain' | 'cover';
  onLoad?: () => void;
}

export default function NextImage(props: NextImageProps) {
  const { image: source, priority, fit, onLoad } = props;

  return (
    <Image
      className="h-full w-full"
      fill
      alt={source?.alt || ""}
      src={urlForImage(source)?.url() as string}
      sizes="50vw"
      priority={priority}
      style={{ objectFit: fit || 'cover' }}
      onLoad={onLoad}
    />
  );
}
