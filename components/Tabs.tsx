import React from 'react';
import { Tab } from './utils';

interface TabsProps {
    activeTab: Tab;
    tabs: Tab[];
    setActiveTab: (tab: Tab) => void;
}

export default function Tabs({ activeTab, setActiveTab, tabs }: TabsProps) {
    return (
        <div className="border-b border-gray-600 w-full">
            <ul className="flex flex-wrap -mb-px text-sm lg:text-base font-medium text-center text-gray-500 dark:text-gray-400 justify-center sm:justify-normal">
                {tabs.map((tab) => (
                    <li key={tab.name} className="me-2">
                        <button
                            onClick={() => setActiveTab(tab)}
                            className={`inline-flex items-center justify-center p-4 border-b-2 ${activeTab.name === tab.name ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
                                } rounded-t-lg dark:hover:text-gray-300 group`}
                        >
                            <span className="mr-2 text-lg">{tab.icon}</span>
                            {tab.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
