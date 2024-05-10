import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export default async function sendEmail(req: any, res: any) {
    if (req.method === 'POST') {
        const { senderEmail, firstName, lastName, subject, message } = req.body;

        console.log(req.body)

        const content = {
            to: 'iainjblack20@gmail.com',
            from: senderEmail,
            subject: subject,
            text: message,
            html: `<p>You've received a message from ${firstName} ${lastName}: </p><p>Message: ${message}</p>`,
        };

        try {
            await sgMail.send(content);
            res.status(200).send('Message sent successfully.');
        } catch (error) {
            console.error('SendGrid mail send error', error);
            res.status(500).send('Error sending message.');
        }
    } else {
        res.status(405).end();
    }
}
