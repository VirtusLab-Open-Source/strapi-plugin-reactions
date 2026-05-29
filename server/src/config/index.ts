import { z } from 'zod';
import { CONFIG_PARAMS } from '../utils/constants';

const defaultPluginConfig: ReactionsPluginStoreConfig = {
  blockedAuthorProps: [],
};

export const schemaConfig = z.object({
  [CONFIG_PARAMS.AUTHOR_BLOCKED_PROPS]: z.array(z.string()),
  gql: z.object({
    reactionRelated: z.array(z.string()).optional(),
  }).optional(),
});

export type ReactionsPluginStoreConfig = z.infer<typeof schemaConfig>;

const config = {
  default: schemaConfig.parse(defaultPluginConfig),
  validate: (config: unknown) => schemaConfig.safeParse(config),
} as const;

export default config;
