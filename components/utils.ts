 
export const pages: { name: string; slug: string, contentType?: string}[] = [
    { name: "Home", slug: "", contentType: "contentPanel" },
    { name: "Lou's Healing Journey", slug: "healing-journey", contentType: "post" },
    { name: "Additional Topics", slug: "additional-topics", contentType: "post" },
    { name: "Messages for Humanity", slug: "messages-for-humanity", contentType: "post" },
    { name: "Recommended Resources", slug: "recommended-resources", contentType: "contentPanel"},
    { name: "Photos", slug: "photos", contentType: "gallery" },
];

export const emailPreferenceOptions = pages.filter((page) => page.contentType === "post").map((page) => page.name);

export interface BasicAlertState {
    message: string;
    type: "error" | "success";
    show: boolean;
}