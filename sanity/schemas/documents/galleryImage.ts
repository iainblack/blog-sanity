import { pages } from "@/components/utils";
import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "galleryImage",
  title: "Photo Gallery Image",
  icon: ImageIcon,
  type: "document",
  fields: [
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      fields: [
        {
            name: "pageId",
            title: "Page",
            type: "string",
            description: "The page that this panel should be displayed on.",
            options: {
              list: pages.filter((page) => page.contentType === "gallery").map((page) => page.name),
            }
        },
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.picture as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      validation: (rule) => rule.required(),
    }),
  ],
});
