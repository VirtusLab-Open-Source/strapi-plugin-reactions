import { Core } from '@strapi/strapi';
import { get, isNil } from 'lodash';
import { ReactionsPluginStoreConfig } from '../config';
import { CONFIG_PARAMS, PLUGIN_SELECTOR } from '../utils/constants';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getPluginStore(): any | undefined {
    if (!isNil(strapi.store)) {
      return strapi.store({ type: "plugin", name: "reactions" }) as any;
    }
  },

  getLocalConfig<K extends keyof ReactionsPluginStoreConfig>(
    prop: K,
    defaultValue?: ReactionsPluginStoreConfig[K],
  ): ReactionsPluginStoreConfig[K] {
    return strapi.config.get(
      [PLUGIN_SELECTOR, prop].filter(Boolean).join('.'),
      defaultValue,
    );
  },

  async getConfig<K extends keyof ReactionsPluginStoreConfig>(
    prop?: K,
    defaultValue?: ReactionsPluginStoreConfig[K],
  ): Promise<ReactionsPluginStoreConfig | ReactionsPluginStoreConfig[K]> {
    const pluginStore = this.getPluginStore();
    const storedConfig = await pluginStore?.get({ key: 'config' }) as ReactionsPluginStoreConfig | undefined;

    if (storedConfig) {
      if (prop) {
        return get(storedConfig, prop, defaultValue) as ReactionsPluginStoreConfig[K];
      }

      return storedConfig;
    }

    if (prop) {
      return this.getLocalConfig(prop, defaultValue);
    }

    return {
      blockedAuthorProps: this.getLocalConfig(CONFIG_PARAMS.AUTHOR_BLOCKED_PROPS, []),
    };
  },
});
