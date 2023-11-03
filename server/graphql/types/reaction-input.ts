import { INexusType, StrapiGraphQLContext } from "../../../types";

export = ({ nexus }: StrapiGraphQLContext) =>
  nexus.inputObjectType({
    name: "ReactionInput",
    definition(t: INexusType) {
      t.nonNull.string("kind");
      t.nonNull.string("uid");
      t.id("id");
    },
  });
