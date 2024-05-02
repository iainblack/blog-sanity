import React from 'react';
import { cleanString } from '../utils';

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
        large: 'min-h-[120vh] lg:min-h-[75vh]',
        xl: 'min-h-[150vh] lg:min-h-[100vh]',
    };

    const cleanS = cleanString(size);
    const sizeClass = sizeClasses[cleanS];

    return (
        <div
            id="content-panel-centered"
            className={`centered-container ${sizeClass} ${singleContent ? 'single' : ''}`}
        >
            {children}
        </div >
    );
}
