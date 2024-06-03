'use client';
import { Post } from "@/sanity/lib/queries";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
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
        <aside className="my-20">
            <div className="flex justify-center w-full space-x-1">
                <button
                    disabled={!previous}
                    className={`rounded-l-xl shadow-lg bg-contrast-bg h-14 border ${previous ? 'border-black hover:bg-primary hover:text-white hover:shadow-inner' : 'border-gray-400 cursor-not-allowed'} `}
                    onClick={goPrevious}>
                    <div className="flex justify-between items-center space-x-2 pl-2">
                        <IoIosArrowRoundBack className={`h-6 w-6 ${previous ? '' : 'text-gray-400'}`} />
                        <div className='min-w-20'>
                            <div className={`text-sm ${previous ? '' : 'text-gray-400'}`}>Prev</div>
                        </div>
                    </div>
                </button>

                <button
                    disabled={!next}
                    className={`rounded-r-xl shadow-lg bg-contrast-bg h-14 border ${next ? 'border-black hover:bg-primary hover:text-white hover:shadow-inner' : 'border-gray-400 cursor-not-allowed'} `} onClick={goNext}>
                    <div className="flex justify-between items-center space-x-2 pr-2">
                        <div className="min-w-20">
                            <div className={`text-sm ${next ? '' : 'text-gray-400'}`}>Next</div>
                        </div>
                        <IoIosArrowRoundForward className={`h-6 w-6 ${next ? '' : 'text-gray-400'}`} />
                    </div>
                </button>
            </div >
        </aside >
    )
}