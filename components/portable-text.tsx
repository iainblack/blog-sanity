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
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 pl-4 my-4">{children}</blockquote>
      ),
      ul: ({ children }) => <ul className="list-disc ml-8 my-4">{children}</ul>,
      ol: ({ children }) => (
        <ol className="list-decimal ml-8 my-4">{children}</ol>
      ),
      li: ({ children }) => <li className="mb-2">{children}</li>,
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
