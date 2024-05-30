'use client';

import { useState } from "react";
import PreferencesModal from "./PreferencesModal";
import { BasicAlertState, emailPreferenceOptions } from "./utils";
import Alert from "./Alert";
import { isEmailSubscribedAction, subscribeUserAction } from "@/firebase/FirebaseActions";
import LoadingSpinner from "./LoadingSpinner";
import SearchBar from "./SearchBar";

export default function SignUpForm() {
    const [email, setEmail] = useState('');
    const [isSubscribedLoading, setIsSubscribedLoading] = useState(false);
    const [updatePreferencesLoading, setUpdatePreferencesLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [alertState, setAlertState] = useState<BasicAlertState>({ message: "", type: "success", show: false });

    const initialPreferences = emailPreferenceOptions.reduce((acc: { [key: string]: boolean }, option) => {
        acc[option] = true;
        return acc;
    }, {});

    const [preferences, setPreferences] = useState(initialPreferences);

    const handleSignUp = async () => {
        setIsSubscribedLoading(true);
        setError(undefined);

        if (!email) {
            setIsSubscribedLoading(false);
            setError("Email is required");
            return;
        }
        else if (!email.includes("@")) {
            setIsSubscribedLoading(false);
            setError("Invalid email address");
            return;
        }

        const emailExists = await isEmailSubscribedAction(email);
        if (emailExists) {
            setIsSubscribedLoading(false);
            setError("Email is already subscribed.");
            return;
        }

        setIsSubscribedLoading(false);
        setIsModalOpen(true);
    };

    const handleSavePreferences = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setUpdatePreferencesLoading(true);

        const success = await subscribeUserAction(email, preferences);

        if (success) {
            setAlertState({ show: true, message: "Successfully subscribed.", type: "success" });
        } else {
            setAlertState({ show: true, message: "Failed to subscribe. Please try again.", type: "error" });
        }

        setEmail("");
        setIsModalOpen(false);
        setUpdatePreferencesLoading(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSignUp();
        }
    };

    return (
        <div className="flex relative">
            <SearchBar
                value={email}
                setSearch={setEmail}
                onSubmit={handleSignUp}
                placeholder="Enter your email"
                type="email"
                error={error}
                loading={isSubscribedLoading}
                buttonText="Sign Up"
            />
            <PreferencesModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                preferences={preferences}
                setPreferences={setPreferences}
                handleSave={handleSavePreferences}
                loading={updatePreferencesLoading}
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
