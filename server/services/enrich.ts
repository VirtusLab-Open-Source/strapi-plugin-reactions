import { Strapi } from '@strapi/strapi';
import { ContentType } from "@strapi/strapi/lib/types/core/uid";
import { AnyEntity } from '@strapi/strapi/lib/services/entity-service';

import { PopulateClause } from 'strapi-typed';

import { IServiceEnrich } from "../../types";
import { getModelUid } from './utils/functions';

export type StrapiReactions = Array<AnyEntity>;

export type StrapiReactionsMeta<M = any> = M & {
  reactions: {
    [slug: string]: StrapiReactions;
  }
};

export type StrapiContentAPIResponse<T, M> = {
  data: T,
  meta: StrapiReactionsMeta<M>,
};

const DEFAULT_POPULATE = {
  kind: {
    fields: ['name', 'slug', 'emoji', 'emojiFallbackUrl'],
    populate: ['icon'],
  },
  user: {
    fields: ['username', 'email']
  }
};

export default ({ strapi }: { strapi: Strapi }) => ({

  async enrichOne<T extends AnyEntity, M extends any>(
    this: IServiceEnrich,
    uid: ContentType,
    response: StrapiContentAPIResponse<T, M>,
    populate: PopulateClause = DEFAULT_POPULATE,
  ): Promise<StrapiContentAPIResponse<T, M>> {

    const { data } = response;

    const reactions = await this.findReactions({
      relatedUid: `${uid}:${data.id}`,
    }, populate);

    return {
      ...response,
      meta: {
        ...response.meta,
        reactions: (reactions || []).reduce(this.composeReactionsMeta, {}),
      },
    };
  },

  async enrichMany<T extends AnyEntity, M extends any>(
    this: IServiceEnrich,
    uid: ContentType,
    response: StrapiContentAPIResponse<Array<T>, M>,
    populate: PopulateClause = DEFAULT_POPULATE,
  ): Promise<StrapiContentAPIResponse<Array<T>, M>> {

    const reactions = await this.findReactions({
      relatedUid: {
        $contains: `${uid}:`,
      }
    }, populate);

    return {
      ...response,
      meta: {
        ...response.meta,
        reactions: response.data
          .reduce((accItem, currItem) => ({
            ...accItem,
            [currItem.id]: (reactions || [])
              .filter(({ relatedUid }) => relatedUid === `${uid}:${currItem.id}`)
              .reduce(this.composeReactionsMeta, {}),
          }), {}),
      },
    };
  },

  async findReactions(filters: any, populate: PopulateClause): Promise<null | AnyEntity | Array<AnyEntity>> {
    return strapi.entityService
      .findMany(getModelUid('reaction'), {
        filters,
        populate: populate as any,
      });
  },

  composeReactionsMeta(acc: { [slug: string]: StrapiReactions }, curr: AnyEntity): { [slug: string]: StrapiReactions } {
    const kindAcc = acc[curr.kind.slug] || [];
    return {
      ...acc,
      [curr.kind.slug]: [...kindAcc, curr],
    };
  }
});
