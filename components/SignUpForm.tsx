'use client';

import { useState } from "react";
import PreferencesModal from "./PreferencesModal";
import { BasicAlertState, emailPreferenceOptions } from "./utils";
import Alert from "./Alert";
import { isEmailSubscribedAction, subscribeUserAction } from "@/firebase/FirebaseActions";
import LoadingSpinner from "./LoadingSpinner";
import Link from "next/link";

export default function SignUpForm() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [alertState, setAlertState] = useState<BasicAlertState>({ message: "", type: "success", show: false });

    const initialPreferences = emailPreferenceOptions.reduce((acc: { [key: string]: boolean }, option) => {
        acc[option] = true;
        return acc;
    }, {});

    const [preferences, setPreferences] = useState(initialPreferences);

    const handleSignUp = async () => {
        setError(null);

        if (!email) {
            setError("Email is required");
            return;
        }
        else if (!email.includes("@")) {
            setError("Invalid email address");
            return;
        }

        const emailExists = await isEmailSubscribedAction(email);
        if (emailExists) {
            setError("Email is already subscribed.");
            return;
        }

        setIsModalOpen(true);
    };

    const handleSavePreferences = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setLoading(true);

        const success = await subscribeUserAction(email, preferences);

        if (success) {
            setAlertState({ show: true, message: "Successfully subscribed.", type: "success" });
        } else {
            setAlertState({ show: true, message: "Failed to subscribe. Please try again.", type: "error" });
        }

        setEmail("");
        setIsModalOpen(false);
        setLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
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
                onKeyDown={handleKeyDown}
            />
            {error && <p className="text-red-500 text-sm ml-2 absolute -top-6">{error}</p>}
            <button
                className="two-tone-button-inverse whitespace-nowrap h-12 w-52"
                type="button"
                onClick={handleSignUp}
            >
                {loading ? <LoadingSpinner size={16} /> : "Sign Up"}
            </button>
            <PreferencesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                preferences={preferences}
                setPreferences={setPreferences}
                handleSave={handleSavePreferences}
            />
            <Alert
                show={alertState.show}
                onClose={() => setAlertState({ ...alertState, show: false })}
                message={alertState.message}
                type={alertState.type}
            />
        </div>
    );
}
