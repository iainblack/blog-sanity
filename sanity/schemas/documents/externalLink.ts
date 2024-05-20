import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "externalLink",
  title: "Recommended Resource",
  icon: LinkIcon,
  type: "document",
  fields: [
    defineField({
        name: "url",
        title: "URL",
        type: "url",
        validation: (rule) => rule.required(),
    }),
    defineField({
        name: "title",
        title: "Title",
        type: "string",
        validation: (rule) => rule.required(),
    }),
  ],
});
