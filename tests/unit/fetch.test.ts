// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * sanityFetch decides between the REAL Sanity client and the mock dataset. This is the
 * safety mechanism behind "tests never touch production", so it is tested directly.
 */
const clientFetch = vi.fn(async () => 'REAL');
vi.mock('@/sanity/lib/client', () => ({ client: { fetch: (...args: unknown[]) => (clientFetch as any)(...args) } }));
vi.mock('@/sanity/lib/token', () => ({ token: 'tok' }));

let cookieJar: Record<string, string> = {};
let cookiesThrow = false;
let draft = false;
vi.mock('next/headers', () => ({
  cookies: async () => {
    if (cookiesThrow) throw new Error('outside request scope');
    return { get: (name: string) => (name in cookieJar ? { name, value: cookieJar[name] } : undefined) };
  },
  draftMode: async () => ({ isEnabled: draft }),
}));

import { sanityFetch } from '@/sanity/lib/fetch';

const POST_COUNT = 'count(*[_type == "post"])';
const env = process.env as Record<string, string | undefined>;
const original = { MOCK_DATA: env.MOCK_DATA, NODE_ENV: env.NODE_ENV, VERCEL_ENV: env.VERCEL_ENV };

beforeEach(() => {
  clientFetch.mockClear();
  cookieJar = {};
  cookiesThrow = false;
  draft = false;
  delete env.MOCK_DATA;
  delete env.VERCEL_ENV;
  env.NODE_ENV = 'development';
});
afterEach(() => {
  for (const [key, value] of Object.entries(original)) {
    if (value === undefined) delete env[key];
    else env[key] = value;
  }
});

describe('sanityFetch: mock vs real', () => {
  it('without mock mode, uses the real client with published perspective + CDN + 60s revalidate', async () => {
    expect(await sanityFetch({ query: POST_COUNT })).toBe('REAL');
    expect(clientFetch).toHaveBeenCalledWith(POST_COUNT, {}, expect.objectContaining({ perspective: 'published', useCdn: true, next: { revalidate: 60 } }));
  });

  it('in dev, the mock_data=true cookie serves mock data and never calls the client', async () => {
    cookieJar = { mock_data: 'true' };
    expect(await sanityFetch<number>({ query: POST_COUNT })).toBe(33); // 11 posts x 3 sections
    expect(clientFetch).not.toHaveBeenCalled();
  });

  it('a mock_data cookie with any other value does not enable mock mode', async () => {
    for (const value of ['false', '1', 'TRUE', '']) {
      cookieJar = { mock_data: value };
      expect(await sanityFetch({ query: POST_COUNT })).toBe('REAL');
    }
  });

  it('the mock_data cookie is IGNORED in production builds (visitors cannot swap site content)', async () => {
    env.NODE_ENV = 'production';
    cookieJar = { mock_data: 'true' };
    expect(await sanityFetch({ query: POST_COUNT })).toBe('REAL');
    expect(clientFetch).toHaveBeenCalledTimes(1);
  });

  it('mock_scenario selects the dataset; unknown scenarios fall back to default', async () => {
    cookieJar = { mock_data: 'true', mock_scenario: 'empty' };
    expect(await sanityFetch<number>({ query: POST_COUNT })).toBe(0);
    cookieJar = { mock_data: 'true', mock_scenario: 'many' };
    expect(await sanityFetch<number>({ query: POST_COUNT })).toBe(90);
    cookieJar = { mock_data: 'true', mock_scenario: 'bogus' };
    expect(await sanityFetch<number>({ query: POST_COUNT })).toBe(33);
  });

  it('passes query params through to the mock query', async () => {
    cookieJar = { mock_data: 'true' };
    const count = await sanityFetch<number>({ query: 'count(*[_type == "post" && pageId == $pageId])', params: { pageId: 'Additional Topics' } });
    expect(count).toBe(11);
  });

  describe('MOCK_DATA=force (used by the E2E server)', () => {
    beforeEach(() => {
      env.MOCK_DATA = 'force';
    });

    it('is always mock - even with no cookie, so real Sanity cannot be reached', async () => {
      expect(await sanityFetch<number>({ query: POST_COUNT })).toBe(33);
      expect(clientFetch).not.toHaveBeenCalled();
    });

    it('stays mock outside a request scope (cookies() throws)', async () => {
      cookiesThrow = true;
      expect(await sanityFetch<number>({ query: POST_COUNT })).toBe(33);
      expect(clientFetch).not.toHaveBeenCalled();
    });

    it('is mock even if NODE_ENV=production and even in draft mode', async () => {
      env.NODE_ENV = 'production';
      draft = true;
      expect(await sanityFetch<number>({ query: POST_COUNT })).toBe(33);
      expect(clientFetch).not.toHaveBeenCalled();
    });

    it('the scenario cookie still selects the dataset, without needing mock_data', async () => {
      cookieJar = { mock_scenario: 'single' };
      expect(await sanityFetch<number>({ query: POST_COUNT })).toBe(3);
    });
  });
});

describe('sanityFetch: real-client behaviour (perspectives)', () => {
  it('draft mode uses previewDrafts with the token, no CDN and no caching, with stega on', async () => {
    draft = true;
    await sanityFetch({ query: POST_COUNT });
    expect(clientFetch).toHaveBeenCalledWith(POST_COUNT, {}, { stega: true, perspective: 'previewDrafts', token: 'tok', useCdn: false, next: { revalidate: 0 } });
  });

  it('an explicit perspective wins over draft mode', async () => {
    draft = true;
    await sanityFetch({ query: POST_COUNT, perspective: 'published' });
    expect(clientFetch).toHaveBeenCalledWith(POST_COUNT, {}, expect.objectContaining({ perspective: 'published', useCdn: true }));
  });

  it('stega defaults off for published, on for Vercel preview deployments, and can be forced', async () => {
    await sanityFetch({ query: POST_COUNT });
    expect(clientFetch).toHaveBeenLastCalledWith(POST_COUNT, {}, expect.objectContaining({ stega: false }));
    env.VERCEL_ENV = 'preview';
    await sanityFetch({ query: POST_COUNT });
    expect(clientFetch).toHaveBeenLastCalledWith(POST_COUNT, {}, expect.objectContaining({ stega: true }));
    await sanityFetch({ query: POST_COUNT, stega: false });
    expect(clientFetch).toHaveBeenLastCalledWith(POST_COUNT, {}, expect.objectContaining({ stega: false }));
  });

  it('falls back to published when draftMode() throws (e.g. generateStaticParams)', async () => {
    vi.resetModules();
    vi.doMock('next/headers', () => ({ cookies: async () => { throw new Error('x'); }, draftMode: async () => { throw new Error('x'); } }));
    const { sanityFetch: isolated } = await import('@/sanity/lib/fetch');
    await isolated({ query: POST_COUNT });
    expect(clientFetch).toHaveBeenCalledWith(POST_COUNT, {}, expect.objectContaining({ perspective: 'published' }));
    vi.doUnmock('next/headers');
  });
});
