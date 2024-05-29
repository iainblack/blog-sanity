'use client';

import React from 'react';
import { FaBook, FaCubes, FaLink } from 'react-icons/fa6';

interface TabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const tabs = [
    "Books",
    "Websites",
    "Other"
]

export default function ResourceTabs({ activeTab, setActiveTab }: TabsProps) {

    function getIcon(tab: string) {
        switch (tab) {
            case "Books":
                return <FaBook className="w-5 h-5 mr-2" />;
            case "Websites":
                return <FaLink className="w-5 h-5 mr-2" />;
            case "Other":
                return <FaCubes className="w-5 h-5 mr-2" />;
            default:
                return <FaCubes className="w-5 h-5 mr-2" />;
        }
    }

    return (
        <div className="border-b border-gray-200 dark:border-gray-700 w-full mb-6">
            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                {tabs.map((tab) => (
                    <li key={tab}>
                        <button
                            onClick={() => setActiveTab(tab)}
                            className={`inline-flex items-center justify-center p-4 border-b-2 rounded-t-lg group ${activeTab === tab
                                ? 'text-blue-600 border-blue-600'
                                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                }`}
                            aria-current={activeTab === tab ? 'page' : undefined}
                        >
                            {getIcon(tab)}
                            {tab}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
