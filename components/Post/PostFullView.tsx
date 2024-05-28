import BackButton from "../BackButton";
import MorePosts from "../MorePosts";
import PortableText from "../portable-text";
import PostHeader from "./PostHeader";

interface PostFullViewProps {
    posts: {
        currentPost: any;
        previousPost: any;
        nextPost: any;
    },
    backRoute: string;
}

export default function PostFullView({ posts, backRoute }: PostFullViewProps) {
    return (
        <div className="container mx-auto py-5">
            <BackButton route={backRoute} title="All Posts" />
            <article className="mx-auto lg:max-w-5xl p-8">
                <PostHeader post={posts.currentPost} />
                {posts.currentPost.content?.length
                    ? (<PortableText className="body-text" value={posts.currentPost.content} />)
                    : (
                        <div className="flex justify-center items-center h-full w-full">
                            <p>No content found! :/</p>
                        </div>
                    )}
            </article>
            <MorePosts previous={posts.previousPost} next={posts.nextPost} />
        </div>);
}
