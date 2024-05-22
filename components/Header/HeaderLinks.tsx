'use client';

import Link from "next/link";
import { useState } from "react";

export default function HeaderLinks() {
    const [showPopover, setShowPopover] = useState(false);

    const handleMouseEnter = () => {
        setShowPopover(true);
    };

    const handleMouseLeave = () => {
        setShowPopover(false);
    };

    return (
        <ul className={`space-x-5 align-baseline flex flex-wrap`}>
            <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="relative">
                <button className="text-text-primary hover:cursor-pointer">Writings</button>
                {showPopover && (
                    <div className="absolute top-full left-0 bg-default-bg shadow-xl border rounded px-4 py-2 z-10">
                        <ul className="w-full">
                            <li className="py-1 whitespace-nowrap">
                                <Link href="/healing-journey" onClick={handleMouseLeave}>
                                    <div className="hover:text-primary">Lou&apos;s Healing Journey</div>
                                </Link>
                            </li>
                            <li className="py-1 whitespace-nowrap" onClick={handleMouseLeave}>
                                <Link href="/additional-topics">
                                    <div className="hover:text-primary">Additional Topics</div>
                                </Link>
                            </li>
                            <li className="py-1 whitespace-nowrap" onClick={handleMouseLeave}>
                                <Link href="/messages-for-humanity">
                                    <div className="hover:text-primary">Messages from Humanity</div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </li>
            <Link href="/recommended-resources">
                <div className="text-text-primary hover:text-primary">Resources</div>
            </Link>
            <Link href={"/photos"}>
                <div className="text-text-primary hover:text-primary">Photos</div>
            </Link>
        </ul>
    );
}