'use client';

import { stegaClean } from '@sanity/client/stega'
import { ContentPanel, } from "@/sanity/lib/queries";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import CenteredPanel from "@/components/CenteredPanel";
import React, { useState } from 'react';

const MAX_CHAR_LENGTH = 1300;

export default function ExpandablePanel({
    panel: { title, content, image, size, backgroundColor },
}: {
    panel: ContentPanel;
}) {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const cleanedContent = stegaClean(content);
    const cleanedPosition = stegaClean(image?.position);
    const cleanedBgColor = stegaClean(backgroundColor);
    const cleanedSize = stegaClean(size);

    const imagePosition = cleanedPosition === "left" ? 'xl:order-1' : 'xl:order-2';
    const textPosition = cleanedPosition === "left" ? 'xl:order-2' : 'xl:order-1';


    const handleToggle = () => {
        setIsCollapsed(!isCollapsed);
    };

    const truncatedContent = cleanedContent && cleanedContent.slice(0, MAX_CHAR_LENGTH);
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1280;
    const shouldTruncate = cleanedContent && cleanedContent.length > MAX_CHAR_LENGTH && !isSmallScreen;
    const shouldDisplayImage = isSmallScreen ? true : isCollapsed;

    const displayContent = !isSmallScreen && isCollapsed ? `${truncatedContent} ...` : cleanedContent;


    return (
        <CenteredPanel size={cleanedSize} bgColor={cleanedBgColor}>
            {shouldDisplayImage && image && image?.asset &&
                <div className={`centered-container__image ${imagePosition}`}>
                    <Image
                        alt={image?.alt || ""}
                        src={urlForImage(image)?.url() as string}
                        sizes="50vw"
                        style={{ objectFit: "cover" }}
                        priority
                        fill
                    />
                </div>
            }
            <div className={`mt-4 w-full text-left max-w-3xl lg:mt-0${image && image?.asset ? 'md:text-left' : 'md:text-center'} ${textPosition}`}>
                {title && <h1 className="flex-wrap header-text">
                    {title}
                </h1>}
                <h6 className={`text-pretty flex-wrap mt-5 body-text`}>
                    {displayContent.split("\n").map((paragraph, index) => (
                        <p key={index} className="body-text pb-2 hyphens-auto break-words text-justify">{paragraph}</p>
                    ))}
                </h6>
                {shouldTruncate && (
                    <button onClick={handleToggle} className="text-primary mt-4 font-garamond text-base lg:text-lg">
                        {isCollapsed ? 'Read More' : 'Read Less'}
                    </button>
                )}
            </div>
        </CenteredPanel>
    );
}
