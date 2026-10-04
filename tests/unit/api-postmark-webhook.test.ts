// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { isOnSubscriberList, removeFromSubscriberList } = vi.hoisted(() => ({
  isOnSubscriberList: vi.fn(),
  removeFromSubscriberList: vi.fn(),
}));
vi.mock('@/utils/FirebaseUtils', () => ({ isOnSubscriberList, removeFromSubscriberList }));

import { POST } from '@/app/api/postmarkWebhook/route';

const post = (body: unknown, raw = false) =>
  POST(new NextRequest('http://localhost/api/postmarkWebhook', { method: 'POST', body: raw ? (body as string) : JSON.stringify(body) }));

beforeEach(() => {
  isOnSubscriberList.mockReset().mockResolvedValue(true);
  removeFromSubscriberList.mockReset().mockResolvedValue(true);
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/postmarkWebhook', () => {
  it('unsubscribe event for a known subscriber removes them from the subscriber list', async () => {
    const res = await post({ RecordType: 'SubscriptionChange', Recipient: 'a@example.com', SuppressSending: true });
    expect(res.status).toBe(200);
    expect(isOnSubscriberList).toHaveBeenCalledWith('a@example.com');
    expect(removeFromSubscriberList).toHaveBeenCalledWith('a@example.com');
  });

  it('unsubscribe event for an unknown email removes nothing', async () => {
    isOnSubscriberList.mockResolvedValue(false);
    const res = await post({ RecordType: 'SubscriptionChange', Recipient: 'ghost@example.com', SuppressSending: true });
    expect(res.status).toBe(200);
    expect(removeFromSubscriberList).not.toHaveBeenCalled();
  });

  it('a re-subscribe event (SuppressSending=false) does not remove anyone', async () => {
    const res = await post({ RecordType: 'SubscriptionChange', Recipient: 'a@example.com', SuppressSending: false });
    expect(res.status).toBe(200);
    expect(isOnSubscriberList).not.toHaveBeenCalled();
    expect(removeFromSubscriberList).not.toHaveBeenCalled();
  });

  it('unhandled record types are acknowledged and ignored', async () => {
    const res = await post({ RecordType: 'Bounce', Recipient: 'a@example.com' });
    expect(res.status).toBe(200);
    expect(removeFromSubscriberList).not.toHaveBeenCalled();
  });

  it('returns 500 on a malformed body or a Firebase failure', async () => {
    expect((await post('nope', true)).status).toBe(500);
    isOnSubscriberList.mockRejectedValue(new Error('firestore down'));
    expect((await post({ RecordType: 'SubscriptionChange', Recipient: 'a@example.com', SuppressSending: true })).status).toBe(500);
  });

  // BEHAVIOR.md: "Requires valid POSTMARK_WEBHOOK_SECRET". The handler checks no secret, so anyone can
  // unsubscribe any address by POSTing to this public endpoint.
  it.fails('rejects requests that do not carry the webhook secret (401/403) and changes nothing', async () => {
    const res = await post({ RecordType: 'SubscriptionChange', Recipient: 'victim@example.com', SuppressSending: true });
    expect([401, 403]).toContain(res.status);
    expect(removeFromSubscriberList).not.toHaveBeenCalled();
  });
});
