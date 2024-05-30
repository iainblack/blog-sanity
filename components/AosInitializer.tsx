'use client';

import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AOSInitializer = () => {
    useEffect(() => {
        AOS.init({
            once: true,
            duration: 800,
        });
    }, []);

    return null;
};

export default AOSInitializer;
