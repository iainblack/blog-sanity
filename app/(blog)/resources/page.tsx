"use client";
import { useEffect, useState } from "react";
import { Intro } from "@/components/PageIntro";
import { trimPlural } from "@/components/utils";
import SearchBar from "@/components/SearchBar";
import { getResources } from "../actions";
import { Resource } from "@/sanity/lib/queries";
import { ResourcePreview, ResourcePreviewSkeleton } from "@/components/Resource/ResourcePreview";
import Pagination from "@/components/Pagination";
import ResourceModal from "@/components/Resource/ResourceModal";
import Dropdown from "@/components/Dropdown";

interface ResourceState {
    resources?: Resource[];
    totalResources: number;
}

interface ModalState {
    isOpen: boolean;
    resource?: Resource;
}
const options = ["Books", "Websites", "Other"];

export default function Page() {
    const [searchVal, setSearchVal] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [resources, setResources] = useState<ResourceState>({
        resources: [],
        totalResources: 0,
    });
    const [modalState, setModalState] = useState<ModalState>({
        isOpen: false,
    });
    const limit = 25;

    const handleResourceClick = (resource: Resource) => {
        setModalState({
            isOpen: true,
            resource,
        });
    }

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            const offset = page * limit;
            const trimmedOptions = selectedOptions.map(option => trimPlural(option));
            const response = await getResources(trimmedOptions, searchVal, limit, offset);
            setResources({
                resources: response.resources,
                totalResources: response.totalResources,
            });
            setLoading(false);
        };
        fetchResources();
    }, [selectedOptions, page, searchVal]);

    return (
        <div className="container mx-auto lg:px-16">
            <div className="flex flex-col items-center space-y-6 my-6 md:space-y-0 md:flex-row md:justify-between md:my-12">
                <Intro title={"Resources"} subtitle="Books, websites, and anything else I find useful for your spiritual journey." />
            </div>
            <div className="flex flex-col space-y-6 px-2 items-center sm:items-start md:px-0">
                <SearchBar
                    setSearch={setSearchVal}
                    value={searchVal}
                    onSubmit={() => setPage(0)}
                    placeholder="Search resources"
                    searchIcon
                    loading={loading}
                />
                <Dropdown
                    checkbox
                    options={options}
                    label="Filter by type"
                    selected={selectedOptions}
                    setSelected={setSelectedOptions}
                />
                {loading && <ResourcePreviewSkeleton />}
                {!loading &&
                    <div className="pt-5 w-full">
                        {!resources.resources || resources.resources.length === 0
                            ? <p className="text-body flex w-full justify-center h-[50vh]">No resources found.</p>
                            :
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                                {resources.resources.map(resource => (
                                    <ResourcePreview key={resource._id} resource={resource} onClick={handleResourceClick} />
                                ))}
                            </div>}
                    </div>}
                <div className="w-full flex justify-center">
                    <Pagination totalPages={Math.ceil(resources.totalResources / limit)} active={page} setActive={setPage} />
                </div>
            </div>
            {modalState.resource &&
                <ResourceModal
                    resource={modalState.resource}
                    isOpen={modalState.isOpen}
                    onClose={() => setModalState({ isOpen: false })}
                />}
        </div>
    );
}
