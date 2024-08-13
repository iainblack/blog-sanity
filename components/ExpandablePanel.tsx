'use client';

import { stegaClean } from '@sanity/client/stega'
import { ContentPanel, } from "@/sanity/lib/queries";
import CenteredPanel from "@/components/CenteredPanel";
import React, { useState } from 'react';
import NextImage from './NextImage';

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

    // Find the end of the first paragraph
    const firstParagraphEnd = cleanedContent.indexOf('\n');
    const truncatedContent = firstParagraphEnd !== -1 ? cleanedContent.slice(0, firstParagraphEnd) : cleanedContent;
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1280;
    const shouldTruncate = firstParagraphEnd !== -1 && !isSmallScreen;
    const shouldDisplayImage = isSmallScreen ? true : isCollapsed;

    const formattedContent = !isSmallScreen && isCollapsed ? truncatedContent : cleanedContent;

    return (
        <CenteredPanel size={cleanedSize} bgColor={cleanedBgColor}>

            {shouldDisplayImage && image && image?.asset &&
                <div className='w-full flex flex-col items-center justify-center'>
                    <div className='relative w-full h-[60vh]'>
                        <NextImage image={image} priority fit='contain' />
                    </div>
                    {image?.caption && <p className="text-gray-600 text-center font-garamond">{image.caption}</p>}
                </div>
            }
            <div className={`mt-4 w-full text-left sm:max-w-2xl md:max-w-3xl lg:max-w-6xl lg:mt-0${image && image?.asset ? 'md:text-left' : 'md:text-center'} ${textPosition}`}>
                {title && <h1 className="flex-wrap subheader-text text-center pb-5">
                    {title}
                </h1>}
                {cleanedContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="body-text hyphens-auto break-words text-justify pb-2">
                        {paragraph}
                    </p>
                ))}
                {/* {shouldTruncate && (
                    <button onClick={handleToggle} className="font-bold mt-4 font-garamond text-base lg:text-lg hover:underline">
                        {isCollapsed ? 'Read More' : 'Read Less'}
                    </button>
                )} */}
            </div>
        </CenteredPanel>
    );
}
