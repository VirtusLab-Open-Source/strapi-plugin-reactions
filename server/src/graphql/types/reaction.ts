import { INexusType, StrapiGraphQLContext } from "../../../../@types";

export default ({ nexus }: StrapiGraphQLContext) =>
  nexus.objectType({
    name: "Reaction",
    definition(t: INexusType) {
      t.id("documentId");
      t.nonNull.field("kind", { type: "ReactionType" });
      t.nonNull.field("user", { type: "UsersPermissionsUser" });
      t.string("locale");
      t.string("createdAt");
      t.string("updatedAt");
    },
  });
