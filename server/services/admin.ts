import { Strapi } from '@strapi/strapi';
import { StrapiStore } from 'strapi-typed';

import { ReactionsPluginConfig, IServiceAdmin, StrapiId } from "../../types";
import { getModelUid } from './utils/functions';
import { isArray, isNil, isString } from 'lodash';
import slugify from 'slugify';
import PluginError from '../utils/error';
import { ID } from '@strapi/strapi/lib/services/entity-service/types/params/attributes';

export default ({ strapi }: { strapi: Strapi }) => ({
  async getPluginStore(): Promise<StrapiStore> {
    return strapi.store({ type: "plugin", name: "reactions" });
  },

  async fetchConfig() {
    const pluginStore = await this.getPluginStore();
    const config: ReactionsPluginConfig = await pluginStore.get({
      key: "config",
    });

    const types = await strapi.entityService
      .findMany(getModelUid("reaction-type"), {
        populate: ['icon']
      });

    return {
      config: config || {},
      types,
    };
  },

  async updateConfig(
    this: IServiceAdmin,
    body: any,
  ): Promise<any> {

    if (isNil(body.id)) {
      return await strapi.entityService
        .create(getModelUid("reaction-type"), {
          data: body,
        });
    }

    const { id, ...rest } = body;
    return await strapi.entityService
      .update(getModelUid("reaction-type"), id, {
        data: rest,
      });
  },

  async deleteReactionType(
    this: IServiceAdmin,
    id: StrapiId,
  ): Promise<boolean> {

    const reactionKind = await strapi.entityService
      .findOne(getModelUid("reaction-type"), id as ID);

    if (!reactionKind) {
      throw new PluginError(404, `Reaction type does not exist. You can't use it.`);
    }

    const entitiesToDelete = await strapi.entityService
      .findMany(getModelUid("reaction"), {
        fields: ['id'],
        filters: {
          kind: reactionKind,
        },
      });

    if (isArray(entitiesToDelete)) {
      await strapi.db.query(getModelUid("reaction")).deleteMany({
        where: {
          id: entitiesToDelete.map(_ => _.id),
        },
      });
    }

    const removed = await strapi.entityService
      .delete(getModelUid("reaction-type"), id as ID);

    return !isNil(removed) && (removed.id === id);
  },

  async generateSlug(
    this: IServiceAdmin,
    subject: string,
    id?: StrapiId,
  ): Promise<string> {

    const slug = slugify(subject).toLowerCase();
    return await this.uniqueSlug(slug, id);
  },

  async uniqueSlug(
    this: IServiceAdmin,
    slug: string,
    id?: StrapiId,
  ): Promise<string> {
    if (isString(slug)) {
      let filters: any = {
        slug,
      };
      if (!isNil(id)) {
        filters = {
          ...filters,
          id: {
            $not: id
          },
        };
      }
      const entities = await strapi.entityService
        .findMany(getModelUid("reaction-type"), {
          filters,
        });
      if (entities && (entities.length > 0)) {
        return `${slug}-${entities.length + 1}`;
      }
      return slug;
    }
    throw new PluginError(400, "Not valid value for slug");
  },

});
