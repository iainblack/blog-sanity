'use server';

import { getUserPreferences, isEmailSubscribed, subscribeUser, unsubscribeUser, updateUserPreferences } from "./FirebaseUtils";

export async function subscribeUserAction(email: string, preferences: { [key: string]: boolean }) {
    return subscribeUser(email, preferences);
}

export async function unsubscribeUserAction(email: string) {
    return unsubscribeUser(email);
}

export async function updateUserPreferencesAction(email: string, preferences?: { [key: string]: boolean }) {
    return updateUserPreferences(email, preferences);
}

export async function isEmailSubscribedAction(email: string) {
    return isEmailSubscribed(email);
}

export async function getEmailPreferencesAction(email: string) {
    return await getUserPreferences(email);
}