import { INexusType, StrapiGraphQLContext } from "../../../../@types";

export default ({ nexus }: StrapiGraphQLContext) =>
  nexus.objectType({
    name: "Reaction",
    definition(t: INexusType) {
      t.id("documentId");
      t.nonNull.field("kind", { type: "ReactionType" });
      t.field("user", { type: "UsersPermissionsUser" });
      t.field("related", { type: "ReactionRelated" });
      t.string("userId");
      t.string("locale");
      t.string("createdAt");
      t.string("updatedAt");
    },
  });
