import { Post } from "@/sanity/lib/queries";
import { HeroImagePreview, PostImagePreview, PostPreview } from "./PostPreview";

interface PostPreviewGridProps {
    posts?: Post[];
    view: "grid" | "list";
    page: number;
    noResultsMessage?: string;
    backgroundColor?: string;
}

export default function PostPreviewGrid({ posts, view, page, noResultsMessage, backgroundColor }: PostPreviewGridProps) {

    if (!posts || posts.length === 0) {
        return (
            <div className="flex justify-center max-w-2xl text-center">
                <p className="body-text text-gray-600">{noResultsMessage ?? 'No posts yet...'}</p>
            </div >
        );
    }

    const [firstPost, ...otherPosts] = posts;

    if (view === "grid" && page === 0) {
        return (
            <div className="pb-4 w-full items-center">
                <div className="w-full mb-6 p-3">
                    <HeroImagePreview post={firstPost} backgroundColor={backgroundColor} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                    {otherPosts.map(post => (
                        <PostImagePreview key={post._id} post={post} backgroundColor={backgroundColor} />
                    ))}
                </div>
            </div>
        );
    }

    if (view === "grid") {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full pb-4">
                {posts.map(post => (
                    <PostImagePreview key={post._id} post={post} backgroundColor={backgroundColor} />
                ))}
            </div>
        );
    }

    const numRows = Math.min(posts.length, 10);
    const numCols = Math.ceil(posts.length / numRows);

    return (
        <div className="flex flex-col w-full p-3">
            <div
                className="grid gap-3"
                style={{
                    gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))`,
                    gridTemplateColumns: `repeat(${numCols}, 1fr)`,
                }}
            >
                {posts.map(post => (
                    <PostPreview key={post._id} post={post} backgroundColor={backgroundColor} />
                ))}
            </div>
        </div>
    );

}

export const PostPreviewGridWithHeroSkeleton = () => {
    return (
        <div className="pb-4 w-full">
            <div className="w-full mb-6 p-3">
                <div className="p-4 px-6 w-full rounded-lg border border-gray-300 animate-pulse">
                    <div className="flex flex-col md:flex-row">
                        <div className="relative w-full md:w-1/2 rounded-lg bg-gray-300"></div>
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
                                <div>
                                    <div className="w-48 h-8 bg-gray-300 rounded mt-4"></div>
                                    <div className="w-48 h-6 bg-gray-300 rounded mt-3"></div>
                                </div>
                                <div className="text-body overflow-hidden text-ellipsis truncate-lines">
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                </div>
                                <div className="w-24 h-6 bg-gray-300 rounded mt-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {[1, 2, 3].map((_, index) => (
                    <div key={index} className="p-3 w-full rounded-lg border border-gray-300 animate-pulse">
                        <div className="relative w-full h-56 rounded-lg bg-gray-300"></div>
                        <div className="py-4 space-y-3">
                            <div className="text-left w-full md:w-auto md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                <div className="flex items-center">
                                    <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                </div>
                                <div className="flex items-center mt-1">
                                    <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                    <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                            <div>
                                <div className="w-32 h-5 bg-gray-300 rounded mt-3"></div>
                                <div className="w-32 h-4 bg-gray-300 rounded mt-1"></div>
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="w-full h-4 bg-gray-300 rounded"></div>
                                <div className="w-full h-4 bg-gray-300 rounded"></div>
                                <div className="w-full h-4 bg-gray-300 rounded"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


export const PostPreviewGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-4">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
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
    );
}

export const PostPreviewListSkeleton = () => {
    return (
        <div className="flex flex-col w-full pb-4">
            <div className="grid grid-rows-10 gap-2 lg:grid-rows-5 w-full grid-flow-col row-auto px-3 py-1 md:px-0">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                    <div
                        key={index}
                        className="w-full p-4 my-2 border border-gray-300 rounded-xl shadow animate-pulse lg:max-w-md xl:max-w-2xl"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center">
                            <div className="flex flex-col w-full md:w-auto md:flex-row md:items-center">
                                <div className="text-left pb-3 md:pb-0 md:flex md:flex-col truncate md:mr-4">
                                    <div className="flex items-center mb-2">
                                        <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                                <div className="w-full text-left md:flex md:flex-col truncate max-w-full">
                                    <div className="w-32 h-5 bg-gray-300 rounded mt-2 md:ml-10"></div>
                                    <div className="w-full h-4 bg-gray-300 rounded mt-2 md:ml-10"></div>
                                </div>
                            </div>
                            <div className="w-8 h-8 bg-gray-300 rounded hidden md:block"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}