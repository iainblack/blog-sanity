import { format } from "date-fns";
import { ClockIcon } from "@sanity/icons";

export default function DateComponent({ dateString }: { dateString: string }) {
  return (
    <div className="flex items-center">
      <ClockIcon className="text-gray-500 mr-1 w-5 h-5" />
      <time dateTime={dateString} className="text-gray-500 text-sm">
        {format(new Date(dateString), "LLLL	d, yyyy")}
      </time>
    </div>
  );
}
