import { Strapi } from '@strapi/strapi';
import { UID } from "@strapi/types";

import { PopulateClause } from 'strapi-typed';

import { IServiceEnrich, ReactionEntity } from "../../types";
import { buildRelatedId, getModelUid } from './utils/functions';

export type StrapiReactions = Array<ReactionEntity>;

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

  async enrichOne<T extends ReactionEntity, M extends any>(
    this: IServiceEnrich,
    uid: UID.ContentType,
    response: StrapiContentAPIResponse<T, M>,
    populate: PopulateClause = DEFAULT_POPULATE,
  ): Promise<StrapiContentAPIResponse<T, M>> {

    if (!response) {
      return response;
    }

    const { data } = response;

    const reactions = await this.findReactions({
      relatedUid: buildRelatedId(uid, data.id),
    }, populate);

    return {
      ...response,
      meta: {
        ...response.meta,
        reactions: (reactions || []).reduce(this.composeReactionsMeta, {}),
      },
    };
  },

  async enrichMany<T extends ReactionEntity, M extends any>(
    this: IServiceEnrich,
    uid: UID.ContentType,
    response: StrapiContentAPIResponse<Array<T>, M>,
    populate: PopulateClause = DEFAULT_POPULATE,
  ): Promise<StrapiContentAPIResponse<Array<T>, M>> {

    if (!response) {
      return response;
    }

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
              .filter(({ relatedUid }) => relatedUid === buildRelatedId(uid, currItem.id))
              .reduce(this.composeReactionsMeta, {}),
          }), {}),
      },
    };
  },

  async findReactions(filters: any, populate: PopulateClause): Promise<undefined | null | ReactionEntity | Array<ReactionEntity>> {
    return strapi.entityService
      ?.findMany(getModelUid('reaction'), {
        filters,
        populate: populate as any,
      }) as any;
  },

  composeReactionsMeta(acc: { [slug: string]: StrapiReactions }, curr: any): { [slug: string]: StrapiReactions } {
    const kindAcc = acc[curr.kind.slug] || [];
    return {
      ...acc,
      [curr.kind.slug]: [...kindAcc, curr],
    };
  }
});
