import { UserIcon } from "@sanity/icons";
import { PortableText } from "next-sanity";
import CoverImage from "../CoverImage";
import Modal from "../Modal";
import DateComponent from "../date";
import { Resource } from "@/sanity/lib/queries";
import { FaLink } from "react-icons/fa6";

interface ResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource;
}


export default function ResourceModal({ isOpen, onClose, resource }: ResourceModalProps) {
    const spacedDescription = resource.description.split("\n").map((paragraph, index) => (
        <p key={index} className="body-text pb-2">{paragraph}</p>
    ));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            imageHeader={resource.coverImage ?
                <div className="relative w-full h-64">
                    <CoverImage image={resource.coverImage} priority={false} />
                </div>
                : null
            }
        >
            <div id="resources-modal" className="flex flex-col space-y-5 w-full overflow-auto h-full">
                {(resource.datePublished || resource.author) &&
                    <div className="space-y-1 w-full">
                        {resource.datePublished && <DateComponent icon dateString={resource.datePublished} />}
                        {resource.author && (
                            <div className="flex items-center">
                                <UserIcon className="text-gray-600 mr-1 w-5 h-5" />
                                <div className="text-gray-600 text-sm">
                                    {resource.author}
                                </div>
                            </div>
                        )}
                    </div>
                }
                <h2 className="text-lg font-bold">{resource.title}</h2>
                <div className="text-body text-sm flex-grow w-full py-4 text-pretty">
                    <div className="body-text">{spacedDescription}</div>
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
            </div>
        </Modal>
    )
}