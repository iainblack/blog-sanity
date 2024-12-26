import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "next-sanity";
import { normalizeText } from "./utils";


export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      h4: ({ children }) => (
        <h6 className="text-2xl lg:text-2xl text-center py-5">{children}</h6>
      ),
      blockquote: ({ children }) => (
        <blockquote className="italic sm:px-12 xl:px-16">{children}</blockquote>
      ),
    },
    marks: {
      link: ({ children, value }) => {
        return (
          <a href={value?.href} rel="noreferrer noopener" target="_blank" className="underline text-blue-600">
            {children}
          </a>
        );
      },
    },
  };

  //value = normalizeText(value);

  return (
    <div className={[className].filter(Boolean).join(" ")}>
      <PortableText value={value} components={components} />
    </div>
  );
}
