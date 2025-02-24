import { ServerClient } from 'postmark';
import { NextRequest, NextResponse } from 'next/server';

const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY || '');

const parseBody = async (req: NextRequest) => {
    const raw = await req.arrayBuffer();
    const text = new TextDecoder().decode(raw);
    return JSON.parse(text);
}

export async function POST(req: NextRequest, res: any) {
    try {
        const body = await parseBody(req);
        const { senderEmail, firstName, lastName, subject, message } = body;

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
                <p style="font-size: 16px;">New message from <strong>${firstName} ${lastName}</strong> was sent from your website:</p>
                <p style="font-size: 16px;">${message}</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
            </div>
        </div>
    `;
    return emailBody;
}