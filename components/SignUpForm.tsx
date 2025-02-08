'use client';

import { useState } from "react";
import { BasicAlertState, emailPreferenceOptions } from "./utils";
import Alert from "./Alert";
import { isEmailSubscribedAction, subscribeUserAction } from "@/app/api/actions";
import SearchBar from "./SearchBar";
import Modal from "./Modal";
import PreferencesForm from "./PreferencesForm";

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

    const [preferences, setPreferences] = useState<{ [key: string]: boolean }>(initialPreferences);

    const handleSignUp = async () => {
        setIsSubscribedLoading(true);
        setError(undefined);

        if (!email) {
            setIsSubscribedLoading(false);
            setError("Email is required");
            return;
        }

        if (!email.includes("@")) {
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

    const handleSavePreferences = async () => {
        setUpdatePreferencesLoading(true);

        const success = await subscribeUserAction(email, preferences);

        if (success) {
            setAlertState({ show: true, message: "Successfully subscribed.", type: "success" });
        } else {
            setAlertState({ show: true, message: "Failed to subscribe. Please try again.", type: "error" });
        }

        setIsModalOpen(false);
        setUpdatePreferencesLoading(false);
        setEmail("");
    };

    return (
        <div className="flex relative">
            <SearchBar
                value={email}
                handleChange={(e) => setEmail(e.target.value)}
                onSubmit={handleSignUp}
                placeholder="Enter your email"
                type="email"
                error={error}
                loading={isSubscribedLoading}
                buttonText="Sign Up"
            />
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Set Email Preferences"
                loading={updatePreferencesLoading}
                onSaveClick={handleSavePreferences}>
                <PreferencesForm preferences={preferences} setPreferences={setPreferences} />
            </Modal>
            <Alert
                show={alertState.show}
                onClose={() => setAlertState({ ...alertState, show: false })}
                message={alertState.message}
                type={alertState.type}
            />
        </div>
    );
}
