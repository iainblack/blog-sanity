'use client';

import { Suspense, use, useEffect, useState } from 'react';
import Alert from '@/components/Alert';
import { BasicAlertState } from '@/components/utils';
import { CheckmarkCircleIcon } from '@sanity/icons'
import PreferencesManager from '@/components/PreferenceManager';

export default function Page() {
    const [alertState, setAlertState] = useState<BasicAlertState>({ message: '', type: 'success', show: false });
    const [showUnsubscribed, setShowUnsubscribed] = useState(false);


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
            <Suspense>
                <PreferencesManager
                    setShowUnsubscribed={setShowUnsubscribed}
                    setAlertState={setAlertState}
                    showUnsubscribed={showUnsubscribed}
                />
            </Suspense>
            <Alert
                show={alertState.show}
                onClose={() => setAlertState({ ...alertState, show: false })}
                message={alertState.message}
                type={alertState.type}
            />
        </div>

    );
};