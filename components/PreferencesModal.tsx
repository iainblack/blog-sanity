'use client';

import React, { useEffect } from "react";
import { pages } from "./utils";

const PreferencesModal = ({ isOpen, onClose, preferences, setPreferences, handleSave }:
    {
        isOpen: boolean,
        onClose: () => void,
        preferences: { [key: string]: boolean },
        setPreferences: any,
        handleSave: () => void
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

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPreferences({
            ...preferences,
            [name]: checked,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-3">Set Preferences</h2>
                <h6 className="text-sm text-left text-gray-500 mb-5">Select the types of content you would like to receive updates for.</h6>
                <div className="flex flex-col items-start space-y-4">
                    {Object.entries(preferences).map(([option, isChecked]) => (
                        <label key={option} className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                name={option}
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
                <div className="flex justify-end mt-8 space-x-4">
                    <button onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-lg">
                        Cancel
                    </button>
                    <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreferencesModal;
