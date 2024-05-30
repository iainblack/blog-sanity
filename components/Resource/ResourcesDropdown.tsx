'use client';

import { useState } from "react";
import { ChevronDownIcon } from "@sanity/icons";

interface DropdownProps {
    selected: string[];
    setSelected: (selected: string[]) => void;
}

const options = ["Books", "Websites", "Other"];

export default function ResourcesDropdown({ selected, setSelected }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option: string) => {
        if (selected.includes(option)) {
            setSelected(selected.filter(item => item !== option));
        } else {
            setSelected([...selected, option]);
        }
    };

    return (
        <div className="relative">
            <button
                className="flex items-center justify-between w-52 h-10 bg-contrast-bg text-gray-600 border border-black py-3 px-3 leading-tight focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
            >
                {"Filter by type"}
                <ChevronDownIcon className="h-7 w-7 text-gray-600" />
            </button>
            {isOpen && (
                <div className="absolute z-10 w-52 bg-white border border-black">
                    {options.map((option) => (
                        <label key={option} className="flex items-center w-full h-10 px-4 py-1 hover:bg-primary hover:text-white cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => handleSelect(option)}
                                className="mr-2"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
