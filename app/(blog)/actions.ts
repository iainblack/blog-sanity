"use server";

import { sanityFetch } from "@/sanity/lib/fetch";
import { ContentPanelsQueryResponse, GalleryImage, Post, Resource, postFields, resourceFields } from "@/sanity/lib/queries";
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


export const getResources = async (types: string[], search: string, limit: number, offset: number) => {
  const searchFilter = search ? `&& title match $search` : '';
  console.log(types);
  const query = groq`*[_type == "resource" && type in $types ${searchFilter}] | order(_createdAt desc) [${offset}...${offset + limit}] {
    ${resourceFields}
  }`;
  return sanityFetch<Resource[] | undefined>({
    query,
    params: { types, search: search ? `*${search}*` : '' },
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
};

export const getGalleryImagesByPage = async (pageId: string) => {
  const query = groq`*[_type == "galleryImage" && pageId == $pageId] | order(_createdAt desc) {
    _id,
    picture {
      asset -> {
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
      alt
    }
  }`;

  return sanityFetch<GalleryImage[]> ({
    query,
    params: { pageId },
  });
}

export const getPostAndNeighbors = async (slug: string, pageId: string) => {
  // Fetch current post first
  const currentPostQuery = groq`*[_type == "post" && slug.current == $slug && pageId == $pageId][0] {
    ${postFields}
  }`;
  const currentPost = await sanityFetch<Post>({
    query: currentPostQuery,
    params: { slug, pageId },
  });

  if (!currentPost) return { currentPost: null, previousPost: null, nextPost: null };

  const previousPostQuery = groq`*[_type == "post" && pageId == $pageId && _createdAt < $currentDate] | order(_createdAt desc)[0] {
    ${postFields}
  }`;
  const nextPostQuery = groq`*[_type == "post" && pageId == $pageId && _createdAt > $currentDate] | order(_createdAt asc)[0] {
    ${postFields}
  }`;

  const [previousPost, nextPost] = await Promise.all([
    sanityFetch<Post>({ query: previousPostQuery, params: { pageId, currentDate: currentPost._createdAt } }),
    sanityFetch<Post>({ query: nextPostQuery, params: { pageId, currentDate: currentPost._createdAt } })
  ]);

  return {
    currentPost,
    previousPost,
    nextPost,
  };
}

