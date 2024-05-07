import React from 'react';
import { stegaClean } from '@sanity/client/stega';

export default function CenteredPanel({
    children,
    size,
    singleContent
}: {
    children: React.ReactNode;
    isFirst?: boolean;
    singleContent?: boolean;
    size: 'normal' | 'large' | 'xl';
}) {
    const sizeClasses: { [key: string]: string } = {
        normal: 'min-h-screen lg:min-h-[50vh]',
        large: 'min-h-screen lg:min-h-[75vh]',
        xl: 'min-h-screen lg:min-h-[100vh]',
    };

    const sizeClass = sizeClasses[stegaClean(size)];

    return (
        <div
            id="content-panel-centered"
            className={`centered-container ${sizeClass} ${singleContent ? '' : ''}`}
        >
            {children}
        </div >
    );
}
