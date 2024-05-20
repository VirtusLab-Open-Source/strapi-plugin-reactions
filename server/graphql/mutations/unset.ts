import { StrapiRequestContext } from "strapi-typed";
import {
  IServiceClient,
  StrapiGraphQLContext,
  ToBeFixed,
} from "../../../types";

import { getPluginService } from "../../utils/functions";

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
      ctx: StrapiRequestContext<never> & ToBeFixed
    ) {
      const { input } = args;
      const { state: { user = undefined } = {} } = ctx;
      const { kind, uid, id } = input;
      try {
        return await getPluginService<IServiceClient>("client")
          .delete(kind, uid, id, user);
      } catch (e: ToBeFixed) {
        throw new Error(e);
      }
    },
  };
};
