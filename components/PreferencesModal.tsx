'use client';
import React, { useEffect } from "react";
import PreferencesForm from "./PreferencesForm";

const PreferencesModal = ({ isOpen, onClose, preferences, setPreferences, handleSave, loading }:
    {
        isOpen: boolean,
        onClose: () => void,
        preferences: { [key: string]: boolean },
        setPreferences: any,
        handleSave: (e: React.MouseEvent<HTMLButtonElement>) => void
        loading?: boolean
    }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white pt-5 rounded-lg shadow-lg w-[95vw] sm:w-1/2 xl:w-1/4">
                <h2 className="text-2xl font-bold mb-3">Set Preferences</h2>
                <PreferencesForm preferences={preferences} setPreferences={setPreferences} handleSaveClick={handleSave} handleCancelClick={onClose} loading={loading} />
            </div>
        </div>
    );
};

export default PreferencesModal;
