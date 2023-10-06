import {  StrapiRequestContext } from "strapi-typed";

import { getPluginService, parseParams } from '../utils/functions';
import { throwError } from './utils/functions';
import { IServiceAdmin, StrapiId } from '../../types';

type GenerateSlugRequestQueryProps = {
  id?: StrapiId;
  value: string;
};

type ReactionsTypeDeleteProps = {
  id: StrapiId;
};

export default () => ({
  getService<T>(name = "admin") {
    return getPluginService<T>(name);
  },

  async fetch(ctx: StrapiRequestContext) {
    try {
      return await this.getService<IServiceAdmin>().fetchConfig<any>();
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async create(ctx: StrapiRequestContext) {
    try {
      const { request: { body }} = ctx;
      return await this.getService<IServiceAdmin>().updateConfig(body);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async update(ctx: StrapiRequestContext) {
    try {
      const { request: { body }} = ctx;
      return await this.getService<IServiceAdmin>().updateConfig(body);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async deleteReactionType(ctx: StrapiRequestContext<any, any, ReactionsTypeDeleteProps>) {
    try {
      const { params = {} } = ctx;
      const { id } = parseParams<ReactionsTypeDeleteProps>(params);
      return await this.getService<IServiceAdmin>().deleteReactionType(id);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async generateSlug(ctx: StrapiRequestContext<any, GenerateSlugRequestQueryProps>) {
    try {
      const { query = {} } = ctx;
      const { value, id } = parseParams<GenerateSlugRequestQueryProps>(query);
      console.log(value);
      return await this.getService<IServiceAdmin>().generateSlug(value, id);
    } catch (e) {
      throw throwError(ctx, e);
    }
  },

  async syncAssociations(ctx: StrapiRequestContext) {
    try {
      return await this.getService<IServiceAdmin>().syncAssociations();
    } catch (e) {
      throw throwError(ctx, e);
    }
  },
  
});
