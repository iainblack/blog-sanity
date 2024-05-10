
'use client';

import { useState } from 'react';

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
    status: string;
}

export default function MessageForm() {
    const [formState, setFormState] = useState<FormState>({
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
        status: '',
    });

    const isValidForm = () => {
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
        }

        if (!isValid) setFormState(errors);

        return isValid;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        const { firstName, lastName, subject, message } = formState;

        e.preventDefault();

        if (!isValidForm()) return;

        const response = await fetch('/api/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ senderEmail: email, firstName: firstName.value, lastName: lastName.value, subject: subject.value, message: message.value }),
        });

        if (response.ok) {
            setFormState({
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
                status: 'Message sent successfully',
            });
        } else {
            setFormState({
                ...formState,
                status: 'Message failed to send',
            });
        }
    };

    const { firstName, lastName, email, subject, message } = formState;

    return (
        <div className='w-full p-5 max-w-xl'>
            <form className="w-full">
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="contact-first-name">
                            First Name
                        </label>
                        <input
                            id='contact-first-name' type="text" value={firstName.value} onChange={(e) => setFormState({ ...formState, firstName: { value: e.target.value } })}
                            className={`contact-form-input ${firstName.error ? 'border-red-500' : ''}`}
                        />
                        {firstName.error && <p className="text-red-500 text-xs italic">{firstName.error}</p>}
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-2 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="contact-last-name">
                            Last Name
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
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="contact-password">
                            Subject
                        </label>
                        <input
                            type='text' value={subject.value} onChange={(e) => setFormState({ ...formState, subject: { value: e.target.value } })}
                            className={`contact-form-input ${subject.error ? 'border-red-500' : ''}`}
                        />
                        {subject.error && <p className="text-red-500 text-xs italic">{subject.error}</p>}
                    </div>
                    <div className="w-full px-3 mb-2">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="contact-password">
                            Email
                        </label>
                        <input
                            type='text' value={email.value} onChange={(e) => setFormState({ ...formState, email: { value: e.target.value } })}
                            className={`contact-form-input ${email.error ? 'border-red-500' : ''}`}
                        />
                        {email.error && <p className="text-red-500 text-xs italic">{email.error}</p>}
                    </div>
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="contact-message">
                            Message
                        </label>
                        <textarea
                            id='contact-message' rows={10} value={message.value} onChange={(e) => setFormState({ ...formState, message: { value: e.target.value } })}
                            className={`contact-form-input text-sm ${message.error ? 'border-red-500' : ''}`}
                        />
                        {message.error && <p className="text-red-500 text-xs italic">{message.error}</p>}
                    </div>
                </div>
                <div className="flex justify-start">
                    <button onClick={handleSubmit} className="two-tone-button" type="button">
                        Submit
                    </button>
                </div>
            </form>
        </div >
    );
}
