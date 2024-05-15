'use client';

import { useState } from "react";
import PreferencesModal from "./PreferencesModal";
import { emailPreferenceOptions } from "./utils";

export default function SignUpForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialPreferences = emailPreferenceOptions.reduce((acc: { [key: string]: boolean }, option) => {
        acc[option] = true;
        return acc;
    }, {});

    const [preferences, setPreferences] = useState(initialPreferences);


    const handleSignUp = () => {
        // validate email
        if (!email) {
            setError("Email is required");
            return;
        }
        else if (!email.includes("@")) {
            setError("Invalid email address");
            return;
        }

        setIsModalOpen(true);
    };

    const handleSavePreferences = () => {
        // Here you can handle saving preferences to the backend
        console.log("Email:", email);
        console.log("Preferences:", preferences);
        setIsModalOpen(false);
    };

    return (
        <div className="flex items-center relative">
            <input
                className={`w-full h-12 bg-white text-gray-600 border border-black py-3 px-4 leading-tight focus:outline-none focus:bg-white ${error ? "border-red-500" : ""}`}
                type="email"
                placeholder="Email"
                aria-label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm ml-2 absolute -top-6">{error}</p>}
            <button
                className="two-tone-button-inverse whitespace-nowrap h-12"
                type="button"
                onClick={handleSignUp}
            >
                Sign Up
            </button>
            <PreferencesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                preferences={preferences}
                setPreferences={setPreferences}
                handleSave={handleSavePreferences}
            />
        </div>
    );
}
