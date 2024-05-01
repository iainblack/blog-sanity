import { BlockContentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "titlePageContentPanel",
  title: "Title Page Content Panel",
  icon: BlockContentIcon,
  type: "document",
  fields: [
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: ["normal", "large", "xl"],
      },
      initialValue: "normal"
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
      validation: (rule) => rule.required(),
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
          description: "Important for SEO and accessiblity.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        },
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
