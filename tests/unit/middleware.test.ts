// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import { config, middleware } from '@/middleware';

const run = (url: string) => middleware(new NextRequest(`http://localhost${url}`));
const setCookie = (res: Response) => res.headers.get('set-cookie') ?? '';

describe('mock-mode middleware', () => {
  it('?mock=true sets a long-lived, site-wide mock_data cookie', () => {
    const cookie = setCookie(run('/resources?mock=true'));
    expect(cookie).toContain('mock_data=true');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain(`Max-Age=${60 * 60 * 24 * 365}`);
    expect(cookie).toMatch(/SameSite=lax/i);
  });

  it('?mock=true&scenario=empty also sets the scenario cookie', () => {
    const cookie = setCookie(run('/?mock=true&scenario=empty'));
    expect(cookie).toContain('mock_data=true');
    expect(cookie).toContain('mock_scenario=empty');
  });

  it('?mock=false clears both cookies', () => {
    const cookie = setCookie(run('/?mock=false'));
    expect(cookie).toMatch(/mock_data=;/);
    expect(cookie).toMatch(/mock_scenario=;/);
  });

  it.each(['/', '/resources', '/resources?mock=maybe', '/resources?scenario=empty'])('%s does not touch cookies', (url) => {
    expect(setCookie(run(url))).toBe('');
  });

  it('skips static assets and API routes via the matcher', () => {
    const regex = new RegExp(`^${config.matcher[0]}$`);
    expect(regex.test('/resources')).toBe(true);
    expect(regex.test('/healing-journey/posts/x')).toBe(true);
    expect(regex.test('/_next/static/chunk.js')).toBe(false);
    expect(regex.test('/_next/image')).toBe(false);
    expect(regex.test('/favicon.ico')).toBe(false);
    expect(regex.test('/api/sendEmail')).toBe(false);
  });
});
