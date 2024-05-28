import { Post } from "@/sanity/lib/queries";
import { PostPreview } from "./PostPreview";

interface PostPreviewListProps {
    posts?: Post[];
}

export default function PostPreviewList({ posts }: PostPreviewListProps) {

    if (!posts || posts.length === 0) {
        return (
            <div className="flex justify-center">
                <p>No posts yet...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            <ul className="w-full space-y-2 list-disc">
                {posts?.map((post) => (
                    <PostPreview key={post._id} post={post} />
                ))}
            </ul>
        </div >
    );
}