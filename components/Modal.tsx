import React, { useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { CloseIcon } from '@sanity/icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveClick?: () => void;
    onCancelClick?: () => void;
    title?: string;
    children?: React.ReactNode;
    loading?: boolean;
    imageHeader?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, onSaveClick, onCancelClick, title, children, loading, imageHeader }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    return (
        <div id="modal"
            className={`fixed inset-0 z-[990] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm placeholder:transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div
                className="max-h-[95vh] overflow-y-auto relative w-[95%] sm:w-[90%] md:w-[60%] xl:w-[35%] rounded-lg bg-default-bg font-light leading-relaxed antialiased shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className='absolute top-0 right-0 p-4 z-[995]'>
                    <button onClick={onClose}>
                        <CloseIcon className="w-6 h-6 text-black" />
                    </button>
                </div>
                {title && <div className="flex items-center p-5 subheader-text">
                    {title}
                </div>}
                {imageHeader && <div className="flex items-center justify-center">
                    {imageHeader}
                </div>}
                <div className='flex flex-col items-center justify-center p-5'>
                    {children}
                </div>
                {(onCancelClick || onSaveClick) && <div className="flex justify-end p-5">
                    <div className="flex space-x-4">
                        {onCancelClick && <button onClick={onCancelClick} className="border w-28 h-10 bg-gray-300 border-black">
                            Cancel
                        </button>}
                        {onSaveClick && <button onClick={onSaveClick} className="border w-28 h-10 border-black transition-colors duration-200 bg-contrast-bg hover:bg-primary hover:text-text-contrast">
                            {loading ? <LoadingSpinner size={16} /> : "Save"}
                        </button>}
                    </div>
                </div>}
            </div>
        </div>
    );
}
