import React from 'react';
import LoadingSpinner from './LoadingSpinner';

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
    return (
        <div
            data-dialog-backdrop="dialog"
            data-dialog-backdrop-close="true"
            className={`fixed inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            onClick={onClose}
        >
            <div
                data-dialog="dialog"
                className="relative m-4 w-2/5 min-w-[40%] max-w-[40%] rounded-lg bg-white text-base font-light leading-relaxed antialiased shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside the dialog
            >
                {title && <div className="flex items-center p-5 text-2xl antialiased font-semibold leading-snug shrink-0 text-blue-gray-900">
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
                        {onCancelClick && <button onClick={onCancelClick} className="bg-gray-300 px-4 py-2 shadow rounded-lg h-10 min-w-20">
                            Cancel
                        </button>}
                        {onSaveClick && <button onClick={onSaveClick} className="bg-blue-500 text-white px-4 py-2 shadow rounded-lg h-10 min-w-20">
                            {loading ? <LoadingSpinner size={16} /> : "Save"}
                        </button>}
                    </div>
                </div>}
            </div>
        </div>
    );
}
