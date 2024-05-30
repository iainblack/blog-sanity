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