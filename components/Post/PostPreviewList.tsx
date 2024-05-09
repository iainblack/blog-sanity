'use client';

import { Post } from "@/sanity/lib/queries";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DateComponent from "../date";
import { ChevronRightIcon } from "@sanity/icons";

interface PostPreviewListProps {
    posts?: Post[];
}

export default function PostPreviewList({ posts }: PostPreviewListProps) {

    const path = usePathname();


    if (!posts || posts.length === 0) {
        return (
            <div className="flex justify-center items-center">
                <p>No posts yet...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            {posts?.map((post) => (
                <div
                    key={post._id}
                    className={`w-full min-w-2xl sm:w-2/3 md:w-3/4 xl:w-1/2 border border-gray-400 bg-white px-3 py-3 my-2 shadow-lg hover:shadow-inner hover:bg-gray-200 rounded-xl transition-shadow cursor-pointer`}
                >
                    <Link href={`${path}/posts/${post.slug}`}>
                        <div className="flex flex-col justify-center md:flex-row md:justify-between items-center">
                            <div className="flex flex-col w-[90%] justify-center items-center space-y-1 h-20 md:flex-row md:justify-start">
                                <DateComponent dateString={post.date} />
                                <div className="text-center md:text-left md:flex md:flex-col truncate max-w-full">
                                    <h2 className="text-lg truncate md:ml-10">{post.title}</h2>
                                    {post.excerpt && (
                                        <p className="text-gray-600 text-sm truncate md:ml-10">{post.excerpt}</p>
                                    )}
                                </div>
                            </div>
                            <ChevronRightIcon className="w-8 h-12 hidden md:block" />
                        </div>
                    </Link>
                </div>
            ))}
        </div >
    );
}