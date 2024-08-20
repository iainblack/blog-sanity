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
      description: "The type of resource, for filtering and display purposes.",
      options: {
        list: ["Books", "Websites", "Other"]
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
      hidden: ({ parent }) => parent?.type !== "Books",
    }),
    defineField({
      name: "publisher",
      title: "Publisher",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "Books",
      validation: (Rule) => Rule.custom((publisher, context) => {
        const datePublished = context.document?.datePublished;
        if ((publisher && !datePublished) || (!publisher && datePublished)) {
          return "Both Publisher and Year Published must be populated.";
        }
        return true;
      }),
    }),
    defineField({
      name: "datePublished",
      title: "Year Published",
      type: "string",
      hidden: ({ parent }) => parent?.type !== "Books",
      validation: (Rule) => Rule.regex(/^\d{4}$/, {
        name: "year", // Error message is "Does not match year pattern"
        invert: false, // Boolean to allow any value that does NOT match pattern
      }).error("Please enter a valid year (e.g., 2023)").custom((datePublished, context) => {
        const publisher = context.document?.publisher;
        if ((datePublished && !publisher) || (!datePublished && publisher)) {
          return "Both Publisher and Year Published must be populated.";
        }
        return true;
      }),
      options: {
        list: Array.from({ length: 251 }, (_, i) => {
          const year = new Date().getFullYear() - i;
          return { title: year.toString(), value: year.toString() };
        }),
      },
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      hidden: ({ parent }) => parent?.type === "Books",
    }),
    defineField({
      name: "urlDisplayName",
      title: "URL Display Name",
      type: "string",
      description: "The text to display for the URL link.",
      hidden: ({ parent }) => parent?.type === "Books",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (rule) => rule.max(1300).error("Description must be 1000 characters or less."),
    }),
    defineField({
      name: "coverImage",
      title: "Image",
      type: "image",
      hidden: true,
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
    }),
  ],
  preview: {
    select: {
      title: "title",
      //media: "coverImage",
    },
    prepare({ title }) {
      return { title };
    },
  },
});
