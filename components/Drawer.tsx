import Link from "next/link";
import { ChevronRightIcon, CloseIcon } from '@sanity/icons';
import { pages } from "./utils";

export default function Drawer({ isMenuOpen, closeMenu, isActive }: { isMenuOpen: boolean, closeMenu: () => void, isActive: (path: string) => boolean }) {
    return (
        <div className={`border-b border-black fixed top-0 left-0 z-40 w-full transition-transform ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} bg-contrast-bg`} tabIndex={-1} aria-labelledby="drawer-navigation-label">
            <div className="p-4">
                <CloseIcon className="text-text-primary absolute top-5 right-5" fontSize={30} onClick={closeMenu} />
                <div className="py-8 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {pages.filter(page => page.name !== 'Home').map((page) => (
                            <li key={page.slug}>
                                <Link href={`/${page.slug}`} onClick={closeMenu} className="flex items-center p-2 text-text-primary">
                                    <ChevronRightIcon fontSize={18} className={`${isActive(page.slug) ? 'text-text-contrast' : 'text-text-primary'}`} />
                                    <span className={`ml-3 ${isActive(page.slug) ? 'text-text-contrast' : 'text-text-primary'}`}>{page.name}</span>
                                </Link>
                            </li>
                        ))}
                        <li key='contact'>
                            <Link href='/contact' onClick={closeMenu} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <ChevronRightIcon fontSize={18} className={`${isActive('contact') ? 'text-text-contrast' : 'text-text-primary'}`} />
                                <span className={`ml-3 ${isActive('contact') ? 'text-text-contrast' : 'text-text-primary'}`}>Contact</span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
