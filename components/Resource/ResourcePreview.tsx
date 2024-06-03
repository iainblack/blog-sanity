import { Resource } from "@/sanity/lib/queries";
import CoverImage from "../CoverImage";
import DateComponent from "../DateComponent";
import { FaCubes, FaLink } from "react-icons/fa6";
import { IoBookOutline } from "react-icons/io5";

interface ResourcePreviewProps {
    resource: Resource;
    onClick: (resource: Resource) => void;
}

export const ResourcePreview: React.FC<ResourcePreviewProps> = ({ resource, onClick }) => {
    return (
        <div className="p-3 overflow-hidden transition-colors w-full rounded-lg border border-transparent shadow hover:shadow-xl hover:border-black">
            <div className="w-full flex flex-col h-full cursor-pointer" onClick={() => onClick(resource)}>
                <div className="relative w-full h-52 rounded-lg overflow-hidden object-cover">
                    {resource.type === "Book" && (
                        <div className="absolute top-2 left-2 p-2 rounded-full bg-green-500">
                            <IoBookOutline className="w-5 h-5 text-white" />
                        </div>
                    )}
                    {resource.type === "Website" && (
                        <div className="absolute top-2 left-2 p-2 rounded-full bg-blue-500">
                            <FaLink className="w-5 h-5 text-white" />
                        </div>
                    )}
                    {resource.type === "Other" && (
                        <div className="absolute top-2 left-2 p-2 rounded-full bg-gray-500">
                            <FaCubes className="w-5 h-5 text-white" />
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
                    <h2 className="text-lg font-bold truncate">{resource.title}</h2>
                    <div className="text-body text-sm truncate-lines-small flex-grow">
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
                            className="text-primary font-bold"
                        >
                            Read More
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

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
                            <div className="text-body text-sm truncate-lines-small flex-grow">
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