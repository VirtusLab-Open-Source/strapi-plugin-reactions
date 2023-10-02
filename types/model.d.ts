import { EntityService} from "@strapi/types";
import { StrapiContentTypeMediaAttribute, StrapiUser } from "strapi-typed";

type ReactionTypeFields = {
    kind: any;
    emoji: string;
    emojiFallbackUrl: string;
    icon: StrapiContentTypeMediaAttribute;
};

export type ReactionTypeEntity = EntityService.Entity<"plugin::reactions.reaction-type", ReactionTypeFields>;

type ReactionFields = {
    kind: ReactionTypeEntity;
    user: StrapiUser;
};

export type ReactionEntity = EntityService.Entity<"plugin::reactions.reaction", ReactionFields>;