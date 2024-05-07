import React from 'react';
import CoverImage from '../CoverImage';
import { Post } from '@/sanity/lib/queries';
import { DocumentTextIcon } from "@sanity/icons";

interface PostPreviewProps {
    post: Post;
}

const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
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

export default PostPreview;
