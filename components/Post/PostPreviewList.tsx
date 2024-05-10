import { Post } from "@/sanity/lib/queries";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DateComponent from "../date";
import { ChevronRightIcon, UserIcon } from "@sanity/icons";
import { PostPreview } from "./PostPreview";

interface PostPreviewListProps {
    posts?: Post[];
}

export default function PostPreviewList({ posts }: PostPreviewListProps) {

    const path = usePathname();


    if (!posts || posts.length === 0) {
        return (
            <div className="flex justify-center items-center">
                <p>No posts yet...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full">
            {posts?.map((post) => (
                <PostPreview key={post._id} post={post} />
            ))}
        </div >
    );
}