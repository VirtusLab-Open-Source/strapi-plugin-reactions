//@ts-nocheck
import { Strapi } from '@strapi/strapi';
import { UID } from "@strapi/types";
import { isArray, isNil, first } from "lodash";

import { IServiceZone, ReactionEntity, StrapiId } from "../../types";
import { buildRelatedId, getModelUid } from './utils/functions';

export type ReactionsCount = {
  [slug: string]: number;
};

export default ({ strapi }: { strapi: Strapi }) => ({

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
      return [];
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
