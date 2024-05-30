"use client";
import {
  Post,
} from "@/sanity/lib/queries";
import { getPostsByPage } from "../actions";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import PostFilters from "@/components/Post/PostFilters";
import { Intro } from "@/components/PageIntro";
import PostPreviewGrid, { PostPreviewGridSkeleton, PostPreviewGridWithHeroSkeleton } from "@/components/Post/PostPreviewGrid";

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
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [view, setView] = useState<"grid" | "list">("grid");
  const limit = 10;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const response = await getPostsByPage("Additional Topics", order, page * limit, limit);
      setPostState({
        visiblePosts: response.posts,
        totalPosts: response.totalPosts,
      });
      setLoading(false);
    };
    fetchPosts();
  }, [order, page]);

  return (
    <div className="container mx-auto lg:px-16">
      <div className="flex flex-col items-center space-y-3 my-6 md:space-y-0 md:flex-row md:justify-between md:my-12">
        <Intro title={"Additional Topics"} />
        <PostFilters order={order} setOrder={setOrder} postCount={postState.visiblePosts?.length} loading={loading} view={view} setView={setView} />
      </div>
      <div className="flex flex-col items-center">
        {loading && page === 0 && <PostPreviewGridWithHeroSkeleton />}
        {loading && page !== 0 && <PostPreviewGridSkeleton />}
        {!loading &&
          <div className="w-full flex justify-center">
            <PostPreviewGrid posts={postState.visiblePosts} view={view} page={page} />
            <Pagination totalPages={Math.ceil(postState.totalPosts / limit)} active={page} setActive={setPage} />
          </div>}
      </div>
    </div>
  );
}
