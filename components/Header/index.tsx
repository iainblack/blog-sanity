"use client";
import Link from "next/link";
import * as demo from "@/sanity/lib/demo";
import { useState, useEffect } from "react";
import { MenuIcon, CloseIcon, ChevronRightIcon } from '@sanity/icons'
import './header.css';
import { pages } from "../utils";

export default function Header() {
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down
                setHeaderVisible(false);
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up
                setHeaderVisible(true);
            }
            setLastScrollY(currentScrollY);
        };

        const throttleScroll = () => {
            let timerId;
            if (!timerId) {
                timerId = setTimeout(() => {
                    handleScroll();
                    timerId = null;
                }, 100);
            }
        }

        window.addEventListener('scroll', throttleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', throttleScroll);
        };

    }, [lastScrollY]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    }

    const closeMenu = () => {
        setIsMenuOpen(false);
    }

    const Menu = () => {
        return (
            <div className="fixed mx-auto left-0 bg-white w-full h-screen flex flex-col py-3 px-8">
                <ul className="p-5 space-y-8 flex-grow flex flex-col pt-32">
                    {pages.filter(page => page.name !== 'Home').map((page) => (
                        <li key={page.slug}>
                            <Link href={`/${page.slug}`} onClick={closeMenu} className="hover:underline">
                                <div className="flex space-x-1 items-center">
                                    <h1 className="text-2xl">{page.name}</h1>
                                    <ChevronRightIcon fontSize={24} />
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <header className={`header border-b bg-white ${headerVisible ? '' : 'header-hidden'}`}>
            <div className="container mx-auto p-5 xl:px-0">
                <nav className="flex justify-between items-center py-3 px-8 xl:py-5 xl:px-0">
                    <a href="/" className="text-2xl font-bold">
                        {demo.title}
                    </a>
                    {!isMenuOpen && (
                        <>
                            <ul className={`space-x-5 hidden lg:flex flex-wrap justify-center items-center align-baseline px-12 py-3`}>
                                {pages.filter(page => page.name !== 'Home').map((page) => (
                                    <li key={page.slug}>
                                        <Link href={`/${page.slug}`} className="hover:underline">{page.name}</Link>
                                    </li>
                                ))}
                            </ul><button className="hidden lg:block border border-black py-3 px-12 transition-colors duration-200 hover:bg-black hover:text-white">
                                Subscribe
                            </button>
                        </>
                    )}
                    {!isMenuOpen ?
                        <MenuIcon className="lg:hidden" fontSize={38} onClick={toggleMenu} /> :
                        <CloseIcon className="lg:hidden" fontSize={38} onClick={toggleMenu} />
                    }
                </nav>
                {isMenuOpen && <Menu />}
            </div>
        </header >
    );
}
