import { StrapiContext } from "strapi-typed";
import permissions from "./../permissions";
import { IServiceAdmin, ReactionsPluginConfig } from "../types";
import { getPluginService } from "./utils/functions";
import { graphQLSetupStrategy } from './graphql';

export = async ({ strapi }: StrapiContext) => {
  // Provide GQL support
  const config: ReactionsPluginConfig = await getPluginService<IServiceAdmin>("admin")
    .fetchConfig();
  await graphQLSetupStrategy({ strapi, config });

  // Check if the plugin users-permissions is installed because the navigation needs it
  if (Object.keys(strapi.plugins).indexOf("users-permissions") === -1) {
    throw new Error(
      "In order to make the reactions plugin work the users-permissions plugin is required"
    );
  }
  // Add permissions
  const actions = [
    {
      section: "plugins",
      displayName: "Settings: Read",
      uid: permissions.settings.read,
      pluginName: "reactions",
    },
    {
      section: "plugins",
      displayName: "Settings: Change",
      uid: permissions.settings.change,
      pluginName: "reactions",
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);
};
