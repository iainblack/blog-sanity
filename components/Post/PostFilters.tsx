import { UlistIcon, ThLargeIcon, SortIcon } from "@sanity/icons";
import Dropdown from "../Dropdown";

interface PostFiltersProps {
    setOrder: (order: string) => void;
    order: string;
    postCount?: number;
    loading: boolean;
    view: "grid" | "list";
    setView: (view: "grid" | "list") => void;
}

export default function PostFilters({ setOrder, order, view, setView }: PostFiltersProps) {
    return (
        <div className="flex justify-center space-x-14 items-center">
            <div className="flex space-x-2 items-center">
                <Dropdown
                    variant="outlined"
                    options={order === "asc" ? ["Newest First"] : ["Oldest First"]}
                    label={order === "asc" ? "Oldest First" : "Newest First"}
                    selected={[order]}
                    setSelected={() => setOrder(order === "asc" ? "desc" : "asc")}
                />
            </div>
            <>
                <div className="flex items-center">
                    <button onClick={() => setView("grid")} className={`p-2 rounded-md ${view === "grid" ? "bg-gray-300" : "bg-default-bg"} hover:bg-gray-200`}>
                        <ThLargeIcon className="w-6 h-6" />
                    </button>
                    <button onClick={() => setView("list")} className={`p-2 rounded-md ${view === "list" ? "bg-gray-300" : "bg-default-bg"} hover:bg-gray-200`}>
                        <UlistIcon className="w-6 h-6" />
                    </button>
                </div>
            </>
        </div>
    );
}