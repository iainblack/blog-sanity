

export default function PostFilters({ setOrder, order, postCount, loading }: { setOrder: (order: string) => void, order: string, postCount?: number, loading: boolean }) {
    return (
        <div className="flex pb-2 justify-left items-center">
            <label htmlFor="order-select" className="mr-2">Sort by:</label>
            <select
                className="p-2 border-gray-300 rounded-md"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                disabled={loading || !postCount || postCount === 0}
            >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
            </select>
        </div>
    );
}