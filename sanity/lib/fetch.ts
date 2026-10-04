import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode, cookies } from "next/headers";

import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import { parseMockScenario, type MockScenario } from "./mockData";

/**
 * Resolve the active mock scenario, or null when real Sanity data should be used.
 *
 * - `MOCK_DATA=force` (used by the Playwright test server): always mock. The
 *   cookie, if present, only selects the scenario. Real Sanity is unreachable.
 * - Otherwise mock mode is a dev-only convenience, switched on by the
 *   `mock_data=true` cookie (set by middleware via `?mock=true`). It is ignored
 *   in production builds so a visitor can't swap the live site's content.
 */
async function getMockScenario(): Promise<MockScenario | null> {
  const forced = process.env.MOCK_DATA === "force";
  if (!forced && process.env.NODE_ENV === "production") return null;

  try {
    const cookieStore = await cookies();
    if (!forced && cookieStore.get("mock_data")?.value !== "true") return null;
    return parseMockScenario(cookieStore.get("mock_scenario")?.value);
  } catch {
    // cookies() throws outside a request context (e.g. generateStaticParams)
    return forced ? "default" : null;
  }
}

/**
 * Check if draft mode is enabled
 */
async function isDraftMode(): Promise<boolean> {
  try {
    const dm = await draftMode();
    return dm.isEnabled;
  } catch {
    return false;
  }
}

/**
 * Used to fetch data in Server Components, it has built in support for handling Draft Mode and perspectives.
 * When using the "published" perspective then time-based revalidation is used, set to match the time-to-live on Sanity's API CDN (60 seconds)
 * and will also fetch from the CDN.
 * When using the "previewDrafts" perspective then the data is fetched from the live API and isn't cached, it will also fetch draft content that isn't published yet.
 *
 * Mock mode (dev only): visit any page with ?mock=true (optionally
 * &scenario=empty|single|ten|eleven|many) and ?mock=false to turn it off.
 * See getMockScenario above.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective,
  stega,
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  stega?: boolean;
}): Promise<QueryResponse> {
  const mockScenario = await getMockScenario();
  if (mockScenario) {
    const { runMockQuery } = await import("./mockData");
    return runMockQuery<QueryResponse>(query, params, mockScenario);
  }

  // Resolve perspective
  let resolvedPerspective: "published" | "previewDrafts";
  if (perspective) {
    resolvedPerspective = perspective as "published" | "previewDrafts";
  } else {
    resolvedPerspective = (await isDraftMode()) ? "previewDrafts" : "published";
  }

  // Resolve stega
  const resolvedStega = stega ?? (resolvedPerspective === "previewDrafts" || process.env.VERCEL_ENV === "preview");

  if (resolvedPerspective === "previewDrafts") {
    return client.fetch<QueryResponse>(query, params, {
      stega: resolvedStega,
      perspective: "previewDrafts",
      token,
      useCdn: false,
      next: { revalidate: 0 },
    });
  }

  return client.fetch<QueryResponse>(query, params, {
    stega: resolvedStega,
    perspective: "published",
    useCdn: true,
    next: { revalidate: 60 },
  });
}
