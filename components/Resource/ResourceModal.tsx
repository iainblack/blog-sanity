import { UserIcon } from "@sanity/icons";
import NextImage from "../NextImage";
import Modal from "../Modal";
import DateComponent from "../DateComponent";
import { Resource } from "@/sanity/lib/queries";
import { FaLink } from "react-icons/fa6";

interface ResourceModalProps {
    isOpen: boolean;
    onClose: () => void;
    resource: Resource;
}


export default function ResourceModal({ isOpen, onClose, resource }: ResourceModalProps) {
    const spacedDescription = resource.description && resource.description.split("\n").map((paragraph, index) => (
        <p key={index} className="body-text pb-2">{paragraph}</p>
    ));

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            imageHeader={resource.coverImage ?
                <div className="relative w-full h-64">
                    <NextImage image={resource.coverImage} priority={false} />
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
                                <div className="text-gray-600 text-sm lg:text-base">
                                    {resource.author}
                                </div>
                            </div>
                        )}
                    </div>
                }
                <h2 className="subheader-text">{resource.title}</h2>
                <div className="flex-grow w-full text-pretty">
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