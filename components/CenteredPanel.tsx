import React from 'react';

export default function CenteredPanel({
    children,
    size,
    bgColor,
}: {
    children: React.ReactNode;
    isFirst?: boolean;
    size: 'normal' | 'large' | 'xl';
    bgColor: 'default' | 'contrast' | 'primary' | 'dark';
}) {
    const sizeClasses: { [key: string]: string } = {
        normal: 'min-h-[25vh] xl:min-h-[50vh]',
        large: 'min-h-[25vh] xl:min-h-[75vh]',
        xl: 'min-h-[25vh] xl:min-h-[100vh]',
    };

    const bgClasses: { [key: string]: string } = {
        contrast: 'bg-contrast-bg',
        primary: 'bg-primary text-white',
        dark: 'bg-dark-bg text-white',
    }

    const sizeClass = sizeClasses[size];
    const bgClass = bgClasses[bgColor];

    return (
        <div className={`centered-container ${sizeClass} ${bgClass}`}>
            {children}
        </div>
    );
}
