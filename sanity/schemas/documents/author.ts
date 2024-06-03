import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  icon: UserIcon,
  type: "document",
  description: "Authors can be reused for blog posts",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required().error("Author name is required."),
      description: "Authors can be reused for blog posts",
    }),
  ],
});
