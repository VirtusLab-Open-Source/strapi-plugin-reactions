import { ReactionTypeEntity } from "./model";

export type ReactionsPluginConfig = {
    types: Array<ReactionTypeEntity>;
    config: any;
};