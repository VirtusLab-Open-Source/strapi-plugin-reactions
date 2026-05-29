import { UID, Data } from "@strapi/strapi";
import { isEmpty } from 'lodash';

import { CTReaction } from '../../../../@types';

export const sanitizeReactionUser = (
  user: Record<string, unknown> | null | undefined,
  blockedUserProps: Array<string>,
) => {
  if (!user || typeof user !== 'object') {
    return user;
  }

  const sanitizedUser = Object.fromEntries(
    Object.entries(user)
      .filter(([name]) => !blockedUserProps.includes(name)),
  );

  return isEmpty(sanitizedUser) ? user : sanitizedUser;
};

export const sanitizeReactionEntity = (
  entity: CTReaction,
  blockedUserProps: Array<string>,
): CTReaction => {
  if (!entity.user || typeof entity.user !== 'object') {
    return entity;
  }

  return {
    ...entity,
    user: sanitizeReactionUser(entity.user as Record<string, unknown>, blockedUserProps),
  };
};

export const getModelUid = (name: string): UID.ContentType => {
  const contentType = strapi.plugin("reactions").contentTypes[name];
  return (contentType as any).uid;
};

export const buildRelatedId = (uid?: UID.ContentType, documentId?: Data.DocumentID) => uid ? `${uid}${documentId ? `:${documentId}` : ''}` : '';