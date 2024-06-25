import { Dispatch, SetStateAction } from "react";

interface PreferencesFormProps {
    preferences: { [key: string]: boolean };
    setPreferences: Dispatch<SetStateAction<{ [key: string]: boolean; }>>;
    showUnsubscribe?: boolean;
    handleUnsubscribeClick?: () => void;
}

export default function PreferencesForm(props: PreferencesFormProps) {
    const { preferences, setPreferences, showUnsubscribe, handleUnsubscribeClick } = props;

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPreferences({
            ...preferences,
            [name]: checked,
        });
    };

    return (
        <div className="w-full">
            <h6 className="text-sm lg:text-base text-left text-gray-600">
                Revise the types of content for which you would like to receive updates
            </h6>
            {showUnsubscribe &&
                <h6 className="text-sm lg:text-base text-left text-gray-600">
                    or click<button onClick={handleUnsubscribeClick} className="text-blue-500 underline">unsubscribe</button>
                    {" "} if you no longer wish to receive any email communications.
                </h6>}
            <div className="flex flex-col items-start w-full space-y-4 mt-5">
                {Object.entries(preferences).map(([option, isChecked]) => (
                    <label key={option} className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            className="accent-primary"
                            name={option}
                            checked={isChecked}
                            onChange={handleCheckboxChange} />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
        </div >
    )
}