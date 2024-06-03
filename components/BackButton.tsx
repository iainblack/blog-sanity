'use client';

import { useRouter } from 'next/navigation';
import { IoIosArrowRoundBack } from "react-icons/io";

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
            <div className='flex items-center justify-center hover:underline text-gray-600 pl-6'>
                <IoIosArrowRoundBack className='h-6 w-6 mr-1' />
                {title ?? 'Back'}
            </div>
        </button>
    );
};

export default BackButton;