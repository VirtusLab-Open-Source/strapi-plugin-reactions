import { Data, UID } from "@strapi/strapi";
import { AnyEntity, StrapiUser } from "@sensinum/strapi-vl-utils";

import { StrapiId, ToBeFixed } from "./common";
import { StrapiReactions } from "../src/services/enrich";
import { ReactionsCount } from "../src/services/zone";
import { ReactionsPluginConfig } from "./config";
import { CTReaction, CTReactionType } from "./model";

export interface IServiceCommon {
  getPluginStore(): any;
}

export interface IServiceAdmin {
  fetchConfig<T extends ReactionsPluginConfig>(): Promise<T>;
  updateConfig(
    body: CTReactionType,
  ): Promise<ReactionsPluginConfig>;
  deleteReactionType(documentId: StrapiId): Promise<{ result: boolean }>;
  generateSlug(subject: string, documentId?: StrapiId): Promise<{ slug: string }>;
  uniqueSlug(slug: string, documentId?: StrapiId): Promise<string>;
  syncAssociations(): Promise<boolean>;
}

export interface IServiceClient {
  kinds(): Promise<Array<AnyEntity>>;
  list(kind?: string, uid?: UID.ContentType, user?: StrapiUser, documentId?: StrapiId): Promise<Array<AnyEntity>>;
  create(kind: string, uid: UID.ContentType, user?: StrapiUser | undefined, documentId?: StrapiId, ): Promise<AnyEntity>;
  delete(kind: string, uid: UID.ContentType, user?: StrapiUser | undefined, documentId?: StrapiId): Promise<boolean>;
  toggle(kind: string, uid: UID.ContentType, user?: StrapiUser | undefined, documentId?: StrapiId): Promise<AnyEntity | boolean>;
  prefetchConditions(type: string, uid?: string, documentId?: StrapiId): Promise<[AnyEntity, AnyEntity]>;
  directCreate(uid: UID.ContentType, kind: AnyEntity, related: AnyEntity, user: StrapiUser | undefined): Promise<AnyEntity>;
  directDelete(reactions: Array<CTReaction>): Promise<boolean>;
}

export interface IServiceEnrich {
  enrichOne<T extends AnyEntity, M extends any>(uid: UID.ContentType, response: T, populate: ToBeFixed): Promise<T>;
  enrichMany<T extends AnyEntity, M extends any>(uid: UID.ContentType, response: T, populate: ToBeFixed): Promise<T>;
  findReactions(filters: any, populate: ToBeFixed): null | AnyEntity | Array<AnyEntity>;
  composeReactionsMeta(acc: { [slug: string]: StrapiReactions }, curr: AnyEntity): { [slug: string]: StrapiReactions };
}

export interface IServiceZone {
  count(uid: UID.ContentType, documentId?: StrapiId): Promise<ReactionsCount>;
}
