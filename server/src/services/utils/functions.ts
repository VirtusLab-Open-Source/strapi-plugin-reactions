import { UID, Data } from "@strapi/strapi";
import { isEmpty } from 'lodash';
import { z } from 'zod';
import { CTReaction } from '../../../../@types';

const userRecordSchema = z.record(z.string(), z.unknown());

export const sanitizeReactionUser = (
  user: unknown,
  blockedUserProps: Array<string>,
) => {
  const parsedUser = userRecordSchema.safeParse(user);

  if (!parsedUser.success) {
    return user;
  }

  const parsedUserData = parsedUser.data;
  
  const sanitizedUser = Object.fromEntries(
    Object.entries(parsedUserData)
      .filter(([name]) => !blockedUserProps.includes(name)),
  );

  if (isEmpty(sanitizedUser)) {
    strapi.log.warn('Strapi Reactions Plugin:You filtered out all of users properties, so the user is empty object');
    return {}
  } else {
    return sanitizedUser;
  }
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
    user: sanitizeReactionUser(entity.user, blockedUserProps),
  };
};

export const getModelUid = (name: string): UID.ContentType => {
  const contentType = strapi.plugin("reactions").contentTypes[name];
  return (contentType as any).uid;
};

export const buildRelatedId = (uid?: UID.ContentType, documentId?: Data.DocumentID) => uid ? `${uid}${documentId ? `:${documentId}` : ''}` : '';