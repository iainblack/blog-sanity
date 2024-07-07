
export const pages: { name: string; slug: string, contentType?: string }[] = [
  { name: "Home", slug: "", contentType: "contentPanel" },
  { name: "Lou's Healing Journey", slug: "healing-journey", contentType: "post" },
  { name: "Additional Topics", slug: "additional-topics", contentType: "post" },
  { name: "Messages for Humanity", slug: "messages-for-humanity", contentType: "post" },
  { name: "Resources", slug: "resources", contentType: "resource" },
  { name: "Photos", slug: "photos", contentType: "gallery" },
];

export const resourceTypes = ["Books", "Websites", "Other"];

export const emailPreferenceOptions = pages.filter((page) => page.contentType === "post").map((page) => page.name);

export interface Tab {
  name: string;
  icon: React.ReactNode;
}

export interface BasicAlertState {
  message: string;
  type: "error" | "success";
  show: boolean;
}

export const trimPlural = (type: string): string => {
  if (type.endsWith('s')) {
    return type.slice(0, -1);
  }
  return type;
};

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

export function normalizeText(blocks: any[]) {
  if (!blocks) return [];
  return blocks.map(block => {
    if (block._type === 'block' && block.children) {
      return {
        ...block,
        children: block.children.map((child: { _type: string; text: string; }) => {
          if (child._type === 'span' && typeof child.text === 'string') {
            return {
              ...child,
              text: child.text
                // Add one space after a period if followed by a capital letter
                .replace(/(\.)([A-Z])/g, '$1 $2')
                // Original functionality to add one space if no space follows punctuation (excluding periods)
                .replace(/([:?!])([^\s])/g, '$1 $2')
            };
          }
          return child;
        }),
      };
    }
    return block;
  });
}