import PortableText from "@/components/portable-text";
import * as demo from "@/sanity/lib/demo";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  SettingsQueryResponse,
  TitlePageContentPanel,
  TitlePageContentPanelsQueryResponse,
  settingsQuery,
  titlePageContentPanelsQuery,
} from "@/sanity/lib/queries";
import { Image } from "next-sanity/image";
import { urlForImage } from "@/sanity/lib/utils";
import CenteredPanel from "@/components/CenteredPanel";
import { PortableTextBlock } from "next-sanity";
import { cleanString } from "@/components/utils";

function Panel({
  panel: { title, content, image, size },
}: {
  panel: TitlePageContentPanel;
}) {

  const cleanImage = cleanString(image?.position);
  const imagePosition = cleanImage === "left" ? 'lg:order-1' : 'lg:order-2';
  const textPosition = cleanImage === "left" ? 'lg:order-2' : 'lg:order-1';

  return (
    <CenteredPanel size={size} singleContent={!image}>
      {
        image && <div className={`relative w-full sm:w-1/2 xl:w-1/3 ${imagePosition}`} style={{ aspectRatio: "1/1" }}>
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
      <div className={`mt-4 w-full text-left max-w-2xl lg:${image ? 'max-w-3xl' : 'max-w-5xl'} lg:mt-0 ${image ? 'md:text-left' : 'md:text-center'} ${textPosition}`}>
        {title && <h1 className="text-6xl flex-wrap font-bold leading-tight tracking-tighter lg:text-6xl">
          {title}
        </h1>}
        <PortableText
          className={`text-pretty flex-wrap mt-5 text-lg }`}
          value={content as PortableTextBlock[]}
        />
      </div>
    </CenteredPanel >
  );
}

export default async function Page() {
  const [settings, contentPanel] = await Promise.all([
    sanityFetch<SettingsQueryResponse>({
      query: settingsQuery,
    }),
    sanityFetch<TitlePageContentPanelsQueryResponse>({ query: titlePageContentPanelsQuery }),
  ]);

  return (
    contentPanel && contentPanel.length > 0 && <>
      {contentPanel.map((panel) => (
        <Panel key={panel._id} panel={panel} />
      ))}
    </>)
}
