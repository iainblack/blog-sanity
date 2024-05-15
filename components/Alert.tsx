'use client';

import { useEffect } from "react";
import { CloseIcon } from "@sanity/icons";

interface AlertProps {
    show: boolean;
    setShow: (show: boolean) => void;
    message: string;
    type: 'error' | 'success';
}

export default function Alert({ message, type, show, setShow }: AlertProps) {

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                setShow(false);
            }, 5000);
        }
    }, [show]);

    if (!show) {
        return null;
    }

    const alertClasses = {
        error: 'bg-red-100 border border-red-400 text-red-700',
        success: 'bg-green-100 border border-green-400 text-green-700',
    };

    return (
        <div className={`${type === 'success' ? alertClasses.success : alertClasses.error} px-4 rounded-lg relative flex items-center`} role="alert">
            <span className="block sm:inline">{message}</span>
            <div className="pl-4 py-3 cursor-pointer">
                <CloseIcon className="h-6 w-6" onClick={() => setShow(false)} />
            </div>
        </div >
    );
}