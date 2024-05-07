"use server";

import { sanityFetch } from "@/sanity/lib/fetch";
import { ContentPanelsQueryResponse } from "@/sanity/lib/queries";
import { groq } from "next-sanity";
import { draftMode } from "next/headers";

export async function disableDraftMode() {
  "use server";
  await Promise.allSettled([
    draftMode().disable(),
    // Simulate a delay to show the loading state
    new Promise((resolve) => setTimeout(resolve, 1000)),
  ]);
}

export const getContentPanelsByPage = (pageId: string) => {
  const query = groq`*[_type == "contentPanel" && pageId == $pageId] | order(_createdAt asc)`;
  return sanityFetch<ContentPanelsQueryResponse>({
    query,
    params: { pageId },
  });
};