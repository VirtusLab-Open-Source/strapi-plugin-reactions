import { Core, Data, UID } from '@strapi/strapi';
import { isArray, isNil, first } from "lodash";
import { AnyEntity, StrapiUser } from "@virtuslab/strapi-utils";

import { CTReaction, CTReactionType, IServiceClient, StrapiId } from "../../../@types";
import { buildRelatedId, getModelUid } from './utils/functions';
import PluginError from '../utils/error';


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
    documentId?: StrapiId,
  ): Promise<Array<CTReaction>> {
    const [reactionKind] = await this.prefetchConditions(kind || null);

    let fields = ['createdAt', 'updatedAt'];
    let filters: Record<string, any> = {
      relatedUid: buildRelatedId(uid, documentId),
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
          fields: ['id', 'username', 'email']
        },
      };
    }

    const entities = await strapi
      .documents(getModelUid("reaction"))
      .findMany<CTReaction>({
        fields,
        filters,
        populate,
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
    documentId?: StrapiId,
  ): Promise<CTReaction> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions(kind, uid, documentId);
    const existingReaction = await this.list(kind, uid, user, documentId);

    if (!existingReaction || (isArray(existingReaction) && (existingReaction.length === 0))) {
      return this.directCreate(uid, reactionKind, relatedEntity, user);
    }

    throw new PluginError(405, `Can't perform CREATE on reaction type of "${kind}" for Entity with ID: ${documentId || 'single'} of type: ${uid} as it already exist`);
  },

  async delete(
    this: IServiceClient,
    kind: string,
    uid: UID.ContentType,
    user: StrapiUser,
    documentId?: StrapiId,
  ): Promise<boolean> {

    const existingReaction = await this.list(kind, uid, user, documentId);

    if (isArray(existingReaction) && (existingReaction.length === 1)) {
      return this.directDelete(existingReaction);
    }

    throw new PluginError(405, `Can't perform DELETE on reaction type of "${kind}" for Entity with ID: ${documentId || 'single'} of type: ${uid}`);

  },

  async toggle(
    this: IServiceClient,
    kind: string,
    uid: UID.ContentType,
    user: StrapiUser,
    documentId?: StrapiId,
  ): Promise<CTReaction | boolean> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions(kind, uid, documentId);
    const existingReactions = await this.list(null, uid, user, documentId);
    const matchingReaction = existingReactions
      .find(({ kind: { slug } }) => kind === slug);
    const reactionsToRemove = matchingReaction ?
      existingReactions
        .filter(({ documentId: reactionId }) => reactionId !== matchingReaction.documentId) :
      [...existingReactions];

    if (isArray(existingReactions) && (existingReactions.length === 1)) {
      return this.directDelete(existingReactions);
    }

    const removed = await this.directDelete(reactionsToRemove);

    if (!removed) {
      throw new PluginError(405, `Can't perform toogle action reaction type of "${kind}" for Entity with Document ID: ${documentId || 'single'} of type: ${uid}`);
    }

    if (isNil(matchingReaction)) {
      return this.directCreate(uid, reactionKind, relatedEntity, user);
    } else {
      return matchingReaction;
    }


  },

  async prefetchConditions(
    this: IServiceClient,
    kind: string | null,
    uid?: UID.ContentType,
    documentId?: Data.DocumentID,
  ): Promise<[CTReactionType, AnyEntity | null]> {

    let result: [CTReactionType, AnyEntity | null] = [null, null];

    if (kind !== null) {
      const reactionKind = await strapi
        .documents(getModelUid("reaction-type"))
        .findOne<CTReactionType>({
          filters: { slug: kind }
        });

      if (!reactionKind || (reactionKind.length === 0)) {
        throw new PluginError(404, `Reaction '${kind}' does not exist. You can't use it.`);
      }

      result = [reactionKind, null];
    } else {
      result = [null, null];
    }

    if (uid) {
      let relatedEntity: AnyEntity;
      try {
        relatedEntity = await strapi
          .documents(uid)
          .findOne({
            documentId,
          }) as AnyEntity;
      }
      catch (e) {
        throw new PluginError(404, `Entity with Document ID: ${documentId || 'single'} of type: ${uid} does not exits`);
      }

      if (!relatedEntity) {
        throw new PluginError(404, `Entity with Document ID: ${documentId || 'single'} of type: ${uid} does not exits`);
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
      });
  },

  async directDelete(
    this: IServiceClient,
    reactions: Array<CTReaction>,
  ): Promise<boolean> {
    const removedEntities = await strapi.db.query(getModelUid("reaction")).deleteMany({
      where: {
        documentId: reactions.map(_ => _.documentId),
      },
    });
    return removedEntities && (removedEntities.count === reactions.length);
  },


});
