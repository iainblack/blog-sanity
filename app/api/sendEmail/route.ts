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

    var content = {
        to: 'iainjblack20@gmail.com',
        from: senderEmail,
        subject: subject,
        text: message,
        html: `New message from ${firstName} ${lastName} sent from your website:<br><br>${message}`,
    };

    await sgMail.send(content);
    return Response.json({ message: 'Email sent successfully' }, { status: 200 });

    } catch (error) {
        return Response.json({ message: 'Email failed to send' }, { status: 500 });
    }
}