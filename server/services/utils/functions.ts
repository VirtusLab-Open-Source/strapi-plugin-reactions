import { UID } from "@strapi/types";

export const getModelUid = (name: string): UID.ContentType => {
  const contentType = strapi.plugin("reactions").contentTypes[name];
  return (contentType as any).uid;
};