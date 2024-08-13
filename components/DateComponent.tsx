import { format } from "date-fns";
import { ClockIcon } from "@sanity/icons";

export default function DateComponent({ dateString, icon, fontSize }: { dateString: string, icon?: boolean, fontSize?: string }) {
  return (
    <div className="flex items-center whitespace-nowrap">
      {icon && <ClockIcon className="text-gray-600 mr-1 w-5 h-5" />}
      <time dateTime={dateString} className={`text-gray-600 ${fontSize ?? 'text-lg'} font-garamond`}>
        {format(new Date(dateString), "LLLL	d, yyyy")}
      </time>
    </div>
  );
}
