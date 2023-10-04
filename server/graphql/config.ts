import { StrapiContext } from "strapi-typed";

import { getModelUid } from "../services/utils/functions";
import { getPluginService } from "../utils/functions";
import { IServiceCommon } from "../../types";

import getTypes from "./types";
import getQueries from "./queries";
import getMutations from "./mutations";
import getResolversConfig from "./resolvers-config";

export default async ({ strapi }: StrapiContext) => {
  const extensionService = strapi.plugin("graphql").service("extension");

  extensionService.shadowCRUD(getModelUid('reaction')).disable();
  extensionService.shadowCRUD(getModelUid('reaction-type')).disable();

  const commonService = getPluginService<IServiceCommon>('common');
  const pluginStore = commonService.getPluginStore()
  const config = await pluginStore.get({ key: 'config' });

  extensionService.use(({ strapi, nexus }: any) => {
    const types = getTypes({ strapi, nexus, config });
    const queries = getQueries({ strapi, nexus });
    const mutations = getMutations({ strapi, nexus, config });
    const resolversConfig = getResolversConfig();

    return {
      types: [types, queries, mutations],
      resolversConfig,
    };
  });
};
