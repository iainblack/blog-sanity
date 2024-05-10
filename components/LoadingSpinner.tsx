
export default function LoadingSpinner() {
    return (
        <div className="flex pt-12 justify-center w-full h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
}