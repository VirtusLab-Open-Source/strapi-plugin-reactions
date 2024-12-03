import { INexusType, StrapiGraphQLContext } from "../../../../@types";

import reactionsListAllPerUser from "./list-all-per-user";
import reactionsList from "./list";
import reactionKinds from "./kinds";

export default (context: StrapiGraphQLContext) => {
  const queries = {
    reactionsListAllPerUser,
    reactionsList,
    reactionsListPerUser: reactionsList,
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
