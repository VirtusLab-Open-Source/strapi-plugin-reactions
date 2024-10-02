import { UID } from "@strapi/strapi";
import { Context } from "koa";

import {
  IServiceClient,
  StrapiGraphQLContext,
  StrapiId,
} from "../../../../@types";
import { getPluginService } from "../../utils/functions";

type ListAllResolverProps = {
  kind: string;
  uid: UID.ContentType;
  id?: StrapiId;
};

export default ({ nexus }: StrapiGraphQLContext) => {
  const { nonNull, stringArg, intArg, list } = nexus;

  return {
    type: list("Reaction"),
    args: {
      kind: stringArg(),
      uid: nonNull(stringArg()),
      id: intArg(),
    },
    async resolve(
      _: Object, 
      args: ListAllResolverProps,
      ctx: Context) {
      const { kind, uid, id } = args;
      const { state: { user = undefined } = {} } = ctx;

      return await getPluginService<IServiceClient>("client").list(kind, uid, user, id);
    },
  };
};
