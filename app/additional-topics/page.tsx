"use client";
import * as demo from "@/sanity/lib/demo";
import {
  Post,
} from "@/sanity/lib/queries";
import { getPostsByPage } from "../actions";
import { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostFilters from "@/components/Post/PostFilters";
import PostPreviewList from "@/components/Post/PostPreviewList";

function Intro(props: { title: string | null | undefined; }) {
  const title = props.title || demo.title;
  return (
    <section className="my-10 flex justify-center items-center">
      <h1 className="header-text text-center">
        {title || demo.title}
      </h1>
    </section>
  );
}

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
    <div className="mx-auto px-5">
      <Intro title={"Additional Topics"} />
      <div className="flex flex-col items-center w-full px-4">
        <PostFilters order={order} setOrder={setOrder} postCount={postState.visiblePosts?.length} loading={loading} />
        {loading && <LoadingSpinner />}
        {!loading &&
          <>
            <PostPreviewList posts={postState.visiblePosts} />
            <Pagination totalPages={Math.ceil(postState.totalPosts / limit)} active={page} setActive={setPage} />
          </>}
      </div>
    </div>
  );
}