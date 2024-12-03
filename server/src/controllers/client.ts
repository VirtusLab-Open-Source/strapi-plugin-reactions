
import { Data, UID } from "@strapi/strapi";
import { Context } from "koa";

import { getPluginService, parseParams, parseQuery } from '../utils/functions';
import PluginError from "../utils/error";

import { throwError } from './utils/functions';

import { IServiceClient } from '../../../@types';

type ReactionListUrlProps = {
  kind?: string;
  uid: UID.ContentType;
  documentId: Data.DocumentID;
};

type ReactionListByUserUrlProps = {
  kind?: string;
  userId: Data.ID;
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
      const { params = {}, state: { user }, query = {} } = ctx;
      const { locale } = parseQuery(query);
      const { kind, uid, documentId } = parseParams<ReactionListUrlProps>(params);
      return await this.getService<IServiceClient>().list(kind, uid, user, documentId, locale);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async listPerUser(ctx: Context) {
    try {
      const { params = {}, state: { user }, query = {} } = ctx;
      const { populate, filters, sort, pagination } = parseQuery(query);
      const { kind, userId } = parseParams<ReactionListByUserUrlProps>(params);

      let targetUser: unknown;
      try {
        if (userId) {
          targetUser = await strapi
            .plugin("users-permissions")
            .service("user")
            .fetch(userId);
        } else {
          targetUser = user;
        }
      } catch (e) {
        throw new PluginError(400, "User not found");
      }

      return await this.getService<IServiceClient>().listPerUser(targetUser, kind, {
        populate,
        filters,
        sort,
        pagination,
      });
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async create(ctx: Context) {
    try {
      const { params = {}, state: { user }, query = {} } = ctx;
      const { kind, uid, documentId } = parseParams<ReactionsTypeUrlProps>(params);
      const { locale } = parseQuery(query);
      return await this.getService<IServiceClient>().create(kind, uid, user, documentId, locale);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async delete(ctx: Context) {
    try {
      const { params = {}, state: { user }, query = {} } = ctx;
      const { kind, uid, documentId } = parseParams<ReactionsTypeUrlProps>(params);
      const { locale } = parseQuery(query);
      return await this.getService<IServiceClient>().delete(kind, uid, user, documentId, locale);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async toggle(ctx: Context) {
    try {
      const { params = {}, state: { user }, query = {} } = ctx;
      const { kind, uid, documentId } = parseParams<ReactionsTypeUrlProps>(params);
      const { locale } = parseQuery(query);
      return await this.getService<IServiceClient>().toggle(kind, uid, user, documentId, locale);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },
});
