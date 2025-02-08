'use server';

import { addToSubscriberList, getSubscriberPreferences, isOnSubscriberList, removeFromSubscriberList, updateSubscriberPreferences } from "@/utils/FirebaseUtils";
import { addToSuppressionList, isOnSuppressionList, removeFromSuppressionList } from "@/utils/PostmarkUtils";

export async function subscribeUserAction(email: string, preferences: { [key: string]: boolean }) {
    const isSuppressed = await isOnSuppressionList(email);

    if (isSuppressed) {
        const removed = await removeFromSuppressionList(email);

        if (!removed) {
            // Something wen't wrong, return false
            return false;
        }
    }

    const subscribed = await addToSubscriberList(email, preferences);
    return subscribed;
}

export async function unsubscribeUserAction(email: string) {
    const isSuppressed = await isOnSuppressionList(email);

    if (!isSuppressed) {
        const suppressed = await addToSuppressionList(email);

        if (!suppressed) {
            // Something wen't wrong, return false
            return false;
        }
    }

    const removed = await removeFromSubscriberList(email);
    return removed;
}


export async function updateUserPreferencesAction(email: string, preferences?: { [key: string]: boolean }) {
    return updateSubscriberPreferences(email, preferences);
}

export async function isEmailSubscribedAction(email: string) {
    return isOnSubscriberList(email);
}

export async function getEmailPreferencesAction(email: string) {
    return await getSubscriberPreferences(email);
}
