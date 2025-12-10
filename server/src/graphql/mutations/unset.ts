import { Context } from "koa";

import {
  IServiceClient,
  StrapiGraphQLContext,
  ToBeFixed,
} from "../../../../@types";

import { getPluginService } from "../../utils/functions";
import PluginError from "../../utils/error";

type UnsetReactionProps = {
  input: ToBeFixed;
};

export default ({ nexus }: StrapiGraphQLContext) => {
  const { nonNull } = nexus;

  return {
    type: nonNull("Reaction"),
    args: {
      input: nonNull("ReactionInput"),
    },
    async resolve(
      _: Object,
      args: UnsetReactionProps,
      ctx: Context
    ) {
      const { input } = args;
      const { state: { user = undefined } = {}, koaContext } = ctx;
      const { kind, uid, documentId, locale } = input;
      const authorId = koaContext.get('x-reactions-author');

      if (!user && !authorId) {
        throw new PluginError(400, "User ID must be provided via x-reactions-author header (custom users) or Authorization header (Strapi users");
      }

      try {
        return await getPluginService<IServiceClient>("client")
          .delete(kind, uid, user, documentId, locale, authorId);
      } catch (e: ToBeFixed) {
        throw new Error(e);
      }
    },
  };
};
