import { Resource } from "@/sanity/lib/queries";
import { DocumentTextIcon } from "@sanity/icons";
import CoverImage from "../CoverImage";
import DateComponent from "../date";
import PortableText from "../portable-text";
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
                    {resource.datePublished && (
                        <div className="text-left w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                            <DateComponent dateString={resource.datePublished} />
                        </div>
                    )}
                    <h2 className="text-lg font-bold truncate">{resource.title}</h2>
                    <div className="text-body text-sm truncate-lines-small flex-grow">
                        <PortableText value={resource.description} />
                    </div>
                    {resource.url && (
                        <a
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                        >
                            {resource.urlDisplayName || resource.url}
                        </a>
                    )}
                    <div>
                        <span
                            className="text-blue-500 font-bold"
                        >
                            Read More
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}