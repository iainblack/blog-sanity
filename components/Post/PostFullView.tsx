'use client';

import BackButton from "../BackButton";
import MorePosts from "../MorePosts";
import PortableText from "../portable-text";
import PostHeader from "./PostHeader";
import PostShareControls from "./PostShareControls";

interface PostFullViewProps {
    posts: {
        currentPost: any;
        previousPost: any;
        nextPost: any;
    },
    backRoute: string;
    backgroundColor?: string;
}

export default function PostFullView({ posts, backRoute, backgroundColor }: PostFullViewProps) {

    let bgClass = '';
    if (backgroundColor === 'contrast') {
        bgClass = 'bg-contrast-bg';
    }
    else if (backgroundColor === 'pink') {
        bgClass = 'bg-pink-bg';
    }

    return (
        <div className="container mx-auto py-5">
            <BackButton route={backRoute} title="All Posts" />
            <article className={`mx-auto lg:max-w-5xl p-5 md:p-8 ${bgClass ? `rounded-xl shadow-xl ${bgClass}` : ''}`}>
                <PostHeader post={posts.currentPost} />
                {posts.currentPost.content?.length
                    ? (<PortableText className="body-text hyphens-auto break-words text-justify custom-portable-text whitespace-pre-line" value={posts.currentPost.content} />)
                    : (
                        <div className="flex justify-center items-center h-full w-full">
                            <p>No content found.</p>
                        </div>
                    )}
                <div className="w-full justify-end items-center pt-3">
                    <PostShareControls post={posts.currentPost} />
                </div>
            </article>
            <MorePosts previous={posts.previousPost} next={posts.nextPost} />
        </div>);
}
