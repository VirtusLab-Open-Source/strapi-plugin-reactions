import { Path } from '@virtuslab/strapi-utils';
import type { EN } from './en';

export type TranslationPath = Path<EN>;

const trads = {
  en: () => import('./en'),
  fr: () => import('./fr'),
};

export default trads;
