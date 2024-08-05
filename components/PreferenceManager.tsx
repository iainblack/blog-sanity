'use client';

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import PreferencesForm from "./PreferencesForm";
import { getEmailPreferencesAction, isEmailSubscribedAction, unsubscribeUserAction, updateUserPreferencesAction } from "@/firebase/FirebaseActions";
import { BasicAlertState } from "./utils";

interface PreferencesManagerProps {
    setShowUnsubscribed: (show: boolean) => void;
    setAlertState: (alertState: BasicAlertState) => void;
    showUnsubscribed: boolean;
}

export default function PreferencesManager({ setShowUnsubscribed, setAlertState, showUnsubscribed }: PreferencesManagerProps) {
    const [inputValue, setInputValue] = useState('');
    const [preferences, setPreferences] = useState<any>(undefined);
    const [isSubscribedLoading, setIsSubscribedLoading] = useState(false);
    const [updatePreferencesLoading, setUpdatePreferencesLoading] = useState(false);
    const [error, setError] = useState('');

    const params = useSearchParams();
    const emailParam = params.get('email');
    const unsubscribeEmailParam = params.get('unsubscribe');

    useEffect(() => {
        if (unsubscribeEmailParam && !showUnsubscribed) {
            handleUnsubscribeClick(unsubscribeEmailParam);
        }
    }, [params]);

    useEffect(() => {
        if (emailParam) {
            handleEmailSubmit(undefined, emailParam);
        }
    }, [params]);

    const handleEmailSubmit = async (e?: React.FormEvent, emailParam?: string) => {
        e && e.preventDefault();
        setIsSubscribedLoading(true);
        setError('');

        const isSubscribed = await isEmailSubscribedAction(emailParam ?? inputValue);
        if (!isSubscribed) {
            setError('Email not found.');
            setIsSubscribedLoading(false);
            return;
        }

        const currentPreferences = await getEmailPreferencesAction(emailParam ?? inputValue);
        if (currentPreferences) {
            setPreferences(currentPreferences);
        } else {
            setError('Failed to fetch preferences. Please try again.');
        }
        setIsSubscribedLoading(false);
    };

    const handleSubmit = async () => {
        setUpdatePreferencesLoading(true);
        const success = await updateUserPreferencesAction(inputValue, preferences);
        if (success) {
            setAlertState({ show: true, message: 'Preferences updated successfully.', type: 'success' });
        } else {
            setAlertState({ show: true, message: 'Failed to update preferences. Please try again.', type: 'error' });
        }
        setUpdatePreferencesLoading(false);
    };

    const handleUnsubscribeClick = async (email: string) => {
        const success = await unsubscribeUserAction(email);
        if (success) {
            setShowUnsubscribed(true);
        } else {
            setAlertState({ show: true, message: 'Failed to unsubscribe. Please try again.', type: 'error' });
        }
    }

    return (
        <div className='flex flex-col items-center w-full p-5 lg:mt-20 lg:max-w-xl'>
            {!preferences ? (
                <form onSubmit={handleEmailSubmit} className="w-full md:max-w-xl px-3">
                    <label htmlFor="email" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                        Enter your email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className={`contact-form-input ${error ? 'border-red-500' : ''}`}
                        required
                    />
                    {error && <p className="text-red-500 text-xs italic">{error}</p>}
                    <button
                        type="submit"
                        className="two-tone-button w-40 h-[50px] mt-4"
                        disabled={isSubscribedLoading}
                    >
                        {isSubscribedLoading ? <LoadingSpinner size={16} /> : 'Submit'}
                    </button>
                </form>

            ) : (
                <div className="flex flex-col space-y-8">
                    <PreferencesForm
                        showUnsubscribe
                        preferences={preferences}
                        setPreferences={setPreferences}
                        handleUnsubscribeClick={() => handleUnsubscribeClick(emailParam ?? inputValue)}
                    />
                    <button onClick={handleSubmit} className="two-tone-button w-40 h-[50px] mr-3" type="button">
                        {updatePreferencesLoading ? <LoadingSpinner size={16} /> : 'Submit'}
                    </button>
                </div>
            )}
        </div>
    );
}