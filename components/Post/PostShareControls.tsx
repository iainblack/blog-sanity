"use client";

import React from 'react';
import { FaRegEnvelope, FaRegMessage, FaSquareFacebook, FaXTwitter, FaLinkedin } from 'react-icons/fa6';
import { usePathname } from 'next/navigation';
import { Post } from "@/sanity/lib/queries";

interface PostShareControlsProps {
    post: Post;
}

export default function PostShareControls({ post }: PostShareControlsProps) {
    const path = usePathname();
    const postUrl = encodeURIComponent(`${window.location.origin}${path}/posts/${post.slug}`);

    const handleEmailShare = () => {
        window.location.href = `mailto:?subject=Check out this post&body=I thought you might enjoy this post: ${postUrl}`;
    };

    const handleTextShare = () => {
        window.location.href = `sms:?body=Check out this post: ${postUrl}`;
    };

    const handleFacebookShare = () => {
        window.open(`https://www.facebook.com/dialog/share?app_id=145634995501895&display=popup&href=${postUrl}&redirect_uri=${postUrl}`, '_blank');
    };

    const handleTwitterShare = () => {
        window.open(`https://twitter.com/intent/tweet?url=${postUrl}&text=Check out this post`, '_blank');
    };

    const handleLinkedInShare = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${postUrl}`, '_blank');
    };

    return (
        <div className="flex space-x-1 mt-4">
            <button onClick={handleEmailShare} aria-label="Share via Email" className='p-2 rounded-full border border-transparent hover:border-black'>
                <FaRegEnvelope className="text-text-secondary w-5 h-5" />
            </button>
            <button onClick={handleTextShare} aria-label="Share via Text" className='p-2 rounded-full border border-transparent hover:border-black'>
                <FaRegMessage className="text-text-secondary w-5 h-5" />
            </button>
            <button onClick={handleFacebookShare} aria-label="Share on Facebook" className='p-2 rounded-full border border-transparent hover:border-black'>
                <FaSquareFacebook className="text-text-secondary w-5 h-5" />
            </button>
            <button onClick={handleTwitterShare} aria-label="Share on Twitter" className='p-2 rounded-full border border-transparent hover:border-black'>
                <FaXTwitter className="text-text-secondary w-5 h-5" />
            </button>
            <button onClick={handleLinkedInShare} aria-label="Share on LinkedIn" className='p-2 rounded-full border border-transparent hover:border-black'>
                <FaLinkedin className="text-text-secondary w-5 h-5" />
            </button>
        </div>
    );
}
