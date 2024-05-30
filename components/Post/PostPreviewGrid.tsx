import { Post } from "@/sanity/lib/queries";
import { HeroImagePreview, PostImagePreview, PostPreview } from "./PostPreview";

interface PostPreviewGridProps {
    posts?: Post[];
    view: "grid" | "list";
    page: number;
}

export default function PostPreviewGrid({ posts, view, page }: PostPreviewGridProps) {

    if (!posts || posts.length === 0) {
        return (
            <div className="flex justify-center">
                <p>No posts yet...</p>
            </div>
        );
    }

    const [firstPost, ...otherPosts] = posts;

    if (view === "grid" && page === 0) {
        return (
            <div className="pb-4 w-full">
                <div className="w-full mb-6 p-3">
                    <HeroImagePreview post={firstPost} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                    {otherPosts.map(post => (
                        <PostImagePreview key={post._id} post={post} />
                    ))}
                </div>
            </div>
        );
    }

    if (view === "grid") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                {posts.map(post => (
                    <PostImagePreview key={post._id} post={post} />
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <div className="grid grid-rows-10 lg:grid-rows-5 gap-2 grid-flow-col row-auto">
                {posts.map((post) => (
                    <PostPreview key={post._id} post={post} />
                ))}
            </div>
        </div>
    )

}

export const PostPreviewGridSkeleton = () => {
    return (
        <div className="pb-4 w-full">
            <div className="w-full mb-6 p-3">
                <div className="p-4 w-full rounded-lg border border-gray-300 animate-pulse">
                    <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-1/2 h-52 md:h-72 lg:h-96 rounded-lg bg-gray-300"></div>
                        <div className="md:w-1/2 md:pl-4 flex flex-col">
                            <div className="py-4 md:py-0 space-y-3 md:space-y-6 lg:space-y-8">
                                <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                                <div className="w-48 h-6 bg-gray-300 rounded mt-4"></div>
                                <div className="text-body text-sm overflow-hidden text-ellipsis truncate-lines">
                                    <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
                                </div>
                                <div className="w-24 h-6 bg-gray-300 rounded mt-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="p-3 w-full rounded-lg border border-gray-300 animate-pulse">
                        <div className="relative w-full h-52 rounded-lg bg-gray-300"></div>
                        <div className="py-4 h-24">
                            <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                            </div>
                            <div className="w-32 h-5 bg-gray-300 rounded mt-2"></div>
                            <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};