import { Data, UID } from "@strapi/strapi";
import { AnyEntity, StrapiUser, StrapiQueryParamsParsed } from "@sensinum/strapi-vl-utils";

import { ToBeFixed } from "./common";
import { type PrefetchConditionsProps } from "../server/src/services/client";
import { StrapiReactions } from "../server/src/services/enrich";
import { ReactionsCount } from "../server/src/services/zone";
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
  deleteReactionType(documentId: Data.DocumentID): Promise<{ result: boolean }>;
  generateSlug(subject: string, documentId?: Data.DocumentID): Promise<{ slug: string }>;
  uniqueSlug(slug: string, documentId?: Data.DocumentID): Promise<string>;
  syncAssociations(): Promise<boolean>;
}

export interface IServiceClient {
  kinds(): Promise<Array<AnyEntity>>;
  list(kind?: string, uid?: UID.ContentType, user?: StrapiUser, documentId?: Data.DocumentID, locale?: string): Promise<Array<AnyEntity>>;
  listPerUser(user: StrapiUser, kind?: string, populate?: StrapiQueryParamsParsed): Promise<Array<AnyEntity>>;
  create(kind: string, uid: UID.ContentType, user?: StrapiUser, documentId?: Data.DocumentID, locale?: string): Promise<AnyEntity>;
  delete(kind: string, uid: UID.ContentType, user?: StrapiUser, documentId?: Data.DocumentID, locale?: string): Promise<boolean>;
  toggle(kind: string, uid: UID.ContentType, user?: StrapiUser, documentId?: Data.DocumentID, locale?: string): Promise<AnyEntity | boolean>;
  prefetchConditions(props: PrefetchConditionsProps): Promise<[AnyEntity, AnyEntity]>;
  directCreate(uid: UID.ContentType, kind: AnyEntity, related: AnyEntity, user?: StrapiUser, locale?: string): Promise<AnyEntity>;
  directDelete(reactions: Array<CTReaction>, locale?: string): Promise<boolean>;
}

export interface IServiceEnrich {
  enrichOne<T extends AnyEntity, M extends any>(uid: UID.ContentType, response: T, populate: ToBeFixed, locale?: string): Promise<T>;
  enrichMany<T extends AnyEntity, M extends any>(uid: UID.ContentType, response: T, populate: ToBeFixed, locale?: string): Promise<T>;
  findReactions(filters: any, populate: ToBeFixed, locale?: string): null | AnyEntity | Array<AnyEntity>;
  composeReactionsMeta(acc: { [slug: string]: StrapiReactions }, curr: AnyEntity): { [slug: string]: StrapiReactions };
}

export interface IServiceZone {
  count(uid: UID.ContentType, documentId?: Data.DocumentID, locale?: string): Promise<ReactionsCount>;
}
