import { ID } from "@strapi/strapi/lib/services/entity-service/types/params/attributes";
import { Id, StrapiUser, PopulateClause } from "strapi-typed";
import { StrapiId } from "./common";
import { AnyEntity } from "@strapi/strapi/lib/services/entity-service";
import { ContentType } from "@strapi/strapi/lib/types/core/uid";
import { StrapiReactions } from "../server/services/enrich";
import { ReactionsCount } from "../server/services/zone";

export interface IServiceCommon {
  getPluginStore(): StrapiStore;
}

export interface IServiceAdmin {
  fetchConfig<T extends ReactionsPluginConfig>(): Promise<T>;
  updateConfig(
    body: ReactionsPluginConfig | undefined,
  ): Promise<ReactionsPluginConfig>;
  deleteReactionType(id: StrapiId): Promise<boolean>;
  generateSlug(subject: string, id?: StrapiId): Promise<string>;
  uniqueSlug(slug: string, id?: StrapiId): Promise<string>;
  syncAssociations(): Promise<boolean>;
}

export interface IServiceClient {
  kinds(): Promise<Array<AnyEntity>>;
  list(kind?: string, uid: ContentType, id?: StrapiId, user?: StrapiUser | undefined): Promise<Array<AnyEntity>>;
  create(kind: string, uid: ContentType, id?: StrapiId, user: StrapiUser | undefined): Promise<AnyEntity>;
  delete(kind: string, uid: ContentType, id?: StrapiId, user: StrapiUser | undefined): Promise<boolean>;
  toggle(kind: string, uid: ContentType, id?: StrapiId, user: StrapiUser | undefined): Promise<AnyEntity | boolean>;
  prefetchConditions(type: string, uid?: string, id?: StrapiId): Promise<[AnyEntity, AnyEntity]>;
  directCreate(uid: ContentType, kind: AnyEntity, related: AnyEntity, user: StrapiUser | undefined): Promise<AnyEntity>;
  directDelete(uid: ContentType, kind: AnyEntity, related: AnyEntity, user: StrapiUser | undefined): Promise<boolean>;
}

export interface IServiceEnrich {
  enrichOne<T extends AnyEntity, M extends any>(uid: ContentType, response: T, populate: PopulateClause): Promise<T>;
  enrichMany<T extends AnyEntity, M extends any>(uid: ContentType, response: T, populate: PopulateClause): Promise<T>;
  findReactions(filters: any, populate: PopulateClause): null | AnyEntity | Array<AnyEntity>;
  composeReactionsMeta(acc: { [slug: string]: StrapiReactions }, curr: AnyEntity): { [slug: string]: StrapiReactions };
}

export interface IServiceZone {
  count(uid: ContentType, id?: StrapiId): Promise<ReactionsCount>;
}
