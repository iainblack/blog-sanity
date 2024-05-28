'use client';

import React, { useEffect, useState } from 'react';
import { FaRegEnvelope, FaRegMessage, FaSquareFacebook, FaXTwitter, FaLinkedin } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import { Post } from "@/sanity/lib/queries";
import Link from 'next/link';

interface PostShareControlsProps {
    post: Post;
}

export default function PostShareControls({ post }: PostShareControlsProps) {
    const path = usePathname();
    const [postUrl, setPostUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setPostUrl(encodeURIComponent(`${window.location.origin}${path}/posts/${post.slug}`));
        }
    }, [path, post.slug]);

    if (!postUrl) return null;

    return (
        <div className="flex space-x-1 mt-4">
            <Link href={`mailto:?subject=Check out this post&body=I thought you might enjoy this post: ${postUrl}`} target='_blank' rel='noopener noreferrer'>
                <button aria-label="Share via Email" className='p-2 rounded-full border border-transparent hover:border-black'>
                    <FaRegEnvelope className="text-text-secondary w-5 h-5" />
                </button>
            </Link>
            <Link href={`sms:?body=Check out this post: ${postUrl}`} target='_blank' rel='noopener noreferrer'>
                <button aria-label="Share via Text" className='p-2 rounded-full border border-transparent hover:border-black'>
                    <FaRegMessage className="text-text-secondary w-5 h-5" />
                </button>
            </Link>
            <Link href={`https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=${postUrl}&redirect_uri=${postUrl}`} target='_blank' rel='noopener noreferrer'>
                <button aria-label="Share via Facebook" className='p-2 rounded-full border border-transparent hover:border-black'>
                    <FaSquareFacebook className="text-text-secondary w-5 h-5" />
                </button>
            </Link>
            <Link href={`https://twitter.com/intent/tweet?url=${postUrl}&text=Check out this post`} target='_blank' rel='noopener noreferrer'>
                <button aria-label="Share via Twitter" className='p-2 rounded-full border border-transparent hover:border-black'>
                    <FaXTwitter className="text-text-secondary w-5 h-5" />
                </button>
            </Link>
            <Link href={`https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`} target='_blank' rel='noopener noreferrer'>
                <button aria-label="Share via LinkedIn" className='p-2 rounded-full border border-transparent hover:border-black'>
                    <FaLinkedin className="text-text-secondary w-5 h-5" />
                </button>
            </Link>
        </div>
    );
}
