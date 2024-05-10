'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeftIcon } from '@sanity/icons';

interface BackButtonProps {
    route: string;
    title?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ route, title }) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(route);
    };

    return (
        <button onClick={handleClick}>
            <div className='flex items-center justify-center underline text-gray-600'>
                <ChevronLeftIcon className='h-6 w-6' />
                {title ?? 'Back'}
            </div>
        </button>
    );
};

export default BackButton;