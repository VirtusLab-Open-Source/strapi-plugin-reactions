import { UID } from "@strapi/strapi";
import { Context } from "koa";
import { getPluginService, parseParams } from '../utils/functions';

import { throwError } from './utils/functions';
import { IServiceZone, StrapiId } from '../../../@types';

type ReactionListUrlProps = {
  uid: UID.ContentType;
  id: StrapiId;
};

export default () => ({
  getService<T>(name = "zone") {
    return getPluginService<T>(name);
  },

  async count(ctx: Context) {
    try {
      const { params = {} } = ctx;
      const { uid, id } = parseParams<ReactionListUrlProps>(params);
      return await this.getService<IServiceZone>().count(uid, id);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },
});
