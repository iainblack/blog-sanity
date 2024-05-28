import { UlistIcon, ThLargeIcon, SortIcon } from "@sanity/icons";

interface PostFiltersProps {
    setOrder: (order: string) => void;
    order: string;
    postCount?: number;
    loading: boolean;
    view: "grid" | "list";
    setView: (view: "grid" | "list") => void;
}

export default function PostFilters({ setOrder, order, postCount, loading, view, setView }: PostFiltersProps) {
    return (
        <div className="flex justify-center space-x-14 items-center">
            <div>
                <label htmlFor="order-select" className="mr-2">Sort by:</label>
                <select
                    className="p-2 border-gray-300 rounded-md bg-inherit"
                    value={order}
                    onChange={(e) => setOrder(e.target.value)}
                    disabled={loading || !postCount || postCount === 0}
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
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