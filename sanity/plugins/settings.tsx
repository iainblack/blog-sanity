/**
 * This plugin contains all the logic for setting up the singletons
 */

import { definePlugin, type DocumentDefinition } from "sanity";
import { type StructureResolver } from "sanity/structure";
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { BlockContentIcon, DocumentTextIcon, ImageIcon } from "@sanity/icons";
import { pages, resourceTypes } from "@/components/utils";
import { FaCubes } from "react-icons/fa6";

export const singletonPlugin = definePlugin((types: string[]) => {
  return {
    name: "singletonPlugin",
    document: {
      // Hide 'Singletons (such as Settings)' from new document options
      // https://user-images.githubusercontent.com/81981/195728798-e0c6cf7e-d442-4e58-af3a-8cd99d7fcc28.png
      newDocumentOptions: (prev, { creationContext, ...rest }) => {
        if (creationContext.type === "global") {
          return prev.filter(
            (templateItem) => !types.includes(templateItem.templateId),
          );
        }

        return prev;
      },
      // Removes the "duplicate" action on the Singletons (such as Home)
      actions: (prev, { schemaType }) => {
        if (types.includes(schemaType)) {
          return prev.filter(({ action }) => action !== "duplicate");
        }

        return prev;
      },
    },
  };
});

// The StructureResolver is how we're changing the DeskTool structure to linking to document (named Singleton)
// like how "Home" is handled.
export const pageStructure = (
  typeDefArray: DocumentDefinition[],
): StructureResolver => {
  return (S, context) => {
    // Goes through all of the singletons that were provided and translates them into something the
    // Structure tool can understand
    const singletonItems = typeDefArray.map((typeDef) => {
      return S.listItem()
        .title(typeDef.title!)
        .icon(typeDef.icon)
        .child(
          S.editor()
            .id(typeDef.name)
            .schemaType(typeDef.name)
            .documentId(typeDef.name),
        );
    });

    // The default root list items (except custom ones)
    const defaultListItems = S.documentTypeListItems().filter(
      (listItem) => {
        const id = listItem.getId();
        return (
          id !== "galleryImage" &&
          id !== "post" &&
          id !== "contentPanel" &&
          !typeDefArray.find((singleton) => singleton.name === id)
        );
      }
    );

    // Create a list of posts grouped by page with ordering capability
    const posts = pages
      .filter(page => page.contentType === 'post')
      .map(page =>
        orderableDocumentListDeskItem({
          id: page.slug,
          type: 'post',
          title: page.name,
          icon: DocumentTextIcon,
          S,
          context,
          filter: `_type == "post" && pageId == "${page.name}"`
        })
      );

    const resources = resourceTypes.map(resourceType =>
      S.listItem()
        .title(resourceType)
        .child(
          S.documentList()
            .title(`${resourceType} Resources`)
            .filter('_type == "resource" && type == $type')
            .params({ type: resourceType })
        )
        .icon(FaCubes)
    );

    return S.list()
      .title("Content")
      .items([
        S.listItem()
          .title('Posts')
          .icon(DocumentTextIcon)
          .child(
            S.list()
              .title('Posts')
              .items([
                ...posts
              ])
          ),
        S.listItem()
          .title('Resources')
          .icon(FaCubes)
          .child(
            S.list()
              .title('Resource Types')
              .items([
                ...resources,
              ])
          ),
        orderableDocumentListDeskItem({
          type: 'galleryImage',
          title: 'Photo Gallery Images',
          icon: ImageIcon,
          S,
          context
        }),
        orderableDocumentListDeskItem({
          type: 'contentPanel',
          title: 'Landing Page Panels',
          icon: BlockContentIcon,
          S,
          context
        }),
        S.documentTypeListItem('author').title('Authors'),
        S.divider(),
        ...singletonItems,
      ]);
  };
};
