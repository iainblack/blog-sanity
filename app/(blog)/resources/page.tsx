"use client";
import { useEffect, useState } from "react";
import { Intro } from "@/components/PageIntro";
import { Tab } from "@/components/utils";
import SearchBar from "@/components/SearchBar";
import { getResources } from "../actions";
import { Resource } from "@/sanity/lib/queries";
import { ResourceListItem, ResourceListItemSkeleton } from "@/components/Resource/ResourcePreview";
import { FaCubes, FaLink } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";
import Pagination from "@/components/Pagination";
import ResourceModal from "@/components/Resource/ResourceModal";
import Tabs from "@/components/Tabs";

interface ResourceState {
    resources?: Resource[];
    totalResources: number;
}

interface ModalState {
    isOpen: boolean;
    resource?: Resource;
}
const tabs: Tab[] = [
    { name: 'Books', icon: <IoBookOutline /> },
    { name: 'Websites', icon: <FaLink /> },
    { name: 'Other Resources', icon: <FaCubes /> },
];

export default function Page() {
    const [searchVal, setSearchVal] = useState("");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showSkeleton, setShowSkeleton] = useState(false);
    const [resourceState, setResourceState] = useState<ResourceState>({
        resources: [],
        totalResources: 0,
    });
    const [activeTab, setActiveTab] = useState(tabs[0].name);
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
    });
    const limit = 10;

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            const skeletonTimeout = setTimeout(() => {
                setShowSkeleton(true);
            }, 800);

            const offset = page * limit;
            const response = await getResources(activeTab, searchVal, limit, offset);

            clearTimeout(skeletonTimeout);
            setShowSkeleton(false);
            setResourceState({
                resources: response.resources,
                totalResources: response.totalResources,
            });
            setLoading(false);
        };

        fetchResources();
    }, [page, searchVal, activeTab]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    return (
        <div className="container mx-auto lg:px-16">
            <div className="flex flex-col items-center space-y-6 my-6 md:space-y-0 md:flex-row md:justify-between md:my-12">
                <Intro title={"Lou's Recommended Resources"} />
            </div>
            <div className="flex flex-col space-y-6 px-2 md:px-4 items-center sm:items-start lg:px-0">
                <Tabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />
                <SearchBar
                    setSearch={setSearchVal}
                    value={searchVal}
                    onSubmit={() => setPage(0)}
                    placeholder={`Search ${activeTab.toLowerCase()}...`}
                    searchIcon
                    loading={loading}
                />
                {showSkeleton && <ResourceListItemSkeleton />}
                {!showSkeleton &&
                    <div className="w-full">
                        {!resourceState.resources || resourceState.resources.length === 0
                            ? <p className="body-text text-gray-600 flex w-full justify-center h-[50vh] font-garamond mt-8">Nothing Yet Available</p>
                            :
                            <div className="grid gap-6">
                                {resourceState.resources.map(resource => (
                                    <ResourceListItem key={resource._id} resource={resource} />
                                ))}
                            </div>
                        }
                    </div>
                }
                <div className="w-full flex justify-center">
                    <Pagination totalPages={Math.ceil(resourceState.totalResources / limit)} active={page} setActive={setPage} />
                </div>
            </div>
            {
                modalState.resource &&
                <ResourceModal
                    resource={modalState.resource}
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState({ isOpen: false })}
                />
            }
        </div >
    );
}
