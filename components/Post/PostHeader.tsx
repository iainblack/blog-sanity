import { Post } from "@/sanity/lib/queries";
import { UserIcon } from "@sanity/icons";
import CoverImage from "../CoverImage";
import DateComponent from "../date";

export default function PostHeader({ post: post }: { post: Post }) {
    if (!post) return null;

    return (
        <>
            <div className="flex justify-between items-center">
                <h5 className="mt-8 md:mb-8 header-text">
                    {post.title}
                </h5>
                <div className="my-4 space-y-1 hidden md:block">
                    <DateComponent dateString={post.date} />
                    {post.author?.name && (
                        <div className="flex items-center">
                            <UserIcon className="text-gray-500 mr-1 w-5 h-5" />
                            <div className="text-gray-500 text-sm">
                                {post.author.name}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="my-4 space-y-1 md:hidden">
                <DateComponent dateString={post.date} />
                {post.author && (
                    <div className="flex items-center">
                        <UserIcon className="text-gray-500 mr-1 w-5 h-5" />
                        <div className="text-gray-500 text-sm">
                            {post.author.name}
                        </div>
                    </div>
                )}
            </div>
            {
                post.coverImage && <div className="mb-8 sm:mx-0 md:mb-16">
                    <CoverImage image={post.coverImage} priority />
                </div>
            }
        </>

    )
}
