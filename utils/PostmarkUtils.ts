import { ServerClient } from 'postmark';

const postmarkClient = new ServerClient(process.env.NEXT_PUBLIC_POSTMARK_API_KEY || '');

export const addToSuppressionList = async (email: string): Promise<boolean> => {
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