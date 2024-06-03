import { ImageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { pages } from "@/components/utils";

export default defineType({
  name: "galleryImage",
  title: "Photo Gallery Image",
  icon: ImageIcon,
  type: "document",
  fields: [
    defineField({
      name: "pageId",
      title: "Page",
      type: "string",
      description: "The page containing the gallery this image should be displayed in.",
      options: {
        list: pages.filter((page) => page.contentType === "gallery").map((page) => page.name),
      },
      validation: (rule) => rule.required().error("Page is required."),
    }),
    defineField({
      name: "picture",
      title: "Picture",
      type: "image",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) => [
            rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            }),
            rule.custom((alt, context) => {
              if (!(context.document?.coverImage as any)?.asset?._ref && alt) {
                return "Remove alt text if there is no image";
              }
              return true;
            }),
          ]
        },
      ],
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      validation: (rule) => rule.required().error("Image is required."),
    }),
  ],
});
