import type { ClientPerspective, QueryParams } from "next-sanity";
import { draftMode, cookies } from "next/headers";

import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import { getMockData } from "./mockData";

/**
 * Check if mock data mode is enabled via cookie
 */
async function isMockMode(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get("mock_data")?.value === "true";
  } catch {
    // cookies() throws when called outside a request context (e.g., during generateStaticParams)
    return false;
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
 * To enable mock mode for development/testing, add a cookie:
 *   document.cookie = "mock_data=true; path=/"
 * To disable:
 *   document.cookie = "mock_data=false; path=/"
 * Or use ?mock=true in URL (handled by middleware).
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective,
  stega,
  pageId,
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  stega?: boolean;
  pageId?: string;
}): Promise<QueryResponse> {
  // Check for mock mode
  const mockMode = await isMockMode();

  // Use mock data if enabled
  if (mockMode) {
    const mockData = getMockData(query, pageId);
    return mockData as QueryResponse;
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
