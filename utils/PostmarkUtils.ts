import { ServerClient } from 'postmark';
import { isSandbox, sandboxSuppressed } from './sandbox';

const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY || '');

export const addToSuppressionList = async (email: string): Promise<boolean> => {
    if (isSandbox) {
        sandboxSuppressed.add(email);
        return true;
    }
    try {
        await postmarkClient.createSuppressions('broadcast', {
            Suppressions: [
                { EmailAddress: email }
            ]
        });
        return true;
    } catch (error) {
        console.error('Error adding to suppression list:', error);
        return false;
    }
};

export const removeFromSuppressionList = async (email: string): Promise<boolean> => {
    if (isSandbox) {
        sandboxSuppressed.delete(email);
        return true;
    }
    try {
        await postmarkClient.deleteSuppressions('broadcast', {
            Suppressions: [
                { EmailAddress: email }
            ]
        });
        return true;
    } catch (error) {
        console.error('Error removing from suppression list:', error);
        return false;
    }
};

export const isOnSuppressionList = async (email: string): Promise<boolean> => {
    if (isSandbox) {
        return sandboxSuppressed.has(email);
    }
    try {
        const response = await postmarkClient.getSuppressions('broadcast', {
            emailAddress: email
        });

        return response.Suppressions.length > 0;

    } catch (error) {
        console.error('Error checking suppression status:', error);
        return false;
    }
}