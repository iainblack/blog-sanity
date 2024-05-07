import { groq, type PortableTextBlock } from "next-sanity";
import type { Image } from "sanity";


/// SETTINGS
export const settingsQuery = groq`*[_type == "settings"][0]`;
export interface SettingsQueryResponse {
  title?: string;
  description?: PortableTextBlock[];
  footer?: PortableTextBlock[];
  ogImage?: (Image & { alt?: string; metadataBase?: string }) | null;
}

/// AUTHOR
export interface Author {
  name: string;
  picture?: (Image & { alt?: string | null }) | null;
}

/// POSTS
export interface Post {
  _id: string;
  status: "draft" | "published";
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: (Image & { alt?: string }) | null;
  date: string;
  author?: Author | null;
}

const postFields = groq`
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

export const heroQuery = groq`*[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
  content,
  ${postFields}
}`;
export type HeroQueryResponse =
  | (Post & {
      content?: PortableTextBlock[] | null;
    })
  | null;

export const moreStoriesQuery = groq`*[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
  ${postFields}
}`;
export type MoreStoriesQueryResponse = Post[] | null;

export const postQuery = groq`*[_type == "post" && slug.current == $slug] [0] {
  content,
  ${postFields}
}`;
export type PostQueryResponse =
  | (Post & {
      content?: PortableTextBlock[] | null;
    })
  | null;


/// CONTENT PANEL
export interface ContentPanel {
  _id: string;
  image?: (Image & { alt?: string, position?: "left" | "right" }) | null;
  title?: string;
  content: PortableTextBlock[];
  size: "normal" | "large" | "xl";
  pageId: string;
}

const contentPanelFields = groq`
  _id,
  image,
  title,
  content,
  size,
`;
export function contentPanelQuery(pageId: string) {
  return groq`*[_type == "contentPanel" && pageId == $pageId] | order(_createdAt asc){
    ${contentPanelFields}
  }`;
}
export const contentPanelsQuery = groq`*[_type == "contentPanel"] | order(_createdAt asc){
  ${contentPanelFields}
}`;

export type ContentPanelsQueryResponse = ContentPanel[] | null;
