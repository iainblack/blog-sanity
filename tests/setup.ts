import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach, vi } from 'vitest';

/**
 * Unit tests must never touch the network (Sanity, Firebase, Postmark, anything).
 * Any attempt to use fetch fails the test loudly instead of silently reaching production.
 */
beforeEach(() => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: unknown) => {
      throw new Error(`Network access is disabled in unit tests (fetch ${String(input)})`);
    }),
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});
