import { Core, Data } from '@strapi/strapi';
import { first, isArray, isEmpty, isNil, isString } from 'lodash';
import slugify from 'slugify';

import { ReactionsPluginConfig, IServiceAdmin, IServiceCommon, CTReactionType, CTReaction } from "../../../@types";
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

    const types = await strapi
      .documents(getModelUid("reaction-type"))
      .findMany({
        populate: ['icon']
      });

    return {
      config: config || {},
      types,
    };
  },

  async updateConfig(
    this: IServiceAdmin,
    body: CTReactionType,
  ): Promise<CTReactionType> {

    if (isNil(body.documentId)) {
      return await strapi
        .documents(getModelUid("reaction-type"))
        .create({
          data: body,
        });
    }

    const { documentId, ...rest } = body;
    return await strapi
      .documents(getModelUid("reaction-type"))
      .update({
        documentId,
        data: rest,
      });
  },

  async deleteReactionType(
    this: IServiceAdmin,
    documentId: Data.DocumentID,
  ): Promise<{
    result: boolean
  }> {

    const reactionKind = await strapi
      .documents(getModelUid("reaction-type"))
      .findOne({ documentId });

    if (!reactionKind) {
      throw new PluginError(404, `Reaction type does not exist. You can't use it.`);
    }

    const entitiesToDelete = await strapi
      .documents(getModelUid("reaction"))
      .findMany({
        fields: ['documentId'],
        locale: "*",
        filters: {
          kind: reactionKind,
        },
      });

    if (isArray(entitiesToDelete)) {
      await strapi.db?.query(getModelUid("reaction")).deleteMany({
        where: {
          documentId: entitiesToDelete.map(_ => _.documentId),
        },
      });
    }

    const removed = await strapi
      .documents(getModelUid("reaction-type"))
      .delete({ documentId });

    return {
      result: !isNil(removed) && (removed.documentId === documentId),
    };
  },

  async generateSlug(
    this: IServiceAdmin,
    subject: string,
    documentId?: Data.DocumentID,
  ): Promise<{
    slug: string;
  }> {

    const slug = slugify(subject).toLowerCase();
    const response = await this.uniqueSlug(slug, documentId);
    return {
      slug: response,
    };
  },

  async uniqueSlug(
    this: IServiceAdmin,
    slug: string,
    documentId?: Data.DocumentID,
  ): Promise<string> {
    if (isString(slug)) {
      let filters: any = {
        slug,
      };
      if (!isNil(documentId)) {
        filters = {
          ...filters,
          documentId: {
            $not: documentId
          },
        };
      }
      const entities = await strapi
        .documents(getModelUid("reaction-type"))
        .findMany({ filters });
      if (entities && (entities.length > 0)) {
        return `${slug}-${entities.length + 1}`;
      }
      return slug;
    }
    throw new PluginError(400, "Not valid value for slug");
  },

  async syncAssociations(this: IServiceAdmin): Promise<number> {
    const entities = await strapi
      .documents(getModelUid("reaction"))
      .findMany({
        fields: ['documentId', 'relatedUid'],
        locale: "*",
        populate: ['related'],
      });

    const entitiesToUpdate = (entities || [])
      .map((_: CTReaction) => ({ ..._, related: first(_.related) }))
      .filter(({ relatedUid, related }: CTReaction) => relatedUid !== buildRelatedId(related.__type, related.documentId));

    if (!entitiesToUpdate || isEmpty(entitiesToUpdate)) {
      return 0;
    }

    const entitiesUpdated = await Promise.all(entitiesToUpdate
      .map(async ({ documentId, related, locale }: CTReaction) =>
        strapi
          .documents(getModelUid("reaction"))
          .update({
            documentId,
            locale,
            data: {
              relatedUid: buildRelatedId(related.__type, related.documentId),
            },
          })
      ));

    if (entitiesToUpdate.length === entitiesUpdated.length) {
      return entitiesUpdated.length;
    }

    throw new PluginError(400, "Action cannot be performed");
  },

});
