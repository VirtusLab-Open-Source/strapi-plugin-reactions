import { Core } from "@strapi/strapi";
import { ToBeFixed } from "./common";
import { ReactionsPluginConfig } from "./config";

export type Primitive = string | number | boolean | object | null | undefined;

type Nexus = any;

export type StrapiGraphQLContext = {
  strapi: Core.Strapi;
  config?: ReactionsPluginConfig;
  nexus?: Nexus;
};

export interface IGraphQLSetupStrategy {
  (context: StrapiGraphQLContext): Promise<void>;
}

export interface INexusType {
  field(name: string, config?: ToBeFixed): void;
  id(name: string): number | string;
  boolean(name: string): boolean;
  string(name: string): string;
  int(name: string): number;

  nonNull: INexusType;
  list: INexusType;
}

export type NexusRequestProps<T = ToBeFixed> = {
  input?: T;
};

export type NexusAst = {
  kind: string;
  value: Primitive;
};
