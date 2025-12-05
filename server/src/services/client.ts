import { Core, Data, UID } from '@strapi/strapi';
import { isArray, isNil, first, isObject } from "lodash";
import { AnyEntity, StrapiUser, StrapiQueryParamsParsed, StrapiRequestQueryPopulateClause, Primitive } from "@sensinum/strapi-utils";

import { CTReaction, CTReactionType, IServiceClient } from "../../../@types";
import { buildRelatedId, getModelUid } from './utils/functions';
import PluginError from '../utils/error';

export type PrefetchConditionsProps = {
  type?: string;
  uid?: UID.ContentType;
  documentId?: Data.DocumentID;
  locale?: string;
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({

  async kinds(
    this: IServiceClient,
  ): Promise<Array<CTReactionType>> {
    return strapi
      .documents(getModelUid("reaction-type"))
      .findMany<CTReactionType>({
        populate: ['icon'],
      });
  },

  async list(
    this: IServiceClient,
    kind?: string,
    uid?: UID.ContentType,
    user?: unknown,
    documentId?: Data.DocumentID,
    locale?: string,
    authorId?: string,
  ): Promise<Array<CTReaction>> {
    const [reactionKind] = await this.prefetchConditions({
      type: kind,
      locale,
    });

    const operator = documentId ? '$eq' : '$contains';
    let fields = ['createdAt', 'updatedAt'];
    let filters: Record<string, any> = {
      relatedUid: {
        [operator]: buildRelatedId(uid, documentId),
      },
    };
    let populate = {};

    // Filter by provided `kind` or get all reactionswith `kind` population
    if (!isNil(kind)) {
      filters = {
        ...filters,
        kind: reactionKind,
      };
    } else {
      populate = {
        ...populate,
        kind: {
          fields: ['slug', 'name']
        },
      };
    }

    // Filter by `x-reaction-author` header, then by provided `user` or get all reactions with `user` population
    if (authorId) {
      filters = {
        ...filters,
        userId: {
          $eq: authorId,
        },
      };
    } else if (!isNil(user)) {
      filters = {
        ...filters,
        user,
      };
    } else {
      populate = {
        ...populate,
        user: {
          fields: ['documentId', 'username', 'email']
        },
      };
    }

    const entities = await strapi
      .documents(getModelUid("reaction"))
      .findMany<CTReaction>({
        fields,
        filters,
        populate,
        locale,
      });

    if (isNil(entities)) {
      return [];
    }

    return (!isArray(entities) ? [entities] : entities);
  },

  async listPerUser(
    this: IServiceClient,
    user: unknown,
    userId: string,
    kind?: string,
    query?: StrapiQueryParamsParsed,
  ): Promise<Array<CTReaction>> {
    const [reactionKind] = await this.prefetchConditions({
      type: kind,
    });

    let fields = ['createdAt', 'updatedAt', 'relatedUid'];
    let filters: Record<string, any> = {
      ...(isObject(query?.filters) ? query?.filters : {}),
      ...(isObject(user) ? { user } : {}),
      ...(userId ? { userId } : {})
    };
    let populate: StrapiRequestQueryPopulateClause = {
      related: true,
      ...(isObject(query?.populate) ? query?.populate : {}),
    };

    // Filter by provided `kind` or get all reactions with `kind` population
    if (!isNil(kind)) {
      filters = {
        ...filters,
        kind: reactionKind,
      };
    } else {
      populate = {
        ...populate,
        kind: {
          fields: ['slug', 'name']
        },
      };
    }

    const entities = await strapi
      .documents(getModelUid("reaction"))
      .findMany<CTReaction>({
        fields,
        filters,
        populate,
        sort: query?.sort || undefined,
        pagination: query?.pagination || undefined,
        locale: query?.locale ? query.locale : '*',
      });

    if (isNil(entities)) {
      return [];
    }

    const isRelatedObjectPopulated = <T =  Record<string | 'related', Primitive>>(populateQuery: T): boolean => {
      const { related } = populateQuery as T & { related: boolean | Array<string> | Object};
      const objectPopulationExist = !isNil(related);
      const stringPopulationExist = isArray(related) ? related.filter((_: string) => _.includes('related')).length > 0 : false;
      return objectPopulationExist || stringPopulationExist;
    }

    const result = !isArray(entities) ? [entities] : entities;

    return Promise.all(result.map(async (entity) => {
      const { relatedUid, related } = entity;
      if (query?.populate && isRelatedObjectPopulated(query.populate)) {
        const [uid, documentId] = relatedUid.split(':');
        const targetRelated = await strapi
          .documents(uid)
          .findOne({
            documentId,
            locale: entity.locale,
          });
        return {
          ...entity,
          related: targetRelated,
        };
      }
      return {
        ...entity,
        related: isArray(related) ? first(related) : related,
      };
    }));
  },

  async create(
    this: IServiceClient,
    kind: string,
    uid: UID.ContentType,
    user: StrapiUser,
    documentId?: Data.DocumentID,
    locale?: string,
    authorId?: string,
  ): Promise<CTReaction> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions({
      type: kind,
      uid,
      documentId,
      locale,
    });
    const existingReaction = await this.list(kind, uid, user, documentId, locale, authorId);
    if (!existingReaction || (isArray(existingReaction) && (existingReaction.length === 0))) {
      return this.directCreate(uid, reactionKind, relatedEntity, user, locale, authorId);
    }

    throw new PluginError(405, `Can't perform CREATE on reaction type of "${kind}" for Entity with ID: ${documentId || 'single'} of type: ${uid} as it already exist`);
  },

  async delete(
    this: IServiceClient,
    kind: string,
    uid: UID.ContentType,
    user: StrapiUser,
    documentId?: Data.DocumentID,
    locale?: string,
    authorId?: string,
  ): Promise<boolean> {

    const existingReaction = await this.list(kind, uid, user, documentId, locale, authorId);

    if (isArray(existingReaction) && (existingReaction.length === 1)) {
      return this.directDelete(existingReaction, locale);
    }

    throw new PluginError(405, `Can't perform DELETE on reaction type of "${kind}" for Entity with ID: ${documentId || 'single'} of type: ${uid}`);

  },

  async toggle(
    this: IServiceClient,
    kind: string,
    uid: UID.ContentType,
    user: StrapiUser,
    documentId?: Data.DocumentID,
    locale?: string,
    authorId?: string,
  ): Promise<CTReaction | boolean> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions({
      type: kind,
      uid,
      documentId,
      locale,
    });
    const existingReactions = await this.list(undefined, uid, user, documentId, locale, authorId);
    const matchingReaction = existingReactions
      .find(({ kind: { slug } }) => kind === slug);
      
    if (matchingReaction) {
      return this.directDelete(existingReactions, locale);
    }

    const reactionsToRemove = existingReactions
      .filter(({ documentId: reactionId }) => reactionId !== matchingReaction.documentId);

    const removed = await this.directDelete(reactionsToRemove, locale);

    if (!removed) {
      throw new PluginError(405, `Can't perform toogle action reaction type of "${kind}" for Entity with Document ID: ${documentId || 'single'} of type: ${uid}`);
    }

    if (isNil(matchingReaction)) {
      return this.directCreate(uid, reactionKind, relatedEntity, user, locale, authorId);
    } else {
      return matchingReaction;
    }


  },

  async prefetchConditions(
    this: IServiceClient,
    props: PrefetchConditionsProps,
  ): Promise<[CTReactionType, AnyEntity | null]> {
    const { type, uid, documentId, locale } = props;

    let result: [CTReactionType, AnyEntity | null] = [null, null];

    if (type) {
      const reactionKind = await strapi
        .documents(getModelUid("reaction-type"))
        .findFirst<CTReactionType>({
          filters: { slug: type }
        });

      if (!(reactionKind && reactionKind.documentId)) {
        throw new PluginError(404, `Reaction '${type}' does not exist. You can't use it.`);
      }

      result = [reactionKind, null];
    } else {
      result = [null, null];
    }

    if (uid) {
      let relatedEntity: AnyEntity & { locale: string };
      try {
        relatedEntity = (documentId ?
          await strapi
            .documents(uid)
            .findOne({
              documentId,
              locale,
            }) :
          await strapi
            .documents(uid)
            .findFirst({ locale })) as (AnyEntity & { locale: string });
      }
      catch (e) {
        throw new PluginError(404, `Entity with Document ID: ${documentId || 'single'} & locale ${locale || 'en'} of type: ${uid} does not exits`);
      }

      if (!relatedEntity) {
        throw new PluginError(404, `Entity with Document ID: ${documentId || 'single'} & locale ${locale || 'en'} of type: ${uid} does not exits`);
      }

      return [first(result), relatedEntity];
    }
    return result;
  },

  async directCreate(
    this: IServiceClient,
    uid: UID.ContentType,
    kind: CTReactionType,
    related: AnyEntity,
    user: StrapiUser,
    locale?: string,
    authorId?: string,
  ): Promise<CTReaction> {
    return await strapi.documents(getModelUid("reaction"))
      .create({
        data: {
          kind,
          related: {
            ...related,
            __type: uid,
          },
          relatedUid: buildRelatedId(uid, related.documentId),
          user,
          userId: authorId,
        },
        locale,
      });
  },

  async directDelete(
    this: IServiceClient,
    reactions: Array<CTReaction>,
    locale?: string,
  ): Promise<boolean> {
    const removedEntities = await Promise.all(reactions.map(async ({ documentId }) =>
      strapi.documents(getModelUid("reaction")).delete({
        documentId,
        locale,
      })));
    return removedEntities && (removedEntities.length === reactions.length);
  },


});
