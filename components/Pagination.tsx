'use client';

import { ArrowLeftIcon, ArrowRightIcon } from "@sanity/icons";
import React from "react";

export default function Pagination({ totalPages, active, setActive }: { totalPages: number, active: number, setActive: (page: number) => void }) {
    const next = () => {
        if (active === totalPages) return;
        setActive(active + 1);
    };

    const prev = () => {
        if (active === 0) return;
        setActive(active - 1);
    };

    return (
        <div className="flex items-center gap-4 py-3">
            <button
                className={`p-2 rounded-full border ${active === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                onClick={prev}
                disabled={active === 0}
            >
                <ArrowLeftIcon className="h-5 w-5 text-gray-700" />
            </button>
            <span className="text-gray-600">
                Page <strong className="text-gray-800">{active + 1}</strong> of <strong className="text-gray-800">{totalPages === 0 ? 1 : totalPages}</strong>
            </span>
            <button
                className={`p-2 rounded-full border ${active + 1 === totalPages || active == totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                onClick={next}
                disabled={active + 1 === totalPages || active === totalPages}
            >
                <ArrowRightIcon className="h-5 w-5 text-gray-700" />
            </button>
        </div>
    );
}
