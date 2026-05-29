import { ReactionTypeEntity } from "./model";

export type ReactionsPluginStoreConfig = {
  blockedAuthorProps: Array<string>;
  gql?: {
    reactionRelated?: Array<string>;
  };
};

export type ReactionsPluginConfig = {
    types: Array<ReactionTypeEntity>;
    config: ReactionsPluginStoreConfig;
};