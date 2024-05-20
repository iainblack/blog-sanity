'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@sanity/icons';
import { ExternalLink as ExternalLinkProps } from '@/sanity/lib/queries';

interface LinkListProps {
    links?: ExternalLinkProps[];
    title?: string;
}

const LinkList: React.FC<LinkListProps> = ({ links, title }) => {
    if (!links) return null;

    return (
        <div className='max-w-sm md:mx-auto'>
            {title && <h1 className='text-2xl text-text-contrast pb-5 text-left'>{title}</h1>}
            <LinksContainer links={links} />
        </div>
    );
};

const LinksContainer: React.FC<{ links: ExternalLinkProps[] }> = ({ links }) => {
    if (links.length <= 5) {
        return (
            <div className='text-left text-text-contrast'>
                <LinkColumn links={links} />
            </div>
        );
    } else if (links.length <= 10) {
        const column1 = links.slice(0, Math.ceil(links.length / 2));
        const column2 = links.slice(Math.ceil(links.length / 2));

        return (
            <div className='text-left text-text-contrast flex flex-wrap md:flex-nowrap space-x-0 md:space-x-12'>
                <div className='flex flex-col w-1/2'>
                    <LinkColumn links={column1} />
                </div>
                <div className='flex flex-col w-1/2'>
                    <LinkColumn links={column2} />
                </div>
            </div>
        );
    } else {
        const isMobile = window.innerWidth < 900;

        if (isMobile) {
            const column1 = links.slice(0, Math.ceil(links.length / 2));
            const column2 = links.slice(Math.ceil(links.length / 2));

            return (
                <div className='text-left text-text-contrast flex flex-wrap md:flex-nowrap space-x-0 md:space-x-8'>
                    <div className='flex flex-col w-1/2'>
                        <LinkColumn links={column1} />
                    </div>
                    <div className='flex flex-col w-1/2'>
                        <LinkColumn links={column2} />
                    </div>
                </div>
            );
        }

        const column1 = links.slice(0, Math.ceil(links.length / 3));
        const column2 = links.slice(Math.ceil(links.length / 3), Math.ceil(links.length * 2 / 3));
        const column3 = links.slice(Math.ceil(links.length * 2 / 3));

        return (
            <div className='text-left text-text-contrast flex flex-wrap md:flex-nowrap space-x-0 md:space-x-8'>
                <div className='flex flex-col lg:w-1/3'>
                    <LinkColumn links={column1} />
                </div>
                <div className='flex flex-col lg:w-1/3'>
                    <LinkColumn links={column2} />
                </div>
                <div className='flex flex-col lg:w-1/3'>
                    <LinkColumn links={column3} />
                </div>
            </div>
        );
    }
}

const LinkColumn: React.FC<{ links: ExternalLinkProps[] }> = ({ links }) => {
    return (
        <ul className='space-y-2'>
            {links.map((link, index) => (
                <li key={index}>
                    <ExternalLink url={link.url} title={link.title} />
                </li>
            ))}
        </ul>
    );
}

const ExternalLink = ({ url, title }: { url: string, title: string }) => {
    return (
        <div className='flex items-center space-x-2'>
            <Link href={url} target='_blank' className='text-text-contrast hover:text-primary'>{title}</Link>
            <ChevronRightIcon className='hover:text-primary' fontSize={16} />
        </div>
    )
}

export default LinkList;
