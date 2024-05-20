import PortableText from "@/components/portable-text";
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
import { PortableTextBlock } from "next-sanity";
import { getContentPanelsByPage } from "./actions";

function Panel({
  panel: { title, content, image, size },
}: {
  panel: ContentPanel;
}) {

  const cleanedPosition = stegaClean(image?.position);
  const imagePosition = cleanedPosition === "left" ? 'lg:order-1' : 'lg:order-2';
  const textPosition = cleanedPosition === "left" ? 'lg:order-2' : 'lg:order-1';

  return (
    <CenteredPanel size={size}>
      {image && image?.asset &&
        <div className={`centered-container__image ${imagePosition}`}>
          <Image
            alt={image?.alt || ""}
            src={urlForImage(image)?.url() as string}
            sizes="50vw"
            style={{ objectFit: "cover" }}
            priority
            fill
          />
        </div>
      }
      <div className={`mt-4 w-full text-left max-w-2xl ${image && image?.asset ? 'lg:max-w-lg' : 'lg:max-w-2xl'} lg:mt-0 ${image && image?.asset ? 'md:text-left' : 'md:text-center'} ${textPosition}`}>
        {title && <h1 className="flex-wrap header-text">
          {title}
        </h1>}
        <PortableText
          className={`text-pretty flex-wrap mt-5 body-text`}
          value={content as PortableTextBlock[]}
        />
      </div>
    </CenteredPanel >
  );
}

export default async function Page() {
  const [settings] = await Promise.all([
    sanityFetch<SettingsQueryResponse>({
      query: settingsQuery,
    }),
  ]);
  const contentPanels = await getContentPanelsByPage('Home');

  return (
    contentPanels && contentPanels.length > 0 &&
    <div>
      {contentPanels.map((panel) => (
        <Panel key={panel._id} panel={panel} />
      ))}
    </div>
  )
}
