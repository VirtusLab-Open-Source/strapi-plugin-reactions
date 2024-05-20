import { INexusType, StrapiGraphQLContext } from "../../../types";

export default ({ nexus }: StrapiGraphQLContext) =>
  nexus.objectType({
    name: "ResponseKind",
    definition(t: INexusType) {
      t.list.field("data", { type: "ReactionType" });
    },
  });
