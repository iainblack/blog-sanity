import { NextRequest, NextResponse } from 'next/server';
import { isOnSubscriberList, removeFromSubscriberList } from '@/utils/FirebaseUtils';

const parseBody = async (req: NextRequest) => {
    const raw = await req.arrayBuffer();
    const text = new TextDecoder().decode(raw);
    return JSON.parse(text);
};

export async function POST(req: NextRequest) {
    try {
        const body = await parseBody(req);

        console.log('Received postmark webhook:', body);

        switch (body.RecordType) {
            case 'SubscriptionChange':
                await handleSubscriptionChangEvent(body);
                break;
            default:
                console.log('Unhandled webhook type:', body.RecordType);
        }

        return NextResponse.json({ message: 'Unsubscribed successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error processing webhook:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


const handleSubscriptionChangEvent = async (body: any) => {
    const email = body.Recipient;
    const unsubscribeEvent = body.SuppressSending;

    if (unsubscribeEvent) {
        const isSubscribed = await isOnSubscriberList(email);
        if (!isSubscribed) {
            console.log(`Email ${email} not found in Firebase.`);
            return;
        }

        const removed = await removeFromSubscriberList(email);
        if (removed) {
            console.log(`Removed ${email} from Firebase.`);
        }

        return;
    }
};