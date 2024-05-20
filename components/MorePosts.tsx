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
            <div className="flex justify-center w-full space-x-1">
                <button disabled={!previous} className={`flex flex-col py-3 pr-3 rounded-l-xl shadow-xl bg-contrast-bg ${previous && 'hover:bg-primary hover:text-white'} ${previous ? 'hover:shadow-inner' : ''} `} onClick={goPrevious}>
                    <div className="flex justify-between items-center space-x-2">
                        <ChevronLeftIcon className={`h-12 w-12 ${previous ? '' : 'text-gray-400'}`} />
                        <div className=' min-w-24'>
                            <div className={`text-sm ${previous ? '' : 'text-gray-400'}`}>Previous Post</div>
                        </div>
                    </div>
                </button>
                {
                    <button disabled={!next} className={`flex flex-col py-3 pl-3 rounded-r-xl shadow-xl bg-contrast-bg ${next && 'hover:bg-primary hover:text-white'} ${next ? 'hover:shadow-inner' : ''}`} onClick={goNext}>
                        <div className="flex justify-between items-center space-x-2">
                            <div className="min-w-24">
                                <div className={`text-sm ${next ? '' : 'text-gray-400'}`}>Next Post</div>
                            </div>
                            <ChevronRightIcon className={`h-12 w-12 ${next ? '' : 'text-gray-400'}`} />
                        </div>
                    </button>
                }
            </div >
        </aside >
    )
}