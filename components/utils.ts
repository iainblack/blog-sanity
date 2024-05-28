 
export const pages: { name: string; slug: string, contentType?: string}[] = [
    { name: "Home", slug: "", contentType: "contentPanel" },
    { name: "Lou's Healing Journey", slug: "healing-journey", contentType: "post" },
    { name: "Additional Topics", slug: "additional-topics", contentType: "post" },
    { name: "Messages for Humanity", slug: "messages-for-humanity", contentType: "post" },
    { name: "Photos", slug: "photos", contentType: "gallery" },
];

export const emailPreferenceOptions = pages.filter((page) => page.contentType === "post").map((page) => page.name);

export interface BasicAlertState {
    message: string;
    type: "error" | "success";
    show: boolean;
}

export function formatTimeAgo(date: string | Date): string {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) {
        return `${years} year${years > 1 ? "s" : ""} ago`;
    } else if (months > 0) {
        return `${months} month${months > 1 ? "s" : ""} ago`;
    } else if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    } else {
        return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
    }
}