'use client';
import { Post } from "@/sanity/lib/queries";
import { ChevronLeftIcon, ChevronRightIcon } from "@sanity/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


export default function MorePosts({ previous, next, }: { previous?: Post, next?: Post }) {

    const router = useRouter();
    const path = usePathname();

    const goNext = () => {
        if (next) {
            router.push(`${getPath()}/${next.slug}`);
        }
    }

    const goPrevious = () => {
        if (previous) {
            router.push(`${getPath()}/${previous.slug}`);
        }
    }

    function getPath() {
        const pathArray = path.split('/');
        pathArray.pop();
        return pathArray.join('/');
    }

    return (
        <aside className="flex justify-center w-full my-20 p-3">
            <div className="flex justify-center w-full">
                {previous ? (
                    <button className="flex flex-col py-3 pr-3 border border-gray-200 rounded-l-xl shadow-lg hover:shadow-inner" onClick={goPrevious}>
                        <div className="flex justify-between items-center space-x-2">
                            <ChevronLeftIcon className="h-12 w-12 text-gray-500" />
                            <div>
                                <div className="text-sm text-gray-500">Next Post</div>
                                <div className="text-lg font-bold">{previous.title}</div>
                            </div>
                        </div>
                    </button>
                ) : <div></div>
                }
                {
                    next ? (
                        <button className="flex flex-col py-3 pl-3 border border-gray-200 rounded-r-xl shadow-lg hover:shadow-inner" onClick={goNext}>
                            <div className="flex justify-between items-center space-x-2">
                                <div>
                                    <div className="text-sm text-gray-500">Next Post</div>
                                    <div className="text-lg font-bold">{next.title}</div>
                                </div>
                                <ChevronRightIcon className="h-12 w-12 text-gray-500" />
                            </div>
                        </button>
                    ) : <div></div>
                }
            </div >
        </aside >
    )
}