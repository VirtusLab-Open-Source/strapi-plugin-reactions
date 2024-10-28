import { Data, UID } from "@strapi/strapi";
import { Context } from "koa";
import { getPluginService, parseParams, parseQuery } from '../utils/functions';

import { throwError } from './utils/functions';
import { IServiceZone } from '../../../@types';

type ReactionListUrlProps = {
  uid: UID.ContentType;
  documentId: Data.DocumentID;
};

export default () => ({
  getService<T>(name = "zone") {
    return getPluginService<T>(name);
  },

  async count(ctx: Context) {
    try {
      const { params = {}, query = {} } = ctx;
      const { uid, documentId } = parseParams<ReactionListUrlProps>(params);
      const { locale } = parseQuery(query);
      return await this.getService<IServiceZone>().count(uid, documentId, locale);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },
});
