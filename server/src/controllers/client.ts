
import { UID } from "@strapi/strapi";
import { Context } from "koa";
import { getPluginService, parseParams } from '../utils/functions';

import { throwError } from './utils/functions';
import { IServiceClient, StrapiId } from '../../../@types';

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

  async kinds(ctx: Context) {
    try {
      return await this.getService<IServiceClient>().kinds();
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async list(ctx: Context) {
    try {
      const { params = {}, state: { user } } = ctx;
      const { kind, uid, id } = parseParams<ReactionListUrlProps>(params);
      return await this.getService<IServiceClient>().list(kind, uid, id, user);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async create(ctx: Context) {
    try {
      const { params = {}, state: { user } } = ctx;
      const { kind, uid, id } = parseParams<ReactionsTypeUrlProps>(params);
      return await this.getService<IServiceClient>().create(kind, uid, user, id);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async delete(ctx: Context) {
    try {
      const { params = {}, state: { user } } = ctx;
      const { kind, uid, id } = parseParams<ReactionsTypeUrlProps>(params);
      return await this.getService<IServiceClient>().delete(kind, uid, user, id);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async toggle(ctx: Context) {
    try {
      const { params = {}, state: { user } } = ctx;
      const { kind, uid, id } = parseParams<ReactionsTypeUrlProps>(params);
      return await this.getService<IServiceClient>().toggle(kind, uid, user, id);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },
});
