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

function Panel({
  panel: { title, content, image, size, backgroundColor },
}: {
  panel: ContentPanel;
}) {

  const cleanedPosition = stegaClean(image?.position);
  const cleanedBgColor = stegaClean(backgroundColor);
  const cleanedSize = stegaClean(size);

  const imagePosition = cleanedPosition === "left" ? 'xl:order-1' : 'xl:order-2';
  const textPosition = cleanedPosition === "left" ? 'xl:order-2' : 'xl:order-1';

  const spacedDescription = content && content.split("\n").map((paragraph, index) => (
    <p key={index} className="body-text pb-2">{paragraph}</p>
  ));

  return (
    <CenteredPanel size={cleanedSize} bgColor={cleanedBgColor}>
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
      <div className={`mt-4 w-full text-left max-w-3xl lg:mt-0
       ${image && image?.asset ? 'md:text-left' : 'md:text-center'} ${textPosition}`}
      >
        {title && <h1 className="flex-wrap header-text">
          {title}
        </h1>}
        <h6 className={`text-pretty flex-wrap mt-5 body-text`}>{spacedDescription}</h6>
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
  contentPanels?.sort((a, b) => a.order - b.order);

  return (
    contentPanels && contentPanels.length > 0 &&
    <div>
      {contentPanels.map((panel) => (
        <Panel key={panel._id} panel={panel} />
      ))}
    </div>
  )
}
