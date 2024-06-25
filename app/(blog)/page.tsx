import { stegaClean } from '@sanity/client/stega'
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  SettingsQueryResponse,
  ContentPanel,
  settingsQuery,
} from "@/sanity/lib/queries";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import CenteredPanel from "@/components/CenteredPanel";
import { getContentPanelsByPage } from "./actions";
import ExpandablePanel from '@/components/ExpandablePanel';

export default async function Page() {
  const [settings] = await Promise.all([
    sanityFetch<SettingsQueryResponse>({
      query: settingsQuery,
    }),
  ]);
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
