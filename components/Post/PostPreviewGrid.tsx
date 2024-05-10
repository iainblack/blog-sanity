import { Post } from "@/sanity/lib/queries";
import { PostPreview } from "./PostPreview";
import Link from "next/link";


interface PostPreviewGridProps {
    posts?: Post[];
}

export default function PostPreviewGrid({ posts }: PostPreviewGridProps) {

    if (!posts || posts.length === 0) {
        return null;
    }

    return (
        <div className="mx-auto px-4 pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-8">
                {posts.map(post => (
                    <Link key={post._id} href={`/posts/${post.slug}`}>
                        <PostPreview post={post} />
                    </Link>
                ))}
            </div>
        </div>
    );
}