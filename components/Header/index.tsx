"use client";
import Link from "next/link";
import * as demo from "@/sanity/lib/demo";
import { useState, useEffect } from "react";
import { MenuIcon, CloseIcon, ChevronRightIcon } from '@sanity/icons'
import './header.css';
import { pages } from "../utils";
import { usePathname } from "next/navigation";
import Drawer from "../Drawer";

export default function Header() {
    const [lastScrollY, setLastScrollY] = useState(0);
    const [headerVisible, setHeaderVisible] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const currentPath = usePathname();

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

    const isActive = (path: string) => currentPath === `/${path}`;

    return (
        <header className={`min-h-[10vh] header border-b border-black bg-default-bg ${headerVisible ? '' : 'header-hidden'}`}>
            <div className="container mx-auto p-5">
                <nav className="flex justify-between items-center py-3 px-8 xl:py-5">
                    <a href="/" className="text-2xl font-bold">
                        {demo.title}
                    </a>
                    {!isMenuOpen && (
                        <>
                            <ul className={`space-x-5 hidden lg:flex flex-wrap justify-center items-center align-baseline px-12 py-3 max-w-[60vw] lg:max-w-[50vw]`}>
                                {pages.filter(page => page.name !== 'Home' && page.name !== 'Contact').map((page) => (
                                    <li key={page.slug}>
                                        <Link href={`/${page.slug}`} className={`hover:text-primary hover:underline ${isActive(page.slug) ? 'text-primary' : ''}`}>{page.name}</Link>
                                    </li>
                                ))}
                            </ul>
                            <Link href='/contact' className="hidden lg:block two-tone-button">
                                Contact
                            </Link>
                        </>
                    )}
                    <MenuIcon className="lg:hidden" fontSize={38} onClick={toggleMenu} />
                </nav>
                <Drawer isMenuOpen={isMenuOpen} closeMenu={closeMenu} isActive={isActive} />
            </div>
        </header >
    );
}
