import React from 'react';

export default function CenteredPanel({
    children,
    size
}: {
    children: React.ReactNode;
    isFirst?: boolean;
    size: 'normal' | 'large' | 'xl';
}) {

    const sizeClasses = {
        normal: 'min-h-[50vh]',
        large: 'min-h-[75vh]',
        xl: 'min-h-[100vh]',
    };
    return (
        <div
            id="content-panel-centered"
            className={`centered-container ${sizeClasses[size]}`}
        >
            {children}
        </div >
    );
}
