import { resourcesContent } from "../data/resourcesContent";

const resourceIds = new Set(resourcesContent.map((item) => item.id));

export const resourceRoute = (id: string) => {
  if (!resourceIds.has(id)) {
    console.warn(`Unknown resource id: ${id}`);
    return "/resources";
  }
  return `/resources/${id}`;
};

export const allResources = resourcesContent;
