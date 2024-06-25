import { Resource } from "@/sanity/lib/queries";
import CoverImage from "../CoverImage";
import DateComponent from "../DateComponent";
import { FaCubes, FaLink } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";

interface ResourcePreviewProps {
    resource: Resource;
    onClick?: (resource: Resource) => void;
}

export const ResourceImagePreview: React.FC<ResourcePreviewProps> = ({ resource, onClick }) => {
    return (
        <div className="p-3 overflow-hidden transition-colors w-full rounded-lg border border-transparent shadow hover:shadow-xl hover:border-black">
            <div className="w-full flex flex-col h-full cursor-pointer" onClick={() => onClick && onClick(resource)}>
                <div className="relative w-full h-52 rounded-lg overflow-hidden object-cover">
                    {resource.type === "Book" && resource && resource.coverImage && (
                        <div className="absolute top-2 left-2 p-2 rounded-full bg-transparent border border-gray-500">
                            <IoBookOutline className="w-5 h-5 text-gray-500" />
                        </div>
                    )}
                    {resource.type === "Website" && resource && resource.coverImage && (
                        <div className="absolute top-2 left-2 p-2 rounded-full bg-transparent border border-gray-500">
                            <FaLink className="w-5 h-5 text-gray-500" />
                        </div>
                    )}
                    {resource.type === "Other" && resource && resource.coverImage && (
                        <div className="absolute top-2 left-2 p-2 rounded-full bg-transparent border border-gray-500">
                            <FaCubes className="w-5 h-5 text-gray-500" />
                        </div>
                    )}
                    {resource.coverImage ? (
                        <CoverImage image={resource.coverImage} priority={false} />
                    ) : (
                        <div className="flex items-center justify-center bg-gray-300 h-full rounded-lg">
                            {resource.type === "Book" && <IoBookOutline className="w-12 h-12" />}
                            {resource.type === "Website" && <FaLink className="w-12 h-12" />}
                            {resource.type === "Other" && <FaCubes className="w-12 h-12" />}
                        </div>
                    )}
                </div>
                <div className="py-4 flex-grow flex flex-col space-y-3">
                    <div className="text-left w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                        {resource.datePublished ? <DateComponent dateString={resource.datePublished} /> : <div className="h-5" />}
                    </div>
                    <h2 className="subheader-text">{resource.title}</h2>
                    <div className="body-text truncate-lines-small flex-grow">
                        {resource.description}
                    </div>
                    {resource.url && (
                        <div className="flex space-x-1 items-center">
                            <FaLink className="w-4 h-4 text-blue-500" />
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                {resource.urlDisplayName || resource.url}
                            </a>
                        </div>
                    )}
                    <div>
                        <span
                            className="text-primary body-text"
                        >
                            Read More
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export const ResourceListItem: React.FC<ResourcePreviewProps> = ({ resource }) => {
    return (
        <div className="w-full overflow-hidden flex items-center justify-between p-3 md:p-4 border border-gray-300 rounded-xl shadow ">
            <div className="flex flex-row justify-between items-center h-full">
                <div className="text-left flex-grow w-full space-y-1">
                    <div>
                        <div className="flex space-x-1">
                            {resource.datePublished && (
                                <div className="flex items-center">
                                    <p className="text-sm lg:text-base text-gray-600 font-garamond pr-1">Published</p>
                                    <DateComponent dateString={resource.datePublished} />
                                </div>)}
                            {resource.publisher && (
                                <p className="text-sm lg:text-base text-gray-600 font-garamond truncate-lines-smaller">{`by ${resource.publisher}`}</p>
                            )}
                        </div>
                        {resource.author && (
                            <p className="text-sm lg:text-base text-gray-600 font-garamond">{`Written by ${resource.author}`} </p>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl lg:text-2xl truncate font-garamond">{resource.title}</h2>
                    </div>
                    <p className="text-gray-600 body-text font-garamond truncate-lines">{resource.description}</p>
                    {resource.url && (
                        <div className="flex items-center space-x-1 mt-2">
                            <FaLink className="w-4 h-4 text-blue-500" />
                            <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline text-sm lg:text-base font-garamond"
                            >
                                {resource.urlDisplayName || resource.url}
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export const ResourceListItemSkeleton = () => {
    return (
        <div className="flex flex-col w-full pb-4">
            <div className="grid grid-rows-5 gap-3 w-full">
                {[1, 2, 3, 4, 5].map((_, index) => (
                    <div
                        key={index}
                        className="w-full overflow-hidden flex items-center justify-between p-3 md:p-4 border border-gray-300 rounded-xl shadow animate-pulse"
                    >
                        <div className="flex flex-row justify-between items-center h-full w-full">
                            <div className="text-left flex-grow w-full space-y-1">
                                <div>
                                    <div className="flex space-x-1">
                                        <div className="flex items-center space-x-1">
                                            <div className="h-4 bg-gray-300 rounded w-20"></div>
                                            <div className="h-4 bg-gray-300 rounded w-10"></div>
                                        </div>
                                        <div className="h-4 bg-gray-300 rounded w-24"></div>
                                    </div>
                                    <div className="h-4 bg-gray-300 rounded w-32 mt-1"></div>
                                </div>
                                <div>
                                    <div className="h-6 bg-gray-300 rounded w-1/4 mt-2"></div>
                                </div>
                                <div>
                                    <div className="h-5 bg-gray-300 rounded w-full mt-2"></div>
                                    <div className="h-5 bg-gray-300 rounded w-full mt-1"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export const ResourcePreviewSkeleton: React.FC = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full pt-5">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div key={index} className="p-3 overflow-hidden transition-colors w-full rounded-lg border border-gray-300 animate-pulse shadow">
                    <div className="w-full flex flex-col h-full cursor-pointer">
                        <div className="relative w-full h-52 rounded-lg bg-gray-300"></div>
                        <div className="py-4 flex-grow flex flex-col space-y-3">
                            <div className="text-left w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                            </div>
                            <div className="w-32 h-5 bg-gray-300 rounded mt-2"></div>
                            <div className="body-text truncate-lines-small flex-grow">
                                <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
                                <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
                                <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
                            </div>
                            <div className="w-24 h-6 bg-gray-300 rounded mt-4"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};