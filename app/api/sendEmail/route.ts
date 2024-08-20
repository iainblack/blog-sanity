import sgMail from '@sendgrid/mail';
import { NextRequest } from 'next/server';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

const parseBody = async (req: NextRequest) => {
    const raw = await req.arrayBuffer();
    const text = new TextDecoder().decode(raw);
    return JSON.parse(text);
}

export async function POST(req: NextRequest, res: any) {
    try {
        const body = await parseBody(req);
        const { senderEmail, firstName, lastName, subject, message } = body;
        const fromEmail = process.env.NEXT_PUBLIC_VERIFIED_SENDER ?? '';

        var content = {
            to: process.env.NEXT_PUBLIC_VERIFIED_SENDER,
            from: fromEmail,
            subject: subject,
            text: message,
            html: getEmailHtml({ firstName, lastName, message, senderEmail }),
        };

        await sgMail.send(content);
        return Response.json({ message: 'Email sent successfully' }, { status: 200 });

    } catch (error) {
        console.log(error);
        return Response.json({ message: 'Email failed to send' }, { status: 500 });
    }
}

function getEmailHtml({ firstName, lastName, message, senderEmail }: { firstName: string, lastName: string, message: string, senderEmail: string }) {
    const emailBody = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="background-color: #f7f7f7; padding: 20px; border-bottom: 1px solid #e0e0e0;">
                <h1 style="margin: 0; color: #65a765;">New Message Received</h1>
            </div>
           <div style="padding: 20px;">
                <p style="font-size: 16px;">New message from <strong>${firstName} ${lastName}</strong> was sent from your website:</p>
                <p style="font-size: 16px;">${message}</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
                <p style="font-size: 16px;">Reply to this user at: <a href="mailto:${senderEmail}" style="font-size: 16px;">${senderEmail}</a></p>
            </div>
        </div>
    `;
    return emailBody;
}