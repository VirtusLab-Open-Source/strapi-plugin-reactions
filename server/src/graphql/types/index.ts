import { StrapiGraphQLContext } from "../../../../@types";

import ReactionInput from "./reaction-input";
import Reaction from "./reaction";
import ReactionRelated from "./reaction-related";
import ReactionType from "./reaction-type";
import ResponseList from "./response-list";
import ResponseKind from "./response-kind";

const typesFactories = [
  Reaction,
  ReactionType,
  ReactionRelated,
  ReactionInput,
  ResponseList,
  ResponseKind,
];

export default (context: StrapiGraphQLContext) =>
  typesFactories.map((factory) => factory(context));
