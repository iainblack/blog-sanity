'use client';

import { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@sanity/icons";

interface DropdownProps {
    options: string[];
    label?: string;
    selected: string[];
    setSelected: (selected: any) => void;
    checkbox?: boolean;
    variant?: "outlined" | "filled";
}

export default function Dropdown({ selected, setSelected, options, label, checkbox, variant }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleCheckboxSelect = (option: string) => {
        if (selected.includes(option)) {
            setSelected(selected.filter(item => item !== option));
        } else {
            setSelected([...selected, option]);
        }
    };

    const handleListSelect = (option: string) => {
        setSelected([option]);
        setIsOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filledButtonClass = 'bg-contrast-bg text-gray-600 border border-black leading-tight';
    const bottomBorderClass = 'border-b border-black focus:border-none';

    const bottomBorderMenuClass = 'border rounded-lg mt-1';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className={`flex items-center justify-between w-52 h-10 py-3 pl-3 pr-1 ${variant === "outlined" ? bottomBorderClass : filledButtonClass}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {label || "Select"}
                <ChevronDownIcon className="h-7 w-7 text-gray-600" />
            </button>
            {isOpen && (
                <div className={`absolute z-10 w-52 overflow-hidden bg-white border-x border-b border-black ${bottomBorderMenuClass}`}>
                    {options.map((option) => (
                        <label key={option} onClick={!checkbox ? () => handleListSelect(option) : undefined}
                            className="flex space-x-2 items-center w-full h-10 px-4 py-1 hover:bg-primary hover:text-white cursor-pointer">
                            {checkbox && <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => handleCheckboxSelect(option)}
                                className="mr-2"
                            />}
                            {option}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
}
