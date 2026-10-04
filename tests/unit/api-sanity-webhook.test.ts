// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { sanityFetch, sendEmailBatch, firestoreGet, where } = vi.hoisted(() => {
  const firestoreGet = vi.fn();
  return { sanityFetch: vi.fn(), sendEmailBatch: vi.fn(), firestoreGet, where: vi.fn(() => ({ get: firestoreGet })) };
});
vi.mock('@sanity/client', () => ({ createClient: () => ({ fetch: sanityFetch }) }));
vi.mock('postmark', () => ({ ServerClient: class { sendEmailBatch = sendEmailBatch; } }));
vi.mock('@/components/Firebase/FirebaseConfig', () => ({ db: { collection: () => ({ where }) } }));

import { POST } from '@/app/api/sanityWebhook/route';

const POST_DOC = { _id: 'p1', title: 'New Post', slug: { current: 'new-post' }, pageId: "Lou's Healing Journey", excerpt: 'An excerpt' };
const post = (body: unknown, raw = false) =>
  POST(new NextRequest('http://localhost/api/sanityWebhook', { method: 'POST', body: raw ? (body as string) : JSON.stringify(body) }));
const snapshotOf = (emails: string[]) => ({ forEach: (fn: (d: { data: () => { email: string } }) => void) => emails.forEach((email) => fn({ data: () => ({ email }) })) });

beforeEach(() => {
  sanityFetch.mockReset().mockResolvedValue(POST_DOC);
  sendEmailBatch.mockReset().mockResolvedValue([]);
  firestoreGet.mockReset().mockResolvedValue(snapshotOf(['a@example.com', 'b@example.com']));
  where.mockClear();
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/sanityWebhook', () => {
  it('400 when the payload has no _id; nothing is fetched or sent', async () => {
    const res = await post({});
    expect(res.status).toBe(400);
    expect(sanityFetch).not.toHaveBeenCalled();
    expect(sendEmailBatch).not.toHaveBeenCalled();
  });

  it('404 when the post does not exist', async () => {
    sanityFetch.mockResolvedValue(null);
    const res = await post({ _id: 'missing' });
    expect(res.status).toBe(404);
    expect(sendEmailBatch).not.toHaveBeenCalled();
  });

  it('200 and no email when nobody subscribed to that section', async () => {
    firestoreGet.mockResolvedValue(snapshotOf([]));
    const res = await post({ _id: 'p1' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: 'No subscribers to notify' });
    expect(sendEmailBatch).not.toHaveBeenCalled();
  });

  it('looks up the post by id and subscribers by the post\'s section preference', async () => {
    await post({ _id: 'p1' });
    expect(sanityFetch).toHaveBeenCalledWith(expect.stringContaining('_id == $postId'), { postId: 'p1' });
    expect(where).toHaveBeenCalledWith("preferences.Lou's Healing Journey", '==', true);
  });

  it('sends one broadcast email per subscriber with a link to the post and a manage-preferences link', async () => {
    const res = await post({ _id: 'p1' });
    expect(res.status).toBe(200);
    expect(sendEmailBatch).toHaveBeenCalledTimes(1);
    const batch = sendEmailBatch.mock.calls[0][0];
    expect(batch.map((m: any) => m.To)).toEqual(['a@example.com', 'b@example.com']);
    for (const mail of batch) {
      expect(mail.MessageStream).toBe('broadcast');
      expect(mail.From).toBe('unit@example.invalid');
      expect(mail.Subject).toBe("New Post from Lou's Blog: Lou's Healing Journey");
      expect(mail.HtmlBody).toContain('http://localhost:3000/healing-journey/posts/new-post');
      expect(mail.HtmlBody).toContain(`manage-email-preferences?email=${mail.To}`);
      expect(mail.HtmlBody).toContain('New Post');
      expect(mail.HtmlBody).toContain('An excerpt');
    }
  });

  it('omits the excerpt paragraph when the post has none', async () => {
    sanityFetch.mockResolvedValue({ ...POST_DOC, excerpt: null });
    await post({ _id: 'p1' });
    expect(sendEmailBatch.mock.calls[0][0][0].HtmlBody).not.toContain('null');
  });

  it('500 when Sanity, Firestore or Postmark fails; malformed JSON is also a 500', async () => {
    sanityFetch.mockRejectedValueOnce(new Error('x'));
    expect((await post({ _id: 'p1' })).status).toBe(500);
    firestoreGet.mockRejectedValueOnce(new Error('x'));
    expect((await post({ _id: 'p1' })).status).toBe(500);
    sendEmailBatch.mockRejectedValueOnce(new Error('x'));
    expect((await post({ _id: 'p1' })).status).toBe(500);
    expect((await post('{bad', true)).status).toBe(500);
  });

  // SECURITY: the endpoint is public and unauthenticated. Anyone who knows (or guesses) a post _id can
  // trigger a real email blast to every subscriber, repeatedly. Sanity webhooks support a signing secret.
  it.fails('requires a valid webhook signature before sending anything', async () => {
    const res = await post({ _id: 'p1' });
    expect([401, 403]).toContain(res.status);
    expect(sendEmailBatch).not.toHaveBeenCalled();
  });
});
