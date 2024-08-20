
'use client';

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';
import { BasicAlertState } from './utils';

interface FormState {
    firstName: {
        value: string;
        error?: string;
    };
    lastName: {
        value: string;
        error?: string;
    };
    email: {
        value: string;
        error?: string;
    };
    subject: {
        value: string;
        error?: string;
    };
    message: {
        value: string;
        error?: string;
    };
}

const initialFormState: FormState = {
    firstName: {
        value: '',
    },
    lastName: {
        value: '',
    },
    email: {
        value: '',
    },
    subject: {
        value: '',
    },
    message: {
        value: '',
    },
};

export default function MessageForm() {
    const [loading, setLoading] = useState(false);
    const [formState, setFormState] = useState<FormState>(initialFormState);
    const [alertState, setAlertState] = useState<BasicAlertState>({ message: '', type: 'success', show: false });

    const clearForm = () => {
        setFormState(initialFormState);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        const { firstName, lastName, subject, message } = formState;

        e.preventDefault();

        if (!isValidForm({ formState, setFormState, setLoading })) {
            return;
        }

        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderEmail: email.value, firstName: firstName.value, lastName: lastName.value, subject: subject.value, message: message.value }),
        });


        if (response.ok) {
            setAlertState({ show: true, message: 'Message sent successfully', type: 'success' });
            clearForm();
        } else {
            setAlertState({ show: true, message: 'Message failed to send', type: 'error' });
        }

        setLoading(false);
    };

    const { firstName, lastName, email, subject, message } = formState;

    return (
        <div className='w-full mx-auto p-5 md:max-w-xl lg:mx-0 my-0 lg:my-12'>
            <form className="w-full">
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="contact-first-name">
                            Your First Name
                        </label>
                        <input
                            id='contact-first-name' type="text" value={firstName.value} onChange={(e) => setFormState({ ...formState, firstName: { value: e.target.value } })}
                            className={`contact-form-input ${firstName.error ? 'border-red-500' : ''}`}
                        />
                        {firstName.error && <p className="text-red-500 text-xs italic">{firstName.error}</p>}
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="contact-last-name">
                            Your Last Name
                        </label>
                        <input
                            id='contact-last-name' type="text" value={lastName.value} onChange={(e) => setFormState({ ...formState, lastName: { value: e.target.value } })}
                            className={`contact-form-input ${lastName.error ? 'border-red-500' : ''}`}
                        />
                        {lastName.error && <p className="text-red-500 text-xs italic">{lastName.error}</p>}
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full px-3 mb-2">
                        <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="contact-password">
                            Subject
                        </label>
                        <input
                            type='text' value={subject.value} onChange={(e) => setFormState({ ...formState, subject: { value: e.target.value } })}
                            className={`contact-form-input ${subject.error ? 'border-red-500' : ''}`}
                        />
                        {subject.error && <p className="text-red-500 text-xs italic">{subject.error}</p>}
                    </div>
                    <div className="w-full px-3 mb-2">
                        <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="contact-password">
                            Your Email
                        </label>
                        <input
                            type='text' value={email.value} onChange={(e) => setFormState({ ...formState, email: { value: e.target.value } })}
                            className={`contact-form-input ${email.error ? 'border-red-500' : ''}`}
                        />
                        {email.error && <p className="text-red-500 text-xs italic">{email.error}</p>}
                    </div>
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-600 text-xs font-bold mb-2" htmlFor="contact-message">
                            Message
                        </label>
                        <textarea
                            id='contact-message' rows={10} value={message.value} onChange={(e) => setFormState({ ...formState, message: { value: e.target.value } })}
                            className={`contact-form-input text-sm lg:text-base ${message.error ? 'border-red-500' : ''}`}
                        />
                        {message.error && <p className="text-red-500 text-xs italic">{message.error}</p>}
                    </div>
                </div>
                <div className="flex justify-start h-18">
                    <button onClick={handleSubmit} className="two-tone-button w-40 h-[50px] mr-3" type="button">
                        {loading ? <LoadingSpinner size={16} /> : 'Submit'}
                    </button>
                    <Alert
                        show={alertState.show}
                        onClose={() => setAlertState({ ...alertState, show: false })}
                        message={alertState.message}
                        type={alertState.type}
                    />
                </div>
            </form>
        </div >
    );
}


const isValidForm = ({ formState, setFormState, setLoading }
    : { formState: FormState, setFormState: (formState: FormState) => void, setLoading: (loading: boolean) => void }) => {
    const { firstName, lastName, email, subject, message } = formState;
    let isValid = true;
    let errors = { ...formState };

    if (firstName.value === '') {
        errors.firstName.error = 'First name is required';
        console.log('First name is required')
        isValid = false;
    }

    if (!lastName.value) {
        errors.lastName.error = 'Last name is required';
        isValid = false;
    }

    if (!email.value) {
        errors.email.error = 'Email is required';
        isValid = false;
    } else if (!email.value.includes('@')) {
        errors.email.error = 'Invalid email';
        isValid = false;
    }

    if (!subject.value) {
        errors.subject.error = 'Subject is required';
        isValid = false;
    }

    if (!message.value) {
        errors.message.error = 'Message is required';
        isValid = false;
    } else if (message.value.length < 10) {
        errors.message.error = 'Message must be at least 10 characters';
        isValid = false;
    }

    if (!isValid) {
        setFormState(errors);
        setLoading(false);
    }

    return isValid;
}