import { INexusType, StrapiGraphQLContext } from "../../../types";

import reactionSet from "./set";
import reactionUnset from "./unset";
import reactionToggle from "./toggle";

export = (context: StrapiGraphQLContext) => {
  const mutations = {
    reactionSet,
    reactionUnset,
    reactionToggle,
  };

  return context.nexus.extendType({
    type: "Mutation",
    definition(t: INexusType) {
      for (const [name, configFactory] of Object.entries(mutations)) {
        const config = configFactory(context);

        t.field(name, config);
      }
    },
  });
};
