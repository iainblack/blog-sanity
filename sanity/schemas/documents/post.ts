import { DocumentTextIcon } from "@sanity/icons";
import { format, parseISO } from "date-fns";
import { defineField, defineType } from "sanity";

import authorType from "./author";
import { pages } from "@/components/utils";

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "pageId",
      title: "Page",
      type: "string",
      description: "The page that this post should be displayed on.",
      options: {
        list: pages.filter((page) => page.contentType === "post").map((page) => page.name),
      },
      validation: (rule) => rule.required().error("Page is required."),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().error("Title is required."),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'A subtitle for the post.',
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A 'slug' is the path of the URL for this post. It should be unique.",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required().error("Slug is required."),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ 
        type: "block",
        styles: [
          { title: "Normal", value: "normal" },
          { title: "Subtitle", value: "h4" },
        ],
       }],
      description: "The content of the post. (Don't mind the missing spaces after punctuation in the editor, it will be normalized on the webpage.)",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "string",
      description: "A short description of the post.",
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
      description: "Upload an image or search for one on Unsplash.",
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
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: authorType.name }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "date",
      media: "coverImage",
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean);

      return { title, media, subtitle: subtitles.join(" ") };
    },
  },
});
