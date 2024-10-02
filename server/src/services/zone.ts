import { Core, UID } from '@strapi/strapi';
import { isArray, isNil } from "lodash";

import { IServiceZone, StrapiId } from "../../../@types";
import { buildRelatedId, getModelUid } from './utils/functions';

export type ReactionsCount = {
  [slug: string]: number;
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({

  async count(
    this: IServiceZone,
    uid: UID.ContentType,
    id?: StrapiId,
  ): Promise<ReactionsCount> {
    const entities = await strapi.entityService
      ?.findMany(getModelUid("reaction"), {
        filters: {
          relatedUid: buildRelatedId(uid, id),
        },
        populate: {
          kind: {
            fields: ['slug', 'name']
          },
        },
      });

    if (isNil(entities)) {
      return {};
    }

    return (!isArray(entities) ? [entities] : entities)
      .reduce((acc, entity) => {
        const currentCount = acc[entity.kind.slug] || 0;
        return {
          ...acc,
          [entity.kind.slug]: currentCount ? currentCount + 1 : 1,
        };
      }, {});
  },

});
