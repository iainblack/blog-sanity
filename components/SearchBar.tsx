import LoadingSpinner from "./LoadingSpinner";
import { SearchIcon } from "@sanity/icons";

interface SearchBarProps {
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: () => void;
    value: string;
    placeholder?: string;
    type?: string;
    error?: string;
    loading?: boolean;
    buttonText?: string;
    searchIcon?: boolean;
}

export default function SearchBar({ handleChange, onSubmit, loading, value, type, placeholder, error, buttonText, searchIcon }: SearchBarProps) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSubmit();
        }
    };

    return (
        <div className="flex w-full">
            <div className={`relative flex items-center w-full h-12 bg-white text-gray-600 border border-black py-3 px-4 leading-tight focus:outline-none focus:bg-white ${error ? "border-red-500" : ""} ${buttonText ? ' border-r-transparent' : ''}`}>
                {searchIcon && <SearchIcon className="h-6 w-6 text-gray-600" />}
                <input
                    className={`w-full h-11 body-text ${searchIcon ? 'pl-4' : ''} focus:outline-none focus:bg-white`}
                    type={type || "text"}
                    placeholder={placeholder || "Search"}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </div>
            {error && <p className="text-red-500 text-base ml-2 absolute -bottom-6">{error}</p>}
            {buttonText &&
                <button
                    className="two-tone-button whitespace-nowrap h-12 w-52"
                    type="button"
                    onClick={onSubmit}
                >
                    {loading ? <LoadingSpinner size={16} /> : <div className='text-xl font-garamond'>{buttonText}</div>}
                </button>}
        </div >
    );
}
