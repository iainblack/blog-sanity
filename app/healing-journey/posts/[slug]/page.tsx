import type { Metadata, ResolvingMetadata } from "next";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import PortableText from "../../../../components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { getPostAndNeighbors } from "@/app/actions";
import PostHeader from "@/components/Post/PostHeader";
import MorePosts from "@/components/MorePosts";
import BackButton from "@/components/BackButton";

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
  const neighbors = await getPostAndNeighbors(slug, "Lou's Healing Journey");
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

  const posts = await getPostAndNeighbors(slug, "Lou's Healing Journey");

  if (!posts.currentPost?._id) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-5 relative py-5">
      <BackButton route="/healing-journey" title="All Posts" />
      <article className="mx-auto max-w-4xl min-h-[50vh]">
        <PostHeader post={posts.currentPost} />
        {posts.currentPost.content?.length
          ? (<PortableText className="mx-auto max-w-4xl body-text" value={posts.currentPost.content} />)
          : (
            <div className="flex justify-center items-center h-full w-full">
              <p>No content found! :/</p>
            </div>
          )}
      </article>
      <MorePosts previous={posts.previousPost} next={posts.nextPost} />
    </div>
  );
}
