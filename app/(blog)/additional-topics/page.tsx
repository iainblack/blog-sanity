"use client";
import { Post } from "@/sanity/lib/queries";
import { getPostsByPage } from "../actions";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import PostFilters from "@/components/Post/PostFilters";
import { Intro } from "@/components/PageIntro";
import { PostPreviewGridWithHeroSkeleton, PostPreviewGridSkeleton } from "@/components/Post/LoadingSkeletons";
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
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const skeletonTimeout = setTimeout(() => {
        setShowSkeleton(true);
      }, 500);

      // Calculate limit and offset for fetching posts
      const currentLimit = page === 0 ? 10 : 9;
      const offset = page === 0 ? 0 : 10 + (page - 1) * 9;

      const response = await getPostsByPage("Additional Topics", order, offset, currentLimit);

      clearTimeout(skeletonTimeout);
      setShowSkeleton(false);
      setPostState({
        visiblePosts: response.posts,
        totalPosts: response.totalPosts,
      });
      setLoading(false);
    };

    fetchPosts();
  }, [order, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);


  // Calculate total pages dynamically
  const totalPages =
    postState.totalPosts > 10
      ? Math.ceil((postState.totalPosts - 10) / 9) + 1 // First page has 10, others have 9
      : postState.totalPosts > 0
        ? 1
        : 0;

  return (
    <div className="container mx-auto lg:px-16">
      <div className="flex flex-col items-center space-y-6 my-6 lg:space-y-0 lg:flex-row md:justify-between lg:my-12">
        <Intro title={"Additional Topics"} />
        <PostFilters order={order} setOrder={setOrder} postCount={postState.visiblePosts?.length} loading={loading} view={view} setView={setView} />
      </div>
      <div className="flex flex-col items-center min-h-[65vh]">
        {showSkeleton && page === 0 && <PostPreviewGridWithHeroSkeleton />}
        {showSkeleton && page !== 0 && <PostPreviewGridSkeleton />}
        {!showSkeleton && !loading && (
          <div className="w-full flex flex-col items-center">
            <PostPreviewGrid posts={postState.visiblePosts} view={view} page={page} loading={loading} />
            <Pagination totalPages={totalPages} active={page} setActive={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
