
import { UID } from "@strapi/types";
import { getPluginService, parseParams } from '../utils/functions';
import { StrapiRequestContext } from "strapi-typed";

import { throwError } from './utils/functions';
import { IServiceClient, StrapiId } from '../../types';

type ReactionListUrlProps = {
  kind?: string;
  uid: UID.ContentType;
  id: StrapiId;
};

type ReactionsTypeUrlProps = Required<ReactionListUrlProps>;

export default () => ({
  getService<T>(name = "client") {
    return getPluginService<T>(name);
  },

  async kinds(ctx: StrapiRequestContext) {
    try {
      return await this.getService<IServiceClient>().kinds();
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async list(ctx: StrapiRequestContext<any, any, ReactionListUrlProps>) {
    try {
      const { params = {}, state: { user } } = ctx;
      const { kind, uid, id } = parseParams<ReactionListUrlProps>(params);
      return await this.getService<IServiceClient>().list(kind, uid, id, user);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async create(ctx: StrapiRequestContext<any, any, ReactionsTypeUrlProps>) {
    try {
      const { params = {}, state: { user } } = ctx;
      const { kind, uid, id } = parseParams<ReactionsTypeUrlProps>(params);
      return await this.getService<IServiceClient>().create(kind, uid, id, user);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async delete(ctx: StrapiRequestContext<any, any, ReactionsTypeUrlProps>) {
    try {
      const { params = {}, state: { user } } = ctx;
      const { kind, uid, id } = parseParams<ReactionsTypeUrlProps>(params);
      return await this.getService<IServiceClient>().delete(kind, uid, id, user);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async toggle(ctx: StrapiRequestContext<any, any, ReactionsTypeUrlProps>) {
    try {
      const { params = {}, state: { user } } = ctx;
      const { kind, uid, id } = parseParams<ReactionsTypeUrlProps>(params);
      return await this.getService<IServiceClient>().toggle(kind, uid, id, user);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },
});
