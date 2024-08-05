'use client';

import { Post } from "@/sanity/lib/queries";
import { HeroImagePreview, PostImagePreview, PostPreview } from "./PostPreview";

interface PostPreviewGridProps {
    posts?: Post[];
    view: "grid" | "list";
    page: number;
    noResultsMessage?: string;
    backgroundColor?: string;
    singleImage?: boolean;
}

export default function PostPreviewGrid({ posts, view, page, noResultsMessage, backgroundColor, singleImage }: PostPreviewGridProps) {

    if (!posts || posts.length === 0) {
        return (
            <div className="flex justify-center max-w-2xl text-center">
                <p className="body-text text-gray-600">{noResultsMessage ?? 'No posts yet...'}</p>
            </div >
        );
    }

    const [firstPost, ...otherPosts] = posts;

    // First page of grid view
    if (view === "grid" && page === 0) {

        // Single image specified, hero image + list
        if (singleImage) {
            return (
                <div className="pb-4 w-full items-center">
                    <div className="w-full mb-6 p-3">
                        <HeroImagePreview post={firstPost} backgroundColor={backgroundColor} />
                    </div>
                    <div
                        className="grid gap-3"
                    >
                        {otherPosts.map(post => (
                            <PostPreview key={post._id} post={post} backgroundColor={backgroundColor} />
                        ))}
                    </div>
                </div>
            );
        }

        // Default: hero image + grid
        return (
            <div className="pb-4 w-full items-center">
                <div className="w-full mb-6 p-3">
                    <HeroImagePreview post={firstPost} backgroundColor={backgroundColor} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {otherPosts.map(post => (
                        <PostImagePreview key={post._id} post={post} backgroundColor={backgroundColor} />
                    ))}
                </div>
            </div>
        );
    }

    if (view === "grid") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full pb-4">
                {posts.map(post => (
                    <PostImagePreview key={post._id} post={post} backgroundColor={backgroundColor} />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full p-3">
            <div
                className="grid gap-3"
            >
                {posts.map(post => (
                    <PostPreview key={post._id} post={post} backgroundColor={backgroundColor} />
                ))}
            </div>
        </div>
    );

}