import { INexusType, StrapiGraphQLContext } from "../../../types";

export = ({ nexus }: StrapiGraphQLContext) =>
  nexus.objectType({
    name: "ReactionType",
    definition(t: INexusType) {
      t.id("id");
      t.nonNull.string("slug");
      t.nonNull.string("name");
      t.string("emoji");
      t.string("emojiFallbackUrl");
      t.field("icon", { type: "UploadFile" });
    },
  });
