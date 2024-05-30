import { FaCubes } from "react-icons/fa6";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "resource",
  title: "Resource",
  icon: FaCubes,
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Resource Type",
      type: "string",
      description: "The type of resource. This will determine where it is displayed.",
      options: {
        list: ["Book", "Website", "Other"]
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      hidden: ({ document }) => document?.type !== "Book",
    }),
    defineField({
      name: "publisher",
      title: "Publisher",
      type: "string",
      hidden: ({ document }) => document?.type !== "Book",
    }),
    defineField({
      name: "datePublished",
      title: "Date Published",
      type: "datetime",
      hidden: ({ document }) => document?.type !== "Book",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      hidden: ({ document }) => document?.type !== "Website",
  }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "coverImage",
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
      media: "coverImage",
    },
    prepare({ title, media }) {
      return { title, media };
    },
  },
});
