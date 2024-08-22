"use client";
import { Post } from "@/sanity/lib/queries";
import { getPostsByPage } from "../actions";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import PostFilters from "@/components/Post/PostFilters";
import { Intro } from "@/components/PageIntro";
import { PostPreviewListSkeleton, PostPreviewGridWithHeroSkeleton, PostPreviewGridSkeleton } from "@/components/Post/LoadingSkeletons";
import PostPreviewGrid from "@/components/Post/PostPreviewGrid";

interface PostState {
  visiblePosts?: Post[];
  totalPosts: number;
}

export default function Page() {
  const [postState, setPostState] = useState<PostState>({
    visiblePosts: [],
    totalPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const limit = 10;

  const getLoadingSkeleton = (page: number, view: "grid" | "list") => {
    if (view === "list") {
      return <PostPreviewListSkeleton />;
    }

    if (page === 0) {
      return <PostPreviewGridWithHeroSkeleton />;
    }

    return <PostPreviewGridSkeleton />;
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchPosts = async () => {
      setLoading(true);
      setShowSkeleton(true);
      const response = await getPostsByPage("Lou's Healing Journey", order, page * limit, limit);
      setPostState({
        visiblePosts: response.posts,
        totalPosts: response.totalPosts,
      });
      setLoading(false);
      timeoutId = setTimeout(() => {
        setShowSkeleton(false);
      }, 500); // Ensure skeleton displays for at least 500 ms
    };

    fetchPosts();

    return () => clearTimeout(timeoutId);
  }, [order, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  return (
    <div className="container mx-auto lg:px-16">
      <div className="flex flex-col items-center space-y-6 my-6 lg:space-y-0 lg:flex-row md:justify-between lg:my-12">
        <Intro title={"Lou's Healing Journey"} />
        <PostFilters order={order} setOrder={setOrder} postCount={postState.visiblePosts?.length} loading={loading} view={view} setView={setView} />
      </div>
      <div className="flex flex-col items-center">
        {showSkeleton && getLoadingSkeleton(page, view)}
        {!showSkeleton && (
          <div className="w-full flex flex-col items-center">
            <PostPreviewGrid posts={postState.visiblePosts} view={view} page={page} backgroundColor="contrast" />
            <Pagination totalPages={Math.ceil(postState.totalPosts / limit)} active={page} setActive={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
