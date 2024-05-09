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

function Intro(props: { title?: string; subtitle?: string; }) {
  const title = props.title || demo.title;
  return (
    <section className="mt-10 mb-8 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <h1 className="header-text text-center">
          {title || demo.title}
        </h1>
        {props.subtitle &&
          <h2 className="subheader-text text-center body-text mt-3">
            {props.subtitle}
          </h2>}
      </div>
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
      const response = await getPostsByPage("Lou's Healing Journey", order, page * limit, limit);
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
      <Intro title={"Lou's Healing Journey"} />
      <div className="flex flex-col items-center w-full px-4">
        <PostFilters order={order} setOrder={setOrder} postCount={postState.visiblePosts?.length} loading={loading} />
        {loading && <div className="w-full h-80"><LoadingSpinner /></div>}
        {!loading &&
          <>
            <PostPreviewList posts={postState.visiblePosts} />
            <Pagination totalPages={Math.ceil(postState.totalPosts / limit)} active={page} setActive={setPage} />
          </>}
      </div>
    </div>
  );
}
