import { Post } from "@/sanity/lib/queries";
import { HeroImagePreview, PostImagePreview } from "./PostPreview";

interface PostPreviewGridProps {
    posts?: Post[];
}

export default function PostPreviewGrid({ posts }: PostPreviewGridProps) {

    if (!posts || posts.length === 0) {
        return null;
    }

    const [firstPost, ...otherPosts] = posts;

    return (
        <div className="pb-4 w-full">
            <div className="w-full mb-6 p-3">
                <HeroImagePreview post={firstPost} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xl:gap-8 w-full">
                {otherPosts.map(post => (
                    <PostImagePreview key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
}