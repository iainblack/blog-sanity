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
        <h6 className="text-xl text-center">{children}</h6>
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

  value = normalizeText(value);

  return (
    <div className={[className].filter(Boolean).join(" ")}>
      <PortableText value={value} components={components} />
    </div>
  );
}
