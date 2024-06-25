import type { Metadata, ResolvingMetadata } from "next";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/fetch";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { getPostAndNeighbors } from "@/app/(blog)/actions";
import PostFullView from "@/components/Post/PostFullView";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return sanityFetch<{ slug: string }[]>({
    query: groq`*[_type == "post" && defined(slug.current)]{"slug": slug.current}`,
    perspective: "published",
    stega: false,
  });
}

export async function generateMetadata(
  { params: { slug } }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const neighbors = await getPostAndNeighbors(slug, "Messages for Humanity");
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(neighbors.currentPost?.coverImage);

  return {
    authors: neighbors.currentPost?.author?.name ? [{ name: neighbors.currentPost?.author?.name }] : [],
    title: neighbors.currentPost?.title,
    description: neighbors.currentPost?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage({ params: { slug } }: Props) {

  const posts = await getPostAndNeighbors(slug, "Messages for Humanity");

  if (!posts.currentPost?._id) {
    return notFound();
  }

  return (
    <PostFullView posts={posts} backRoute="/messages-for-humanity" variantColor />
  );
}
