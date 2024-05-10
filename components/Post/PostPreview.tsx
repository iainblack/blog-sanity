'use client';
import React from 'react';
import CoverImage from '../CoverImage';
import { Post } from '@/sanity/lib/queries';
import { ChevronRightIcon, DocumentTextIcon, UserIcon } from "@sanity/icons";
import Link from 'next/link';
import DateComponent from '../date';
import { usePathname } from 'next/navigation';

interface PostPreviewProps {
    post: Post;
}

export const PostImagePreview: React.FC<PostPreviewProps> = ({ post }) => {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow hover:shadow-xl transition-shadow cursor-pointer">
            <div className="relative w-full h-48 md:h-64 xl:h-80 ">
                {post.coverImage ? (
                    <CoverImage image={post.coverImage} priority={false} />
                ) : (
                    <div className="flex items-center justify-center bg-gray-300 h-full">
                        <DocumentTextIcon className='w-12 h-12' />
                    </div>
                )}
            </div>
            <div className="p-4 h-24">
                <h2 className="text-lg font-bold truncate">{post.title}</h2>
                <p className="text-gray-600 text-sm overflow-hidden text-ellipsis">{post.excerpt}</p>
            </div >
        </div >
    );
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
    const path = usePathname();

    return (
        <div
            className={`w-full min-w-2xl sm:w-2/3 md:w-3/4 xl:w-1/2 border border-gray-400 bg-white px-3 py-3 my-2 shadow-lg hover:shadow-inner hover:bg-contrast-bg rounded-xl transition-shadow cursor-pointer`}
        >
            <Link href={`${path}/posts/${post.slug}`}>
                <div className="flex flex-col justify-center md:flex-row md:justify-between items-center">
                    <div className="flex flex-col w-full md:w-[90%] justify-center items-center min-h-20 md:flex-row md:justify-start">
                        <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                            <DateComponent dateString={post.date} />
                            {post.author?.name && (
                                <div className="flex">
                                    <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                    <div className="text-gray-600 text-sm">
                                        {post.author.name}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-full text-left md:flex md:flex-col truncate max-w-full px-4 md:px-0">
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
    );
}
