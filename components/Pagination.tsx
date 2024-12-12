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

    if (totalPages === 0) return null;

    return (
        <div className="flex items-center gap-4 p-6 pb-8">
            <button
                className={`p-2 rounded-full border border-text-primary ${active === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary bg-contrast-bg'}`}
                onClick={prev}
                disabled={active === 0}
            >
                <ArrowLeftIcon className="h-5 w-5 text-text-primary" />
            </button>
            <span className="body-text">
                Page {active + 1} of {totalPages === 0 ? 1 : totalPages}
            </span>
            <button
                className={`p-2 rounded-full border border-text-primary  ${active + 1 === totalPages || active == totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary bg-contrast-bg'}`}
                onClick={next}
                disabled={active + 1 === totalPages || active === totalPages}
            >
                <ArrowRightIcon className="h-5 w-5 text-text-primary" />
            </button>
        </div>
    );
}
