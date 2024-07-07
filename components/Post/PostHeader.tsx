import { Post } from "@/sanity/lib/queries";
import { UserIcon } from "@sanity/icons";
import DateComponent from "../DateComponent";
import NextImage from "../NextImage";

export default function PostHeader({ post: post }: { post: Post }) {
    if (!post) return null;

    return (
        <>
            <div className="flex justify-between items-center">
                <div className="lg:mb-8 space-y-3">
                    <h5 className="header-text">
                        {post.title}
                    </h5>
                </div>
                <div className="my-8 space-y-1 hidden lg:block">
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
            </div >
            <div className="my-4 space-y-1 lg:hidden">
                <DateComponent icon dateString={post.date} />
                {post.author && (
                    <div className="flex items-center">
                        <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                        <div className="text-gray-600 text-sm lg:text-base">
                            {post.author.name}
                        </div>
                    </div>
                )}
            </div>
            {post.coverImage && <div className="mb-8 relative w-full h-64 sm:h-96 lg:h-[500px]">
                <NextImage image={post.coverImage} priority fit="contain" />
            </div>}
            {post.subtitle && <div className="pb-8">
                <h6 className="text-xl lg:text-3xl font-walbaum text-center text-text-primary"> {post.subtitle}</h6>
            </div>}
        </>

    )
}
