'use client';

import { use, useEffect, useState } from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getEmailPreferencesAction, unsubscribeUserAction, updateUserPreferencesAction } from '@/firebase/FirebaseActions';
import PreferencesForm from '@/components/PreferencesForm';
import Alert from '@/components/Alert';
import { BasicAlertState } from '@/components/utils';
import { CheckmarkCircleIcon } from '@sanity/icons'
import { useSearchParams } from 'next/navigation';

export default function Page() {
    const [inputValue, setInputValue] = useState('');
    const [preferences, setPreferences] = useState<{ [key: string]: boolean } | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [alertState, setAlertState] = useState<BasicAlertState>({ message: '', type: 'success', show: false });
    const [showUnsubscribed, setShowUnsubscribed] = useState(false);

    const params = useSearchParams();
    const emailParam = params.get('email');
    const unsubscribeEmailParam = params.get('unsubscribe');

    const handleEmailSubmit = async (e?: React.FormEvent, emailParam?: string) => {
        e && e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const currentPreferences = await getEmailPreferencesAction(emailParam ?? inputValue);
            if (currentPreferences) {
                setPreferences(currentPreferences);
            } else {
                setError('Email not found.');
            }
        } catch (error) {
            console.error('Error fetching preferences:', error);
            setError('Error fetching preferences. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        const success = await updateUserPreferencesAction(emailParam ?? inputValue, preferences);
        if (success) {
            setAlertState({ show: true, message: 'Preferences updated successfully.', type: 'success' });
            setPreferences(undefined);
            setInputValue('');
        } else {
            setAlertState({ show: true, message: 'Failed to update preferences. Please try again.', type: 'error' });
        }
    };

    const handleUnsubscribeClick = async (email: string) => {
        const success = await unsubscribeUserAction(email);
        if (success) {
            setShowUnsubscribed(true);
        } else {
            setAlertState({ show: true, message: 'Failed to unsubscribe. Please try again.', type: 'error' });
        }
    }

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

    if (showUnsubscribed) {
        return (
            <div className="mx-auto flex-col py-6 md:flex-row md:pt-12 md:flex md:justify-evenly">
                <div>
                    <h1 className="header-text text-center">
                        Unsubscribed
                    </h1>
                    <p className="body-text text-center mt-3">
                        You have been successfully unsubscribed.
                    </p>

                    <div className="flex justify-center mt-5">
                        <CheckmarkCircleIcon fontSize={68} color='green' />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto flex-col py-6 md:flex-row md:pt-12 md:flex md:justify-evenly">
            <div>
                <h1 className="header-text text-center">
                    Update Preferences
                </h1>
                <p className="body-text text-center mt-3">
                    Enter your email to update your email preferences.
                </p>
            </div>
            <div className='w-full p-5 md:max-w-xl lg:mt-20'>
                {!preferences ? (
                    <form onSubmit={handleEmailSubmit} className="md:max-w-xl px-3">
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
                            disabled={loading}
                        >
                            {loading ? <LoadingSpinner size={16} /> : 'Submit'}
                        </button>
                    </form>

                ) : (
                    <div className="flex flex-col items-center space-y-4">
                        <PreferencesForm
                            showUnsubscribe
                            preferences={preferences}
                            setPreferences={setPreferences}
                            handleSaveClick={handleSubmit}
                            handleUnsubscribeClick={() => handleUnsubscribeClick(emailParam ?? inputValue)}
                        />
                    </div>
                )}
            </div>
            <Alert
                show={alertState.show}
                onClose={() => setAlertState({ ...alertState, show: false })}
                message={alertState.message}
                type={alertState.type}
            />
        </div>

    );
};
