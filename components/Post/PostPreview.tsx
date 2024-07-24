'use client';
import React from 'react';
import NextImage from '../NextImage';
import { Post } from '@/sanity/lib/queries';
import { ChevronRightIcon, DocumentTextIcon, UserIcon } from "@sanity/icons";
import Link from 'next/link';
import DateComponent from '../DateComponent';
import { usePathname } from 'next/navigation';
import PortableText from '../portable-text';

interface PostPreviewProps {
    post: Post;
    backgroundColor?: string;
}

export const HeroImagePreview: React.FC<PostPreviewProps> = ({ post, backgroundColor }) => {
    const path = usePathname();
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    let bgClass = '';

    if (backgroundColor === 'contrast') {
        bgClass = 'bg-contrast-bg';
    } else if (backgroundColor === 'pink') {
        bgClass = 'bg-pink-bg';
    }


    return (
        <div className={`p-4 px-6 shadow overflow-hidden ${bgClass} cursor-pointer w-full rounded-lg border border-black`}>
            <Link href={`${path}/posts/${post.slug}`} className="w-full block">
                <div className="flex flex-col md:flex-row">
                    <div className="relative w-full md:w-1/2 rounded-lg overflow-hidden">
                        {post.coverImage ? (
                            <NextImage image={post.coverImage} priority fit={isMobile ? 'cover' : 'contain'} />
                        ) : (
                            <div className="flex items-center justify-center bg-gray-300 h-full rounded-lg">
                                <DocumentTextIcon className="w-12 h-12" />
                            </div>
                        )}
                    </div>
                    <div className="md:w-1/2 md:pl-4 flex flex-col justify-center">
                        <div className="py-4 md:py-0 space-y-3 lg:space-y-6">
                            <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                <DateComponent icon dateString={post.date} />
                                {post.author?.name && (
                                    <div className="flex items-center">
                                        <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                        <div className="text-gray-600 text-sm lg:text-base font-garamond">
                                            {post.author.name}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="subheader-text truncate">{post.title}</h1>
                                {post.subtitle && <h3 className="subtitle-text truncate">{post.subtitle}</h3>}
                            </div>
                            <div className='body-text truncate-lines text-gray-600'>
                                <PortableText className="body-text hyphens-auto break-words text-justify custom-portable-text" value={post.content} />
                            </div>
                            <div>
                                <span className="font-garamond text-primary pt-6 text-base lg:text-lg">Read More</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export const PostImagePreview: React.FC<PostPreviewProps> = ({ post, backgroundColor }) => {
    const path = usePathname();

    let bgClass = '';

    if (backgroundColor === 'contrast') {
        bgClass = 'bg-contrast-bg';
    } else if (backgroundColor === 'pink') {
        bgClass = 'bg-pink-bg';
    }

    return (
        <div className={`p-3 overflow-hidden ${bgClass} transition-colors cursor-pointer shadow w-full rounded-lg border border-transparent hover:shadow-xl hover:border-black`}>
            <Link href={`${path}/posts/${post.slug}`} className='w-full'>
                <div className={`relative w-full h-56 rounded-lg overflow-hidden object-cover`}>
                    {post.coverImage ? (
                        <NextImage image={post.coverImage} />
                    ) : (
                        <div className="flex items-center justify-center bg-gray-300 h-full rounded-lg">
                            <DocumentTextIcon className='w-12 h-12' />
                        </div>
                    )}
                </div>
                <div className={`py-2 space-y-2`}>
                    <div className="text-left w-full md:w-auto md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                        <DateComponent icon dateString={post.date} />
                        {post.author?.name && (
                            <div className="flex items-center">
                                <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                <div className="text-gray-600 font-garamond text-sm lg:text-base">
                                    {post.author.name}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-lg lg:text-2xl truncate font-garamond">{post.title}</h2>
                        {post.subtitle && <h3 className="text-base lg:text-lg truncate font-garamond">{post.subtitle}</h3>}
                    </div>
                    <p className="text-gray-600 text-base font-garamond truncate-lines-small">{post.excerpt}</p>
                </div>
            </Link>
        </div>
    );
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post, backgroundColor }) => {
    const path = usePathname();

    let bgClass = '';

    if (backgroundColor === 'contrast') {
        bgClass = 'bg-contrast-bg';
    } else if (backgroundColor === 'pink') {
        bgClass = 'bg-pink-bg';
    }


    return (
        <div className={`w-full overflow-hidden ${bgClass} flex items-center justify-between p-3 md:p-4 border border-black lg:border-gray-300 rounded-xl shadow transition-colors cursor-pointer hover:border-black`}>
            <Link href={`${path}/posts/${post.slug}`} className='w-full h-full flex flex-col justify-between'>
                <div className="flex flex-row justify-between items-center h-full">
                    <div className="w-auto">
                        <div className="text-left truncate">
                            <DateComponent icon dateString={post.date} />
                            {post.author?.name && (
                                <div className="flex items-center">
                                    <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                    <p className="text-gray-600 text-sm lg:text-base font-garamond">{post.author.name}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-left ml-10 flex-grow">
                        <h2 className="text-lg truncate font-garamond">{post.title}</h2>
                        <p className="text-gray-600 text-base font-garamond truncate-lines">{post.excerpt}</p>
                    </div>
                    <div>
                        <ChevronRightIcon className="w-8 h-8 hidden md:block" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
