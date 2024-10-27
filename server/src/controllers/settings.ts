
import { Data } from '@strapi/strapi';
import { Context } from 'koa';

import { getPluginService, parseParams } from '../utils/functions';
import { throwError } from './utils/functions';
import { IServiceAdmin, ReactionsPluginConfig } from '../../../@types';
import PluginError from "../utils/error";

type GenerateSlugRequestQueryProps = {
  documentId?: Data.DocumentID;
  value: string;
};

type ReactionsTypeDeleteProps = {
  documentId: Data.DocumentID;
};

export default () => ({
  getService<T>(name = "admin"): T {
    return getPluginService<T>(name);
  },

  async fetch(ctx: Context): Promise<ReactionsPluginConfig> {
    try {
      return await this.getService<IServiceAdmin>().fetchConfig<any>();
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async create(ctx: Context) {
    try {
      const { request: { body }} = ctx;
      if (body) {
        return await this.getService<IServiceAdmin>().updateConfig(body);
      }
      throw throwError(ctx, new PluginError(400, 'Bad Request'));
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async update(ctx: Context) {
    try {
      const { request: { body }} = ctx;
      if (body) {
        return await this.getService<IServiceAdmin>().updateConfig(body);
      }
      throw throwError(ctx, new PluginError(400, 'Bad Request'));
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async deleteReactionType(ctx: Context) {
    try {
      const { params = {} } = ctx;
      const { documentId } = parseParams<ReactionsTypeDeleteProps>(params);
      return await this.getService<IServiceAdmin>().deleteReactionType(documentId);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async generateSlug(ctx: Context) {
    try {
      const { query = {} } = ctx;
      const { value, documentId } = parseParams<GenerateSlugRequestQueryProps>(query);
      return await this.getService<IServiceAdmin>().generateSlug(value, documentId);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async syncAssociations(ctx: Context) {
    try {
      return await this.getService<IServiceAdmin>().syncAssociations();
    } catch (e) {
      throw throwError(ctx, e);
    }
  },
  
});
