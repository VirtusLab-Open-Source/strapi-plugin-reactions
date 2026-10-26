import { Core, UID } from '@strapi/strapi';
import { PopulateClause } from '@sensinum/strapi-utils';

import { IServiceEnrich, IServiceCommon, ReactionEntity, RelatedId } from "../../../@types";
import { buildRelatedId, getModelUid, sanitizeReactionEntity } from './utils/functions';
import { CONFIG_PARAMS } from '../utils/constants';
import { getPluginService } from '../utils/functions';
import { first } from 'lodash';

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

export default ({ strapi }: { strapi: Core.Strapi }) => ({

  getCommonService(): IServiceCommon {
    return getPluginService<IServiceCommon>('common');
  },

  async sanitizeReactions(reactions: Array<ReactionEntity>): Promise<Array<ReactionEntity>> {
    const blockedAuthorProps = await this.getCommonService().getConfig(CONFIG_PARAMS.AUTHOR_BLOCKED_PROPS, []);

    return reactions.map((reaction) => sanitizeReactionEntity(reaction, blockedAuthorProps));
  },

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
      relatedUid: buildRelatedId(uid, data.documentId),
    }, populate, data?.locale);

    const sanitizedReactions = reactions ? await this.sanitizeReactions(reactions) : [];
    
    return {
      ...response,
      meta: {
        ...response.meta,
        reactions: sanitizedReactions.reduce(this.composeReactionsMeta, {}),
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

    const { data } = response;
    const firstEntity = first(data);

    const reactions = await this.findReactions({
      relatedUid: {
        $contains: `${uid}:`,
      }
    }, populate, firstEntity?.locale);

    const sanitizedReactions = reactions ? await this.sanitizeReactions(reactions) : [];

    return {
      ...response,
      meta: {
        ...response.meta,
        reactions: response.data
          .reduce((accItem, currItem) => ({
            ...accItem,
            [currItem.documentId]: sanitizedReactions
              .filter(({ relatedUid }: { relatedUid: RelatedId}) => relatedUid === buildRelatedId(uid, currItem.documentId))
              .reduce(this.composeReactionsMeta, {}),
          }), {}),
      },
    };
  },

  async findReactions(filters: any, populate: PopulateClause, locale?: string): Promise<undefined | null | ReactionEntity | Array<ReactionEntity>> {
    return strapi.documents(getModelUid('reaction'))
      ?.findMany({
        filters,
        populate: populate as any,
        locale,
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
