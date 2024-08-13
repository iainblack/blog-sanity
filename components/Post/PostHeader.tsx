import { Post } from "@/sanity/lib/queries";
import { UserIcon } from "@sanity/icons";
import DateComponent from "../DateComponent";
import NextImage from "../NextImage";

export default function PostHeader({ post: post }: { post: Post }) {
    if (!post) return null;

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="mb-8 space-y-1 hidden lg:block">
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
            </div >
            <div className="my-4 space-y-1 lg:hidden">
                <DateComponent icon dateString={post.date} />
                {post.author && (
                    <div className="flex items-center">
                        <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                        <div className="text-gray-600 text-lg font-garamond">
                            {post.author.name}
                        </div>
                    </div>
                )}
            </div>
            {post.coverImage &&
                <div className="mb-8">
                    <div className="relative w-full h-64 sm:h-96 lg:h-[500px]">
                        <NextImage image={post.coverImage} priority fit="contain" />
                    </div>
                    <p className="text-gray-600 text-center font-garamond">{post.coverImage?.caption}</p>
                </div>
            }
            {<div className="pb-5 md:pb-8 space-y-3 lg:space-y-6">
                <h5 className="text-2xl lg:text-3xl whitespace-pre-wrap font-garamond text-center">{post.title}</h5>
                {post.subtitle && <h6 className="text-xl lg:text-2xl font-garamond text-center text-text-primary"> {post.subtitle}</h6>}
            </div>}
        </>

    )
}
