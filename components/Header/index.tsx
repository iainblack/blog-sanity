"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MenuIcon } from '@sanity/icons'
import Image from "next/image";
import './header.css';
import { usePathname } from "next/navigation";
import Drawer from "../Drawer";
import HeaderLinks from "./HeaderLinks";

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
        <header className={`w-full header border-b border-black bg-default-bg  transition-transform duration-300 transform ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <nav className="p-6 md:p-8 flex items-center relative justify-between lg:px-20">
                {!isMenuOpen && (
                    <div className="hidden lg:flex justify-start items-center w-[50vw] lg:w-[33%]">
                        <HeaderLinks />
                    </div>
                )}
                <div className="w-[50%] sm:w-[33%] flex justify-start align-middle">
                    <Link href="/" className="w-full">
                        <div className="w-full relative text-center space-y-1">
                            <h1 className="header-text">Lou Fleming</h1>
                            <h6 className="body-text">Journey to Healing - Journey of Awakening</h6>
                        </div>
                    </Link>
                </div>
                <div className="lg:w-[33%] flex justify-end">
                    <Link href='/contact' className="hidden lg:block two-tone-button">
                        Contact
                    </Link>
                    <MenuIcon className="lg:hidden " fontSize={38} onClick={toggleMenu} />
                </div>
            </nav>
            <Drawer isDrawerOpen={isMenuOpen} closeDrawer={closeMenu} />
        </header >
    );

}
