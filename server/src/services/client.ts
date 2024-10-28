import { Core, Data, UID } from '@strapi/strapi';
import { isArray, isNil, first } from "lodash";
import { AnyEntity, StrapiUser } from "@sensinum/strapi-utils";

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

    // Filter by provided `user` or get all reactions with `user` population
    if (!isNil(user)) {
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

  async create(
    this: IServiceClient,
    kind: string,
    uid: UID.ContentType,
    user: StrapiUser,
    documentId?: Data.DocumentID,
    locale?: string,
  ): Promise<CTReaction> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions({
      type: kind,
      uid,
      documentId,
      locale,
    });
    const existingReaction = await this.list(kind, uid, user, documentId, locale);
    if (!existingReaction || (isArray(existingReaction) && (existingReaction.length === 0))) {
      return this.directCreate(uid, reactionKind, relatedEntity, user, locale);
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
  ): Promise<boolean> {

    const existingReaction = await this.list(kind, uid, user, documentId, locale);

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
  ): Promise<CTReaction | boolean> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions({
      type: kind,
      uid,
      documentId,
      locale,
    });
    const existingReactions = await this.list(undefined, uid, user, documentId, locale);
    const matchingReaction = existingReactions
      .find(({ kind: { slug } }) => kind === slug);
    const reactionsToRemove = matchingReaction ?
      existingReactions
        .filter(({ documentId: reactionId }) => reactionId !== matchingReaction.documentId) :
      [...existingReactions];

    if (isArray(existingReactions) && (existingReactions.length === 1)) {
      return this.directDelete(existingReactions, locale);
    }

    const removed = await this.directDelete(reactionsToRemove, locale);

    if (!removed) {
      throw new PluginError(405, `Can't perform toogle action reaction type of "${kind}" for Entity with Document ID: ${documentId || 'single'} of type: ${uid}`);
    }

    if (isNil(matchingReaction)) {
      return this.directCreate(uid, reactionKind, relatedEntity, user, locale);
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
  ): Promise<CTReaction> {
    return await strapi.documents(getModelUid("reaction"))
      .create({
        data: {
          kind: kind,
          related: {
            ...related,
            __type: uid,
          },
          relatedUid: buildRelatedId(uid, related.documentId),
          user,
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
