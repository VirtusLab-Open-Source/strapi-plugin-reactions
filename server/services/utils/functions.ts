import { ContentType } from "@strapi/strapi/lib/types/core/uid";

export const getModelUid = (name: string): ContentType => {
    return strapi.plugin("reactions").contentTypes[name]?.uid;
  };