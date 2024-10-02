import { Data, UID } from "@strapi/strapi";

export type ToBeFixed = any;

export type StrapiId = Data.ID | Data.DocumentID;

export type RelatedId = `${UID.ContentType}:${StrapiId}`;