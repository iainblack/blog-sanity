import { pages } from "@/components/utils";
import { BlockContentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contentPanel",
  title: "Content Panel",
  icon: BlockContentIcon,
  type: "document",
  fields: [
    defineField({
      name: "pageId",
      title: "Page",
      type: "string",
      description: "The page that this panel should be displayed on.",
      options: {
        list: pages.filter((page) => page.contentType === "contentPanel").map((page) => page.name),
      },
      validation: (rule) => rule.required().error("Page is required."),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "The order in which this panel should be displayed on the page.",
      validation: (rule) => rule.required().error("Order is required."),
    }),
    defineField({
      name: "size",
      title: "Panel Size",
      type: "string",
      options: {
        list: ["normal", "large", "xl"],
      },
      initialValue: "normal"
    }),
    defineField({
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      description: "The color of the background for this panel.",
      options: {
        list: ["default", "contrast", "primary", "dark"],
      },
      initialValue: "default"
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }],
      description: "Text should be kept short and to the point for this panel. One or two short paragraphs is best",
      validation: (rule) => rule.required().error("Content is required."),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Fallback text if the image cannot be displayed.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.image as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
        {
          name: "position",
          type: "string",
          title: "Position",
          options: {
            list: ["left", "right"],
            layout: "radio",
          },
          hidden: ({ document }) => !document?.image,
          initialValue: "left",
        }
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare({ title, media }) {
      return { title, media };
    },
  },
});
