'use client';

import { getPostsByPage } from "@/app/(blog)/actions";
import { useEffect, useState } from "react";
import LoadingSpinner from "../LoadingSpinner";

interface ResourceTabPanelProps {
    activeTab: string;
}

export default function ResourceTabPanel({ activeTab }: ResourceTabPanelProps) {
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(0);
    const [view, setView] = useState<"grid" | "list">("grid");
    const limit = 20;

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            const response = await getPostsByPage("Lou's Healing Journey", order, page * limit, limit);
            // setPostState({
            //     visiblePosts: response.posts,
            //     totalPosts: response.totalPosts,
            // });
            setLoading(false);
        };
        fetchPosts();
    }, [order, page, activeTab]);

    return (
        <>
            {loading && <div className="w-full min-h-[50vh]"><LoadingSpinner /></div>}
        </>
    );

}