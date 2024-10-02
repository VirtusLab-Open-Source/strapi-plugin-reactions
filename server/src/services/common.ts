import { Core } from '@strapi/strapi';

import { isNil } from 'lodash';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getPluginStore(): any | undefined {
    if (!isNil(strapi.store)) {
      return strapi.store({ type: "plugin", name: "reactions" }) as any;
    }
  },
});
