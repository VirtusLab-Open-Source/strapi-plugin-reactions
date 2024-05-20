import { INexusType, StrapiGraphQLContext } from "../../../types";

export default ({ nexus }: StrapiGraphQLContext) =>
  nexus.objectType({
    name: "ResponseList",
    definition(t: INexusType) {
      t.list.field("data", { type: "Reaction" });
    },
  });
