import { emailPreferenceOptions } from "../components/utils";

/**
 * Sandbox mode (MOCK_DATA=force, i.e. `npm run dev:local` and the E2E server): the email and
 * subscriber write paths use these in-memory fakes instead of Postmark / Firebase.
 * State lives for the life of the dev server process.
 */
export const isSandbox = process.env.MOCK_DATA === "force";

/**
 * Dummy account that always exists in the sandbox, so the Update Preferences page
 * (existing accounts only) can be tried without signing up first. Restarting the
 * server restores it, even if it was unsubscribed.
 */
export const SANDBOX_SUBSCRIBER_EMAIL = "subscriber@example.com";

const seed: [string, { [key: string]: boolean }][] = isSandbox
  ? [[SANDBOX_SUBSCRIBER_EMAIL, Object.fromEntries(emailPreferenceOptions.map((option) => [option, true]))]]
  : [];

export const sandboxSubscribers = new Map<string, { [key: string]: boolean }>(seed);
export const sandboxSuppressed = new Set<string>();
