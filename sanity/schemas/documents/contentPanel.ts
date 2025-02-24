import { pages } from "@/components/utils";
import { BlockContentIcon } from "@sanity/icons";
import { orderRankField } from "@sanity/orderable-document-list";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "contentPanel",
  title: "Landing Page Panel",
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
    orderRankField({ type: 'contentPanel', newItemPosition: 'after' }),
    defineField({
      name: "size",
      title: "Panel Size",
      type: "string",
      options: {
        list: ["Small", "Medium", "Large"],
      },
      initialValue: "Medium"
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
      type: "text",
      description: "Content should be limited to one to two paragraphs per panel.",
      validation: rule => [
        rule.required().min(1).error("Content is required."),
      ]
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
          description: "Fallback text if the image fails to load.",
          validation: (rule) => [
            rule.custom((alt, context) => {
              if ((context.document?.image as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            }),
            rule.custom((alt, context) => {
              if (alt && !(context.document?.image as any)?.asset?._ref) {
                return "Remove alt text if there is no image";
              }
              return true;
            }),
          ]
        },
        {
          name: "caption",
          type: "string",
          title: "Caption",
          description: "A caption for the image.",
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
