import {
  IServiceClient,
  StrapiGraphQLContext,
} from "../../../types";
import { getPluginService } from "../../utils/functions";

export = ({ nexus }: StrapiGraphQLContext) => {
  const { list } = nexus;

  return {
    type: list("ReactionType"),
    async resolve() {
      return await getPluginService<IServiceClient>("client").kinds();
    },
  };
};
