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
  const limit = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const skeletonTimeout = setTimeout(() => {
        setShowSkeleton(true);
      }, 500);

      const response = await getPostsByPage("Additional Topics", order, page * limit, limit);

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

  return (
    <div className="container mx-auto lg:px-16">
      <div className="flex flex-col items-center space-y-6 my-6 lg:space-y-0 lg:flex-row md:justify-between lg:my-12">
        <Intro title={"Additional Topics"} />
        <PostFilters order={order} setOrder={setOrder} postCount={postState.visiblePosts?.length} loading={loading} view={view} setView={setView} />
      </div>
      <div className="flex flex-col items-center min-h-[65vh]">
        {showSkeleton && page === 0 && <PostPreviewGridWithHeroSkeleton />}
        {showSkeleton && page !== 0 && <PostPreviewGridSkeleton />}
        {!showSkeleton && (
          <div className="w-full flex flex-col items-center">
            <PostPreviewGrid posts={postState.visiblePosts} view={view} page={page} loading={loading} />
            <Pagination totalPages={Math.ceil(postState.totalPosts / limit)} active={page} setActive={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
