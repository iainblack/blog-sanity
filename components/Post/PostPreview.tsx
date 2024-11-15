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
    let readMoreClass = 'text-primary';

    if (backgroundColor === 'contrast') {
        bgClass = 'bg-contrast-bg';
        readMoreClass = 'text-text-secondary';
    } else if (backgroundColor === 'pink') {
        bgClass = 'bg-pink-bg';
        readMoreClass = 'text-text-secondary';
    }


    return (
        <div className={`p-4 px-6 shadow overflow-hidden ${bgClass} cursor-pointer w-full rounded-lg border border-black`}>
            <Link href={`${path}/posts/${post.slug}`} className="w-full block">
                <div className="flex flex-col md:flex-row">
                    <div className={`relative w-full h-64 md:w-1/2 md:h-auto rounded-lg overflow-hidden object-cover`}>
                        {post.coverImage && <NextImage image={post.coverImage} priority fit={'contain'} />}
                    </div>
                    <div className="md:w-1/2 md:pl-4 flex flex-col justify-center">
                        <div className="py-4 md:py-0 space-y-3 lg:space-y-6">
                            <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                <DateComponent icon dateString={post.date} />
                                {post.author?.name && (
                                    <div className="flex items-center">
                                        <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                        <div className="text-gray-600 text-lg font-garamond">
                                            {post.author.name}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h2 className="text-2xl truncate-lines-smaller font-garamond">{post.title}</h2>
                                {post.subtitle && <h3 className="text-xl truncate font-garamond">{post.subtitle}</h3>}
                            </div>
                            <div className='truncate-lines text-gray-600'>
                                <PortableText className="text-xl font-garamond hyphens-auto break-words text-justify custom-portable-text" value={post.content} />
                            </div>
                            <div>
                                <span className={`font-garamond ${readMoreClass} pt-6 text-base lg:text-lg`}><b>Read More</b></span>
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
    let readMoreClass = '';

    if (backgroundColor === 'contrast') {
        bgClass = 'bg-contrast-bg';
        readMoreClass = 'text-contrast';
    } else if (backgroundColor === 'pink') {
        bgClass = 'bg-pink-bg';
        readMoreClass = 'text-pink';
    }

    return (
        <div className={`p-3 overflow-hidden ${bgClass} transition-colors cursor-pointer shadow w-full rounded-lg border border-black hover:shadow-xl`}>
            <Link href={`${path}/posts/${post.slug}`} className='w-full'>
                <div className={`relative w-full h-56 rounded-lg overflow-hidden mb-2`}>
                    {post.coverImage && <NextImage image={post.coverImage} fit='contain' />}
                </div>
                <div className={`py-2 space-y-2`}>
                    <div className="text-left w-full md:w-auto md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                        <DateComponent icon dateString={post.date} />
                        {post.author?.name && (
                            <div className="flex items-center">
                                <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                <div className="text-gray-600 font-garamond text-lg">
                                    {post.author.name}
                                </div>
                            </div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-2xl truncate-lines-smaller font-garamond">{post.title}</h2>
                        {post.subtitle && <h3 className="text-xl truncate font-garamond">{post.subtitle}</h3>}
                    </div>
                    <p className="text-gray-600 text-xl font-garamond truncate-lines-smaller">{post.excerpt}</p>
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
        <div className={`w-full overflow-hidden ${bgClass} flex items-center justify-between p-3 md:p-4 border border-black rounded-xl shadow transition-colors cursor-pointer`}>
            <Link href={`${path}/posts/${post.slug}`} className='w-full h-full flex flex-col justify-between'>
                <div className="flex flex-col h-full md:flex-row md:justify-between md:items-center ">
                    <div className="w-auto pb-3 md:pb-0 md:min-w-[200px]">
                        <div className="text-left truncate">
                            <DateComponent icon dateString={post.date} />
                            {post.author?.name && (
                                <div className="flex items-center">
                                    <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                    <div className="text-gray-600 font-garamond text-lg">
                                        {post.author.name}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="text-left md:ml-10 flex-grow space-y-3">
                        <h2 className="text-xl md:text-2xl truncate-lines-smaller font-garamond">{post.title}</h2>
                        {post.excerpt && <p className="text-gray-600 text-base md:text-lg font-garamond truncate-lines">{post.excerpt}</p>}
                    </div>
                    <div>
                        <ChevronRightIcon className="w-8 h-8 hidden md:block" />
                    </div>
                </div>
            </Link>
        </div>
    );
}
