"use client";
import {
    Post,
} from "@/sanity/lib/queries";
import { getPostsByPage } from "../actions";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import PostFilters from "@/components/Post/PostFilters";
import { Intro } from "@/components/PageIntro";
import ResourceTabs from "@/components/Resource/ResourceTabs";
import ResourceTabPanel from "@/components/Resource/ResourceTabPanel";
interface PostState {
    visiblePosts?: Post[];
    totalPosts: number;
}

export default function Page() {
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(0);
    const [view, setView] = useState<"grid" | "list">("grid");
    const [activeTab, setActiveTab] = useState("Books");


    return (
        <div className="container mx-auto lg:px-16">
            <div className="flex flex-col items-center space-y-3 my-6 md:space-y-0 md:flex-row md:justify-between md:my-12">
                <Intro title={"Recommended Resources"} subtitle="Books, websites, and anything else I find useful for your spiritual journey." />
                {/* <PostFilters order={order} setOrder={setOrder} postCount={postState.visiblePosts?.length} loading={loading} view={view} setView={setView} /> */}
            </div>
            <div className="flex flex-col items-center">
                <ResourceTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                <ResourceTabPanel activeTab={activeTab} />
            </div>
        </div>
    );
}
