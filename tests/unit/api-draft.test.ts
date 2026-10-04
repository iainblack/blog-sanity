// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { validatePreviewUrl, enable, redirect } = vi.hoisted(() => ({
  validatePreviewUrl: vi.fn(),
  enable: vi.fn(),
  redirect: vi.fn((to: string) => { throw new Error(`REDIRECT:${to}`); }),
}));
vi.mock('@sanity/preview-url-secret', () => ({ validatePreviewUrl }));
vi.mock('next/headers', () => ({ draftMode: () => ({ enable }) }));
vi.mock('next/navigation', () => ({ redirect }));
vi.mock('@/sanity/lib/client', () => ({ client: { withConfig: () => ({}) } }));
vi.mock('@/sanity/lib/token', () => ({ token: 't' }));

import { GET } from '@/app/api/draft/route';

beforeEach(() => {
  validatePreviewUrl.mockReset();
  enable.mockReset();
});

describe('GET /api/draft', () => {
  it('401s and does not enable draft mode when the secret is invalid', async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: false });
    const res = await GET(new Request('http://localhost/api/draft?sanity-preview-secret=bad'));
    expect(res.status).toBe(401);
    expect(await res.text()).toBe('Invalid secret');
    expect(enable).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it('enables draft mode and redirects to the requested page when the secret is valid', async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: true, redirectTo: '/healing-journey' });
    await expect(GET(new Request('http://localhost/api/draft?x=1'))).rejects.toThrow('REDIRECT:/healing-journey');
    expect(enable).toHaveBeenCalledTimes(1);
  });

  it('redirects to / when no target is given', async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: true });
    await expect(GET(new Request('http://localhost/api/draft'))).rejects.toThrow('REDIRECT:/');
  });
});
