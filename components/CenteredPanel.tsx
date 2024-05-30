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
        large: 'min-h-[25vh] xl:min-h-[80vh]',
        xl: 'min-h-[25vh] xl:min-h-[100vh]',
    };

    const bgClasses: { [key: string]: string } = {
        contrast: 'bg-contrast-bg border-transparent',
        primary: 'bg-primary text-white border-transparent',
        dark: 'bg-dark-bg text-white border-transparent',
    }

    const sizeClass = sizeClasses[size];
    const bgClass = bgClasses[bgColor];

    return (
        <div className={`centered-container ${sizeClass} ${bgClass} border-b border-black`}>
            {children}
        </div>
    );
}
