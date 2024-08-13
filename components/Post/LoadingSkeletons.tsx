export const PostPreviewGridWithHeroSkeleton = ({ singleImage }: { singleImage?: boolean }) => {
    return (
        <div className="pb-4 w-full">
            <div className="w-full mb-6 px-3">
                <div className="p-4 px-6 w-full rounded-lg border border-gray-300 animate-pulse">
                    <div className="flex flex-col md:flex-row">
                        <div className="relative w-full h-56 md:w-1/2 md:h-auto rounded-lg bg-gray-300"></div>
                        <div className="md:w-1/2 md:pl-4 flex flex-col">
                            <div className="py-4 md:py-0 space-y-3 md:space-y-6 lg:space-y-8">
                                <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="w-48 h-8 bg-gray-300 rounded mt-4"></div>
                                    <div className="w-48 h-6 bg-gray-300 rounded mt-3"></div>
                                </div>
                                <div className="text-body overflow-hidden text-ellipsis truncate-lines">
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                    <div className="w-full h-5 bg-gray-300 rounded mt-2"></div>
                                </div>
                                <div className="w-24 h-6 bg-gray-300 rounded mt-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {singleImage ? (
                <div className="grid gap-3 px-3">
                    {[1, 2, 3].map((_, index) => (
                        <div
                            key={index}
                            className="w-full overflow-hidden animate-pulse flex items-center justify-between p-3 md:p-4 border border-gray-300 rounded-xl shadow"
                        >
                            <div className='w-full h-full flex flex-col justify-between'>
                                <div className="flex flex-row justify-between items-center h-full">
                                    <div className="w-auto">
                                        <div className="text-left truncate">
                                            <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                                            <div className="flex items-center">
                                                <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
                                                <div className="h-4 bg-gray-300 rounded w-16"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-left ml-10 flex-grow">
                                        <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-96"></div>
                                    </div>
                                    <div>
                                        <div className="w-8 h-8 bg-gray-300 rounded-full hidden md:block"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-3">
                    {[1, 2, 3].map((_, index) => (
                        <div key={index} className="p-3 w-full rounded-lg border border-gray-300 animate-pulse">
                            <div className="relative w-full h-56 rounded-lg bg-gray-300"></div>
                            <div className="py-4 space-y-3">
                                <div className="text-left w-full md:w-auto md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <div className="w-5 h-5 bg-gray-300 rounded-full mr-2"></div>
                                        <div className="w-16 h-4 bg-gray-300 rounded"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="w-32 h-5 bg-gray-300 rounded mt-3"></div>
                                    <div className="w-32 h-4 bg-gray-300 rounded mt-1"></div>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="w-full h-4 bg-gray-300 rounded"></div>
                                    <div className="w-full h-4 bg-gray-300 rounded"></div>
                                    <div className="w-full h-4 bg-gray-300 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const PostPreviewGridSkeleton = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full pb-4">
            {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div key={index} className="p-3 w-full rounded-lg border border-gray-300 animate-pulse px-3">
                    <div className="relative w-full h-52 rounded-lg bg-gray-300"></div>
                    <div className="py-4 h-24">
                        <div className="text-left pb-3 w-full md:w-auto md:pb-0 md:flex md:flex-col truncate min-w-[25%] lg:min-w-[20%]">
                            <div className="w-24 h-4 bg-gray-300 rounded"></div>
                        </div>
                        <div className="w-32 h-5 bg-gray-300 rounded mt-2"></div>
                        <div className="w-full h-4 bg-gray-300 rounded mt-2"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export const PostPreviewListSkeleton = () => {
    return (
        <div className="flex flex-col w-full p-3">
            <div className="grid gap-3 px-3">
                {[...Array(10)].map((_, index) => (
                    <div
                        key={index}
                        className="w-full overflow-hidden animate-pulse flex items-center justify-between p-3 md:p-4 border border-gray-300 rounded-xl shadow"
                    >
                        <div className='w-full h-full flex flex-col justify-between'>
                            <div className="flex flex-col h-full md:flex-row md:justify-between md:items-center">
                                <div className="w-auto pb-3 md:pb-0 md:min-w-[200px]">
                                    <div className="text-left truncate">
                                        <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 bg-gray-300 rounded-full mr-1"></div>
                                            <div className="h-4 bg-gray-300 rounded w-16"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-left md:ml-10 flex-grow space-y-3">
                                    <div className="h-6 bg-gray-300 rounded w-48 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-48"></div>
                                </div>
                                <div>
                                    <div className="w-8 h-8 bg-gray-300 rounded-full hidden md:block"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};



