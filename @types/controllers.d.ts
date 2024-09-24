import {
  Id,
  StrapiRequestQueryFieldsClause,
} from "strapi-typed";
import { ToBeFixed } from "./common";

import PluginError from "../src/utils/error";

export type FlatInput<TKeys extends string> = {
  query: ToBeFixed;
  sort: ToBeFixed;
  relation?: Id;
  pagination?: ToBeFixed;
  fields?: StrapiRequestQueryFieldsClause<TKeys>;
};

export type ThrowableResponse<T> = T | PluginError | never;
export type ThrowablePromisedResponse<T> = Promise<ThrowableResponse<T>>;
