"use client";
import { useEffect, useState } from "react";
import { Intro } from "@/components/PageIntro";
import { resourceTypes, trimPlural } from "@/components/utils";
import SearchBar from "@/components/SearchBar";
import ResourcesDropdown from "@/components/Resource/ResourcesDropdown";
import { getResources } from "../actions";
import { Resource } from "@/sanity/lib/queries";

export default function Page() {
    const [searchVal, setSearchVal] = useState("");
    const [selectedOptions, setSelectedOptions] = useState<string[]>([...resourceTypes]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [resources, setResources] = useState<Resource[] | undefined>([]);

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            const limit = 25;
            const offset = page * limit;
            const trimmedOptions = selectedOptions.map(option => trimPlural(option));
            const fetchedResources = await getResources(trimmedOptions, searchVal, limit, offset);
            setResources(fetchedResources);
            setLoading(false);
        };
        fetchResources();
    }, [selectedOptions, page, searchVal]);

    return (
        <div className="container mx-auto lg:px-16">
            <div className="flex flex-col items-center space-y-3 my-6 md:space-y-0 md:flex-row md:justify-between md:my-12">
                <Intro title={"Recommended Resources"} subtitle="Books, websites, and anything else I find useful for your spiritual journey." />
            </div>
            <div className="flex flex-col space-y-3">
                <SearchBar
                    setSearch={setSearchVal}
                    value={searchVal}
                    onSubmit={() => setPage(0)}
                    placeholder="Search resources"
                    searchIcon
                    loading={loading}
                />
                <ResourcesDropdown
                    selected={selectedOptions}
                    setSelected={setSelectedOptions}
                />
                <div>
                    {resources && resources.map(resource => (
                        <div key={resource._id}>
                            {/* Render your resource card or list item here */}
                            <h3>{resource.title}</h3>
                            <p>{resource.author}</p>
                            <p>{resource.publisher}</p>
                            <p>{resource.datePublished}</p>
                            <p>{resource.url}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
