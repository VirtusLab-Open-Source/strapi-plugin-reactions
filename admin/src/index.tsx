import { get } from "lodash";

import pluginPkg from '../../package.json';
import { pluginId } from './pluginId';
import Initializer from './components/Initializer';

import pluginPermissions from "./permissions";
import trads, { TranslationKey, Translations } from './translations';
// import { EditViewSummary } from './injections/EditViewSummary';
import { prefixTranslations } from './utils';

const { name, displayName } = pluginPkg.strapi;

export default {
  bootstrap(app: any) {
    console.log('bootstrap');
    console.log(app);
    // console.log(app.getPlugin('content-manager'));
    // app.getPlugin('content-manager').injectComponent()('editView', 'informations', {
    //   name: 'reactions-summary',
    //   Component: EditViewSummary,
    // });
  },

  register(app: any) {
    app.createSettingSection(
      {
        id: pluginId,
        intlLabel: {
          id: `${pluginId}.plugin.section`,
          defaultMessage: `${displayName} plugin`,
        },
      },
      [
        {
          intlLabel: {
            id: `${pluginId}.plugin.section.item`,
            defaultMessage: "Configuration",
          },
          id: `${pluginId}.configuration`,
          to: `/settings/${pluginId}`,
          Component: async () => {
            const component = await import(
              "./pages/SettingsInit"
            );

            return component;
          },
          permissions: pluginPermissions.settings,
        },
      ]
    );

    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  registerTrads({ locales = [] }: { locales: Array<TranslationKey>}) {
    return locales
    .filter((locale: string) => Object.keys(trads).includes(locale))
    .map((locale: string) => {
      return {
        data: prefixTranslations(get<Translations, TranslationKey>(trads, locale as TranslationKey, trads.en), pluginId),
        locale,
      };
    });
  },
};
