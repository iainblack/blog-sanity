"use server";

import { sanityFetch } from "@/sanity/lib/fetch";
import { ContentPanelsQueryResponse, Post, postFields } from "@/sanity/lib/queries";
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

export const getPostsByPage = async (pageId: string, order: string = 'desc', offset: number = 0, limit: number = 10) => {
  const query = groq`*[_type == "post" && pageId == $pageId] | order(date ${order}, _updatedAt ${order})[${offset}...${offset + limit}] {
    ${postFields}
  }`;
  
  const totalQuery = groq`count(*[_type == "post" && pageId == $pageId])`;

  const posts = await sanityFetch<Post[] | undefined>({
    query,
    params: { pageId },
  });

  const total = await sanityFetch<number>({
    query: totalQuery,
    params: { pageId },
  });

  return { posts, totalPosts: total };
}
