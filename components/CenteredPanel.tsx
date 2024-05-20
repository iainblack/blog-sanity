import React from 'react';
import { stegaClean } from '@sanity/client/stega';

export default function CenteredPanel({
    children,
    size,
}: {
    children: React.ReactNode;
    isFirst?: boolean;
    size: 'normal' | 'large' | 'xl';
}) {
    const sizeClasses: { [key: string]: string } = {
        normal: 'min-h-[25vh] xl:min-h-[50vh]',
        large: 'min-h-[25vh] xl:min-h-[75vh]',
        xl: 'min-h-[25vh] xl:min-h-[100vh]',
    };

    const sizeClass = sizeClasses[stegaClean(size)];

    return (
        <div
            id="content-panel-centered"
            className={`centered-container ${sizeClass} bg-black}`}
        >
            {children}
        </div >
    );
}
