import { Data } from "@strapi/strapi";
import { Context } from "koa";

import {
  IServiceClient,
  StrapiGraphQLContext,
} from "../../../../@types";
import { getPluginService } from "../../utils/functions";
import PluginError from "../../utils/error";

type ListAllPerUserResolverProps = {
  kind: string;
  userId?: Data.ID;
};

export default ({ nexus }: StrapiGraphQLContext) => {
  const { stringArg, list } = nexus;

  return {
    type: list("Reaction"),
    args: {
      kind: stringArg(),
      userId: stringArg(),
    },
    async resolve(
      _: Object,
      args: ListAllPerUserResolverProps,
      ctx: Context) {
      const { kind, userId } = args;
      const { state: { user = undefined } = {} } = ctx;

      let targetUser = user;
      try {
        if (!targetUser && userId) {
          targetUser = await strapi
            .plugin("user-permissions")
            .service("user")
            .fetch({ id: userId });
        }
      } catch (e) {
        throw new PluginError(400, "User not found");
      }

      return await getPluginService<IServiceClient>("client").listPerUser(user, kind);
    },
  };
};
