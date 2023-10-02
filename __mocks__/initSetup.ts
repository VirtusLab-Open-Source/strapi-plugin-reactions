import { get, set, pick, isEmpty } from "lodash";


// @ts-ignore
const mockStrapi = (config: any = {}, toStore: boolean = false, database: any = {}) => {
  const dbConfig = toStore
    ? {
        plugin: {
          reactions: {
            config: { ...config },
          },
        },
      }
    : {};

  let mock = {
    db: {
      query: (uid: string) => {
        const [handler, rest] = uid.split("::");
        const [collection] = rest.split(".");
        const values = get(mock.db, `${handler}.${collection}.records`, []);

        const parseValues = (values: any[], args: any = {}) =>
          values.map((_) => {
            const { select = [] } = args;
            if (!isEmpty(select)) {
              return pick(_, [...select, "threadOf"]);
            }
            return _;
          });

        return {
          findOne: async (args: any) =>
            new Promise((resolve) => resolve(parseValues(values, args)[0])),
          findMany: async (args: any) =>
            new Promise((resolve) => resolve(parseValues(values, args))),
          findWithCount: async () =>
            new Promise((resolve) => resolve([values, values.length])),
          count: async () => new Promise((resolve) => resolve(values.length)),
          create: async (value: any) =>
            new Promise((resolve) => resolve(value)),
          update: async (value: any) =>
            new Promise((resolve) => resolve(value)),
          delete: async (value: any) =>
            new Promise((resolve) => resolve(value)),
        };
      },
      ...dbConfig,
    },
    getRef: function () {
      return this;
    },
    plugin: function (name: string): any {
      return get(this.plugins, name);
    },
    store: async function (storeProps: { type: string; name: string }) {
      const { type, name } = storeProps; // { type: 'plugin', name: 'reactions' }

      const mockedStore = {
        get: async function (props: { key: string }) {
          // { key: 'config' }
          const { key } = props;
          return new Promise((resolve) =>
            resolve(get(mock.db, `${type}.${name}.${key}`, undefined))
          );
        },
        set: async function (props: { key: string; value: any }) {
          // { key: 'config', value: {...} }
          const { key, value } = props;
          set(mock.db, `${type}.${name}.${key}`, value);
          return this.get({ key });
        },
        delete: async function (props: { key: string }) {
          // { key: 'config' }
          const { key } = props;
          set(mock.db, `${type}.${name}.${key}`, undefined);
          return new Promise((resolve) => resolve(true));
        },
      };

      return new Promise((resolve) => resolve(mockedStore));
    },
    plugins: {
      reactions: {
        service: function (name: string) {
          const service = get(this.services, name);
          return service.default({ strapi: mock.getRef() });
        },
        package: require("../package.json"),
        services: {
          zone: require("../server/services/zone"),
          enrich: require("../server/services/enrich"),
          client: require("../server/services/client"),
          admin: require("../server/services/admin"),
        },
        contentTypes: {
          reaction: {
            ...require("../server/content-types/reaction"),
            uid: "plugins::reactions.reaction",
          },
          "reaction-type": {
            ...require("../server/content-types/reaction-type"),
            uid: "plugins::reactions.reaction-type",
          },
        },
      },
      graphql: {},
      "users-permissions": {
        contentTypes: {
          user: {
            uid: 'plugin::users-permissions.user',
          }
        }
      },
    },
    config: {
      get: function (prop: string = "") {
        return get(this.plugins, prop.replace("plugin.", ""));
      },
      set: function (prop: string = "", value: any) {
        return set(this.plugins, prop.replace("plugin.", ""), value);
      },
      plugins: {
        reactions: {
          ...(toStore ? {} : config),
        },
      },
    },
    contentTypes: {
      'plugin::users-permissions.user': {
        uid: 'plugin::users-permissions.user',
        attributes: {}
      }
    }
  };

  if (!isEmpty(database)) {
    Object.keys(database).forEach((uid: string) => {
      const [handler, collection] = uid.split("::");
      set(mock.db, `${handler}.${collection}.records`, database[uid]);
    });
  }

  return mock;
};

export const resetStrapi = () => {
  Object.defineProperty(global, "strapi", {});
};

export const setupStrapi = (config = {}, toStore = false, database = {}) => {
  Object.defineProperty(global, "strapi", {
    value: mockStrapi(config, toStore, database),
    writable: true,
  });
};