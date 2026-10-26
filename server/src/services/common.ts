import { Core } from "@strapi/strapi";
import { get, isNil } from "lodash";
import { ReactionsPluginStoreConfig } from "../config";
import config from "../config";
import { PLUGIN_SELECTOR } from "../utils/constants";
import PluginError from "../utils/error";

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getPluginStore(): Promise<ReturnType<typeof strapi.store>> {
    if (!isNil(strapi.store)) {
      return await strapi.store({ type: "plugin", name: "reactions" });
    }
  },

  getLocalConfig<K extends keyof ReactionsPluginStoreConfig>(
    prop?: K,
    defaultValue?: ReactionsPluginStoreConfig[K],
  ): ReactionsPluginStoreConfig | ReactionsPluginStoreConfig[K] {
    const localReactionsConfig = strapi.config.get(PLUGIN_SELECTOR, {});
    const merged = {
      ...config.default,
      ...localReactionsConfig,
    };

    if (prop) {
      return get(localReactionsConfig, prop, defaultValue ?? merged[prop]);
    }

    return merged;
  },

  async getConfig<K extends keyof ReactionsPluginStoreConfig>(
    prop?: K,
    defaultValue?: ReactionsPluginStoreConfig[K],
  ): Promise<ReactionsPluginStoreConfig | ReactionsPluginStoreConfig[K]> {
    const pluginStore = await this.getPluginStore();
    const storedConfig = await pluginStore.get({ key: "config" });
    const rawConfig = storedConfig ?? this.getLocalConfig();
    const validatedConfig = config.validate(rawConfig);

    if (!validatedConfig.success) {
      throw new PluginError(400, "Invalid plugin config");
    }

    const validatedConfigData = validatedConfig.data;

    if (prop) {
      return get(
        validatedConfigData,
        prop,
        defaultValue ?? config.default[prop],
      );
    }

    return validatedConfigData;
  },
});
