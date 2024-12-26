'use client';

import Image from "next/image";

import { urlForImage } from "@/sanity/lib/utils";
import { useState } from "react";

interface NextImageProps {
  image: any;
  priority?: boolean;
  fit?: 'contain' | 'cover';
  onLoad?: () => void;
}

export default function NextImage(props: NextImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { image, priority, fit, onLoad } = props;

  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) {
      onLoad();
    }
  };

  return (
    <>
      {isLoading && (
        <div className="h-full w-full bg-gray-200 animate-pulse" />
      )}
      <Image
        className="h-full w-full"
        fill
        alt={image?.alt || ""}
        src={urlForImage(image)?.url() as string}
        sizes="50w"
        priority={priority}
        style={{ objectFit: fit || 'cover' }}
        onLoad={handleLoad}
      />
    </>
  );
}
