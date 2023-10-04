import { INexusType, StrapiGraphQLContext } from "../../../types";

export = ({ nexus }: StrapiGraphQLContext) =>
  nexus.objectType({
    name: "Reaction",
    definition(t: INexusType) {
      t.id("id");
      t.nonNull.field("kind", { type: "ReactionType" });
      t.nonNull.field("user", { type: "UsersPermissionsUser" });
      t.string("createdAt");
      t.string("updatedAt");
    },
  });
