import { Core, Data, UID } from '@strapi/strapi';
import { isArray, isNil } from "lodash";

import { CTReaction, IServiceZone } from "../../../@types";
import { buildRelatedId, getModelUid } from './utils/functions';

export type ReactionsCount = {
  [slug: string]: number;
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({

  async count(
    this: IServiceZone,
    uid: UID.ContentType,
    documentId?: Data.DocumentID,
    locale?: string,
  ): Promise<ReactionsCount> {
    const operator = documentId ? '$eq' : '$contains';
    const entities = await strapi
      .documents(getModelUid("reaction"))
      .findMany({
        filters: {
          relatedUid: {
            [operator]: buildRelatedId(uid, documentId),
          },
        },
        populate: {
          kind: {
            fields: ['slug', 'name']
          },
        },
        locale,
      });

    if (isNil(entities)) {
      return {};
    }

    return (!isArray(entities) ? [entities] : entities)
      .reduce((acc: Record<string, number>, entity: CTReaction) => {
        const currentCount = acc[entity.kind.slug] || 0;
        return {
          ...acc,
          [entity.kind.slug]: currentCount ? currentCount + 1 : 1,
        };
      }, {} as Record<string, number>);
  },

});
