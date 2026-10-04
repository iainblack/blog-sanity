// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { sendEmail } = vi.hoisted(() => ({ sendEmail: vi.fn() }));
vi.mock('postmark', () => ({ ServerClient: class { sendEmail = sendEmail; } }));

import { POST } from '@/app/api/sendEmail/route';

const BODY = { senderEmail: 'ada@example.com', firstName: 'Ada', lastName: 'Lovelace', subject: 'Hello', message: 'Hi Lou, this is a message.' };
const post = (body: unknown) =>
  POST(new NextRequest('http://localhost/api/sendEmail', { method: 'POST', body: typeof body === 'string' ? body : JSON.stringify(body) }), {});

beforeEach(() => {
  sendEmail.mockReset().mockResolvedValue({ ErrorCode: 0 });
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

describe('POST /api/sendEmail', () => {
  it('sends one email to the site owner, with the visitor as Reply-To, and returns 200', async () => {
    const res = await post(BODY);
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'Email sent successfully' });
    expect(sendEmail).toHaveBeenCalledTimes(1);
    const mail = sendEmail.mock.calls[0][0];
    expect(mail).toMatchObject({
      To: 'unit@example.invalid',
      From: 'unit@example.invalid',
      ReplyTo: 'ada@example.com',
      Subject: 'Hello',
      TextBody: 'Hi Lou, this is a message.',
      MessageStream: 'outbound',
    });
    expect(mail.HtmlBody).toContain('Ada Lovelace');
    expect(mail.HtmlBody).toContain('Hi Lou, this is a message.');
  });

  it('returns 500 when Postmark fails', async () => {
    sendEmail.mockRejectedValue(new Error('postmark down'));
    const res = await post(BODY);
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ message: 'Email failed to send' });
  });

  it('returns 400 for a malformed body without sending anything', async () => {
    const res = await post('{not json');
    expect(res.status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  describe('server-side validation (same rules as the contact form)', () => {
    it.each(['senderEmail', 'firstName', 'lastName', 'subject', 'message'])('rejects a missing %s with 400 and sends nothing', async (key) => {
      const { [key]: _omitted, ...rest } = BODY as Record<string, string>;
      expect((await post(rest)).status).toBe(400);
      expect((await post({ ...rest, [key]: '' })).status).toBe(400);
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('rejects an empty body, a non-object body and non-string fields', async () => {
      for (const body of [{}, 'null', '[]', { ...BODY, firstName: 123 }, { ...BODY, subject: { a: 1 } }]) {
        expect((await post(body)).status).toBe(400);
      }
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('rejects an email without @', async () => {
      expect((await post({ ...BODY, senderEmail: 'nope' })).status).toBe(400);
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it('message boundary: 9 characters rejected, 10 accepted', async () => {
      expect((await post({ ...BODY, message: '123456789' })).status).toBe(400);
      expect(sendEmail).not.toHaveBeenCalled();
      expect((await post({ ...BODY, message: '1234567890' })).status).toBe(200);
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
  });

  it('escapes HTML in user-supplied fields in the HTML body, but sends the text body verbatim', async () => {
    const message = '<script>alert(1)</script> & "quotes"';
    await post({ ...BODY, firstName: '<img src=x onerror=alert(1)>', message });
    const mail = sendEmail.mock.calls[0][0];
    expect(mail.HtmlBody).not.toContain('<script>');
    expect(mail.HtmlBody).not.toContain('<img src=x');
    expect(mail.HtmlBody).toContain('&lt;script&gt;alert(1)&lt;/script&gt; &amp; &quot;quotes&quot;');
    expect(mail.HtmlBody).toContain('&lt;img src=x onerror=alert(1)&gt;');
    expect(mail.TextBody).toBe(message);
  });
});
