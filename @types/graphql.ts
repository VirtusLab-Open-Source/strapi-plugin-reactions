import { ToBeFixed } from "./common";

type Primitive = string | number | boolean | object | null | undefined;

export type StrapiGraphQLContext = ToBeFixed;

export interface IGraphQLSetupStrategy {
  (context: StrapiGraphQLContext): Promise<void>;
}

export interface INexusType {
  field(name: string, config?: ToBeFixed): void;
  id(name: string);
  boolean(name: string);
  string(name: string);
  int(name: string);

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
