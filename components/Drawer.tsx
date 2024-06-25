'use client';
import Link from "next/link";
import { ChevronDownIcon, ChevronUpIcon } from '@sanity/icons';
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Drawer({ isDrawerOpen, closeDrawer }: { isDrawerOpen: boolean, closeDrawer: () => void }) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const drawer = document.getElementById("drawer-top-example");
        if (drawer) {
            if (isDrawerOpen) {
                drawer.classList.add("translate-y-0");
                document.body.style.overflow = 'hidden';
            } else {
                drawer.classList.remove("translate-y-0");
                document.body.style.overflow = 'auto';
            }
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isDrawerOpen]);

    const handleClose = () => {
        closeDrawer();
        setMenuOpen(false);
    }

    return (
        <div className={`fixed inset-0 z-40 ${isDrawerOpen ? 'pointer-events-auto h-screen w-screen bg-opacity-60 backdrop-blur-sm' : 'pointer-events-none'}`} aria-hidden={!isDrawerOpen}>
            <div
                id="drawer"
                className={`fixed top-0 left-0 right-0 z-50 w-full p-4 transition-transform duration-300 transform bg-default-bg rounded-b ${isDrawerOpen ? 'translate-y-0' : '-translate-y-full'}`}
                tabIndex={-1}
                aria-labelledby="drawer-top-label"
            >
                <div className="border-b border-black py-5">
                    <Link href="/" onClick={handleClose}>
                        <div className="w-full relative">
                            <div className="w-full relative text-center space-y-2">
                                <h1 className="header-text">Lou Fleming</h1>
                                <h6 className="body-text-satista">Journey to Healing - Journey of Awakening</h6>
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-3">
                        <li>
                            <div className="p-2 w-full body-text-styled">
                                <Link href="/" onClick={handleClose}>
                                    <span>Home</span>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div
                                className={`flex items-center justify-between w-full p-2 body-text-styled`}
                                onClick={() => setMenuOpen(!menuOpen)}
                            >
                                {'Blogs'}
                                {menuOpen ? <ChevronUpIcon className="h-7 w-7" /> : <ChevronDownIcon className="h-7 w-7" />}
                            </div>
                            {menuOpen && (
                                <div className={`overflow-hidden`}>
                                    <ul className="space-y-3 mt-3 body-text-styled">
                                        <li>
                                            <div className="p-2 w-full ms-3">
                                                <Link href="/healing-journey" onClick={handleClose}>
                                                    <span>My Healing Journey</span>
                                                </Link>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="p-2 w-full ms-3">
                                                <Link href="/additional-topics" onClick={handleClose}>
                                                    <span>Additional Topics</span>
                                                </Link>
                                            </div>
                                        </li>
                                        <li>
                                            <div className="p-2 w-full ms-3">
                                                <Link href="/messages-for-humanity" onClick={handleClose}>
                                                    <span>Messages for Humanity</span>
                                                </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </li>
                        <li>
                            <div className="p-2 w-full body-text-styled">
                                <Link href="/resources" onClick={handleClose}>
                                    <span>Resources</span>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="p-2 w-full body-text-styled">
                                <Link href="/photos" onClick={handleClose}>
                                    <span>Photos</span>
                                </Link>
                            </div>
                        </li>
                        <li>
                            <div className="p-2 w-full body-text-styled">
                                <Link href="/contact" onClick={handleClose}>
                                    <span>Contact</span>
                                </Link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={`fixed inset-0 z-99 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={handleClose}></div>
        </div>
    );
}
