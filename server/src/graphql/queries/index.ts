import { INexusType, StrapiGraphQLContext } from "../../../../@types";

import reactionsListAll from "./list";
import reactionKinds from "./kinds";

export default (context: StrapiGraphQLContext) => {
  const queries = {
    reactionsListAll,
    reactionsListPerUser: reactionsListAll,
    reactionKinds,
  };

  return context.nexus.extendType({
    type: "Query",
    definition(t: INexusType) {
      for (const [name, configFactory] of Object.entries(queries)) {
        const config = configFactory(context);

        t.field(name, config);
      }
    },
  });
};
