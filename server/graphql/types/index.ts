import { StrapiGraphQLContext } from "../../../types";

import ReactionInput from "./reaction-input";
import Reaction from "./reaction";
import ReactionType from "./reaction-type";
import ResponseList from "./response-list";
import ResponseKind from "./response-kind";

const typesFactories = [
  Reaction,
  ReactionType,
  ReactionInput,
  ResponseList,
  ResponseKind,
];

export = (context: StrapiGraphQLContext) =>
  typesFactories.map((factory) => factory(context));
