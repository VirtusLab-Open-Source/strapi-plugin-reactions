import { INexusType, StrapiGraphQLContext } from "../../../types";

export = ({ nexus }: StrapiGraphQLContext) =>
  nexus.objectType({
    name: "ResponseKind",
    definition(t: INexusType) {
      t.list.field("data", { type: "ReactionType" });
    },
  });
