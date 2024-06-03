import React from 'react';

export default function CenteredPanel({
    children,
    size,
    bgColor,
}: {
    children: React.ReactNode;
    isFirst?: boolean;
    size: 'Small' | 'Medium' | 'Large';
    bgColor: 'default' | 'contrast' | 'primary' | 'dark';
}) {
    const sizeClasses: { [key: string]: string } = {
        Small: 'md:min-h-[35vh] xl:min-h-[50vh]',
        Medium: 'md:min-h-[65vh] xl:min-h-[80vh]',
        Large: 'md:min-h-[80vh] xl:min-h-[100vh]',
    };

    const bgClasses: { [key: string]: string } = {
        contrast: 'bg-contrast-bg ',
        primary: 'bg-primary text-white',
        dark: 'bg-dark-bg text-white',
    }

    const sizeClass = sizeClasses[size];
    const bgClass = bgClasses[bgColor];

    return (
        <div className={`h-full w-full ${bgClass} border-b border-black`}>
            <div className={`centered-container ${sizeClass}`} data-aos="zoom-out">
                {children}
            </div>
        </div>
    );
}
