import { pluginId } from './pluginId';
import Initializer from './components/Initializer';

import pluginPermissions from "./permissions";
// import { EditViewSummary } from './injections/EditViewSummary';
import { flattenObject, prefixPluginTranslations } from '@sensinum/strapi-utils';
import trads from "./translations";

const name = "reactions";
const displayName = "Reactions";

export default {
  bootstrap(app: any) {
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
          id: `${pluginId}.plugin.section.name`,
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

  registerTrads: async function ({ locales = [] }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale: string) => {
        if (locale in trads) {
          const typedLocale = locale as keyof typeof trads;
          return trads[typedLocale]().then(({ default: trad }) => {
            return {
              data: prefixPluginTranslations(flattenObject(trad), pluginId),
              locale,
            };
          });
        }
        return {
          data: prefixPluginTranslations(flattenObject({}), pluginId),
          locale,
        };
      }),
    );
  },
};
