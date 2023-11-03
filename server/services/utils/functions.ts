import { UID } from "@strapi/types";
import { StrapiId } from "../../../types";

export const getModelUid = (name: string): UID.ContentType => {
  const contentType = strapi.plugin("reactions").contentTypes[name];
  return (contentType as any).uid;
};

export const buildRelatedId = (uid: UID.ContentType, id?: StrapiId) => `${uid}:${id ? `${id}` : '1'}`;