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

  it('returns 500 for a malformed body without sending anything', async () => {
    const res = await post('{not json');
    expect(res.status).toBe(500);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  // BEHAVIOR.md: "Requires: senderEmail, firstName, lastName, subject, message".
  // The handler has no server-side validation, so anyone can POST an empty body and trigger an email.
  it.fails('rejects requests that are missing required fields (4xx) without sending', async () => {
    const res = await post({ message: 'spam' });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  // User input is interpolated into the HTML email unescaped.
  it.fails('escapes HTML in user-supplied fields in the HTML body', async () => {
    await post({ ...BODY, firstName: '<img src=x onerror=alert(1)>', message: '<script>alert(1)</script>' });
    const html = sendEmail.mock.calls[0][0].HtmlBody as string;
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img src=x');
  });
});
