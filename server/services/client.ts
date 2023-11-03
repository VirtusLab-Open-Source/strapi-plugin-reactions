//@ts-nocheck
import { Strapi } from '@strapi/strapi';
import { UID } from "@strapi/types";
import { StrapiUser } from 'strapi-typed';
import { isArray, isNil, first } from "lodash";

import { IServiceClient } from "../../types";
import { buildRelatedId, getModelUid } from './utils/functions';
import PluginError from '../utils/error';
import { AnyEntity } from '@strapi/strapi/lib/services/entity-service';

export default ({ strapi }: { strapi: Strapi }) => ({

  async kinds(
    this: IServiceClient,
  ): Promise<Array<AnyEntity>> {
    return strapi.entityService
      .findMany(getModelUid("reaction-type"), {
        populate: ['icon'],
      });
  },

  async list(
    this: IServiceClient,
    kind?: string,
    uid: UID.ContentType,
    id?: StrapiId,
    user?: StrapiUser,
  ): Promise<Array<AnyEntity>> {
    const [reactionKind] = await this.prefetchConditions(kind || null);

    let fields = ['createdAt', 'updatedAt'];
    let filters = {
      relatedUid: buildRelatedId(uid, id),
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

    const entities = await strapi.entityService
      .findMany(getModelUid("reaction"), {
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
    id?: StrapiId,
    user: StrapiUser,
  ): Promise<AnyEntity> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions(kind, uid, id);
    const existingReaction = await this.list(kind, uid, id, user);

    if (!existingReaction || (isArray(existingReaction) && (existingReaction.length === 0))) {
      return this.directCreate(uid, reactionKind, relatedEntity, user);
    }

    throw new PluginError(405, `Can't perform CREATE on reaction type of "${kind}" for Entity with ID: ${id || 'single'} of type: ${uid} as it already exist`);
  },

  async delete(
    this: IServiceClient,
    kind: string,
    uid: UID.ContentType,
    id?: StrapiId,
    user: StrapiUser,
  ): Promise<boolean> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions(kind, uid, id);
    const existingReaction = await this.list(kind, uid, id, user);

    if (isArray(existingReaction) && (existingReaction.length === 1)) {
      return this.directDelete(existingReaction);
    }

    throw new PluginError(405, `Can't perform DELETE on reaction type of "${kind}" for Entity with ID: ${id || 'single'} of type: ${uid}`);

  },

  async toggle(
    this: IServiceClient,
    kind: string,
    uid: UID.ContentType,
    id?: StrapiId,
    user: StrapiUser,
  ): Promise<AnyEntity | boolean> {

    const [reactionKind, relatedEntity] = await this.prefetchConditions(kind, uid, id);
    const existingReactions = await this.list(null, uid, id, user);
    const matchingReaction = existingReactions
      .find(({ kind: { slug } }) => kind === slug);
    const reactionsToRemove = matchingReaction ?
      existingReactions
        .filter(({ id: reactionId }) => reactionId !== matchingReaction.id) :
      [...existingReactions];

    if (isArray(existingReactions) && (existingReactions.length === 1)) {
      return this.directDelete(existingReactions);
    }

    const removed = await this.directDelete(reactionsToRemove);

    if (!removed) {
      throw new PluginError(405, `Can't perform toogle action reaction type of "${kind}" for Entity with ID: ${id || 'single'} of type: ${uid}`);
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
    id?: StrapiId,
  ): Promise<[AnyEntity, AnyEntity | undefined]> {

    let result = [];

    if (kind !== null) {
      const reactionKind = await strapi.entityService
        .findMany(getModelUid("reaction-type"), {
          filters: { slug: kind }
        });

      if (!reactionKind || (reactionKind.length === 0)) {
        throw new PluginError(404, `Reaction '${kind}' does not exist. You can't use it.`);
      }

      result = [...result, first(reactionKind)];
    } else {
      result = [...result, null];
    }

    if (uid) {
      let relatedEntity;
      try {
        relatedEntity = await strapi.entityService
          .findOne(uid, id || '1');
      }
      catch (e) {
        throw new PluginError(404, `Entity with ID: ${id || 'single'} of type: ${uid} does not exits`);
      }

      if (!relatedEntity) {
        throw new PluginError(404, `Entity with ID: ${id || 'single'} of type: ${uid} does not exits`);
      }

      return [...result, relatedEntity];
    }
    return result;
  },

  async directCreate(
    this: IServiceClient,
    uid: StrapiId,
    kind: AnyEntity,
    related: AnyEntity,
    user: StrapiUser,
  ): Promise<AnyEntity> {
    return await strapi.entityService
      .create(getModelUid("reaction"), {
        data: {
          kind: kind,
          related: {
            ...related,
            __type: uid,
          },
          relatedUid: buildRelatedId(uid, related.id),
          user,
        },
      });
  },

  async directDelete(
    this: IServiceClient,
    reactions: Array<AnyEntity>,
  ): Promise<boolean> {
    const removedEntities = await strapi.db.query(getModelUid("reaction")).deleteMany({
      where: {
        id: reactions.map(_ => _.id),
      },
    });
    return removedEntities && (removedEntities.count === reactions.length);
  },


});
