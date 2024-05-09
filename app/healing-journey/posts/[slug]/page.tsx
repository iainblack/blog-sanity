import type { Metadata, ResolvingMetadata } from "next";
import { groq } from "next-sanity";
import { notFound } from "next/navigation";
import { UserIcon } from '@sanity/icons'
import CoverImage from "../../../../components/CoverImage";
import DateComponent from "../../../../components/date";
import PortableText from "../../../../components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { getPostAndNeighbors } from "@/app/actions";
import PostHeader from "@/components/Post/PostHeader";
import MorePosts from "@/components/MorePosts";

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

  console.log(posts);

  return (
    <div className="container mx-auto px-5">
      {/* <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
        <Link href="/" className="hover:underline">
          {post.title}
        </Link>
      </h2> */}
      <article className="mx-auto max-w-4xl">
        <PostHeader post={posts.currentPost} />
        {posts.currentPost.content?.length && (
          <PortableText className="mx-auto max-w-4xl" value={posts.currentPost.content} />
        )}
      </article>
      <MorePosts previous={posts.previousPost} next={posts.nextPost} />
    </div>
  );
}
