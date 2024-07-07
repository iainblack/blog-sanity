import { sanityFetch } from "@/sanity/lib/fetch";
import {
  SettingsQueryResponse,
  settingsQuery,
} from "@/sanity/lib/queries";
import { getContentPanelsByPage } from "./actions";
import ExpandablePanel from '@/components/ExpandablePanel';

export default async function Page() {
  const contentPanels = await getContentPanelsByPage('Home');
  contentPanels?.sort((a, b) => a.order - b.order);

  return (
    contentPanels && contentPanels.length > 0 &&
    <div>
      {contentPanels.map((panel) => (
        <ExpandablePanel key={panel._id} panel={panel} />
      ))}
    </div>
  )
}
