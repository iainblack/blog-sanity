import type { Metadata, ResolvingMetadata } from "next";
import { groq } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import Avatar from "../../../../components/avatar";
import CoverImage from "../../../../components/CoverImage";
import DateComponent from "../../../../components/date";
import MoreStories from "../../../../components/more-stories";
import PortableText from "../../../../components/portable-text";

import { sanityFetch } from "@/sanity/lib/fetch";
import {
  SettingsQueryResponse,
  settingsQuery,
} from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import * as demo from "@/sanity/lib/demo";

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

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata,
// ): Promise<Metadata> {
//   const post = await sanityFetch<PostQueryResponse>({
//     query: postQuery,
//     params,
//     stega: false,
//   });
//   const previousImages = (await parent).openGraph?.images || [];
//   const ogImage = resolveOpenGraphImage(post?.coverImage);

//   return {
//     authors: post?.author?.name ? [{ name: post?.author?.name }] : [],
//     title: post?.title,
//     description: post?.excerpt,
//     openGraph: {
//       images: ogImage ? [ogImage, ...previousImages] : previousImages,
//     },
//   } satisfies Metadata;
// }

export default async function PostPage({ params }: Props) {
  // const [post, settings] = await Promise.all([
  //   sanityFetch<PostQueryResponse>({
  //     query: postQuery,
  //     params,
  //   }),
  //   sanityFetch<SettingsQueryResponse>({
  //     query: settingsQuery,
  //   }),
  // ]);

  // if (!post?._id) {
  //   return notFound();
  // }

  return (
    <></>
    // <div className="container mx-auto px-5">
    //   <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
    //     <Link href="/" className="hover:underline">
    //       {settings?.title || demo.title}
    //     </Link>
    //   </h2>
    //   <article className="mx-auto max-w-4xl">
    //     {/* <div className="hidden md:mb-12 md:block">
    //       {post.author && (
    //         <Avatar name={post.author.name} picture={post.author.picture} />
    //       )}
    //     </div> */}
    //     {/* <div className="mb-8 sm:mx-0 md:mb-16">
    //       <CoverImage image={post.coverImage} priority />
    //     </div> */}
    //     <div className="max-w-4xl">
    //       <div className="mb-6 block md:hidden">
    //         {post.author && (
    //           <Avatar name={post.author.name} picture={post.author.picture} />
    //         )}
    //       </div>
    //       <div className="mb-6 text-lg">
    //         <div className="mb-4 text-lg">
    //           <DateComponent dateString={post.date} />
    //         </div>
    //       </div>
    //     </div>
    //     <h5 className="mb-8 text-4xl font-bold leading-tight tracking-tighter md:text-6xl">
    //       {post.title}
    //     </h5>
    //     {post.content?.length && (
    //       <PortableText className="mx-auto max-w-4xl" value={post.content} />
    //     )}
    //   </article>
    //   <aside>
    //     <hr className="border-accent-2 mb-24 mt-28" />
    //     <h2 className="mb-16 mt-10 text-2xl font-bold leading-tight tracking-tight md:text-4xl md:tracking-tighter">
    //       More Stories
    //     </h2>
    //     <Suspense>
    //       <MoreStories skip={post._id} limit={2} />
    //     </Suspense>
    //   </aside>
    // </div>
  );
}
