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

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchPosts = async () => {
      setLoading(true);
      setShowSkeleton(true);
      const response = await getPostsByPage("Messages for Humanity", order, page * limit, limit);
      setPostState({
        visiblePosts: response.posts,
        totalPosts: response.totalPosts,
      });
      setLoading(false);
      timeoutId = setTimeout(() => {
        setShowSkeleton(false);
      }, 500);
    };

    fetchPosts();

    return () => clearTimeout(timeoutId);
  }, [order, page]);

  const noResultsMessage = "These messages will be made available at a later time when they are in sync with the sharing of Lou's healing story.";

  const renderSkeleton = () => {
    if (showSkeleton && view === 'list') {
      return <PostPreviewListSkeleton />;
    } else if (showSkeleton && page === 0) {
      return <PostPreviewGridWithHeroSkeleton singleImage />;
    } else if (showSkeleton) {
      return <PostPreviewListSkeleton />;
    }
  }

  return (
    <div className="container mx-auto lg:px-16">
      <div className="flex flex-col items-center space-y-6 my-6 lg:space-y-0 lg:flex-row md:justify-between lg:my-12">
        <Intro title={"Messages for Humanity"} />
        <PostFilters order={order} setOrder={setOrder} postCount={postState.visiblePosts?.length} loading={loading} view={view} setView={setView} />
      </div>
      <div className="flex flex-col items-center">
        {renderSkeleton()}
        {!showSkeleton && (
          <>
            <PostPreviewGrid posts={postState.visiblePosts} view={view} page={page} noResultsMessage={noResultsMessage} backgroundColor="pink" singleImage />
            <Pagination totalPages={Math.ceil(postState.totalPosts / limit)} active={page} setActive={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
