
import { Data, UID } from "@strapi/strapi";
import { Context } from "koa";
import { getPluginService, parseParams, parseQuery } from '../utils/functions';

import { throwError } from './utils/functions';
import { IServiceClient } from '../../../@types';

type ReactionListUrlProps = {
  kind?: string;
  uid: UID.ContentType;
  documentId: Data.DocumentID;
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
