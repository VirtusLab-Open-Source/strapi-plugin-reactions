import type { ReactionTypeEntity, CTReactionType } from "./model";
import type { NotificationsContextValue } from "@strapi/strapi/admin";

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

export type EditableReactionsPluginConfig = Pick<
  ReactionsPluginStoreConfig,
  "blockedAuthorProps"
>;

export type ToggleNotification = NotificationsContextValue["toggleNotification"];

export type SubmitPayload = {
  body: CTReactionType;
  toggleNotification: ToggleNotification;
};

export type UpdateConfigPayload = {
  blockedAuthorProps: string[];
  toggleNotification: ToggleNotification;
};
