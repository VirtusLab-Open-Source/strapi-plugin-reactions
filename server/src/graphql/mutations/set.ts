import { Context } from "koa";

import {
  IServiceClient,
  StrapiGraphQLContext,
  ToBeFixed,
} from "../../../../@types";

import { getPluginService } from "../../utils/functions";

type SetReactionProps = {
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
      args: SetReactionProps,
      ctx: Context
    ) {
      const { input } = args;
      const { state: { user = undefined } = {} } = ctx;
      const { kind, uid, documentId, locale } = input;
      try {
        return await getPluginService<IServiceClient>("client")
          .create(kind, uid, user, documentId, locale);
      } catch (e: ToBeFixed) {
        throw new Error(e);
      }
    },
  };
};
