import { UID, Data } from "@strapi/strapi";

export const getModelUid = (name: string): UID.ContentType => {
  const contentType = strapi.plugin("reactions").contentTypes[name];
  return (contentType as any).uid;
};

export const buildRelatedId = (uid?: UID.ContentType, documentId?: Data.DocumentID) => uid ? `${uid}${documentId ? `:${documentId}` : ''}` : '';