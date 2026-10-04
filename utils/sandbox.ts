/**
 * Sandbox mode (MOCK_DATA=force, i.e. `npm run dev:local` and the E2E server): the email and
 * subscriber write paths use these in-memory fakes instead of Postmark / Firebase.
 * State lives for the life of the dev server process.
 */
export const isSandbox = process.env.MOCK_DATA === "force";

export const sandboxSubscribers = new Map<string, { [key: string]: boolean }>();
export const sandboxSuppressed = new Set<string>();
