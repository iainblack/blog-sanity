import Link from "next/link";

interface PreferencesFormProps {
    preferences: { [key: string]: boolean };
    setPreferences: React.Dispatch<React.SetStateAction<{ [key: string]: boolean } | undefined>>;
    handleSaveClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    handleCancelClick?: () => void;
    showUnsubscribe?: boolean;
    handleUnsubscribeClick?: () => void;
}

export default function PreferencesForm(props: PreferencesFormProps) {
    const { preferences, handleSaveClick, handleCancelClick, setPreferences, showUnsubscribe, handleUnsubscribeClick } = props;

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setPreferences({
            ...preferences,
            [name]: checked,
        });
    };

    return (
        <div className="p-5 shadow-xl rounded-xl bg-white">
            <h6 className="text-sm text-left text-gray-500">Select the types of content you would like to receive updates for</h6>
            {showUnsubscribe &&
                <h6
                    className="text-sm text-left text-gray-500">or <button onClick={handleUnsubscribeClick} className="text-blue-500 underline">unsubscribe</button> from all emails.</h6>}
            <div className="flex flex-col items-start w-full space-y-4 mt-5">
                {Object.entries(preferences).map(([option, isChecked]) => (
                    <label key={option} className="flex items-center space-x-4">
                        <input
                            type="checkbox"
                            name={option}
                            checked={isChecked}
                            onChange={handleCheckboxChange} />
                        <span>{option}</span>
                    </label>
                ))}
            </div>
            <div className="flex justify-end mt-8 space-x-4">
                {handleCancelClick && <button onClick={handleCancelClick} className="bg-gray-300 px-4 py-2 rounded-lg">
                    Cancel
                </button>}
                <button onClick={handleSaveClick} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                    Submit
                </button>
            </div>
        </div>
    )
}