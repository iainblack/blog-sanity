'use client';
import React from 'react';
import CoverImage from '../CoverImage';
import { Post } from '@/sanity/lib/queries';
import { ChevronRightIcon, DocumentTextIcon, UserIcon } from "@sanity/icons";
import Link from 'next/link';
import DateComponent from '../date';
import { usePathname } from 'next/navigation';
import PortableText from '../portable-text';

interface PostPreviewProps {
    post: Post;
}

export const HeroImagePreview: React.FC<PostPreviewProps> = ({ post }) => {
    const path = usePathname();

    return (
        <div className="p-4 shadow overflow-hidden cursor-pointer w-full rounded-lg border border-black">
            <Link href={`${path}/posts/${post.slug}`} className="w-full block">
                <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/2 h-52 md:h-64 lg:h-96 rounded-lg overflow-hidden object-cover">
                        {post.coverImage ? (
                            <CoverImage image={post.coverImage} priority={true} />
                        ) : (
                            <div className="flex items-center justify-center bg-gray-300 h-full rounded-lg">
                                <DocumentTextIcon className="w-12 h-12" />
                            </div>
                        )}
                    </div>
                    <div className="md:w-1/2 md:pl-4 flex flex-col">
                        <div className="py-4 md:py-0 space-y-3 lg:space-y-8">
                            <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                <DateComponent icon dateString={post.date} />
                                {post.author?.name && (
                                    <div className="flex items-center">
                                        <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                        <div className="text-gray-600 text-sm">
                                            {post.author.name}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h2 className="text-2xl font-bold truncate">{post.title}</h2>
                            <div className='text-body text-sm overflow-hidden text-ellipsis truncate-lines'>
                                <PortableText value={post.content} />
                            </div>
                            <div>
                                <Link href={`${path}/posts/${post.slug}`} className='pt-4'>
                                    <span className="text-blue-500 font-bold">Read More</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
export const PostImagePreview: React.FC<PostPreviewProps> = ({ post }) => {
    const path = usePathname();

    return (
        <div className={`p-3 overflow-hidden transition-colors cursor-pointer shadow w-full rounded-lg border border-transparent hover:shadow-xl hover:border-black`}>
            <Link href={`${path}/posts/${post.slug}`} className='w-full'>
                <div className={`relative w-full h-52 rounded-lg overflow-hidden object-cover`}>
                    {post.coverImage ? (
                        <CoverImage image={post.coverImage} priority={false} />
                    ) : (
                        <div className="flex items-center justify-center bg-gray-300 h-full rounded-lg">
                            <DocumentTextIcon className='w-12 h-12' />
                        </div>
                    )}
                </div>
                <div className={`py-4 h-24`}>
                    <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                        <DateComponent dateString={post.date} />
                    </div>
                    <h2 className="text-lg font-bold truncate">{post.title}</h2>
                    <p className="text-gray-600 text-sm overflow-hidden text-ellipsis">{post.excerpt}</p>
                </div>
            </Link>
        </div>
    );
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
    const path = usePathname();

    return (
        <div className="w-full flex items-center justify-between p-4 my-2 border border-black md:border-slate-200 rounded-xl shadow transition-colors cursor-pointer hover:border-black lg:max-w-md xl:max-w-2xl min-h-[80px]">
            <Link href={`${path}/posts/${post.slug}`} className='w-full h-full flex flex-col justify-between'>
                <div className="flex flex-col md:flex-row justify-between items-center h-full">
                    <div className="flex flex-col md:flex-row items-start md:items-center w-full md:w-auto md:mr-4">
                        <div className="text-left pb-3 md:pb-0 md:flex md:flex-col truncate">
                            <DateComponent icon dateString={post.date} />
                            {post.author?.name && (
                                <div className="flex items-center mt-2 md:mt-0">
                                    <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                    <div className="text-gray-600 text-sm">{post.author.name}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col w-full text-left max-w-xs px-4 md:px-0 md:ml-10 md:flex-grow truncate">
                        <h2 className="text-lg truncate">{post.title}</h2>
                        <p className="text-gray-600 text-sm truncate flex-grow">{post.excerpt}</p>
                    </div>
                    <ChevronRightIcon className="w-8 h-8 hidden md:block" />
                </div>
            </Link>
        </div>
    );
}
