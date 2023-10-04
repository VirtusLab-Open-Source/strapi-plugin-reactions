import { Strapi } from '@strapi/strapi';
import { CoreStore } from '@strapi/types';

import { isNil } from 'lodash';

export default ({ strapi }: { strapi: Strapi }) => ({
  getPluginStore(): CoreStore | undefined {
    if (!isNil(strapi.store)) {
      return strapi.store({ type: "plugin", name: "reactions" }) as CoreStore;
    }
  },
});
