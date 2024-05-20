import { Core } from '@strapi/types';
import { first, isArray, isEmpty, isNil, isString } from 'lodash';
import slugify from 'slugify';

import { ReactionsPluginConfig, IServiceAdmin, StrapiId, IServiceCommon, ToBeFixed } from "../../types";
import { buildRelatedId, getModelUid } from './utils/functions';
import PluginError from '../utils/error';
import { getPluginService } from '../utils/functions';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async fetchConfig() {
    const pluginStore = getPluginService<IServiceCommon>('common')
      .getPluginStore();
    const config: ReactionsPluginConfig | unknown = await pluginStore?.get({
      key: "config",
    });

    const types = await strapi.entityService
      ?.findMany(getModelUid("reaction-type"), {
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
        ?.create(getModelUid("reaction-type"), {
          data: body,
        });
    }

    const { id, ...rest } = body;
    return await strapi.entityService
      ?.update(getModelUid("reaction-type"), id, {
        data: rest,
      });
  },

  async deleteReactionType(
    this: IServiceAdmin,
    id: StrapiId,
  ): Promise<boolean> {

    const reactionKind = await strapi.entityService
      ?.findOne(getModelUid("reaction-type"), id);

    if (!reactionKind) {
      throw new PluginError(404, `Reaction type does not exist. You can't use it.`);
    }

    const entitiesToDelete = await strapi.entityService
      ?.findMany(getModelUid("reaction"), {
        fields: ['id'],
        filters: {
          kind: reactionKind,
        },
      });

    if (isArray(entitiesToDelete)) {
      await strapi.db?.query(getModelUid("reaction")).deleteMany({
        where: {
          id: entitiesToDelete.map(_ => _.id),
        },
      });
    }

    const removed = await strapi.entityService
      ?.delete(getModelUid("reaction-type"), id);

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
        ?.findMany(getModelUid("reaction-type"), {
          filters,
        });
      if (entities && (entities.length > 0)) {
        return `${slug}-${entities.length + 1}`;
      }
      return slug;
    }
    throw new PluginError(400, "Not valid value for slug");
  },

  async syncAssociations(this: IServiceAdmin): Promise<number> {
    const entities = await strapi.entityService
      ?.findMany(getModelUid("reaction"), {
        fields: ['id', 'relatedUid'],
        populate: ['related'],
      });

    const entitiesToUpdate = (entities || [] as any)
      .map((_: ToBeFixed) => ({ ..._, related: first(_.related) }))
      .filter(({ relatedUid, related }: ToBeFixed) => relatedUid !== buildRelatedId(related.__type, related.id));

    if (!entitiesToUpdate || isEmpty(entitiesToUpdate)) {
      return 0;
    }

    const entitiesUpdated = await Promise.all(entitiesToUpdate
      .map(async ({ id, related }: ToBeFixed) =>
        strapi.entityService?.
          update(getModelUid("reaction"), id, {
            data: {
              relatedUid: buildRelatedId(related.__type, related.id),
            },
          })
      ));

    if (entitiesToUpdate.length === entitiesUpdated.length) {
      return entitiesUpdated.length;
    }

    throw new PluginError(400, "Action cannot be performed");
  },

});
