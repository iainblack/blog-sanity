import { ServerClient } from 'postmark';
import { NextRequest, NextResponse } from 'next/server';

const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY || '');

const parseBody = async (req: NextRequest) => {
    const raw = await req.arrayBuffer();
    const text = new TextDecoder().decode(raw);
    return JSON.parse(text);
}

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const isNonEmptyString = (value: unknown): value is string => typeof value === 'string' && value !== '';

export async function POST(req: NextRequest, res: any) {
    let body: any;
    try {
        body = await parseBody(req);
    } catch {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    // Same rules as the contact form; the endpoint is public so they must hold server-side too.
    const { senderEmail, firstName, lastName, subject, message } = body ?? {};
    if (
        ![senderEmail, firstName, lastName, subject, message].every(isNonEmptyString) ||
        !senderEmail.includes('@') ||
        message.length < 10
    ) {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    try {

        const content = {
            To: process.env.NEXT_PUBLIC_VERIFIED_SENDER ?? '',
            From: process.env.NEXT_PUBLIC_VERIFIED_SENDER ?? '',
            ReplyTo: senderEmail,
            Subject: subject,
            TextBody: message,
            HtmlBody: getEmailHtml({ firstName, lastName, message }),
            MessageStream: 'outbound',
        };

        await postmarkClient.sendEmail(content);

        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Email failed to send' }, { status: 500 });
    }
}

function getEmailHtml({ firstName, lastName, message }: { firstName: string, lastName: string, message: string }) {
    const emailBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background-color: #f7f7f7; padding: 20px; border-bottom: 1px solid #e0e0e0;">
                <h1 style="margin: 0; color: #65a765;">New Message Received</h1>
            </div>
           <div style="padding: 20px;">
                <p style="font-size: 16px;">New message from <strong>${escapeHtml(firstName)} ${escapeHtml(lastName)}</strong> was sent from your website:</p>
                <p style="font-size: 16px;">${escapeHtml(message)}</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            </div>
        </div>
    `;
    return emailBody;
}