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
      validation: (rule) => rule.required().error("Resource type is required."),
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
    }),
    defineField({
      name: "publisher",
      title: "Publisher",
      type: "string",
    }),
    defineField({
      name: "datePublished",
      title: "Date Published",
      type: "datetime",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
    defineField({
      name: "urlDisplayName",
      title: "URL Display Name",
      type: "string",
      description: "The text to display for the URL link.",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      //validation: (rule) => rule.required().max(800).error("Description must be 800 characters or less."),
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
          description: "Fallback text if the image cannot be displayed.",
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
