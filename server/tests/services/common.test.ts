import { setupStrapi, resetStrapi } from '../initSetup';
import { getPluginService } from '../../src/utils/functions';
import { IServiceCommon } from '../../../@types';
import { CONFIG_PARAMS } from '../../src/utils/constants';

afterEach(() => {
  resetStrapi();
});

describe('common service', () => {
  describe('getPluginStore', () => {
    it('returns plugin store when strapi.store is available', async () => {
      setupStrapi();
      const service = getPluginService<IServiceCommon>('common');
      const store = await service.getPluginStore();

      expect(store).toHaveProperty('get');
      expect(store).toHaveProperty('set');
    });
  });

  describe('getLocalConfig', () => {
    it('reads config from strapi config', () => {
      setupStrapi({ blockedAuthorProps: ['email'] });
      const service = getPluginService<IServiceCommon>('common');

      expect(service.getLocalConfig(CONFIG_PARAMS.AUTHOR_BLOCKED_PROPS, [])).toEqual(['email']);
    });

    it('returns default when property is missing', () => {
      setupStrapi({});
      const service = getPluginService<IServiceCommon>('common');

      expect(service.getLocalConfig(CONFIG_PARAMS.AUTHOR_BLOCKED_PROPS, ['fallback'])).toEqual(['fallback']);
    });
  });

  describe('getConfig', () => {
    it('returns full stored config when no prop is given', async () => {
      setupStrapi({ blockedAuthorProps: ['email'] }, true);
      const service = getPluginService<IServiceCommon>('common');

      await expect(service.getConfig()).resolves.toEqual({ blockedAuthorProps: ['email'] });
    });

    it('returns default config from local settings when store is empty', async () => {
      setupStrapi({ blockedAuthorProps: ['username'] });
      const service = getPluginService<IServiceCommon>('common');

      await expect(service.getConfig()).resolves.toEqual({ blockedAuthorProps: ['username'] });
    });

    it('returns a single property from stored config', async () => {
      setupStrapi({ blockedAuthorProps: ['stored'] }, true);
      const service = getPluginService<IServiceCommon>('common');

      await expect(service.getConfig(CONFIG_PARAMS.AUTHOR_BLOCKED_PROPS)).resolves.toEqual(['stored']);
    });

    it('returns a single property from local config when store is empty', async () => {
      setupStrapi({ blockedAuthorProps: ['local'] });
      const service = getPluginService<IServiceCommon>('common');

      await expect(service.getConfig(CONFIG_PARAMS.AUTHOR_BLOCKED_PROPS)).resolves.toEqual(['local']);
    });
  });
});
