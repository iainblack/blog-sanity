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

// Recommended Resource Link
export interface ExternalLink {
  _id: string;
  url: string;
  title: string;
}

export const externalLinkFields = groq`
  _id,
  url,
  title,
`;

export const externalLinksQuery = groq`*[_type == "externalLink"] | order(title asc) { ${externalLinkFields} }`;
/// AUTHOR
export interface Author {
  name: string;
  picture?: (Image & { alt?: string | null }) | null;
}

/// POSTS
export interface Post {
  _id: string;
  _createdAt: string;
  pageId: string;
  status: "draft" | "published";
  title: string;
  content: PortableTextBlock[];
  slug: string;
  excerpt?: string | null;
  coverImage?: (Image & { alt?: string }) | null;
  date: string;
  author?: Author | null;
}

export const postFields = groq`
  _id,
  _createdAt,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  content,
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

/// CONTENT PANEL
export interface ContentPanel {
  _id: string;
  _createdAt: string;
  image?: (Image & { alt?: string, position?: "left" | "right" }) | null;
  title?: string;
  content: PortableTextBlock[];
  size: "normal" | "large" | "xl";
  pageId: string;
}

export type ContentPanelsQueryResponse = ContentPanel[] | null;
